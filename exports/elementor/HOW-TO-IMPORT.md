# How to Import These Templates into WordPress + Elementor Pro

## Option A: One-Click Kit Import (Recommended)

The easiest way to import everything at once is using the **Elementor Kit** zip file.

### What the Kit Includes
- All 11 page/header/footer templates
- Global color palette (dark theme with indigo accent)
- Global typography (Outfit, Inter, JetBrains Mono)
- Site background settings

### How to Import

1. In WordPress admin, go to **Templates > Kit Library**
2. Click the **Import Kit** button (top-right, or via the upload icon)
3. Select the file: **`blueprints-bookkeeping-kit.zip`**
4. Elementor will show a preview of all included templates and settings
5. Choose which items to import (select all for the full site)
6. Click **Apply All** (or selectively apply templates and settings)
7. Your templates, colors, and fonts are now installed site-wide

After importing, create your pages (Home, About, Services, etc.), edit each with Elementor, and insert the corresponding template from **My Templates**. The header and footer will automatically apply to all pages.

> **Note:** The kit zip does NOT replace the individual `.json` files below — those remain available if you prefer to import templates one at a time.

---

## Option B: Manual Import (Individual Templates)

## What's Included

You have 11 Elementor template files:

| File | Page | Type |
|------|------|------|
| `home.json` | Homepage | Page Template |
| `about.json` | About Tea Larson-Hetrick | Page Template |
| `services.json` | Our Services | Page Template |
| `industries.json` | Industry Expertise | Page Template |
| `pricing.json` | Value-Based Investment (Pricing) | Page Template |
| `portfolio.json` | The Digital Handshake (Portfolio) | Page Template |
| `contact.json` | Contact / Discovery Intake | Page Template |
| `blog.json` | Blog & Resources | Page Template |
| `results.json` | Client Results & Case Studies | Page Template |
| `header.json` | Site Header (Navigation) | Theme Builder |
| `footer.json` | Site Footer | Theme Builder |

## Prerequisites

- WordPress installed and running
- Elementor Pro plugin installed and activated
- A dark theme or Elementor's "Hello" theme (recommended for cleanest results)

## Design Reference

These templates use the following color palette to match the original site:

- **Background:** `#0E1118` (very dark navy)
- **Card backgrounds:** `#161B2E`
- **Surface color:** `#1E2336`
- **Text (headings):** `#FFFFFF` (white)
- **Text (body):** `#D8DCE4` (light gray)
- **Text (muted/secondary):** `#8B91A0` (medium gray)
- **Accent/Brand color:** `#6366F1` (indigo/purple)
- **Border color:** `#252B3D`

**Fonts used:**
- Headings: **Outfit** (Google Font)
- Body text: **Inter** (Google Font)
- Monospace labels: **JetBrains Mono** (Google Font)

---

## Step 1: Import Page Templates

1. In WordPress admin, go to **Templates > Saved Templates**
2. Click **Import Templates** at the top of the page
3. Click **Choose File** and select each `.json` file one at a time:
   - Start with `home.json`, then `about.json`, `services.json`, etc.
4. Click **Import Now** for each file
5. Repeat for all 9 page template files (skip header.json and footer.json for now)

## Step 2: Create Pages and Apply Templates

For each page on your site:

1. Go to **Pages > Add New**
2. Enter the page title (e.g., "Home", "About", "Services", etc.)
3. Click **Edit with Elementor**
4. In the Elementor editor, click the **folder icon** (Add Template) in the center
5. Go to the **My Templates** tab
6. Find the template you imported (e.g., "Home") and click **Insert**
7. The full page content will be placed into your editor
8. Click **Publish**
9. Repeat for all pages

**Page setup tips:**
- For the Homepage: Go to **Settings > Reading** and set "Your homepage displays" to "A static page" and select your Home page
- Set each page's **Page Layout** to "Elementor Full Width" (in the page settings panel on the left) for the best appearance

## Step 3: Set Up Header & Footer (Theme Builder)

1. Go to **Templates > Theme Builder**
2. Click **Add New** and choose **Header**
3. Name it "Site Header"
4. In the editor, click the folder icon and import the `header.json` template
5. Click **Publish** and set the display condition to **Entire Site**
6. Repeat for **Footer** using `footer.json`

## Step 4: Configure Global Settings

To match the original site's dark theme:

1. Go to **Elementor > Settings > Style**
2. Under **Default Colors**, set:
   - Primary: `#6366F1`
   - Secondary: `#161B2E`
   - Text: `#D8DCE4`
   - Accent: `#6366F1`
3. Under **Default Fonts**, set:
   - Primary: Inter
   - Secondary: Outfit

4. Go to **Elementor > Custom CSS** (or Appearance > Customize > Additional CSS) and add:

```css
body {
  background-color: #0E1118 !important;
}

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
```

## Step 5: Set Up Forms (Contact Page)

The contact page template includes placeholder notes where forms should go. To activate them:

1. Edit the Contact page with Elementor
2. Delete the placeholder text boxes that say "Use an Elementor Form widget here..."
3. Drag in an **Elementor Form** widget
4. Configure the fields as noted in the placeholder:

**Quick Message Form:**
- Name (required)
- Email (required)
- Message (textarea, required)

**Discovery Intake Form:**
- Name (required)
- Business Name (required)
- Email (required)
- Phone
- Industry (select dropdown)
- Avg. Monthly Revenue (select dropdown)
- Services Interested In (checkboxes)
- Biggest Operational Challenge (textarea, required)

5. Set the form submission action to email (to: tea@blueprintsandbookkeeping.com)

## Step 6: Set Up Newsletter Signup

The footer and home page have placeholders for newsletter signup forms. Replace them with:
- An Elementor Form widget, or
- Your email marketing platform's shortcode (Mailchimp, ConvertKit, etc.)

## Step 7: Set Up Navigation Menu

1. Go to **Appearance > Menus**
2. Create a menu with these items in order:
   - About | Services | Industries | Pricing | Portfolio | Results | Blog
3. Add a "Get Started" button linking to your Contact page
4. Assign the menu to your Primary/Header location

---

## Tips for Best Results

- **Use the Hello Elementor theme** — it's the cleanest base for Elementor Pro and won't conflict with the template styling
- **Install the "Starter Templates" plugin** if you want to quickly set up a base WordPress installation
- **Mobile responsiveness**: After importing, review each page in Elementor's responsive mode (tablet and mobile views) and adjust spacing/font sizes as needed
- **Images**: The original site used placeholder images. Replace the portfolio images with your actual project screenshots
- **Blog**: Use Elementor Pro's Posts widget or Loop Grid to display your actual WordPress blog posts dynamically

## Excluded Pages

The following pages from the original site were intentionally excluded from this export:

- **Marketing Guide** — This is an internal-only page (marked noindex/nofollow, not linked in public navigation). It serves as a private marketing playbook and is not intended for the public WordPress site.
- **Unsubscribe** — A simple utility page that should be handled by your email marketing platform (Mailchimp, ConvertKit, etc.) rather than a custom Elementor template.

If you need either of these as Elementor templates, they can be generated on request.

## Troubleshooting

- **Templates look wrong?** Make sure you've set the page layout to "Elementor Full Width" and added the dark background CSS
- **Fonts not loading?** Add the Google Fonts import CSS shown in Step 4
- **Colors off?** Double-check the Elementor global color settings match the values listed above
- **Missing icons?** The templates use Font Awesome icons. Elementor Pro includes these by default, but make sure Font Awesome is not disabled in Elementor > Settings
