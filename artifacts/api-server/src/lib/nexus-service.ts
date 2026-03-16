import { db, onboardingSubmissionsTable, subscriptionsTable, stateNexusRulesTable, nexusNotificationsLogTable } from "@workspace/db";
import { eq, sql, desc, and, inArray, count as drizzleCount } from "drizzle-orm";
import { Resend } from "resend";

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS = "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

export interface StateNexusSummary {
  stateCode: string;
  stateName: string;
  clientCount: number;
  foreignQualificationThreshold: number;
  bookkeepingLicenseRequired: boolean;
  bookkeepingLicenseNotes: string | null;
  authorityName: string | null;
  authorityUrl: string | null;
  notes: string | null;
  warningThresholdPercent: number;
  riskLevel: "safe" | "warning" | "alert";
  lastNotificationSent: string | null;
  lastNotificationType: string | null;
}

export async function getStateClientCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      state: onboardingSubmissionsTable.businessState,
      count: sql<number>`count(distinct ${onboardingSubmissionsTable.clientEmail})::int`,
    })
    .from(onboardingSubmissionsTable)
    .leftJoin(
      subscriptionsTable,
      eq(onboardingSubmissionsTable.subscriptionId, subscriptionsTable.id),
    )
    .where(
      sql`${onboardingSubmissionsTable.businessState} is not null
        and ${onboardingSubmissionsTable.businessState} != ''
        and (${onboardingSubmissionsTable.subscriptionId} is null
          or ${subscriptionsTable.status} in ('active', 'trialing', 'past_due'))`,
    )
    .groupBy(onboardingSubmissionsTable.businessState);

  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (row.state) counts[row.state] = row.count;
  }
  return counts;
}

function computeRiskLevel(clientCount: number, threshold: number, warningPercent: number): "safe" | "warning" | "alert" {
  if (clientCount >= threshold) return "alert";
  const warningCount = Math.ceil(threshold * (warningPercent / 100));
  if (clientCount >= warningCount) return "warning";
  return "safe";
}

export async function getNexusSummary(): Promise<StateNexusSummary[]> {
  const rules = await db.select().from(stateNexusRulesTable).orderBy(stateNexusRulesTable.stateName);
  const clientCounts = await getStateClientCounts();

  const lastNotifications = await db
    .select()
    .from(nexusNotificationsLogTable)
    .orderBy(desc(nexusNotificationsLogTable.sentAt));

  const latestByState: Record<string, { sentAt: Date; type: string }> = {};
  for (const n of lastNotifications) {
    if (!latestByState[n.stateCode]) {
      latestByState[n.stateCode] = { sentAt: n.sentAt, type: n.notificationType };
    }
  }

  return rules.map((rule) => {
    const clientCount = clientCounts[rule.stateCode] || 0;
    const riskLevel = computeRiskLevel(clientCount, rule.foreignQualificationThreshold, rule.warningThresholdPercent);
    const lastNotif = latestByState[rule.stateCode];

    return {
      stateCode: rule.stateCode,
      stateName: rule.stateName,
      clientCount,
      foreignQualificationThreshold: rule.foreignQualificationThreshold,
      bookkeepingLicenseRequired: rule.bookkeepingLicenseRequired,
      bookkeepingLicenseNotes: rule.bookkeepingLicenseNotes,
      authorityName: rule.authorityName,
      authorityUrl: rule.authorityUrl,
      notes: rule.notes,
      warningThresholdPercent: rule.warningThresholdPercent,
      riskLevel,
      lastNotificationSent: lastNotif?.sentAt.toISOString() ?? null,
      lastNotificationType: lastNotif?.type ?? null,
    };
  });
}

export async function runNexusCheck(): Promise<{ warnings: number; alerts: number }> {
  const rules = await db.select().from(stateNexusRulesTable);
  const clientCounts = await getStateClientCounts();

  let warnings = 0;
  let alerts = 0;

  for (const rule of rules) {
    const clientCount = clientCounts[rule.stateCode] || 0;
    if (clientCount === 0) continue;

    const riskLevel = computeRiskLevel(clientCount, rule.foreignQualificationThreshold, rule.warningThresholdPercent);
    if (riskLevel === "safe") continue;

    const lastNotifs = await db
      .select()
      .from(nexusNotificationsLogTable)
      .where(
        and(
          eq(nexusNotificationsLogTable.stateCode, rule.stateCode),
          eq(nexusNotificationsLogTable.notificationType, riskLevel),
        ),
      )
      .orderBy(desc(nexusNotificationsLogTable.sentAt))
      .limit(1);

    const lastNotif = lastNotifs[0];
    if (lastNotif && lastNotif.clientCount >= clientCount) {
      continue;
    }

    const sent = await sendNexusNotification(rule, clientCount, riskLevel);
    if (sent) {
      await db.insert(nexusNotificationsLogTable).values({
        stateCode: rule.stateCode,
        notificationType: riskLevel,
        clientCount,
        threshold: rule.foreignQualificationThreshold,
      });

      if (riskLevel === "warning") warnings++;
      else alerts++;
    }
  }

  return { warnings, alerts };
}

async function sendNexusNotification(
  rule: typeof stateNexusRulesTable.$inferSelect,
  clientCount: number,
  level: "warning" | "alert",
): Promise<boolean> {
  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    console.warn("RESEND_API_KEY not set, skipping nexus notification");
    return false;
  }

  const resend = new Resend(key);
  const isAlert = level === "alert";
  const headerColor = isAlert ? "#dc2626" : "#f59e0b";
  const title = isAlert
    ? `ALERT: Nexus Threshold Reached in ${rule.stateName}`
    : `WARNING: Approaching Nexus Threshold in ${rule.stateName}`;

  let requirementText = `You have ${clientCount} client${clientCount !== 1 ? "s" : ""} in ${rule.stateName} (${rule.stateCode}). `;
  if (isAlert) {
    requirementText += `Foreign Qualification is required. `;
    if (rule.authorityName) {
      requirementText += `File with ${rule.authorityName}. `;
    }
  } else {
    requirementText += `This is ${Math.round((clientCount / rule.foreignQualificationThreshold) * 100)}% of the ${rule.foreignQualificationThreshold}-client threshold. `;
  }

  if (rule.bookkeepingLicenseRequired) {
    requirementText += `Note: ${rule.stateName} requires a specific bookkeeping license. `;
    if (rule.bookkeepingLicenseNotes) {
      requirementText += rule.bookkeepingLicenseNotes;
    }
  }

  const authorityLink = rule.authorityUrl
    ? `<p style="margin-top:16px;"><a href="${rule.authorityUrl}" style="display:inline-block;padding:10px 20px;background:${headerColor};color:white;text-decoration:none;border-radius:6px;font-weight:600;">Visit ${rule.authorityName || rule.stateName + " Authority"}</a></p>`
    : "";

  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:${headerColor};padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">${title}</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:8px 0;color:#666;font-size:14px;width:160px;">State</td><td style="padding:8px 0;font-weight:600;">${rule.stateName} (${rule.stateCode})</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Current Clients</td><td style="padding:8px 0;font-weight:600;color:${headerColor};">${clientCount}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Threshold</td><td style="padding:8px 0;">${rule.foreignQualificationThreshold} clients</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Risk Level</td><td style="padding:8px 0;font-weight:600;color:${headerColor};">${level.toUpperCase()}</td></tr>
      </table>
      <p style="line-height:1.6;">${requirementText}</p>
      ${rule.notes ? `<p style="margin-top:12px;padding:12px;background:white;border-radius:6px;border-left:3px solid ${headerColor};font-size:14px;color:#555;">${rule.notes}</p>` : ""}
      ${authorityLink}
    </div>
  </div>`;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: OWNER_EMAIL,
      subject: title,
      html,
    });
    return true;
  } catch (err) {
    console.error(`Failed to send nexus notification for ${rule.stateCode}:`, err);
    return false;
  }
}

export async function getNotificationLog() {
  return db
    .select()
    .from(nexusNotificationsLogTable)
    .orderBy(desc(nexusNotificationsLogTable.sentAt))
    .limit(100);
}

const STATE_NEXUS_SEED_DATA = [
  { stateCode: "AL", stateName: "Alabama", threshold: 10, license: false, licenseNotes: null, authority: "Alabama Secretary of State", url: "https://www.sos.alabama.gov/business-entities", notes: null },
  { stateCode: "AK", stateName: "Alaska", threshold: 10, license: false, licenseNotes: null, authority: "Alaska Division of Corporations", url: "https://www.commerce.alaska.gov/web/cbpl/Corporations.aspx", notes: null },
  { stateCode: "AZ", stateName: "Arizona", threshold: 10, license: false, licenseNotes: null, authority: "Arizona Corporation Commission", url: "https://azcc.gov/divisions/corporations", notes: null },
  { stateCode: "AR", stateName: "Arkansas", threshold: 10, license: false, licenseNotes: null, authority: "Arkansas Secretary of State", url: "https://www.sos.arkansas.gov/business-commercial-services-bcs", notes: null },
  { stateCode: "CA", stateName: "California", threshold: 5, license: true, licenseNotes: "California requires registration with the CTEC for tax preparers and may require a registered agent for bookkeeping businesses.", authority: "California Secretary of State", url: "https://www.sos.ca.gov/business-programs", notes: "CA has strict Foreign Qualification rules. Register early." },
  { stateCode: "CO", stateName: "Colorado", threshold: 10, license: false, licenseNotes: null, authority: "Colorado Secretary of State", url: "https://www.sos.state.co.us/biz/BusinessEntitySearch.do", notes: null },
  { stateCode: "CT", stateName: "Connecticut", threshold: 10, license: false, licenseNotes: null, authority: "Connecticut Secretary of State", url: "https://portal.ct.gov/SOTS/Business-Services", notes: null },
  { stateCode: "DE", stateName: "Delaware", threshold: 15, license: false, licenseNotes: null, authority: "Delaware Division of Corporations", url: "https://corp.delaware.gov/", notes: "Delaware is business-friendly with higher thresholds." },
  { stateCode: "FL", stateName: "Florida", threshold: 10, license: false, licenseNotes: null, authority: "Florida Division of Corporations", url: "https://dos.fl.gov/sunbiz/", notes: null },
  { stateCode: "GA", stateName: "Georgia", threshold: 10, license: false, licenseNotes: null, authority: "Georgia Secretary of State", url: "https://sos.ga.gov/corporations-division", notes: null },
  { stateCode: "HI", stateName: "Hawaii", threshold: 10, license: false, licenseNotes: null, authority: "Hawaii DCCA", url: "https://cca.hawaii.gov/breg/", notes: null },
  { stateCode: "ID", stateName: "Idaho", threshold: 10, license: false, licenseNotes: null, authority: "Idaho Secretary of State", url: "https://sos.idaho.gov/business/", notes: null },
  { stateCode: "IL", stateName: "Illinois", threshold: 8, license: false, licenseNotes: null, authority: "Illinois Secretary of State", url: "https://www.ilsos.gov/departments/business_services/", notes: "Illinois has a lower threshold for service businesses." },
  { stateCode: "IN", stateName: "Indiana", threshold: 10, license: false, licenseNotes: null, authority: "Indiana Secretary of State", url: "https://www.in.gov/sos/business/", notes: null },
  { stateCode: "IA", stateName: "Iowa", threshold: 10, license: false, licenseNotes: null, authority: "Iowa Secretary of State", url: "https://sos.iowa.gov/business/", notes: null },
  { stateCode: "KS", stateName: "Kansas", threshold: 10, license: false, licenseNotes: null, authority: "Kansas Secretary of State", url: "https://www.sos.ks.gov/business/business.html", notes: null },
  { stateCode: "KY", stateName: "Kentucky", threshold: 10, license: false, licenseNotes: null, authority: "Kentucky Secretary of State", url: "https://www.sos.ky.gov/bus/business-filings/", notes: null },
  { stateCode: "LA", stateName: "Louisiana", threshold: 10, license: true, licenseNotes: "Louisiana requires a Board of CPA registration for certain bookkeeping services.", authority: "Louisiana Secretary of State", url: "https://www.sos.la.gov/BusinessServices/", notes: null },
  { stateCode: "ME", stateName: "Maine", threshold: 10, license: false, licenseNotes: null, authority: "Maine Secretary of State", url: "https://www.maine.gov/sos/cec/corp/", notes: null },
  { stateCode: "MD", stateName: "Maryland", threshold: 8, license: false, licenseNotes: null, authority: "Maryland SDAT", url: "https://dat.maryland.gov/businesses/", notes: "Maryland has a moderately lower threshold." },
  { stateCode: "MA", stateName: "Massachusetts", threshold: 8, license: false, licenseNotes: null, authority: "Massachusetts Secretary of the Commonwealth", url: "https://www.sec.state.ma.us/cor/", notes: null },
  { stateCode: "MI", stateName: "Michigan", threshold: 10, license: false, licenseNotes: null, authority: "Michigan LARA", url: "https://www.michigan.gov/lara/bureau-list/bcs", notes: null },
  { stateCode: "MN", stateName: "Minnesota", threshold: 10, license: false, licenseNotes: null, authority: "Minnesota Secretary of State", url: "https://www.sos.state.mn.us/business-liens/", notes: null },
  { stateCode: "MS", stateName: "Mississippi", threshold: 10, license: false, licenseNotes: null, authority: "Mississippi Secretary of State", url: "https://www.sos.ms.gov/business-services", notes: null },
  { stateCode: "MO", stateName: "Missouri", threshold: 10, license: false, licenseNotes: null, authority: "Missouri Secretary of State", url: "https://www.sos.mo.gov/business", notes: null },
  { stateCode: "MT", stateName: "Montana", threshold: 10, license: false, licenseNotes: null, authority: "Montana Secretary of State", url: "https://sosmt.gov/business/", notes: null },
  { stateCode: "NE", stateName: "Nebraska", threshold: 10, license: false, licenseNotes: null, authority: "Nebraska Secretary of State", url: "https://sos.nebraska.gov/business-services", notes: null },
  { stateCode: "NV", stateName: "Nevada", threshold: 10, license: false, licenseNotes: null, authority: "Nevada Secretary of State", url: "https://www.nvsos.gov/sos/businesses", notes: null },
  { stateCode: "NH", stateName: "New Hampshire", threshold: 10, license: false, licenseNotes: null, authority: "New Hampshire Secretary of State", url: "https://www.sos.nh.gov/corporations", notes: null },
  { stateCode: "NJ", stateName: "New Jersey", threshold: 8, license: false, licenseNotes: null, authority: "New Jersey Division of Revenue", url: "https://www.njportal.com/DOR/BusinessFormation/", notes: "NJ has a lower threshold for out-of-state service businesses." },
  { stateCode: "NM", stateName: "New Mexico", threshold: 10, license: false, licenseNotes: null, authority: "New Mexico Secretary of State", url: "https://portal.sos.state.nm.us/BFS/online/", notes: null },
  { stateCode: "NY", stateName: "New York", threshold: 5, license: true, licenseNotes: "New York requires registration with the Department of State and may require specific tax preparer registration.", authority: "New York Department of State", url: "https://dos.ny.gov/corporations-state-records-and-ucc", notes: "NY has strict nexus rules. Foreign Qualification triggered at a low threshold." },
  { stateCode: "NC", stateName: "North Carolina", threshold: 10, license: false, licenseNotes: null, authority: "North Carolina Secretary of State", url: "https://www.sosnc.gov/divisions/business_registration", notes: null },
  { stateCode: "ND", stateName: "North Dakota", threshold: 10, license: false, licenseNotes: null, authority: "North Dakota Secretary of State", url: "https://sos.nd.gov/business/", notes: null },
  { stateCode: "OH", stateName: "Ohio", threshold: 10, license: false, licenseNotes: null, authority: "Ohio Secretary of State", url: "https://www.ohiosos.gov/businesses/", notes: null },
  { stateCode: "OK", stateName: "Oklahoma", threshold: 10, license: false, licenseNotes: null, authority: "Oklahoma Secretary of State", url: "https://www.sos.ok.gov/business/", notes: null },
  { stateCode: "OR", stateName: "Oregon", threshold: 10, license: false, licenseNotes: null, authority: "Oregon Secretary of State", url: "https://sos.oregon.gov/business/Pages/default.aspx", notes: null },
  { stateCode: "PA", stateName: "Pennsylvania", threshold: 8, license: false, licenseNotes: null, authority: "Pennsylvania Department of State", url: "https://www.dos.pa.gov/BusinessCharities/Business/", notes: "PA has a moderately lower threshold for service businesses." },
  { stateCode: "RI", stateName: "Rhode Island", threshold: 10, license: false, licenseNotes: null, authority: "Rhode Island Secretary of State", url: "https://www.sos.ri.gov/divisions/business-services", notes: null },
  { stateCode: "SC", stateName: "South Carolina", threshold: 10, license: false, licenseNotes: null, authority: "South Carolina Secretary of State", url: "https://www.sos.sc.gov/online-filings", notes: null },
  { stateCode: "SD", stateName: "South Dakota", threshold: 10, license: false, licenseNotes: null, authority: "South Dakota Secretary of State", url: "https://sdsos.gov/business-services/", notes: null },
  { stateCode: "TN", stateName: "Tennessee", threshold: 10, license: false, licenseNotes: null, authority: "Tennessee Secretary of State", url: "https://sos.tn.gov/business-services", notes: null },
  { stateCode: "TX", stateName: "Texas", threshold: 5, license: true, licenseNotes: "Texas requires registration with the Texas State Board of Public Accountancy for certain accounting services.", authority: "Texas Secretary of State", url: "https://www.sos.texas.gov/corp/index.shtml", notes: "TX has strict nexus rules. File with TX Secretary of State when threshold is reached." },
  { stateCode: "UT", stateName: "Utah", threshold: 10, license: false, licenseNotes: null, authority: "Utah Division of Corporations", url: "https://corporations.utah.gov/", notes: null },
  { stateCode: "VT", stateName: "Vermont", threshold: 10, license: false, licenseNotes: null, authority: "Vermont Secretary of State", url: "https://sos.vermont.gov/corporations/", notes: null },
  { stateCode: "VA", stateName: "Virginia", threshold: 10, license: false, licenseNotes: null, authority: "Virginia SCC", url: "https://scc.virginia.gov/pages/Business-Entity-Search", notes: null },
  { stateCode: "WA", stateName: "Washington", threshold: 10, license: false, licenseNotes: null, authority: "Washington Secretary of State", url: "https://www.sos.wa.gov/corps/", notes: null },
  { stateCode: "WV", stateName: "West Virginia", threshold: 10, license: false, licenseNotes: null, authority: "West Virginia Secretary of State", url: "https://sos.wv.gov/business/Pages/default.aspx", notes: null },
  { stateCode: "WI", stateName: "Wisconsin", threshold: 10, license: false, licenseNotes: null, authority: "Wisconsin DFI", url: "https://www.wdfi.org/Apostilles_702/", notes: null },
  { stateCode: "WY", stateName: "Wyoming", threshold: 15, license: false, licenseNotes: null, authority: "Wyoming Secretary of State", url: "https://sos.wyo.gov/Business/", notes: "Wyoming is business-friendly with higher thresholds." },
  { stateCode: "DC", stateName: "District of Columbia", threshold: 8, license: false, licenseNotes: null, authority: "DC DLCP", url: "https://dcra.dc.gov/service/corporate-registration", notes: "D.C. has a lower threshold and unique registration requirements." },
];

export async function ensureNexusRulesSeeded(): Promise<void> {
  const existing = await db.select({ count: sql<number>`count(*)::int` }).from(stateNexusRulesTable);
  if (existing[0]?.count > 0) return;

  console.log("Seeding state nexus rules...");
  for (const state of STATE_NEXUS_SEED_DATA) {
    await db.insert(stateNexusRulesTable).values({
      stateCode: state.stateCode,
      stateName: state.stateName,
      foreignQualificationThreshold: state.threshold,
      bookkeepingLicenseRequired: state.license,
      bookkeepingLicenseNotes: state.licenseNotes,
      authorityName: state.authority,
      authorityUrl: state.url,
      notes: state.notes,
    }).onConflictDoNothing();
  }
  console.log(`Seeded ${STATE_NEXUS_SEED_DATA.length} state nexus rules`);
}
