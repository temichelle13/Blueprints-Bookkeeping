import { ContractModel, ContractTemplateModel } from "@workspace/db";
import * as adobeSign from "./adobe-sign";
import * as ccStorage from "./adobe-cc-storage";
import { Resend } from "resend";

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

async function notifyAdminExpired(
  contracts: Array<{
    clientName: string;
    clientEmail: string;
    contractType: string;
  }>,
): Promise<void> {
  const key = process.env["RESEND_API_KEY"];
  if (!key || contracts.length === 0) return;

  const resend = new Resend(key);
  const rows = contracts
    .map(
      (c) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #e2e5f0;">${c.clientName}</td><td style="padding:6px 12px;border-bottom:1px solid #e2e5f0;">${c.clientEmail}</td><td style="padding:6px 12px;border-bottom:1px solid #e2e5f0;">${c.contractType.replace(/_/g, " ")}</td></tr>`,
    )
    .join("");

  await resend.emails
    .send({
      from: FROM_ADDRESS,
      to: OWNER_EMAIL,
      subject: `${contracts.length} Contract(s) Auto-Expired — Action May Be Needed`,
      html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:#dc2626;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">Contracts Auto-Expired</h1>
        </div>
        <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
          <p>The following contract(s) were unsigned after 14 days and have been automatically expired:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr style="background:#f1f3f9;"><th style="padding:8px 12px;text-align:left;">Client</th><th style="padding:8px 12px;text-align:left;">Email</th><th style="padding:8px 12px;text-align:left;">Type</th></tr>
            ${rows}
          </table>
          <p style="margin-top:16px;">You may want to follow up with these clients directly or resend the contract from the <a href="https://blueprintsandbookkeeping.com/admin/contracts" style="color:#6366f1;">admin dashboard</a>.</p>
        </div>
      </div>`,
    })
    .catch((err) => {
      console.error("Failed to send expiration notification:", err);
    });
}

const CONTRACT_TYPE_MAP: Record<string, string[]> = {
  bookkeeping: ["engagement_letter"],
  advanced_bookkeeping: ["engagement_letter"],
  business_plans: ["engagement_letter"],
  business_planning: ["engagement_letter"],
  digital_handshake: ["engagement_letter"],
  web_design: ["engagement_letter"],
  advisory: ["engagement_letter"],
  discovery: ["mutual_nda"],
  discovery_call: ["mutual_nda"],
  self_service_onboarding: ["engagement_letter", "mutual_nda"],
};

function normalizeServiceName(service: string): string {
  return service
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "_");
}

const SERVICE_ALIASES: Record<string, string> = {
  discovery_call: "discovery",
  "30_minute_discovery_call": "discovery",
  discovery_session: "discovery",
  "30min": "discovery",
  advanced_bookkeeping: "bookkeeping",
  business_plans: "business_planning",
  digital_handshake: "digital_handshake",
  web_design: "web_design",
};

function resolveServiceAlias(normalized: string): string {
  return SERVICE_ALIASES[normalized] || normalized;
}

export async function processBooking(data: {
  clientName: string;
  clientEmail: string;
  serviceType?: string;
}): Promise<
  Array<{ id: string; contractType: string; adobeAgreementId: string | null }>
> {
  const services = data.serviceType ? [data.serviceType] : null;
  const recurring = await isRecurringClient(data.clientEmail);

  let formType = "service_booking";
  if (data.serviceType) {
    const normalized = normalizeServiceName(data.serviceType);
    const alias = resolveServiceAlias(normalized);
    if (alias === "discovery") {
      formType = "discovery";
    }
  }

  const contractTypes = await determineContractTypes(
    formType,
    services,
    recurring,
  );
  const results: Array<{
    id: string;
    contractType: string;
    adobeAgreementId: string | null;
  }> = [];

  if (contractTypes.length === 0) {
    contractTypes.push("engagement_letter");
  }

  for (const contractType of contractTypes) {
    try {
      const result = await sendContract({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        contractType,
        ...(data.serviceType !== undefined && {
          serviceType: data.serviceType,
        }),
      });
      results.push({ ...result, contractType });
    } catch (err) {
      console.error(
        `Failed to send ${contractType} on booking for ${data.clientEmail}:`,
        err,
      );
    }
  }

  return results;
}

export async function determineContractTypes(
  formType: string,
  servicesInterested: string[] | null,
  isRecurringClient: boolean = false,
): Promise<string[]> {
  const types = new Set<string>();

  const activeTemplates = await ContractTemplateModel.find({
    active: true,
  }).lean();

  const dbTriggerMap = new Map<string, Set<string>>();
  for (const tpl of activeTemplates) {
    if (tpl.triggerCondition) {
      const conditions = tpl.triggerCondition
        .split(",")
        .map((s: string) => s.trim());
      for (const condition of conditions) {
        if (!dbTriggerMap.has(condition)) {
          dbTriggerMap.set(condition, new Set());
        }
        dbTriggerMap.get(condition)!.add(tpl.contractType);
      }
    }
  }

  if (dbTriggerMap.has(formType)) {
    for (const ct of dbTriggerMap.get(formType)!) types.add(ct);
  }

  if (servicesInterested && servicesInterested.length > 0) {
    for (const service of servicesInterested) {
      const normalized = normalizeServiceName(service);
      const alias = resolveServiceAlias(normalized);
      if (dbTriggerMap.has(normalized)) {
        for (const ct of dbTriggerMap.get(normalized)!) types.add(ct);
      }
      if (alias !== normalized && dbTriggerMap.has(alias)) {
        for (const ct of dbTriggerMap.get(alias)!) types.add(ct);
      }
    }
  }

  if (types.size === 0) {
    if (formType === "detailed" || formType === "discovery") {
      types.add("mutual_nda");
    }

    const formTypeMapped = CONTRACT_TYPE_MAP[formType];
    if (formTypeMapped) {
      for (const t of formTypeMapped) types.add(t);
    }

    if (servicesInterested && servicesInterested.length > 0) {
      for (const service of servicesInterested) {
        const normalized = normalizeServiceName(service);
        const alias = resolveServiceAlias(normalized);
        const mapped =
          CONTRACT_TYPE_MAP[alias] || CONTRACT_TYPE_MAP[normalized];
        if (mapped) {
          for (const t of mapped) types.add(t);
        } else {
          types.add("engagement_letter");
        }
      }
    }
  }

  if (isRecurringClient && types.has("engagement_letter")) {
    types.add("data_processing_agreement");
  }

  return Array.from(types);
}

export async function isRecurringClient(email: string): Promise<boolean> {
  const existing = await ContractModel.findOne({
    clientEmail: email,
    status: "signed",
  }).lean();

  return !!existing;
}

export async function sendContract(opts: {
  clientName: string;
  clientEmail: string;
  contractType: string;
  serviceType?: string;
  pricingTier?: string;
  startDate?: string;
  contactInquiryId?: string;
}): Promise<{ id: string; adobeAgreementId: string | null }> {
  const template = await ContractTemplateModel.findOne({
    contractType: opts.contractType,
    active: true,
  }).lean();
  const now = new Date();

  const mergeFields: Array<{ defaultValue: string; fieldName: string }> = [
    { fieldName: "clientName", defaultValue: opts.clientName },
    { fieldName: "clientEmail", defaultValue: opts.clientEmail },
  ];
  if (opts.serviceType) {
    mergeFields.push({
      fieldName: "serviceType",
      defaultValue: opts.serviceType,
    });
  }
  if (opts.pricingTier) {
    mergeFields.push({
      fieldName: "pricingTier",
      defaultValue: opts.pricingTier,
    });
  }
  if (opts.startDate) {
    mergeFields.push({ fieldName: "startDate", defaultValue: opts.startDate });
  }

  if (!adobeSign.isConfigured()) {
    throw new Error(
      "Adobe Sign API is not configured. Cannot send contracts without ADOBE_SIGN_CLIENT_ID, ADOBE_SIGN_CLIENT_SECRET, and ADOBE_SIGN_REFRESH_TOKEN.",
    );
  }

  if (!template?.adobeTemplateId) {
    throw new Error(
      `No active template found for contract type "${opts.contractType}". Create a template in the admin dashboard before sending.`,
    );
  }

  let adobeAgreementId: string | null = null;

  {
    const contractTypeLabel = opts.contractType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const expirationDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const agreementInfo: adobeSign.AgreementCreationInfo = {
      fileInfos: [{ libraryDocumentId: template.adobeTemplateId }],
      name: `${contractTypeLabel} — ${opts.clientName}`,
      participantSetsInfo: [
        {
          memberInfos: [{ email: opts.clientEmail }],
          order: 1,
          role: "SIGNER",
        },
      ],
      signatureType: "ESIGN",
      state: "IN_PROCESS",
      mergeFieldInfo: mergeFields,
      emailOption: {
        sendOptions: {
          completionEmails: "ALL",
          inFlightEmails: "NONE",
          initEmails: "ALL",
        },
      },
      expirationTime: expirationDate.toISOString(),
    };

    const agreement = await adobeSign.createAgreement(agreementInfo);
    adobeAgreementId = agreement.id;
  }

  const contract = await ContractModel.create({
    clientName: opts.clientName,
    clientEmail: opts.clientEmail,
    contractType: opts.contractType,
    templateId: template._id,
    adobeAgreementId,
    status: "sent",
    serviceType: opts.serviceType ?? null,
    pricingTier: opts.pricingTier ?? null,
    startDate: opts.startDate ?? null,
    sentAt: now,
    contactInquiryId: opts.contactInquiryId ?? null,
  });

  return { id: contract._id.toString(), adobeAgreementId };
}

export async function processFormSubmission(data: {
  formType: string;
  name: string;
  email: string;
  servicesInterested?: string[] | null;
  contactInquiryId: string;
}): Promise<
  Array<{ id: string; contractType: string; adobeAgreementId: string | null }>
> {
  const recurring = await isRecurringClient(data.email);
  const contractTypes = await determineContractTypes(
    data.formType,
    data.servicesInterested ?? null,
    recurring,
  );
  const results: Array<{
    id: string;
    contractType: string;
    adobeAgreementId: string | null;
  }> = [];

  for (const contractType of contractTypes) {
    try {
      const result = await sendContract({
        clientName: data.name,
        clientEmail: data.email,
        contractType,
        ...(data.servicesInterested !== undefined &&
          data.servicesInterested !== null && {
            serviceType: data.servicesInterested.join(", "),
          }),
        contactInquiryId: data.contactInquiryId,
      });
      results.push({ ...result, contractType });
    } catch (err) {
      console.error(
        `Failed to send ${contractType} contract to ${data.email}:`,
        err,
      );
    }
  }

  return results;
}

export async function checkAndSendReminders(): Promise<{
  remindersProcessed: number;
  expired: number;
}> {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  let remindersProcessed = 0;
  let expired = 0;
  const expiredContracts: Array<{
    clientName: string;
    clientEmail: string;
    contractType: string;
  }> = [];

  const pendingContracts = await ContractModel.find({
    status: { $in: ["sent", "viewed"] },
    signedAt: null,
  }).lean();

  for (const contract of pendingContracts) {
    if (!contract.sentAt) continue;

    if (contract.sentAt < fourteenDaysAgo) {
      await ContractModel.findByIdAndUpdate(contract._id, {
        status: "expired",
        expiredAt: now,
        updatedAt: now,
      });

      if (contract.adobeAgreementId && adobeSign.isConfigured()) {
        try {
          await adobeSign.cancelAgreement(contract.adobeAgreementId);
        } catch (err) {
          console.error(
            `Failed to cancel agreement ${contract.adobeAgreementId}:`,
            err,
          );
        }
      }
      expiredContracts.push({
        clientName: contract.clientName,
        clientEmail: contract.clientEmail,
        contractType: contract.contractType,
      });
      expired++;
      continue;
    }

    const shouldRemind =
      (contract.remindersSent === 0 && contract.sentAt < twentyFourHoursAgo) ||
      (contract.remindersSent === 1 && contract.sentAt < seventyTwoHoursAgo);

    if (shouldRemind && contract.adobeAgreementId && adobeSign.isConfigured()) {
      try {
        await adobeSign.sendReminder(contract.adobeAgreementId);
        await ContractModel.findByIdAndUpdate(contract._id, {
          remindersSent: (contract.remindersSent ?? 0) + 1,
          lastReminderAt: now,
          updatedAt: now,
        });
        remindersProcessed++;
      } catch (err) {
        console.error(
          `Failed to send reminder for contract ${contract._id}:`,
          err,
        );
      }
    }
  }

  if (expiredContracts.length > 0) {
    await notifyAdminExpired(expiredContracts);
  }

  return { remindersProcessed, expired };
}

export async function syncAgreementStatus(contractId: string): Promise<void> {
  const contract = await ContractModel.findById(contractId).lean();
  if (!contract?.adobeAgreementId || !adobeSign.isConfigured()) return;

  const details = await adobeSign.getAgreement(contract.adobeAgreementId);
  const now = new Date();

  if (
    details.status === "OUT_FOR_SIGNATURE" ||
    details.status === "OUT_FOR_APPROVAL"
  ) {
    if (contract.status !== "sent") {
      await ContractModel.findByIdAndUpdate(contractId, {
        status: "sent",
        updatedAt: now,
      });
    }
  } else if (
    details.status === "VIEWED" ||
    details.status === "WAITING_FOR_MY_SIGNATURE"
  ) {
    if (contract.status !== "viewed") {
      await ContractModel.findByIdAndUpdate(contractId, {
        status: "viewed",
        updatedAt: now,
      });
    }
  } else if (details.status === "SIGNED" && contract.status !== "signed") {
    await ContractModel.findByIdAndUpdate(contractId, {
      status: "signed",
      signedAt: now,
      updatedAt: now,
    });

    try {
      const signedPdf = await adobeSign.getSignedDocument(
        contract.adobeAgreementId,
      );
      const archivePath = ccStorage.buildArchivePath(
        contract.clientName,
        contract.contractType,
      );
      await ccStorage.uploadToCreativeCloud(archivePath, signedPdf);

      await ContractModel.findByIdAndUpdate(contractId, {
        signedDocumentUrl: archivePath,
        updatedAt: now,
      });
    } catch (err) {
      console.error(
        `Failed to archive signed document for contract ${contractId}:`,
        err,
      );
    }
  } else if (details.status === "CANCELLED" || details.status === "EXPIRED") {
    await ContractModel.findByIdAndUpdate(contractId, {
      status: details.status.toLowerCase() as "expired" | "cancelled",
      expiredAt: now,
      updatedAt: now,
    });
  }
}

export async function syncAllPendingAgreements(): Promise<number> {
  const pending = await ContractModel.find({
    status: { $in: ["sent", "viewed"] },
  }).lean();

  let synced = 0;
  for (const contract of pending) {
    try {
      await syncAgreementStatus(contract._id.toString());
      synced++;
    } catch (err) {
      console.error(`Failed to sync contract ${contract._id}:`, err);
    }
  }
  return synced;
}
