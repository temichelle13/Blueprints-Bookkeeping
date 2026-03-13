const fs = require('fs');
const path = require('path');

const COLORS = {
  background: '#0E1118',
  foreground: '#D8DCE4',
  accent: '#6366F1',
  accentLight: '#818CF8',
  card: '#161B2E',
  surface: '#1E2336',
  muted: '#8B91A0',
  white: '#FFFFFF',
  green: '#4ADE80',
  red: '#F87171',
  amber: '#FBBF24',
  border: '#252B3D',
  transparent: 'transparent',
};

let idCounter = 0;
function uid() {
  idCounter++;
  return `elem${idCounter.toString(36).padStart(6, '0')}`;
}

function makeTemplate(title, content, type = 'page') {
  return {
    content,
    page_settings: {
      background_background: 'classic',
      background_color: COLORS.background,
    },
    version: '0.4',
    title,
    type,
  };
}

function section(settings, elements) {
  return {
    id: uid(),
    elType: 'section',
    settings: {
      layout: 'full_width',
      content_width: { unit: 'px', size: 1200 },
      gap: 'default',
      ...settings,
    },
    elements,
  };
}

function column(settings, elements) {
  return {
    id: uid(),
    elType: 'column',
    settings: {
      _column_size: 100,
      ...settings,
    },
    elements,
  };
}

function col(size, elements, extraSettings = {}) {
  return {
    id: uid(),
    elType: 'column',
    settings: {
      _column_size: size,
      ...extraSettings,
    },
    elements,
  };
}

function widget(widgetType, settings) {
  return {
    id: uid(),
    elType: 'widget',
    widgetType,
    settings,
  };
}

function heading(title, tag = 'h2', extraSettings = {}) {
  return widget('heading', {
    title,
    header_size: tag,
    title_color: COLORS.white,
    typography_typography: 'custom',
    typography_font_family: 'Outfit',
    typography_font_weight: '700',
    align: 'center',
    ...extraSettings,
  });
}

function textEditor(content, extraSettings = {}) {
  return widget('text-editor', {
    editor: content,
    text_color: COLORS.foreground,
    typography_typography: 'custom',
    typography_font_family: 'Inter',
    ...extraSettings,
  });
}

function button(text, link = '/contact', extraSettings = {}) {
  return widget('button', {
    text,
    link: { url: link, is_external: false, nofollow: false },
    align: 'center',
    button_type: 'default',
    background_color: COLORS.accent,
    button_text_color: COLORS.white,
    border_radius: { unit: 'px', top: 12, right: 12, bottom: 12, left: 12 },
    typography_typography: 'custom',
    typography_font_family: 'Inter',
    typography_font_weight: '600',
    button_padding: { unit: 'px', top: 16, right: 32, bottom: 16, left: 32 },
    ...extraSettings,
  });
}

function spacer(size = 40) {
  return widget('spacer', { space: { unit: 'px', size } });
}

function divider(extraSettings = {}) {
  return widget('divider', {
    color: COLORS.border,
    weight: { unit: 'px', size: 1 },
    ...extraSettings,
  });
}

function iconList(items) {
  const listItems = items.map((item) => ({
    text: item,
    selected_icon: { value: 'fas fa-check', library: 'fa-solid' },
    _id: uid(),
  }));
  return widget('icon-list', {
    icon_list: listItems,
    icon_color: COLORS.accent,
    text_color: COLORS.foreground,
    typography_typography: 'custom',
    typography_font_family: 'Inter',
    space_between: { unit: 'px', size: 12 },
  });
}

function accentBar() {
  return widget('divider', {
    color: COLORS.accent,
    weight: { unit: 'px', size: 4 },
    width: { unit: 'px', size: 48 },
    align: 'center',
    border_radius: { unit: 'px', top: 2, right: 2, bottom: 2, left: 2 },
  });
}

function pageHero(title, subtitle, tag = 'h1') {
  return section(
    {
      background_background: 'gradient',
      background_color: COLORS.background,
      background_color_b: COLORS.card,
      padding: { unit: 'px', top: 140, right: 0, bottom: 80, left: 0 },
    },
    [
      column({}, [
        accentBar(),
        spacer(20),
        heading(title, tag, {
          typography_font_size: { unit: 'px', size: 48 },
        }),
        spacer(16),
        textEditor(
          `<p style="text-align:center;color:${COLORS.muted};font-size:18px;">${subtitle}</p>`
        ),
      ]),
    ]
  );
}

function cardSection(title, description, items) {
  const cardElements = items.map((item) =>
    col(Math.floor(100 / Math.min(items.length, 3)), [
      widget('icon-box', {
        title_text: item.title,
        description_text: item.desc || item.description || '',
        selected_icon: { value: item.icon || 'fas fa-check-circle', library: 'fa-solid' },
        icon_color: COLORS.accent,
        title_color: COLORS.white,
        description_color: COLORS.muted,
        icon_size: { unit: 'px', size: 28 },
        title_typography_typography: 'custom',
        title_typography_font_family: 'Outfit',
        title_typography_font_weight: '700',
        description_typography_typography: 'custom',
        description_typography_font_family: 'Inter',
        position: 'top',
        background_background: 'classic',
        background_color: COLORS.card,
        border_border: 'solid',
        border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 },
        border_color: COLORS.border,
        border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
        box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 },
      }),
    ])
  );

  return [
    section({ padding: { unit: 'px', top: 80, right: 0, bottom: 20, left: 0 } }, [
      column({}, [
        accentBar(),
        spacer(20),
        heading(title),
        spacer(12),
        textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:16px;">${description}</p>`),
      ]),
    ]),
    section(
      {
        structure: items.length <= 3 ? `${items.length}0` : '30',
        padding: { unit: 'px', top: 20, right: 0, bottom: 80, left: 0 },
      },
      cardElements
    ),
  ];
}

function ctaSection(title, subtitle, buttonText, link = '/contact') {
  return section(
    {
      background_background: 'gradient',
      background_color: '#0E1120',
      background_color_b: COLORS.background,
      padding: { unit: 'px', top: 80, right: 0, bottom: 80, left: 0 },
    },
    [
      column({}, [
        heading(title, 'h2', { typography_font_size: { unit: 'px', size: 36 } }),
        spacer(16),
        textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:18px;">${subtitle}</p>`),
        spacer(24),
        button(buttonText, link),
      ]),
    ]
  );
}

// ===================== PAGE GENERATORS =====================

function generateHome() {
  const content = [
    // Hero
    section(
      {
        background_background: 'classic',
        background_color: COLORS.background,
        min_height: { unit: 'vh', size: 100 },
        flex_align_items: 'center',
        padding: { unit: 'px', top: 120, right: 0, bottom: 80, left: 0 },
      },
      [
        column({}, [
          textEditor(`<p style="text-align:center;"><span style="background:${COLORS.card};border:1px solid ${COLORS.border};padding:8px 16px;border-radius:999px;color:${COLORS.accent};font-size:14px;font-weight:500;">Roseburg, OR &mdash; Serving Nationwide</span></p>`),
          spacer(32),
          heading('Your Blueprint to <span style="color:' + COLORS.accent + '">Business Success</span>', 'h1', {
            typography_font_size: { unit: 'px', size: 60 },
          }),
          spacer(16),
          textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:18px;max-width:700px;margin:0 auto;">We transform financial complexity into scalable growth through advanced bookkeeping, lender-ready business plans, and modern digital presence.</p>`),
          spacer(32),
          widget('button', {
            text: 'Schedule Discovery Call',
            link: { url: '/contact' },
            align: 'center',
            background_color: COLORS.accent,
            button_text_color: COLORS.white,
            border_radius: { unit: 'px', top: 12, right: 12, bottom: 12, left: 12 },
            typography_typography: 'custom',
            typography_font_weight: '600',
            typography_font_size: { unit: 'px', size: 18 },
            button_padding: { unit: 'px', top: 18, right: 36, bottom: 18, left: 36 },
          }),
        ]),
      ]
    ),

    // Three Pillars
    ...cardSection(
      'Three Pillars of Growth',
      'Financial infrastructure designed for founders who have outgrown generalist solutions.',
      [
        { title: 'Advanced Bookkeeping', desc: 'Multi-entity structuring, historical cleanups, and rule-based QBO automation for operations that demand precision.', icon: 'fas fa-calculator' },
        { title: 'Lender-Ready Plans', desc: '3-to-5-year financial forecasting built to survive bank underwriting and institutional due diligence.', icon: 'fas fa-book-open' },
        { title: 'The Digital Handshake', desc: 'Ditch the PDF. Your business plan delivered as a custom, high-performance static website.', icon: 'fas fa-globe' },
      ]
    ),

    // Why Choose Us
    section(
      { padding: { unit: 'px', top: 80, right: 0, bottom: 80, left: 0 } },
      [
        col(50, [
          accentBar(),
          spacer(20),
          heading('Why High-Value Founders Choose Us', 'h2', { align: 'left', typography_font_size: { unit: 'px', size: 36 } }),
          spacer(12),
          textEditor(`<p style="color:${COLORS.muted};font-size:16px;">Generalist bookkeepers hit a complexity ceiling. Tax practices disappear during Q1. We designed a boutique model that stays available and technically unmatched.</p>`),
          spacer(20),
          iconList([
            '12-Month Availability — No tax preparation means no seasonal blind spots.',
            'No Offshore — Ever — 100% domestic. Your sensitive financial data is handled personally.',
            '20-Client Maximum — Strictly capped roster for executive-level dedication.',
          ]),
        ]),
        col(50, [
          widget('icon-box', {
            title_text: 'The Blueprints Difference',
            description_text: `<ul style="list-style:none;padding:0;margin:0;">
<li style="color:#4ADE80;margin-bottom:8px;">✓ Fortune 500 Financial Expertise</li>
<li style="color:#4ADE80;margin-bottom:8px;">✓ Certified Ethical Hacker (CEH v12)</li>
<li style="color:#4ADE80;margin-bottom:8px;">✓ QuickBooks ProAdvisor Advanced</li>
<li style="color:#4ADE80;margin-bottom:8px;">✓ Year-Round Availability</li>
<li style="color:#F87171;margin-bottom:8px;text-decoration:line-through;">✕ Offshore Labor</li>
<li style="color:#F87171;">✕ Tax Season Blackouts</li></ul>`,
            selected_icon: { value: 'fas fa-star', library: 'fa-solid' },
            icon_color: COLORS.accent,
            title_color: COLORS.white,
            description_color: COLORS.foreground,
            background_background: 'classic',
            background_color: COLORS.card,
            border_border: 'solid',
            border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 },
            border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 },
            position: 'top',
          }),
        ]),
      ]
    ),

    // Testimonials
    section(
      { padding: { unit: 'px', top: 80, right: 0, bottom: 40, left: 0 } },
      [
        column({}, [
          accentBar(),
          spacer(20),
          heading('What Clients Say'),
          spacer(12),
          textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:16px;">Real results from real founders — anonymized to protect client confidentiality.</p>`),
        ]),
      ]
    ),
    section(
      {
        structure: '40',
        padding: { unit: 'px', top: 20, right: 0, bottom: 80, left: 0 },
      },
      [
        { quote: 'They untangled three years of messy books across four entities in under six weeks. Our lender finally approved the expansion line.', name: 'J.M.', role: 'AgriTech Founder' },
        { quote: 'Funded on the next attempt — $250K SBA loan approved after two prior rejections. The business plan made all the difference.', name: 'R.K.', role: 'Multi-Location Retail Owner' },
        { quote: 'Having a dedicated bookkeeper who actually understands crypto cost-basis tracking saved me from a potential audit nightmare.', name: 'D.S.', role: 'DeFi Protocol Founder' },
        { quote: 'The Digital Handshake concept blew our investors away. Instead of a PDF, they got a live, interactive business plan site.', name: 'A.P.', role: 'SaaS Startup CEO' },
      ].map((t) =>
        col(25, [
          widget('testimonial', {
            testimonial_content: t.quote,
            testimonial_name: `${t.name} — ${t.role}`,
            testimonial_job: '',
            content_content_color: COLORS.foreground,
            name_text_color: COLORS.white,
            background_background: 'classic',
            background_color: COLORS.card,
            border_border: 'solid',
            border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 },
            border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 24, right: 24, bottom: 24, left: 24 },
          }),
        ])
      )
    ),

    // Lead Magnet
    section(
      { padding: { unit: 'px', top: 80, right: 0, bottom: 80, left: 0 } },
      [
        col(50, [
          accentBar(),
          spacer(20),
          heading('Free Download: Financial <span style="color:' + COLORS.accent + '">Readiness Checklist</span>', 'h2', {
            align: 'left',
            typography_font_size: { unit: 'px', size: 36 },
          }),
          spacer(12),
          textEditor(`<p style="color:${COLORS.muted};font-size:16px;">Are your books lender-ready? Use the same checklist our team applies when onboarding new founder clients — distilled into a one-page actionable guide.</p>`),
          spacer(16),
          iconList([
            'Revenue & expense tracking health check',
            'Key financial ratios every lender looks at',
            'Common bookkeeping red flags to fix now',
            'A step-by-step lender-readiness timeline',
            'Questions to ask before hiring a bookkeeper',
          ]),
        ]),
        col(50, [
          widget('icon-box', {
            title_text: 'Get Your Free Checklist',
            description_text: 'Enter your email to download the Financial Readiness Checklist. No spam — just valuable insights.',
            selected_icon: { value: 'fas fa-file-download', library: 'fa-solid' },
            icon_color: COLORS.accent,
            title_color: COLORS.white,
            description_color: COLORS.muted,
            background_background: 'classic',
            background_color: COLORS.card,
            border_border: 'solid',
            border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 },
            border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 },
            position: 'top',
          }),
          spacer(16),
          textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:13px;"><em>Note: In WordPress, replace this section with an Elementor Form widget or your email marketing plugin's form shortcode to capture leads.</em></p>`),
        ]),
      ]
    ),

    // Final CTA
    ctaSection(
      'Stop Guessing. <span style="color:' + COLORS.accent + '">Start Scaling.</span>',
      'Secure your financial infrastructure and map out a profitable future today.',
      'Book Your Consultation'
    ),
  ];

  return makeTemplate('Home', content);
}

function generateAbout() {
  const content = [
    pageHero('Meet Your Architect', 'Where enterprise financial expertise meets cybersecurity rigor.'),

    section(
      { padding: { unit: 'px', top: 60, right: 0, bottom: 40, left: 0 } },
      [
        column({ _column_size: 100 }, [
          heading('Tea Larson-Hetrick', 'h2', { align: 'left', typography_font_size: { unit: 'px', size: 36 } }),
          textEditor(`<p style="color:${COLORS.accent};font-size:18px;font-weight:600;">Founder & Principal Consultant</p>`),
          spacer(20),
          textEditor(`<p style="color:${COLORS.foreground};font-size:16px;line-height:1.8;">Tea brings a rare intersection of enterprise financial management, software engineering, and cybersecurity to Blueprints & Bookkeeping, LLC.</p>
<p style="color:${COLORS.foreground};font-size:16px;line-height:1.8;margin-top:16px;">Having served as a Senior Financial Expert for a Fortune 500 global financial technology leader, Tea understands exactly where standard accounting breaks down for complex businesses. Generalist bookkeepers hit a "complexity ceiling," leaving multi-entity owners and tech founders with messy historical data and a lack of strategic foresight.</p>
<blockquote style="border-left:2px solid ${COLORS.accent};padding-left:16px;margin:24px 0;color:${COLORS.muted};font-style:italic;">Standard accounting firms are excellent for annual compliance, but they vanish during the first-quarter tax season. Blueprints & Bookkeeping intentionally excludes in-house tax preparation — eliminating the seasonal blind spot to remain a proactive, dedicated operational resource 12 months a year.</blockquote>`),
        ]),
      ]
    ),

    // Cards
    section(
      { structure: '20', padding: { unit: 'px', top: 20, right: 0, bottom: 40, left: 0 } },
      [
        col(50, [
          widget('icon-box', {
            title_text: 'Technical Depth',
            description_text: 'Comfortably managing crypto-assets, multi-location structures, and SBA-ready forecasts.',
            selected_icon: { value: 'fas fa-brain', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white, description_color: COLORS.muted,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 24, right: 24, bottom: 24, left: 24 }, position: 'top',
          }),
        ]),
        col(50, [
          widget('icon-box', {
            title_text: 'Data Security First',
            description_text: 'As a CEH v12, your sensitive data is protected by enterprise-grade security. No offshore labor, ever.',
            selected_icon: { value: 'fas fa-fingerprint', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white, description_color: COLORS.muted,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 24, right: 24, bottom: 24, left: 24 }, position: 'top',
          }),
        ]),
      ]
    ),

    // Certifications & Education
    section(
      { structure: '20', padding: { unit: 'px', top: 20, right: 0, bottom: 40, left: 0 } },
      [
        col(50, [
          widget('icon-box', {
            title_text: 'Professional Certifications',
            description_text: `<ul style="list-style:none;padding:0;">
<li style="margin-bottom:10px;color:${COLORS.foreground};">🏅 Certified Ethical Hacker (CEH v12)</li>
<li style="margin-bottom:10px;color:${COLORS.foreground};">🏅 QuickBooks ProAdvisor Advanced</li>
<li style="margin-bottom:10px;color:${COLORS.foreground};">🏅 Advanced Crypto Tax Certified</li>
<li style="color:${COLORS.foreground};">🏅 Oregon Notary (RON Approved)</li></ul>`,
            selected_icon: { value: 'fas fa-award', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 24, right: 24, bottom: 24, left: 24 }, position: 'top',
          }),
        ]),
        col(50, [
          widget('icon-box', {
            title_text: 'Education',
            description_text: `<ul style="list-style:none;padding:0;">
<li style="margin-bottom:10px;color:${COLORS.foreground};">🎓 MBA Coursework, Walden University</li>
<li style="color:${COLORS.foreground};">🎓 Business Administration Studies, St. Andrews University</li></ul>
<p style="font-size:13px;color:${COLORS.muted};margin-top:16px;font-style:italic;">Plus extensive professional development and continuing education across finance, cybersecurity, and technology.</p>`,
            selected_icon: { value: 'fas fa-graduation-cap', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 24, right: 24, bottom: 24, left: 24 }, position: 'top',
          }),
        ]),
      ]
    ),

    // CTA
    section(
      { padding: { unit: 'px', top: 40, right: 0, bottom: 80, left: 0 } },
      [column({}, [button('Work with Tea', '/contact')])],
    ),
  ];

  return makeTemplate('About', content);
}

function generateServices() {
  const services = [
    { title: 'Advanced Bookkeeping & Cleanup', tag: 'ONGOING', desc: 'For complex operations that have outgrown basic data entry.', icon: 'fas fa-calculator',
      features: ['Historical data remediation and cleanup', 'Multi-entity structuring and consolidation', 'Rule-based QBO automation setup', 'Rigorous monthly close procedures', 'Specialized niche reconciliation (crypto, ag, timber)'] },
    { title: 'Lender-Ready Business Plans', tag: 'PROJECT', desc: 'Bridge the gap between your current operations and future funding.', icon: 'fas fa-book-open',
      features: ['Rigorous 3-to-5-year financial forecasting', 'SBA-ready documentation formatting', 'Deep market analysis & competitive positioning', 'Burn rate analysis for startups', 'Strategic narrative development'] },
    { title: 'The Digital Handshake', tag: 'INNOVATION', desc: 'Transform your business plan into a secure, interactive web presence.', icon: 'fas fa-desktop',
      features: ['Business plans delivered as custom static websites', 'Modern alternative to standard PDF pitches', 'High-performance, secure digital hosting', 'Immediate validation of professional worth', 'No complex dynamic maintenance required'] },
    { title: 'Remote Online Notarization', tag: 'ADD-ON', desc: 'Frictionless document execution for your high-stakes agreements.', icon: 'fas fa-file-signature',
      features: ['Oregon-commissioned active notary', 'Secure video conferencing with KBA protocols', 'Instant execution for business plan docs', 'Corporate entity formation signatures', 'Nationwide remote service availability'] },
  ];

  const content = [
    pageHero('Our Services', 'Beyond simple data entry — robust, modern financial infrastructure tailored for ambitious founders.'),

    section(
      { structure: '20', padding: { unit: 'px', top: 60, right: 0, bottom: 40, left: 0 } },
      services.slice(0, 2).map((svc) =>
        col(50, [
          widget('icon-box', {
            title_text: svc.title,
            description_text: `<p style="color:${COLORS.muted};margin-bottom:20px;">${svc.desc}</p>
<ul style="list-style:none;padding:0;">${svc.features.map(f => `<li style="margin-bottom:8px;color:${COLORS.foreground};">✓ ${f}</li>`).join('')}</ul>`,
            selected_icon: { value: svc.icon, library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
          }),
          spacer(16),
          button('Inquire About This Service', '/contact', { align: 'stretch' }),
        ])
      )
    ),

    section(
      { structure: '20', padding: { unit: 'px', top: 20, right: 0, bottom: 80, left: 0 } },
      services.slice(2, 4).map((svc) =>
        col(50, [
          widget('icon-box', {
            title_text: svc.title,
            description_text: `<p style="color:${COLORS.muted};margin-bottom:20px;">${svc.desc}</p>
<ul style="list-style:none;padding:0;">${svc.features.map(f => `<li style="margin-bottom:8px;color:${COLORS.foreground};">✓ ${f}</li>`).join('')}</ul>`,
            selected_icon: { value: svc.icon, library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
          }),
          spacer(16),
          button('Inquire About This Service', '/contact', { align: 'stretch' }),
        ])
      )
    ),
  ];

  return makeTemplate('Services', content);
}

function generateIndustries() {
  const industries = [
    { title: 'Agriculture & Timber', focus: 'Douglas County Focus', desc: 'Navigating Schedule F complexities, advanced equipment depreciation schedules, and multi-crew seasonal payroll structures.', icon: 'fas fa-tree' },
    { title: 'Crypto & Digital Assets', focus: 'Emerging Markets', desc: 'ASU 2023-08 compliance, blockchain reconciliation, and integrating DeFi transactions into clean, traditional general ledgers.', icon: 'fab fa-bitcoin' },
    { title: 'Gig Economy & E-commerce', focus: 'High Volume', desc: 'Multi-platform reconciliation across Stripe, PayPal, Shopify, and Amazon for accurate margin analysis.', icon: 'fas fa-shopping-bag' },
    { title: 'Multi-Entity Portfolios', focus: 'Real Estate & Holdings', desc: 'Managing separate ledgers, resolving intercompany transactions, and structuring data for complex asset-heavy operators.', icon: 'fas fa-building' },
    { title: 'Tech Founders & Startups', focus: 'Investor-Ready', desc: 'Deep burn rate analysis, operational cost tracking, and forecasting models required by VC and angel investors.', icon: 'fas fa-rocket' },
  ];

  const content = [
    pageHero('Industry Expertise', 'We solve the high-friction financial challenges specific to complex, asset-heavy, and emerging markets.'),

    ...cardSection('', '', industries.map(ind => ({
      title: ind.title,
      desc: `<span style="color:${COLORS.accent};font-size:11px;font-weight:600;letter-spacing:2px;">${ind.focus.toUpperCase()}</span><br/><br/>${ind.desc}`,
      icon: ind.icon,
    }))),

    ctaSection(
      "Don't see your niche?",
      'Our technical foundation adapts to complex environments quickly.',
      "Let's Discuss"
    ),
  ];

  return makeTemplate('Industries', content);
}

function generatePricing() {
  const content = [
    pageHero('Value-Based Investment', 'We reject the hourly billing model. You pay for outcomes, clarity, and executive-level expertise. All pricing is flat-fee for predictable cash flow.'),

    section(
      { padding: { unit: 'px', top: 20, right: 0, bottom: 20, left: 0 } },
      [
        column({}, [
          textEditor(`<p style="text-align:center;"><span style="background:${COLORS.card};border:1px solid ${COLORS.border};padding:8px 16px;border-radius:999px;color:${COLORS.accent};font-size:14px;">🛡️ Includes mandatory Technology & Security Surcharge</span></p>`),
        ]),
      ]
    ),

    // Pricing cards
    section(
      { structure: '30', padding: { unit: 'px', top: 40, right: 0, bottom: 40, left: 0 } },
      [
        col(33, [
          widget('icon-box', {
            title_text: 'Bookkeeping',
            description_text: `<p style="font-size:11px;font-weight:600;letter-spacing:2px;color:${COLORS.muted};margin-bottom:12px;">ONGOING</p>
<p style="font-size:12px;color:${COLORS.muted};">Starting at</p>
<p style="font-size:36px;font-weight:800;color:${COLORS.white};margin:4px 0;">$500<span style="font-size:16px;color:${COLORS.muted};font-weight:400;">/mo</span></p>
<p style="font-size:14px;color:${COLORS.muted};margin-top:12px;">Tailored based on transaction volume, entity count, and niche complexity.</p>
<hr style="border-color:${COLORS.border};margin:20px 0;" />
<ul style="list-style:none;padding:0;">${['Dedicated US-based expert', 'Rule-based QBO automation', 'Monthly reconciliation & close', 'Financial statement delivery', 'Proactive communication'].map(f => `<li style="margin-bottom:10px;color:${COLORS.foreground};font-size:14px;">✓ ${f}</li>`).join('')}</ul>`,
            selected_icon: { value: 'fas fa-calculator', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
          }),
          spacer(16),
          button('Get Custom Quote', '/contact', { align: 'stretch' }),
        ]),
        col(33, [
          textEditor(`<div style="text-align:center;margin-bottom:12px;"><span style="background:${COLORS.accent};color:white;padding:6px 16px;border-radius:0 0 8px 8px;font-size:12px;font-weight:700;letter-spacing:1px;">MOST REQUESTED</span></div>`),
          widget('icon-box', {
            title_text: 'Business Plans',
            description_text: `<p style="font-size:11px;font-weight:600;letter-spacing:2px;color:${COLORS.accent};margin-bottom:12px;">PROJECT</p>
<p style="font-size:36px;font-weight:800;color:${COLORS.white};margin:4px 0;">$2.5k – $5k+</p>
<p style="font-size:14px;color:${COLORS.muted};margin-top:12px;">Lender and investor ready planning to secure essential capital.</p>
<hr style="border-color:${COLORS.border};margin:20px 0;" />
<ul style="list-style:none;padding:0;">${['3-5 Year rigorous forecasting', 'SBA formatting standards', 'Deep market research', 'Competitor analysis', 'Executive summary & narrative'].map(f => `<li style="margin-bottom:10px;color:${COLORS.foreground};font-size:14px;">✓ ${f}</li>`).join('')}</ul>`,
            selected_icon: { value: 'fas fa-book-open', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.accent,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
          }),
          spacer(16),
          widget('button', {
            text: 'Start Your Blueprint →',
            link: { url: '/contact' },
            align: 'stretch',
            background_color: COLORS.accent,
            button_text_color: COLORS.white,
            border_radius: { unit: 'px', top: 12, right: 12, bottom: 12, left: 12 },
            typography_typography: 'custom', typography_font_weight: '600',
            button_padding: { unit: 'px', top: 14, right: 24, bottom: 14, left: 24 },
          }),
        ]),
        col(33, [
          widget('icon-box', {
            title_text: 'Static Web Design',
            description_text: `<p style="font-size:11px;font-weight:600;letter-spacing:2px;color:${COLORS.muted};margin-bottom:12px;">INNOVATION</p>
<p style="font-size:36px;font-weight:800;color:${COLORS.white};margin:4px 0;">$1.5k – $3.5k+</p>
<p style="font-size:14px;color:${COLORS.muted};margin-top:12px;">Turn your business plan into an interactive digital handshake.</p>
<hr style="border-color:${COLORS.border};margin:20px 0;" />
<ul style="list-style:none;padding:0;">${['Custom coded static architecture', 'Blazing fast load times', 'Zero database maintenance', 'Interactive financial displays', 'High-end professional polish'].map(f => `<li style="margin-bottom:10px;color:${COLORS.foreground};font-size:14px;">✓ ${f}</li>`).join('')}</ul>`,
            selected_icon: { value: 'fas fa-desktop', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
          }),
          spacer(16),
          button('Explore Digital Build', '/contact', { align: 'stretch' }),
        ]),
      ]
    ),

    // Notary add-on
    section(
      { padding: { unit: 'px', top: 40, right: 0, bottom: 80, left: 0 } },
      [
        col(60, [
          heading('Need Remote Notarization?', 'h4', { align: 'left', typography_font_size: { unit: 'px', size: 18 } }),
          textEditor(`<p style="color:${COLORS.muted};font-size:14px;">Available as a standalone service or integrated seamlessly into your planning project.</p>`),
        ]),
        col(40, [
          textEditor(`<p style="text-align:right;color:${COLORS.foreground};font-size:14px;font-weight:600;">Per-session pricing available</p>
<p style="text-align:right;"><a href="/contact" style="color:${COLORS.accent};font-size:14px;font-weight:500;">Contact to schedule →</a></p>`),
        ]),
      ]
    ),
  ];

  return makeTemplate('Pricing', content);
}

function generatePortfolio() {
  const projects = [
    { title: 'AgriTech Expansion Strategy', category: 'AGRICULTURE / TECH', desc: 'Interactive static website built to secure a $2M commercial equipment loan, featuring automated cash flow models and crop yield projections.' },
    { title: 'SaaS Series A Pitch Deck', category: 'TECH STARTUP', desc: 'A digital handshake replacing a 40-page PDF. Highlighted strict burn rate metrics and user acquisition models in a highly visual, investor-ready format.' },
    { title: 'Multi-Entity Timber Operations', category: 'TIMBER & REAL ESTATE', desc: 'Consolidated holding company financials presented securely via a private web portal, utilized for securing a localized credit facility.' },
  ];

  const content = [
    pageHero('The Digital Handshake', 'Ditch the uninspiring PDF. See how we transform robust financial planning into premium digital assets that command investor respect.'),

    section(
      { padding: { unit: 'px', top: 20, right: 0, bottom: 20, left: 0 } },
      [column({}, [
        textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:14px;background:${COLORS.card};padding:8px 16px;border-radius:999px;display:inline-block;">Examples below are demonstrations to protect client confidentiality.</p>`),
      ])],
    ),

    section(
      { structure: '30', padding: { unit: 'px', top: 40, right: 0, bottom: 60, left: 0 } },
      projects.map((p) =>
        col(33, [
          textEditor(`<p style="font-size:11px;font-weight:600;letter-spacing:2px;color:${COLORS.accent};margin-bottom:8px;">${p.category}</p>`),
          heading(p.title, 'h3', { align: 'left', typography_font_size: { unit: 'px', size: 20 } }),
          spacer(8),
          textEditor(`<p style="color:${COLORS.muted};font-size:15px;line-height:1.7;">${p.desc}</p>`),
        ])
      )
    ),

    ctaSection(
      'Ready for your own?',
      "A website isn't just marketing — it's proof of competence. Let's build your operational foundation.",
      'Start Your Project'
    ),
  ];

  return makeTemplate('Portfolio', content);
}

function generateContact() {
  const content = [
    pageHero("Let's Talk Strategy", 'Choose the path that fits your timeline. Send a quick note or give us the details for a tailored discovery call.'),

    section(
      { structure: '30', padding: { unit: 'px', top: 60, right: 0, bottom: 80, left: 0 } },
      [
        col(33, [
          widget('icon-box', {
            title_text: 'Quick Message',
            description_text: `<p style="color:${COLORS.muted};margin-bottom:20px;">Just have a question? Drop it here.</p>
<p style="color:${COLORS.muted};font-size:13px;font-style:italic;">Use an Elementor Form widget here with: Name, Email, Message fields.</p>`,
            selected_icon: { value: 'fas fa-envelope', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
          }),
          spacer(24),
          widget('icon-box', {
            title_text: 'Direct Channels',
            description_text: `<div style="margin-top:8px;">
<p style="color:${COLORS.foreground};margin-bottom:12px;">📧 <a href="mailto:tea@blueprintsandbookkeeping.com" style="color:${COLORS.foreground};">tea@blueprintsandbookkeeping.com</a></p>
<p style="color:${COLORS.foreground};margin-bottom:12px;">📞 <a href="tel:+15413198654" style="color:${COLORS.foreground};">(541) 319-8654</a></p>
<p style="color:${COLORS.foreground};">📍 Roseburg, Oregon (Remote US)</p></div>`,
            selected_icon: { value: 'fas fa-phone-alt', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 24, right: 24, bottom: 24, left: 24 }, position: 'top',
          }),
        ]),
        col(66, [
          widget('icon-box', {
            title_text: 'Discovery Intake Form',
            description_text: `<p style="color:${COLORS.muted};margin-bottom:20px;">Ready to dive in? Provide context about your operations so we can hit the ground running on our first call.</p>
<p style="color:${COLORS.muted};font-size:13px;font-style:italic;background:${COLORS.surface};padding:16px;border-radius:8px;">
<strong style="color:${COLORS.white};">WordPress Setup Note:</strong><br/>
Replace this placeholder with an Elementor Pro Form widget containing:<br/><br/>
• Name * (text field)<br/>
• Business Name * (text field)<br/>
• Email * (email field)<br/>
• Phone (tel field)<br/>
• Industry * (select: Agriculture & Timber, Crypto/Digital Assets, E-commerce/Gig, Tech/Startup, Real Estate/Multi-Entity, Other)<br/>
• Avg. Monthly Revenue (select: Pre-revenue, $1k-$10k, $10k-$50k, $50k+)<br/>
• Services Interested In * (checkboxes: Advanced Bookkeeping/Cleanup, Business Planning, Digital Handshake, Remote Online Notarization)<br/>
• Biggest Operational Challenge * (textarea)<br/><br/>
Submit button text: "Submit Discovery Application"</p>`,
            selected_icon: { value: 'fas fa-clipboard-list', library: 'fa-solid' },
            icon_color: COLORS.accent, title_color: COLORS.white,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
          }),
        ]),
      ]
    ),
  ];

  return makeTemplate('Contact', content);
}

function generateBlog() {
  const content = [
    pageHero('Blog & Resources', 'Insights on bookkeeping, business planning, and financial strategy for complex, high-growth operations.'),

    section(
      { padding: { unit: 'px', top: 60, right: 0, bottom: 80, left: 0 } },
      [
        column({}, [
          textEditor(`<div style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;padding:32px;margin-bottom:24px;">
<p style="color:${COLORS.muted};font-size:13px;font-style:italic;">
<strong style="color:${COLORS.white};">WordPress Setup Note:</strong><br/><br/>
This page should display your WordPress blog posts. You have two options:<br/><br/>
<strong>Option A (Recommended):</strong> Use Elementor Pro's "Posts" widget or "Loop Grid" widget to automatically display your latest blog posts with the card styling from the original design.<br/><br/>
<strong>Option B:</strong> Use the "Archive Posts" widget if this is your blog archive page.<br/><br/>
<strong>Styling guidelines to match the original design:</strong><br/>
• Card background: ${COLORS.card}<br/>
• Card border: 1px solid ${COLORS.border}<br/>
• Card border-radius: 16px<br/>
• Title color: ${COLORS.white} (Outfit font, bold)<br/>
• Excerpt color: ${COLORS.muted} (Inter font)<br/>
• Category label: ${COLORS.accent}, uppercase, 11px, monospace<br/>
• Read more link: ${COLORS.accent}<br/>
• 2-column grid layout on desktop, 1-column on mobile
</p></div>`),
        ]),
      ]
    ),
  ];

  return makeTemplate('Blog', content);
}

function generateResults() {
  const testimonials = [
    { quote: 'They untangled three years of messy books across four entities in under six weeks. Our lender finally approved the expansion line we\'d been chasing for over a year.', name: 'J.M.', role: 'AgriTech Founder', industry: 'Agriculture & Timber' },
    { quote: 'I\'d been turned down by two banks before Blueprints rebuilt my financials and business plan from scratch. Funded on the next attempt — $250K SBA loan approved.', name: 'R.K.', role: 'Multi-Location Retail Owner', industry: 'Retail / E-commerce' },
    { quote: 'Having a dedicated bookkeeper who actually understands crypto cost-basis tracking saved me from a potential audit nightmare. Worth every penny.', name: 'D.S.', role: 'DeFi Protocol Founder', industry: 'Crypto / Digital Assets' },
    { quote: 'The Digital Handshake concept blew our investors away. Instead of a PDF, they got a live, interactive business plan site. It changed the conversation entirely.', name: 'A.P.', role: 'SaaS Startup CEO', industry: 'Technology / SaaS' },
  ];

  const caseStudies = [
    { title: 'From Chaos to SBA Approval in 90 Days', client: 'AgriTech Founder — Pacific Northwest', industry: 'AGRICULTURE & TIMBER',
      challenge: 'A second-generation timber and agriculture operation had grown from a single LLC into four interrelated entities over five years. The books were a patchwork of spreadsheets, shoe-box receipts, and a neglected QuickBooks file. Two lender applications for a $400K equipment line had been declined due to unreliable financials.',
      approach: 'We performed a full historical cleanup across all four entities, reconciled 36 months of bank and credit card statements, and built a consolidated chart of accounts in QuickBooks Online. Then we developed a lender-ready 5-year business plan with realistic revenue projections backed by historical data.',
      outcomes: ['36 months of financials reconciled across 4 entities', '$400K equipment line of credit approved on first submission', 'Monthly close time reduced from 3 weeks to 3 days', 'Ongoing advisory retainer for growth planning'] },
    { title: 'Crypto Portfolio Compliance & Tax-Ready Books', client: 'DeFi Protocol Founder — Remote (US-based)', industry: 'CRYPTO / DIGITAL ASSETS',
      challenge: 'A founder running a DeFi protocol and personal crypto portfolio had no formal bookkeeping. Over 2,000 transactions across 8 wallets and 3 exchanges were unreconciled. The founder faced a potential IRS inquiry and needed clean, defensible records before tax season.',
      approach: 'We integrated wallet and exchange data into a unified tracking system, applied FIFO cost-basis methodology across all transactions, and reconciled the full transaction history. We then set up ongoing automated categorization rules in QBO for fiat on/off ramps and staking rewards.',
      outcomes: ['2,000+ transactions reconciled across 8 wallets', 'Tax-ready P&L and balance sheet delivered 6 weeks before deadline', 'Automated monthly categorization saving 10+ hours/month', 'No IRS issues — clean compliance posture established'] },
    { title: 'Multi-Location Retail: Funded After Two Rejections', client: 'Multi-Location Retail Owner — Southern Oregon', industry: 'RETAIL / E-COMMERCE',
      challenge: 'A retail business with three storefronts and an e-commerce channel had been declined for an SBA loan twice. The business plan was a generic template, and financials didn\'t match between the plan, the books, and the tax returns.',
      approach: 'We rebuilt the financial model from the ground up using actual historical performance data, created a 3-year projection with conservative, moderate, and aggressive scenarios, and packaged everything into a lender-ready business plan with a supporting Digital Handshake website.',
      outcomes: ['$250K SBA 7(a) loan approved on next application', 'Business plan website impressed underwriting team', 'Revenue projections validated within 5% of actuals in Year 1', 'Fourth storefront opened ahead of schedule'] },
    { title: 'SaaS Startup: Investor-Ready in 30 Days', client: 'SaaS Startup CEO — Remote (Nationwide)', industry: 'TECHNOLOGY / SAAS',
      challenge: 'A pre-Series A SaaS company had strong MRR growth but messy books that couldn\'t pass investor due diligence. Deferred revenue wasn\'t being tracked, expenses were miscategorized, and there was no financial model for the pitch deck.',
      approach: 'We performed a rapid financial cleanup focused on SaaS metrics (MRR, churn, LTV, CAC), built a proper deferred revenue schedule, and created a detailed 5-year financial model with unit economics. The Digital Handshake presentation replaced their static pitch deck financials with a live, interactive site.',
      outcomes: ['Books cleaned and investor-ready in 28 days', 'Deferred revenue properly recognized — $80K reclassified', 'Interactive financial model site used in investor meetings', 'Term sheet signed within the 45-day window'] },
  ];

  const content = [
    pageHero('Client <span style="color:' + COLORS.accent + '">Results</span>', 'Real outcomes from real founders. Every engagement is confidential — names and details are anonymized to protect our clients\' privacy.'),

    // Testimonials section
    section(
      { padding: { unit: 'px', top: 60, right: 0, bottom: 20, left: 0 } },
      [column({}, [
        accentBar(), spacer(20),
        heading('What Clients Say'),
        spacer(12),
        textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:16px;">Hear directly from founders who transformed their financial operations with us.</p>`),
      ])],
    ),
    section(
      { structure: '20', padding: { unit: 'px', top: 20, right: 0, bottom: 60, left: 0 } },
      testimonials.map((t) =>
        col(50, [
          widget('testimonial', {
            testimonial_content: t.quote,
            testimonial_name: `${t.name} — ${t.role}`,
            testimonial_job: t.industry,
            content_content_color: COLORS.foreground,
            name_text_color: COLORS.white,
            job_text_color: COLORS.muted,
            background_background: 'classic', background_color: COLORS.card,
            border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
            border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
            box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 },
          }),
        ])
      )
    ),

    divider(),

    // Case Studies
    section(
      { padding: { unit: 'px', top: 60, right: 0, bottom: 20, left: 0 } },
      [column({}, [
        accentBar(), spacer(20),
        heading('Case Studies'),
        spacer(12),
        textEditor(`<p style="text-align:center;color:${COLORS.muted};font-size:16px;">Detailed breakdowns of how we helped founders overcome financial complexity and unlock growth.</p>`),
      ])],
    ),

    ...caseStudies.map((cs) =>
      section(
        { padding: { unit: 'px', top: 20, right: 0, bottom: 20, left: 0 } },
        [
          column({}, [
            widget('icon-box', {
              title_text: cs.title,
              description_text: `<p style="margin-bottom:8px;"><span style="background:${COLORS.card};color:${COLORS.accent};padding:4px 12px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:2px;">${cs.industry}</span> <span style="color:${COLORS.muted};font-size:13px;margin-left:8px;">${cs.client}</span></p>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:24px;">
<div>
<p style="color:${COLORS.muted};font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">🎯 THE CHALLENGE</p>
<p style="color:${COLORS.foreground};font-size:15px;line-height:1.7;">${cs.challenge}</p>
</div>
<div>
<p style="color:${COLORS.muted};font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">💡 OUR APPROACH</p>
<p style="color:${COLORS.foreground};font-size:15px;line-height:1.7;">${cs.approach}</p>
</div>
<div>
<p style="color:${COLORS.muted};font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">📈 THE OUTCOMES</p>
<ul style="list-style:none;padding:0;">${cs.outcomes.map(o => `<li style="margin-bottom:8px;color:${COLORS.foreground};font-size:15px;">✓ ${o}</li>`).join('')}</ul>
</div>
</div>

<div style="margin-top:24px;padding-top:20px;border-top:1px solid ${COLORS.border};">
<a href="/contact" style="color:${COLORS.accent};font-weight:600;font-size:14px;">Get results like these — Book a discovery call →</a>
</div>`,
              selected_icon: { value: 'fas fa-chart-line', library: 'fa-solid' },
              icon_color: COLORS.accent, title_color: COLORS.white,
              title_typography_typography: 'custom', title_typography_font_size: { unit: 'px', size: 24 },
              background_background: 'classic', background_color: COLORS.card,
              border_border: 'solid', border_width: { unit: 'px', top: 1, right: 1, bottom: 1, left: 1 }, border_color: COLORS.border,
              border_radius: { unit: 'px', top: 16, right: 16, bottom: 16, left: 16 },
              box_padding: { unit: 'px', top: 32, right: 32, bottom: 32, left: 32 }, position: 'top',
            }),
          ]),
        ]
      )
    ),

    // Final CTA
    ctaSection(
      'Ready to Write Your <span style="color:' + COLORS.accent + '">Success Story?</span>',
      "Join the founders who've transformed their financial infrastructure and unlocked their next stage of growth.",
      'Book Your Discovery Call'
    ),
  ];

  return makeTemplate('Results', content);
}

function generateHeader() {
  const navLinks = ['About', 'Services', 'Industries', 'Pricing', 'Portfolio', 'Results', 'Blog'];

  const content = [
    section(
      {
        layout: 'full_width',
        content_width: { unit: 'px', size: 1200 },
        background_background: 'classic',
        background_color: COLORS.background,
        border_border: 'solid',
        border_width: { unit: 'px', top: 0, right: 0, bottom: 1, left: 0 },
        border_color: COLORS.border,
        padding: { unit: 'px', top: 16, right: 0, bottom: 16, left: 0 },
      },
      [
        col(25, [
          heading('Blueprints &<br/><span style="color:' + COLORS.accent + '">Bookkeeping</span>', 'div', {
            align: 'left',
            typography_font_size: { unit: 'px', size: 18 },
            typography_line_height: { unit: 'em', size: 1.2 },
            link: { url: '/' },
          }),
        ]),
        col(55, [
          textEditor(`<p style="text-align:center;">${navLinks.map(l => `<a href="/${l.toLowerCase()}" style="color:${COLORS.muted};text-decoration:none;font-size:14px;font-weight:500;margin:0 12px;">${l}</a>`).join('')}</p>`),
        ]),
        col(20, [
          button('Get Started', '/contact', {
            typography_font_size: { unit: 'px', size: 14 },
            button_padding: { unit: 'px', top: 10, right: 20, bottom: 10, left: 20 },
            align: 'right',
          }),
        ]),
      ]
    ),
  ];

  return makeTemplate('Header', content, 'header');
}

function generateFooter() {
  const content = [
    section(
      {
        layout: 'full_width',
        content_width: { unit: 'px', size: 1200 },
        background_background: 'classic',
        background_color: COLORS.background,
        border_border: 'solid',
        border_width: { unit: 'px', top: 1, right: 0, bottom: 0, left: 0 },
        border_color: COLORS.border,
        padding: { unit: 'px', top: 60, right: 0, bottom: 32, left: 0 },
        structure: '40',
      },
      [
        col(25, [
          heading('Blueprints &<br/><span style="color:' + COLORS.accent + '">Bookkeeping</span>', 'div', {
            align: 'left', typography_font_size: { unit: 'px', size: 22 },
            typography_line_height: { unit: 'em', size: 1.2 },
          }),
          spacer(16),
          textEditor(`<p style="color:${COLORS.muted};font-size:14px;line-height:1.7;">Your Blueprint to Business Success. We transform financial complexity into scalable growth.</p>`),
          spacer(16),
          textEditor(`<p style="font-size:14px;">
<span style="color:${COLORS.muted};">📧 <a href="mailto:tea@blueprintsandbookkeeping.com" style="color:${COLORS.muted};">tea@blueprintsandbookkeeping.com</a></span><br/>
<span style="color:${COLORS.muted};">📞 <a href="tel:+15413198654" style="color:${COLORS.muted};">(541) 319-8654</a></span><br/>
<span style="color:${COLORS.muted};">📍 Roseburg, Oregon (Remote Nationwide)</span></p>`),
        ]),
        col(25, [
          heading('Navigate', 'h4', { align: 'left', typography_font_size: { unit: 'px', size: 13 }, title_color: COLORS.muted }),
          spacer(16),
          textEditor(`<p style="line-height:2.2;font-size:14px;">
<a href="/about" style="color:${COLORS.muted};text-decoration:none;">About Tea</a><br/>
<a href="/services" style="color:${COLORS.muted};text-decoration:none;">Services</a><br/>
<a href="/industries" style="color:${COLORS.muted};text-decoration:none;">Industries</a><br/>
<a href="/pricing" style="color:${COLORS.muted};text-decoration:none;">Pricing</a><br/>
<a href="/portfolio" style="color:${COLORS.muted};text-decoration:none;">Portfolio</a><br/>
<a href="/results" style="color:${COLORS.muted};text-decoration:none;">Client Results</a><br/>
<a href="/blog" style="color:${COLORS.muted};text-decoration:none;">Blog</a></p>`),
        ]),
        col(25, [
          heading('Services', 'h4', { align: 'left', typography_font_size: { unit: 'px', size: 13 }, title_color: COLORS.muted }),
          spacer(16),
          textEditor(`<p style="line-height:2.2;font-size:14px;color:${COLORS.muted};">
Advanced Bookkeeping<br/>
Historical Cleanup<br/>
Lender-Ready Business Plans<br/>
Static Web Design<br/>
Remote Online Notarization</p>`),
        ]),
        col(25, [
          heading('Stay in the Loop', 'h4', { align: 'left', typography_font_size: { unit: 'px', size: 13 }, title_color: COLORS.muted }),
          spacer(16),
          textEditor(`<p style="color:${COLORS.muted};font-size:14px;line-height:1.7;margin-bottom:16px;">Get founder-focused financial tips and updates delivered to your inbox.</p>
<p style="color:${COLORS.muted};font-size:13px;font-style:italic;">Add an Elementor Form or email marketing shortcode here for newsletter signup.</p>`),
          spacer(24),
          button('Book a Discovery Call', '/contact', { align: 'stretch', typography_font_size: { unit: 'px', size: 14 } }),
        ]),
      ]
    ),

    section(
      {
        background_background: 'classic',
        background_color: COLORS.background,
        padding: { unit: 'px', top: 20, right: 0, bottom: 20, left: 0 },
      },
      [
        col(50, [
          textEditor(`<p style="font-size:12px;color:${COLORS.muted};">&copy; 2026 Blueprints & Bookkeeping, LLC. All rights reserved.</p>`),
        ]),
        col(50, [
          textEditor(`<p style="text-align:right;font-size:12px;">
<a href="/privacy" style="color:${COLORS.muted};text-decoration:none;margin-right:20px;">Privacy Policy</a>
<a href="/terms" style="color:${COLORS.muted};text-decoration:none;margin-right:20px;">Terms of Service</a>
<a href="/unsubscribe" style="color:${COLORS.muted};text-decoration:none;">Unsubscribe</a></p>`),
        ]),
      ]
    ),
  ];

  return makeTemplate('Footer', content, 'footer');
}

// ===================== GENERATE ALL =====================

const outputDir = path.join(__dirname);

const templates = {
  'home': generateHome(),
  'about': generateAbout(),
  'services': generateServices(),
  'industries': generateIndustries(),
  'pricing': generatePricing(),
  'portfolio': generatePortfolio(),
  'contact': generateContact(),
  'blog': generateBlog(),
  'results': generateResults(),
  'header': generateHeader(),
  'footer': generateFooter(),
};

for (const [name, template] of Object.entries(templates)) {
  const filePath = path.join(outputDir, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
  console.log(`Generated: ${filePath}`);
}

console.log(`\nDone! ${Object.keys(templates).length} templates generated.`);
