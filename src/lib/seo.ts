import { useEffect } from 'react'
import { ALL_TOOLS } from '@/config/tools'

export const SITE_NAME = 'iLovePDFGuru'
export const SITE_NAME_PREFIX = 'iLove'
export const SITE_NAME_SUFFIX = 'PDFGuru'
export const SITE_TAGLINE = 'Free Online PDF Tools — Merge, Split, Unlock & More'
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://ilovepdfguru.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.svg`

export type PageSeo = {
  title: string
  description: string
  path: string
}

export const SEO = {
  home: {
    title: `${SITE_NAME} — Free Online PDF Tools & Browser Utilities`,
    description:
      'iLovePDFGuru — free online PDF tools to unlock, merge, split, sign, and view PDFs, plus Base64, UUID, hash, AES, JWT, JSON, YAML, and more. No upload, no signup.',
    path: '/',
  },
  merge: {
    title: `Merge PDF Online Free | ${SITE_NAME}`,
    description:
      'Merge PDF files online for free. Combine multiple PDFs into one document, drag to reorder. No upload — files stay on your device.',
    path: '/pdf/merge',
  },
  split: {
    title: `Split PDF Online Free | ${SITE_NAME}`,
    description:
      'Split PDF online for free. Extract page ranges, split every N pages, or pick specific pages. Private browser-based PDF splitter.',
    path: '/pdf/split',
  },
  view: {
    title: `View PDF Online Free | ${SITE_NAME}`,
    description:
      'View PDF online for free. Open and browse PDF files with zoom, page navigation, and thumbnails in your browser.',
    path: '/pdf/view',
  },
  sign: {
    title: `Sign PDF Online Free — Draw or Digital Certificate | ${SITE_NAME}`,
    description:
      'Sign PDF online for free. Draw your signature or use a .p12 digital certificate. Private browser-based PDF signing — no upload.',
    path: '/pdf/sign',
  },
  unlock: {
    title: `Unlock PDF Online Free — Remove Password Protection | ${SITE_NAME}`,
    description:
      'Unlock PDF online for free. Remove password protection and printing/copying restrictions. Private browser-based PDF unlock — no upload.',
    path: '/pdf/unlock',
  },
  base64: {
    title: `Base64 Encoder & Decoder Online Free | ${SITE_NAME}`,
    description:
      'Encode and decode Base64 online. Convert text to Base64 and back — free, instant, runs in your browser.',
    path: '/base64',
  },
  uuid: {
    title: `UUID Generator — Generate Multiple UUIDs Free | ${SITE_NAME}`,
    description:
      'Generate UUID v4 identifiers online. Create one or hundreds of UUIDs at once — free UUID generator.',
    path: '/uuid',
  },
  aes: {
    title: `AES Encryption & Decryption Online | ${SITE_NAME}`,
    description:
      'Encrypt and decrypt text with AES-256-GCM online. Passphrase-based encryption runs locally in your browser.',
    path: '/aes',
  },
  jwt: {
    title: `JWT Decoder & Viewer Online Free | ${SITE_NAME}`,
    description:
      'Decode JWT tokens online. Inspect header, payload, signature, and expiry — free JWT decoder tool.',
    path: '/jwt',
  },
  json: {
    title: `JSON Formatter & Validator Online Free | ${SITE_NAME}`,
    description:
      'Format, prettify, and minify JSON online. Free JSON formatter with validation.',
    path: '/json',
  },
  jsonCompare: {
    title: `JSON Comparator & Diff Online Free | ${SITE_NAME}`,
    description:
      'Compare two JSON documents online. See added, removed, and changed fields — free JSON diff tool.',
    path: '/json-compare',
  },
  yaml: {
    title: `YAML Formatter & Validator Online Free | ${SITE_NAME}`,
    description:
      'Format, prettify, and minify YAML online. Free YAML formatter with validation in your browser.',
    path: '/yaml',
  },
  yamlCompare: {
    title: `YAML Comparator & Diff Online Free | ${SITE_NAME}`,
    description:
      'Compare two YAML documents online. See added, removed, and changed fields — free YAML diff tool.',
    path: '/yaml-compare',
  },
  cron: {
    title: `Cron Expression Parser & Generator Online | ${SITE_NAME}`,
    description:
      'Parse and validate cron expressions online. Get human-readable schedules and next run times — free cron tool.',
    path: '/cron',
  },
  url: {
    title: `URL Encoder & Decoder Online Free | ${SITE_NAME}`,
    description:
      'Encode and decode URLs and URI components online. Free URL encoder for query strings and paths.',
    path: '/url',
  },
  hash: {
    title: `Hash Generator — SHA-256, SHA-512 Online | ${SITE_NAME}`,
    description: 'Generate SHA-256, SHA-384, and SHA-512 hashes online. Live hash generator in your browser.',
    path: '/hash',
  },
  regex: {
    title: `Regex Tester Online Free | ${SITE_NAME}`,
    description: 'Test regular expressions online with live match highlighting. Free regex tester tool.',
    path: '/regex',
  },
  html: {
    title: `HTML Encoder & Decoder Online Free | ${SITE_NAME}`,
    description: 'Encode and decode HTML entities online. Escape or unescape HTML for safe rendering.',
    path: '/html',
  },
  password: {
    title: `Password Generator — Strong Random Passwords | ${SITE_NAME}`,
    description: 'Generate strong random passwords online with customizable length and character sets.',
    path: '/password',
  },
  timestamp: {
    title: `Unix Timestamp Converter Online | ${SITE_NAME}`,
    description: 'Convert Unix timestamps to dates and back. Free epoch timestamp converter with live clock.',
    path: '/timestamp',
  },
  color: {
    title: `Color Converter — HEX, RGB, HSL | ${SITE_NAME}`,
    description: 'Convert colors between HEX, RGB, and HSL with a live preview swatch.',
    path: '/color',
  },
  qr: {
    title: `QR Code Generator Online Free | ${SITE_NAME}`,
    description: 'Create QR codes from text or URLs. Free QR code generator with download.',
    path: '/qr',
  },
  worldClock: {
    title: `World Clock & Time Zone Converter | ${SITE_NAME}`,
    description:
      'Compare time zones across cities like WorldTimeBuddy. Live world clock with timelines and meeting planner.',
    path: '/world-clock',
  },
} as const satisfies Record<string, PageSeo>

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let element = document.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let element = document.getElementById(id) as HTMLScriptElement | null
  if (!element) {
    element = document.createElement('script')
    element.id = id
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

export function usePageSeo(page: PageSeo, jsonLd?: Record<string, unknown>) {
  useEffect(() => {
    document.title = page.title
    upsertMeta('description', page.description)
    upsertMeta('og:title', page.title, 'property')
    upsertMeta('og:description', page.description, 'property')
    upsertMeta('og:type', 'website', 'property')
    upsertMeta('og:url', `${SITE_URL}${page.path}`, 'property')
    upsertMeta('og:site_name', SITE_NAME, 'property')
    upsertMeta('og:image', DEFAULT_OG_IMAGE, 'property')
    upsertMeta('og:image:alt', `${SITE_NAME} — ${SITE_TAGLINE}`, 'property')
    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', page.title)
    upsertMeta('twitter:description', page.description)
    upsertMeta('twitter:image', DEFAULT_OG_IMAGE)
    upsertCanonical(`${SITE_URL}${page.path}`)

    if (jsonLd) {
      upsertJsonLd('page-json-ld', jsonLd)
    } else {
      document.getElementById('page-json-ld')?.remove()
    }
  }, [page, jsonLd])
}

export const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'iLovePDFGuru — free online PDF tools and private browser utilities for editing, encoding, encryption, and everyday tasks.',
  featureList: ALL_TOOLS.map((tool) => tool.title),
}

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `What is ${SITE_NAME}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${SITE_NAME} is a free collection of private browser utilities for PDF editing, developers, and everyday tasks. Everything runs locally with no file uploads.`,
      },
    },
    {
      '@type': 'Question',
      name: `Are ${SITE_NAME} tools free?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. All tools on ${SITE_NAME} are completely free with no usage limits, watermarks, or signup required.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. ${SITE_NAME} processes everything locally in your browser. Your PDFs, tokens, and text are never sent to a server.`,
      },
    },
  ],
}

export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [appJsonLd, faqJsonLd],
}
