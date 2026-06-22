# iLovePDFGuru

**iLovePDFGuru** — free online PDF tools and private browser utilities for PDF editing, developers, and everyday tasks. Everything runs locally in your browser. No backend, no uploads, no accounts.

## Tool categories

### PDF Tools
- **Unlock PDF** — `/pdf/unlock`
- **Merge PDF** — `/pdf/merge`
- **Split PDF** — `/pdf/split`
- **View PDF** — `/pdf/view`
- **Sign PDF** — `/pdf/sign`

### Developer Tools
- **Base64, UUID, Hash, AES, JWT** — encoding, encryption & decoding
- **JSON & YAML** — formatters and comparators
- **Cron, URL, Regex, HTML** — parsers and encoders

### Time & Everyday Tools
- **World Clock**, **Timestamp**, **Password**, **Color**, **QR Code**

## Getting started

```bash
npm install
npm run dev
```

Set your domain in `.env`:

```bash
cp .env.example .env
```

Update `public/sitemap.xml` and `public/robots.txt` when you deploy.

## Build & deploy

```bash
npm run build
```

Deploy `dist/` to Vercel, Netlify, or Cloudflare Pages.

## Privacy

All processing happens locally in your browser. Data is never sent to a server.

## Adding more tools

1. Add the tool to `src/config/tools.ts`
2. Create a page under `src/pages/dev/` (or a category folder)
3. Add SEO entry in `src/lib/seo.ts`
4. Register the route in `src/App.tsx`
5. Add URL to `public/sitemap.xml`
