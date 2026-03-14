const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

const EXPORT_DIR = __dirname;
const OUTPUT_FILE = path.join(EXPORT_DIR, 'blueprints-bookkeeping-kit.zip');

const TEMPLATES = [
  { file: 'home.json', title: 'Home', type: 'page' },
  { file: 'about.json', title: 'About', type: 'page' },
  { file: 'services.json', title: 'Services', type: 'page' },
  { file: 'industries.json', title: 'Industries', type: 'page' },
  { file: 'pricing.json', title: 'Pricing', type: 'page' },
  { file: 'portfolio.json', title: 'Portfolio', type: 'page' },
  { file: 'contact.json', title: 'Contact', type: 'page' },
  { file: 'blog.json', title: 'Blog', type: 'page' },
  { file: 'results.json', title: 'Results', type: 'page' },
  { file: 'header.json', title: 'Header', type: 'header' },
  { file: 'footer.json', title: 'Footer', type: 'footer' },
];

const siteSettings = {
  custom_colors: [
    { _id: 'bpbk_background', title: 'Background', color: '#0E1118' },
    { _id: 'bpbk_card', title: 'Card', color: '#161B2E' },
    { _id: 'bpbk_surface', title: 'Surface', color: '#1E2336' },
    { _id: 'bpbk_accent', title: 'Accent', color: '#6366F1' },
    { _id: 'bpbk_text', title: 'Text', color: '#D8DCE4' },
    { _id: 'bpbk_muted', title: 'Muted', color: '#8B91A0' },
    { _id: 'bpbk_border', title: 'Border', color: '#252B3D' },
  ],
  system_colors: [
    { _id: 'primary', title: 'Primary', color: '#6366F1' },
    { _id: 'secondary', title: 'Secondary', color: '#161B2E' },
    { _id: 'text', title: 'Text', color: '#D8DCE4' },
    { _id: 'accent', title: 'Accent', color: '#6366F1' },
  ],
  custom_typography: [
    {
      _id: 'bpbk_heading',
      title: 'Heading',
      typography_typography: 'custom',
      typography_font_family: 'Outfit',
      typography_font_weight: '700',
    },
    {
      _id: 'bpbk_body',
      title: 'Body',
      typography_typography: 'custom',
      typography_font_family: 'Inter',
      typography_font_weight: '400',
    },
    {
      _id: 'bpbk_mono',
      title: 'Monospace',
      typography_typography: 'custom',
      typography_font_family: 'JetBrains Mono',
      typography_font_weight: '500',
    },
  ],
  system_typography: [
    {
      _id: 'primary',
      title: 'Primary',
      typography_typography: 'custom',
      typography_font_family: 'Outfit',
      typography_font_weight: '700',
    },
    {
      _id: 'secondary',
      title: 'Secondary',
      typography_typography: 'custom',
      typography_font_family: 'Inter',
      typography_font_weight: '400',
    },
    {
      _id: 'text',
      title: 'Text',
      typography_typography: 'custom',
      typography_font_family: 'Inter',
      typography_font_weight: '400',
    },
    {
      _id: 'accent',
      title: 'Accent',
      typography_typography: 'custom',
      typography_font_family: 'Outfit',
      typography_font_weight: '600',
    },
  ],
  page_background_background: 'classic',
  page_background_color: '#0E1118',
  body_background_background: 'classic',
  body_background_color: '#0E1118',
};

const manifest = {
  name: 'Blueprints & Bookkeeping',
  title: 'Blueprints & Bookkeeping',
  description: 'Complete website kit for Blueprints & Bookkeeping LLC — a boutique financial consultancy. Dark theme with indigo accent, Outfit/Inter fonts.',
  author: 'Blueprints & Bookkeeping LLC',
  version: '1.0.0',
  elementor_version: '3.18.0',
  created: new Date().toISOString(),
  thumbnail: '',
  site: 'blueprintsandbookkeeping.com',
  templates: TEMPLATES.map((t, i) => ({
    id: i + 1,
    title: t.title,
    doc_type: t.type === 'page' ? 'wp-page' : t.type,
    thumbnail: '',
    url: `templates/${t.file}`,
    source: 'local',
    type: t.type,
    subtype: t.type === 'page' ? 'page' : t.type,
    content_type: t.type === 'page' ? '' : t.type,
    conditions: t.type === 'header' || t.type === 'footer'
      ? ['include/general']
      : [],
  })),
  'site-settings': 'site-settings.json',
};

function buildZip() {
  const archiver = require('archiver');

  const output = createWriteStream(OUTPUT_FILE);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Kit zip created: ${OUTPUT_FILE}`);
    console.log(`Total size: ${(archive.pointer() / 1024).toFixed(1)} KB`);
    console.log(`Contains ${TEMPLATES.length} templates + manifest + site-settings`);
  });

  archive.on('error', (err) => { throw err; });
  archive.pipe(output);

  archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
  archive.append(JSON.stringify(siteSettings, null, 2), { name: 'site-settings.json' });

  for (const t of TEMPLATES) {
    const filePath = path.join(EXPORT_DIR, t.file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    const kitTemplate = {
      id: TEMPLATES.indexOf(t) + 1,
      title: parsed.title || t.title,
      type: t.type,
      content: parsed.content,
      page_settings: parsed.page_settings || {},
      version: parsed.version || '0.4',
      metadata: {
        wp_page_template: 'elementor_header_footer',
      },
    };

    archive.append(JSON.stringify(kitTemplate, null, 2), { name: `templates/${t.file}` });
  }

  archive.finalize();
}

buildZip();
