import { useDeferredValue, useMemo, useState } from 'react'
import catalog from './data/coupons.json'
import products from './data/products.json'
import type { Coupon, CouponCatalog, HotelProduct, ProductCatalog } from './types'
import { CouponCard } from './components/CouponCard'
import { ProductCard } from './components/ProductCard'
import { RulesPanel } from './components/RulesPanel'
import './App.css'

const data = catalog as CouponCatalog
const productData = products as ProductCatalog

function matchesQuery(coupon: Coupon, q: string) {
  if (!q) return true
  const hay = [
    coupon.id,
    coupon.brand,
    coupon.attribute,
    coupon.discount,
    coupon.taokouling,
    coupon.channel,
    coupon.listedAt ?? '',
    coupon.lotteryNights?.toString() ?? '',
  ]
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

function matchesProductQuery(product: HotelProduct, q: string) {
  if (!q) return true
  const hay = [
    product.id,
    product.group,
    product.store,
    product.title,
    product.region,
    product.tags.join(' '),
    product.note,
    product.availability,
    product.taokouling,
    product.skus.map((sku) => `${sku.content} ${sku.tags.join(' ')}`).join(' '),
  ]
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

export default function App() {
  const [view, setView] = useState<'coupons' | 'products'>('coupons')
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('全部')
  const [attribute, setAttribute] = useState('全部')
  const [channel, setChannel] = useState('全部')
  const [group, setGroup] = useState('全部')
  const [region, setRegion] = useState('全部')
  const [listedDate, setListedDate] = useState('全部')
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    return data.coupons.filter((c) => {
      if (brand !== '全部' && c.brand !== brand) return false
      if (attribute !== '全部' && c.attribute !== attribute) return false
      if (channel !== '全部' && c.channel !== channel) return false
      return matchesQuery(c, deferredQuery.trim())
    })
  }, [brand, attribute, channel, deferredQuery])

  const filteredProducts = useMemo(() => {
    return productData.products.filter((product) => {
      if (group !== '全部' && product.group !== group) return false
      if (region !== '全部' && product.region !== region) return false
      if (listedDate !== '全部' && product.listedAt !== listedDate) return false
      return matchesProductQuery(product, deferredQuery.trim())
    })
  }, [deferredQuery, group, listedDate, region])

  const isProducts = view === 'products'
  const results = isProducts ? filteredProducts : filtered

  const hasFilters =
    (isProducts
      ? group !== '全部' || region !== '全部' || listedDate !== '全部'
      : brand !== '全部' || attribute !== '全部' || channel !== '全部') ||
    query.trim() !== ''

  function resetFilters() {
    setQuery('')
    setBrand('全部')
    setAttribute('全部')
    setChannel('全部')
    setGroup('全部')
    setRegion('全部')
    setListedDate('全部')
  }

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />

      <header className="hero">
        <p className="brand">Hotel Flash</p>
        <h1 className="headline">{isProducts ? '飞猪酒店套餐' : '酒店红包速查'}</h1>
        <p className="lede">
          {isProducts
            ? `搜索飞猪酒店套餐、集团或淘口令，一键复制。共 ${productData.products.length} 款套餐。`
            : `搜索编号、品牌、折扣或淘口令，一键复制领取。共 ${data.coupons.length} 条可核销红包。`}
        </p>

        <label className="search">
          <span className="sr-only">搜索红包</span>
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M16.5 16.5L21 21"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索：A1、万豪、199抵扣、手淘…"
            autoComplete="off"
          />
        </label>
      </header>

      <div className="view-switch" role="tablist" aria-label="数据类型">
        <button
          type="button"
          role="tab"
          aria-selected={!isProducts}
          className={!isProducts ? 'is-active' : ''}
          onClick={() => setView('coupons')}
        >
          酒店红包
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isProducts}
          className={isProducts ? 'is-active' : ''}
          onClick={() => setView('products')}
        >
          飞猪套餐
        </button>
      </div>

      {!isProducts && <RulesPanel rules={data.rules} />}

      <section className="toolbar" aria-label="筛选">
        {isProducts ? (
          <div className="filters">
            <label>
              <span>集团</span>
              <select value={group} onChange={(e) => setGroup(e.target.value)}>
                <option value="全部">全部</option>
                {productData.groups.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>覆盖范围</span>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="全部">全部</option>
                {productData.regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>上新日期</span>
              <select
                value={listedDate}
                onChange={(e) => setListedDate(e.target.value)}
              >
                <option value="全部">全部</option>
                {productData.listedDates.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="filters">
            <label>
              <span>品牌</span>
              <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="全部">全部</option>
                {data.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>属性</span>
              <select
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
              >
                <option value="全部">全部</option>
                {data.attributes.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>渠道</span>
              <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                <option value="全部">全部</option>
                {data.channels.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="meta-row">
          <p className="result-count">
            显示 <strong>{results.length}</strong> /{' '}
            {isProducts ? productData.products.length : data.coupons.length}
          </p>
          {hasFilters && (
            <button type="button" className="text-btn" onClick={resetFilters}>
              清除筛选
            </button>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>{isProducts ? '没有匹配的套餐' : '没有匹配的红包'}</p>
          <p className="empty-hint">试试更短的关键词，或清除部分筛选条件。</p>
          <button type="button" className="primary-btn" onClick={resetFilters}>
            重置全部
          </button>
        </div>
      ) : (
        <ul className="grid">
          {isProducts
            ? filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            : filtered.map((coupon, index) => (
                <CouponCard key={coupon.id} coupon={coupon} index={index} />
              ))}
        </ul>
      )}

      <footer className="footer">
        <p>
          数据来自 {isProducts ? productData.source : data.source}
          {(isProducts ? productData.generatedAt : data.generatedAt)
            ? ` · 生成于 ${new Date(
                isProducts ? productData.generatedAt : data.generatedAt,
              ).toLocaleString('zh-CN')}`
            : ''}
        </p>
      </footer>
    </div>
  )
}
