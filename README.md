# GetNGrab Shopify Theme

A complete, production-ready Shopify theme converted from the GetNGrab single-page shoe store app.

---

## How to Import into Shopify

1. **Download** `getngrab-shopify-theme.zip`
2. In your Shopify admin, go to **Online Store → Themes**
3. Click **"Add theme" → "Upload zip file"**
4. Select `getngrab-shopify-theme.zip` and click Upload
5. Once uploaded, click **"Customize"** or **"Publish"**

---

## Theme Structure

```
getngrab-shopify-theme/
├── assets/
│   ├── getngrab.css          ← All theme styles
│   └── getngrab.js           ← Cart drawer, search, wishlist, interactions
├── config/
│   ├── settings_schema.json  ← Theme Editor settings definition
│   └── settings_data.json    ← Default settings values
├── layout/
│   ├── theme.liquid          ← Main HTML shell (head, nav, footer)
│   └── password.liquid       ← Storefront password page
├── locales/
│   └── en.default.json       ← English translations
├── sections/
│   ├── header.liquid         ← Sticky nav with cart/search/account
│   ├── footer.liquid         ← Footer with links
│   ├── hero.liquid           ← Full-screen hero banner
│   ├── promo-strip.liquid    ← Announcement strip
│   ├── category-bar.liquid   ← Scrollable category pills
│   ├── new-arrivals.liquid   ← Product grid section
│   ├── best-sellers.liquid   ← Product grid section
│   ├── split-banner.liquid   ← Two-column promo banner
│   ├── why-getngrab.liquid   ← Feature tiles (blocks)
│   └── newsletter.liquid     ← Email signup section
├── snippets/
│   ├── product-card.liquid         ← Reusable product card
│   └── product-card-placeholder.liquid
└── templates/
    ├── index.liquid          ← Homepage
    ├── collection.liquid     ← Collection / category page
    ├── product.liquid        ← Product detail page
    ├── cart.liquid           ← Cart page
    ├── search.liquid         ← Search results
    ├── page.liquid           ← Generic content pages
    ├── 404.liquid            ← Not found
    └── customers/
        ├── account.liquid    ← My Orders / account
        ├── login.liquid      ← Sign in
        └── register.liquid   ← Create account
```

---

## Setup After Installing

### 1. Create Collections
Create these collections in Shopify admin (Products → Collections):
- `running` — Running shoes
- `training` — Training shoes
- `basketball` — Basketball shoes
- `lifestyle` — Lifestyle/casual shoes
- `kids` — Kids shoes
- `new-arrivals` — Tag products with "new-arrivals"
- `best-sellers` — Tag products with "best-sellers"

### 2. Assign Collections in Theme Editor
Go to **Customize → Home page → New Arrivals / Best Sellers** and select the appropriate collections.

### 3. Tag Products for Badges
Add tags to products to show badges on product cards:
- `badge-new` → Shows **NEW** badge
- `badge-sale` → Shows **SALE** badge  
- `badge-hot` → Shows **HOT** badge

### 4. Product Variants
For size selection on the product page, create a **"Size"** option on each product.  
For color swatches, create a **"Color"** option.

### 5. Product Features (Metafield)
To show the feature checklist on product pages, create a metafield:
- Namespace: `custom`
- Key: `features`
- Type: List of single-line text

### 6. Customize in Theme Editor
All text, images, colors, and sections are editable in **Online Store → Themes → Customize**.

---

## Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Shopify AJAX Cart API — instant cart drawer updates
- ✅ Shopify Predictive Search API
- ✅ Customer accounts (login, register, order history)
- ✅ Collection filtering and sorting
- ✅ Product variant selection (size + color)
- ✅ Wishlist (localStorage)
- ✅ Newsletter signup (Shopify customer form)
- ✅ Theme Editor customizable sections and blocks
- ✅ SEO-friendly markup with proper headings and alt tags
- ✅ Keyboard accessibility (Esc closes overlays, Ctrl+K opens search)

---

## Brand Colors
| Variable | Value | Usage |
|---|---|---|
| `--red` | `#e8001d` | Primary accent, CTAs, badges |
| `--black` | `#0a0a0a` | Background, text, nav |
| `--gray` | `#f4f4f4` | Section backgrounds |
| `--mid` | `#777` | Muted text |
| `--success` | `#0a8a3a` | Success states |
