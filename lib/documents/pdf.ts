import 'server-only'
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type PDFImage } from 'pdf-lib'

// ===========================================================================
// Brand-themed PDF builder on top of pdf-lib (pure JS — runs on the Node
// runtime, no headless browser). A flowing cursor with auto page breaks, a
// TourLink header band, key/value rows, section titles, banded tables and
// totals. Standard fonts only (Times for serif headings ≈ Playfair, Helvetica
// for body ≈ Plus Jakarta).
// ===========================================================================

const A4 = { w: 595.28, h: 841.89 }
const MARGIN = 50

// TourLink brand palette (0–1 rgb).
const NAVY = rgb(0.169, 0.224, 0.565) // #2B3990
const MAGENTA = rgb(0.761, 0.094, 0.357) // #C2185B
const GOLD = rgb(0.788, 0.659, 0.298) // #C9A84C
const SLATE = rgb(0.42, 0.42, 0.42) // #6B6B6B
const CHARCOAL = rgb(0.173, 0.173, 0.173) // #2C2C2C
const SAND = rgb(0.961, 0.941, 0.91) // #F5F0E8
const WHITE = rgb(1, 1, 1)
const NAVY_SOFT = rgb(0.78, 0.81, 0.9)

export function money(n: number): string {
  return `$${Math.round(n || 0).toLocaleString('en-US')}`
}

// The standard PDF fonts use WinAnsi encoding, which can't encode arrows, emoji,
// or many Unicode symbols. Trip names / notes / package text are user-driven, so
// normalise common symbols to ASCII and drop anything still non-Latin-1 — a
// single non-encodable character would otherwise crash PDF generation.
function clean(s: string): string {
  return String(s ?? '')
    .replace(/[→➔➜↦⇒➙➙]/g, ' to ')
    .replace(/[←↑↓↔↕↖↗↘↙]/g, '-')
    .replace(/[‘’‚‹›ʼ]/g, "'")
    .replace(/[“”„«»]/g, '"')
    .replace(/[–—―]/g, '-')
    .replace(/…/g, '...')
    .replace(/[•●▪◦‣⁃]/g, '-')
    .replace(/[^\t\n\r\x20-\xFF]/g, '') // drop remaining non-Latin-1 (emoji etc.)
}

export type Column = { header: string; width: number; align?: 'left' | 'right' }
export type Row = string[]

export class PdfBuilder {
  private doc!: PDFDocument
  private page!: PDFPage
  private font!: PDFFont
  private bold!: PDFFont
  private serif!: PDFFont
  private serifBold!: PDFFont
  private logo?: PDFImage
  private y = 0
  private readonly contentW = A4.w - MARGIN * 2

  static async create(opts?: { logoBytes?: Uint8Array }): Promise<PdfBuilder> {
    const b = new PdfBuilder()
    b.doc = await PDFDocument.create()
    b.font = await b.doc.embedFont(StandardFonts.Helvetica)
    b.bold = await b.doc.embedFont(StandardFonts.HelveticaBold)
    b.serif = await b.doc.embedFont(StandardFonts.TimesRoman)
    b.serifBold = await b.doc.embedFont(StandardFonts.TimesRomanBold)
    if (opts?.logoBytes) {
      try { b.logo = await b.doc.embedPng(opts.logoBytes) }
      catch { try { b.logo = await b.doc.embedJpg(opts.logoBytes) } catch { /* unusable logo — fall back to wordmark */ } }
    }
    b.newPage()
    return b
  }

  private newPage() {
    this.page = this.doc.addPage([A4.w, A4.h])
    this.y = A4.h - MARGIN
  }

  private ensure(need: number) {
    if (this.y - need < MARGIN + 24) this.newPage()
  }

  private widthOf(text: string, size: number, font: PDFFont) {
    return font.widthOfTextAtSize(clean(text), size)
  }

  // All text drawing routes through here so it is always WinAnsi-safe.
  private dt(text: string, opts: Parameters<PDFPage['drawText']>[1]) {
    this.page.drawText(clean(text), opts)
  }

  private wrap(text: string, size: number, maxW: number, font: PDFFont): string[] {
    const words = String(text ?? '').split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let line = ''
    for (const w of words) {
      const next = line ? `${line} ${w}` : w
      if (this.widthOf(next, size, font) > maxW && line) { lines.push(line); line = w }
      else line = next
    }
    if (line) lines.push(line)
    return lines.length ? lines : ['']
  }

  // Navy header band: brand logo (or serif wordmark fallback), tagline, gold kicker.
  header(kicker: string, subtitle?: string) {
    const bandH = 76
    this.page.drawRectangle({ x: 0, y: A4.h - bandH, width: A4.w, height: bandH, color: NAVY })
    this.page.drawRectangle({ x: 0, y: A4.h - bandH, width: A4.w, height: 4, color: GOLD })
    if (this.logo) {
      // Logo at the left, scaled to a 40pt cap height; tagline beside it.
      const targetH = 40
      const scale = targetH / this.logo.height
      const w = this.logo.width * scale
      this.page.drawImage(this.logo, { x: MARGIN, y: A4.h - 16 - targetH, width: w, height: targetH })
      this.dt('Linking you to the World', { x: MARGIN + w + 12, y: A4.h - 34, size: 9, font: this.font, color: NAVY_SOFT })
      this.dt('Southern & East Africa · HQ Dar es Salaam', { x: MARGIN + w + 12, y: A4.h - 46, size: 8, font: this.font, color: NAVY_SOFT })
    } else {
      this.dt('TourLink', { x: MARGIN, y: A4.h - 36, size: 24, font: this.serifBold, color: WHITE })
      this.dt('Linking you to the World', { x: MARGIN, y: A4.h - 52, size: 9, font: this.font, color: NAVY_SOFT })
      this.dt('Southern & East Africa · HQ Dar es Salaam', { x: MARGIN, y: A4.h - 64, size: 8, font: this.font, color: NAVY_SOFT })
    }
    const kW = this.widthOf(kicker, 22, this.serifBold)
    this.dt(kicker, { x: A4.w - MARGIN - kW, y: A4.h - 40, size: 22, font: this.serifBold, color: GOLD })
    if (subtitle) {
      const sW = this.widthOf(subtitle, 9, this.font)
      this.dt(subtitle, { x: A4.w - MARGIN - sW, y: A4.h - 56, size: 9, font: this.font, color: NAVY_SOFT })
    }
    this.y = A4.h - bandH - 30
  }

  title(text: string, size = 16) {
    this.ensure(size + 10)
    this.dt(text, { x: MARGIN, y: this.y, size, font: this.serifBold, color: CHARCOAL })
    this.y -= size + 6
  }

  section(title: string) {
    this.ensure(40)
    this.y -= 6
    this.dt(title.toUpperCase(), { x: MARGIN, y: this.y, size: 11, font: this.bold, color: NAVY })
    this.y -= 6
    this.page.drawLine({ start: { x: MARGIN, y: this.y }, end: { x: A4.w - MARGIN, y: this.y }, thickness: 1.5, color: GOLD })
    this.y -= 16
  }

  paragraph(text: string, size = 10) {
    for (const line of this.wrap(text, size, this.contentW, this.font)) {
      this.ensure(size + 4)
      this.dt(line, { x: MARGIN, y: this.y, size, font: this.font, color: SLATE })
      this.y -= size + 4
    }
  }

  keyValues(pairs: [string, string][], size = 10) {
    const labelW = 130
    for (const [k, v] of pairs) {
      const lines = this.wrap(v, size, this.contentW - labelW, this.font)
      this.ensure((size + 4) * lines.length)
      this.dt(k, { x: MARGIN, y: this.y, size, font: this.bold, color: NAVY })
      lines.forEach((line, i) => {
        this.dt(line, { x: MARGIN + labelW, y: this.y - i * (size + 4), size, font: this.font, color: SLATE })
      })
      this.y -= (size + 4) * lines.length + 4
    }
  }

  table(columns: Column[], rows: Row[], size = 9) {
    const drawHead = () => {
      this.ensure(24)
      this.page.drawRectangle({ x: MARGIN, y: this.y - 16, width: this.contentW, height: 20, color: NAVY })
      let x = MARGIN + 8
      for (const c of columns) {
        const tw = this.widthOf(c.header, size, this.bold)
        const tx = c.align === 'right' ? x + c.width - tw - 16 : x
        this.dt(c.header, { x: tx, y: this.y - 11, size, font: this.bold, color: WHITE })
        x += c.width
      }
      this.y -= 24
    }
    drawHead()
    rows.forEach((row, ri) => {
      const cellLines = row.map((cell, ci) => this.wrap(cell, size, columns[ci].width - 16, this.font))
      const rowH = Math.max(...cellLines.map((l) => l.length)) * (size + 3) + 8
      if (this.y - rowH < MARGIN + 24) { this.newPage(); drawHead() }
      if (ri % 2 === 1) this.page.drawRectangle({ x: MARGIN, y: this.y - rowH + 6, width: this.contentW, height: rowH, color: SAND })
      let x = MARGIN + 8
      cellLines.forEach((lines, ci) => {
        const c = columns[ci]
        lines.forEach((line, li) => {
          const tw = this.widthOf(line, size, this.font)
          const tx = c.align === 'right' ? x + c.width - tw - 16 : x
          this.dt(line, { x: tx, y: this.y - 6 - li * (size + 3), size, font: this.font, color: CHARCOAL })
        })
        x += c.width
      })
      this.y -= rowH
    })
    this.y -= 4
  }

  total(label: string, value: string, size = 13) {
    this.ensure(30)
    this.y -= 6
    this.page.drawLine({ start: { x: A4.w - MARGIN - 260, y: this.y + 6 }, end: { x: A4.w - MARGIN, y: this.y + 6 }, thickness: 1, color: SLATE })
    const vW = this.widthOf(value, size, this.bold)
    const lW = this.widthOf(label, size, this.bold)
    this.dt(label, { x: A4.w - MARGIN - vW - 18 - lW, y: this.y - 9, size, font: this.bold, color: NAVY })
    this.dt(value, { x: A4.w - MARGIN - vW, y: this.y - 9, size, font: this.bold, color: MAGENTA })
    this.y -= 26
  }

  // A soft callout box (e.g. payment terms / contact).
  callout(lines: string[], size = 9) {
    const pad = 10
    const h = lines.length * (size + 4) + pad * 2
    this.ensure(h + 6)
    this.page.drawRectangle({ x: MARGIN, y: this.y - h + 6, width: this.contentW, height: h, color: SAND })
    this.page.drawRectangle({ x: MARGIN, y: this.y - h + 6, width: 3, height: h, color: MAGENTA })
    lines.forEach((line, i) => {
      this.dt(line, { x: MARGIN + pad + 4, y: this.y - pad - i * (size + 4), size, font: i === 0 ? this.bold : this.font, color: i === 0 ? NAVY : SLATE })
    })
    this.y -= h + 6
  }

  spacer(h = 10) { this.y -= h }

  async finish(footer: string): Promise<Uint8Array> {
    const pages = this.doc.getPages()
    pages.forEach((p, i) => {
      p.drawLine({ start: { x: MARGIN, y: 38 }, end: { x: A4.w - MARGIN, y: 38 }, thickness: 0.5, color: NAVY_SOFT })
      p.drawText(footer, { x: MARGIN, y: 26, size: 8, font: this.font, color: SLATE })
      const pn = `Page ${i + 1} of ${pages.length}`
      const pw = this.font.widthOfTextAtSize(pn, 8)
      p.drawText(pn, { x: A4.w - MARGIN - pw, y: 26, size: 8, font: this.font, color: SLATE })
    })
    return this.doc.save()
  }
}
