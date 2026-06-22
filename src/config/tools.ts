import type { LucideIcon } from 'lucide-react'
import {
  Binary,
  Braces,
  CalendarClock,
  Clock,
  Combine,
  Eye,
  FileCode,
  FileSignature,
  Fingerprint,
  GitCompare,
  Globe,
  Hash,
  KeyRound,
  Link2,
  Lock,
  Palette,
  QrCode,
  Regex,
  Scissors,
  Shield,
  Unlock,
  Code2,
} from 'lucide-react'

export type ToolCategory = {
  id: string
  title: string
  description: string
  tools: ToolDefinition[]
}

export type ToolDefinition = {
  id: string
  title: string
  description: string
  path: string
  icon: LucideIcon
  keywords: string[]
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'pdf',
    title: 'PDF Tools',
    description: 'Unlock, merge, split, view, and sign PDF files — private and free in your browser.',
    tools: [
      {
        id: 'unlock-pdf',
        title: 'Unlock PDF',
        description: 'Remove password protection and restrictions from PDF files.',
        path: '/pdf/unlock',
        icon: Unlock,
        keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf'],
      },
      {
        id: 'merge-pdf',
        title: 'Merge PDF',
        description: 'Combine multiple PDF files into one. Drag to reorder.',
        path: '/pdf/merge',
        icon: Combine,
        keywords: ['merge pdf', 'combine pdf', 'join pdf'],
      },
      {
        id: 'split-pdf',
        title: 'Split PDF',
        description: 'Extract pages by range, chunks, or specific page numbers.',
        path: '/pdf/split',
        icon: Scissors,
        keywords: ['split pdf', 'extract pdf pages'],
      },
      {
        id: 'view-pdf',
        title: 'View PDF',
        description: 'Open PDFs with zoom, navigation, and thumbnail sidebar.',
        path: '/pdf/view',
        icon: Eye,
        keywords: ['view pdf', 'pdf reader online'],
      },
      {
        id: 'sign-pdf',
        title: 'Sign PDF',
        description: 'Draw a signature or sign with a digital certificate (.p12).',
        path: '/pdf/sign',
        icon: FileSignature,
        keywords: ['sign pdf', 'pdf signature', 'digital signature pdf'],
      },
    ],
  },
  {
    id: 'time',
    title: 'Time Tools',
    description: 'World clocks, time zone comparison, and Unix timestamp conversion.',
    tools: [
      {
        id: 'world-clock',
        title: 'World Clock',
        description: 'Compare times across cities with live clocks and meeting planner.',
        path: '/world-clock',
        icon: Globe,
        keywords: ['world clock', 'time zone converter', 'worldtimebuddy'],
      },
      {
        id: 'timestamp',
        title: 'Unix Timestamp Converter',
        description: 'Convert Unix timestamps with a live clock.',
        path: '/timestamp',
        icon: Clock,
        keywords: ['unix timestamp', 'epoch converter'],
      },
    ],
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    description: 'Encode, encrypt, decode, and generate — all client-side.',
    tools: [
      {
        id: 'base64',
        title: 'Base64 Encoder / Decoder',
        description: 'Encode and decode text to Base64 instantly.',
        path: '/base64',
        icon: Binary,
        keywords: ['base64 encode', 'base64 decode'],
      },
      {
        id: 'uuid',
        title: 'UUID Generator',
        description: 'Generate one or many UUID v4 identifiers at once.',
        path: '/uuid',
        icon: Fingerprint,
        keywords: ['uuid generator', 'guid generator'],
      },
      {
        id: 'hash',
        title: 'Hash Generator',
        description: 'SHA-256, SHA-384, SHA-512 hashes — live as you type.',
        path: '/hash',
        icon: Hash,
        keywords: ['sha256', 'hash generator', 'checksum'],
      },
      {
        id: 'aes',
        title: 'AES Encryption',
        description: 'Encrypt and decrypt text with AES-256-GCM and a passphrase.',
        path: '/aes',
        icon: KeyRound,
        keywords: ['aes encrypt', 'aes decrypt online'],
      },
      {
        id: 'jwt',
        title: 'JWT Decoder',
        description: 'Decode and inspect JWT header, payload, and expiry.',
        path: '/jwt',
        icon: Shield,
        keywords: ['jwt decoder', 'jwt viewer'],
      },
      {
        id: 'json',
        title: 'JSON Formatter',
        description: 'Pretty-print, minify, and validate JSON.',
        path: '/json',
        icon: Braces,
        keywords: ['json formatter', 'json prettify'],
      },
      {
        id: 'json-compare',
        title: 'JSON Comparator',
        description: 'Diff two JSON documents — added, removed, and changed fields.',
        path: '/json-compare',
        icon: GitCompare,
        keywords: ['json compare', 'json diff', 'json comparator'],
      },
      {
        id: 'yaml',
        title: 'YAML Formatter',
        description: 'Pretty-print, minify, and validate YAML.',
        path: '/yaml',
        icon: FileCode,
        keywords: ['yaml formatter', 'yaml prettify', 'yaml validator'],
      },
      {
        id: 'yaml-compare',
        title: 'YAML Comparator',
        description: 'Diff two YAML documents — added, removed, and changed fields.',
        path: '/yaml-compare',
        icon: GitCompare,
        keywords: ['yaml compare', 'yaml diff', 'yaml comparator'],
      },
      {
        id: 'cron',
        title: 'Cron Expression Parser',
        description: 'Validate cron syntax, human-readable schedule, and next run times.',
        path: '/cron',
        icon: CalendarClock,
        keywords: ['cron parser', 'cron expression', 'crontab'],
      },
      {
        id: 'url',
        title: 'URL Encoder / Decoder',
        description: 'Encode or decode URLs and query strings.',
        path: '/url',
        icon: Link2,
        keywords: ['url encode', 'url decode'],
      },
      {
        id: 'regex',
        title: 'Regex Tester',
        description: 'Test regex patterns with live match highlighting.',
        path: '/regex',
        icon: Regex,
        keywords: ['regex tester', 'regular expression'],
      },
      {
        id: 'html',
        title: 'HTML Encoder / Decoder',
        description: 'Escape or unescape HTML entities.',
        path: '/html',
        icon: Code2,
        keywords: ['html encode', 'html escape'],
      },
    ],
  },
  {
    id: 'everyday',
    title: 'Everyday Tools',
    description: 'Handy utilities for passwords, colors, and QR codes.',
    tools: [
      {
        id: 'password',
        title: 'Password Generator',
        description: 'Strong random passwords with a live strength meter.',
        path: '/password',
        icon: Lock,
        keywords: ['password generator', 'strong password'],
      },
      {
        id: 'color',
        title: 'Color Converter',
        description: 'Convert HEX, RGB, and HSL with a live swatch.',
        path: '/color',
        icon: Palette,
        keywords: ['color converter', 'hex to rgb'],
      },
      {
        id: 'qr',
        title: 'QR Code Generator',
        description: 'Create QR codes from text or URLs with live preview.',
        path: '/qr',
        icon: QrCode,
        keywords: ['qr code generator', 'qr code maker'],
      },
    ],
  },
]

export const ALL_TOOLS = TOOL_CATEGORIES.flatMap((category) => category.tools)

export function findToolByPath(path: string) {
  return ALL_TOOLS.find((tool) => tool.path === path)
}

export function getCategoryForTool(path: string) {
  return TOOL_CATEGORIES.find((category) => category.tools.some((tool) => tool.path === path))
}
