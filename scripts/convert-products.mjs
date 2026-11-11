import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const productsPath = join(root, 'data', 'flypig-hotels-products.csv')
const skusPath = join(root, 'data', 'flypig-hotels-skus.csv')
const outPath = join(root, 'src', 'data', 'products.json')

function readCsv(path) {
  const workbook = XLSX.read(readFileSync(path), { type: 'buffer' })
  return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    defval: '',
  })
}

const skuRows = readCsv(skusPath)
const skusByProduct = new Map()
for (const row of skuRows) {
  const id = String(row['产品编号'] ?? '').trim()
  if (!id) continue
  const list = skusByProduct.get(id) ?? []
  list.push({
    id: String(row['套餐编号'] ?? '').trim(),
    content: String(row['套餐内容'] ?? '').trim(),
    tags: String(row['套餐标签'] ?? '')
      .split(' | ')
      .map((tag) => tag.trim())
      .filter(Boolean),
  })
  skusByProduct.set(id, list)
}

const products = readCsv(productsPath).map((row) => {
  const id = String(row['编号'] ?? '').trim()
  return {
    id,
    group: String(row['集团'] ?? '').trim(),
    store: String(row['店铺'] ?? '').trim(),
    title: String(row['标题'] ?? '').trim(),
    region: String(row['覆盖范围'] ?? '').trim(),
    tags: String(row['标签'] ?? '')
      .split(' | ')
      .map((tag) => tag.trim())
      .filter(Boolean),
    note: String(row['卖点'] ?? '').trim(),
    listedAt: String(row['上新日期'] ?? '').trim() || null,
    availability: String(row['购买状态'] ?? '').trim(),
    taokouling: String(row['淘口令'] ?? '').trim(),
    skus: skusByProduct.get(id) ?? [],
  }
})

const groups = [...new Set(products.map((product) => product.group))]
const regions = [...new Set(products.map((product) => product.region).filter(Boolean))].sort()
const listedDates = [...new Set(products.map((product) => product.listedAt).filter(Boolean))].sort().reverse()
const payload = {
  generatedAt: new Date().toISOString(),
  source: 'data/flypig-hotels-products.csv',
  groups,
  regions,
  listedDates,
  products,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n')
console.log(`Wrote ${products.length} products and ${skuRows.length} SKUs → ${outPath}`)
