import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const xlsxPath = join(root, 'hotel-coupon.xlsx')
const outPath = join(root, 'src/data/coupons.json')

const ID_RE = /^[A-Z]\d+$/
const URL_RE = /https?:\/\/\S+/

function excelSerialToIso(serial) {
  if (serial == null || serial === '') return null
  if (typeof serial === 'string' && /^\d{4}-\d{2}-\d{2}/.test(serial)) {
    return serial.slice(0, 10)
  }
  const n = Number(serial)
  if (!Number.isFinite(n)) return null
  const date = new Date(Date.UTC(1899, 11, 30) + n * 86400000)
  return date.toISOString().slice(0, 10)
}

function parseLink(raw) {
  if (raw == null || raw === '') {
    return { taokouling: '', url: null }
  }
  const text = String(raw).trim()
  const match = text.match(URL_RE)
  if (!match) {
    return { taokouling: text, url: null }
  }
  const url = match[0]
  const taokouling = text.replace(url, '').replace(/\s+/g, ' ').trim()
  return { taokouling, url }
}

function isBrandCell(value) {
  if (typeof value !== 'string') return false
  const v = value.trim()
  if (!v || ID_RE.test(v) || v === '编号') return false
  if (/^[1-4]、/.test(v)) return false
  if (v.includes('集团红包') || v.includes('抽奖')) return false
  return v.length < 40
}

const wb = XLSX.read(readFileSync(xlsxPath), { type: 'buffer' })
const sheet = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })

const rules = []
for (let i = 0; i < Math.min(5, rows.length); i++) {
  const cell = rows[i]?.[0]
  if (typeof cell === 'string' && cell.trim()) {
    rules.push(cell.trim())
  }
}

const coupons = []
let brand = '未分组'

for (const row of rows) {
  const r = row || []
  if (isBrandCell(r[0]) && (r[1] == null || ID_RE.test(String(r[1])) || r[1] === '编号')) {
    brand = String(r[0]).trim()
  }

  if (!r[1] || !ID_RE.test(String(r[1]))) continue

  const { taokouling, url } = parseLink(r[4])
  coupons.push({
    id: String(r[1]),
    brand,
    attribute: r[2] != null ? String(r[2]).trim() : '',
    discount: r[3] != null ? String(r[3]).trim() : '',
    taokouling,
    url,
    channel: r[5] != null ? String(r[5]).trim() : '',
    listedAt: excelSerialToIso(r[6]),
    lotteryNights: r[7] == null || r[7] === '' ? null : Number(r[7]),
  })
}

const brands = [...new Set(coupons.map((c) => c.brand))]
const attributes = [...new Set(coupons.map((c) => c.attribute).filter(Boolean))].sort()
const channels = [...new Set(coupons.map((c) => c.channel).filter(Boolean))].sort()

const payload = {
  generatedAt: new Date().toISOString(),
  source: 'hotel-coupon.xlsx',
  rules,
  brands,
  attributes,
  channels,
  coupons,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n')
console.log(`Wrote ${coupons.length} coupons → ${outPath}`)
