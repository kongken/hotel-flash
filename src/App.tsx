import { useDeferredValue, useMemo, useState } from 'react'
import catalog from './data/coupons.json'
import type { Coupon, CouponCatalog } from './types'
import { CouponCard } from './components/CouponCard'
import { RulesPanel } from './components/RulesPanel'
import './App.css'

const data = catalog as CouponCatalog

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

export default function App() {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('全部')
  const [attribute, setAttribute] = useState('全部')
  const [channel, setChannel] = useState('全部')
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    return data.coupons.filter((c) => {
      if (brand !== '全部' && c.brand !== brand) return false
      if (attribute !== '全部' && c.attribute !== attribute) return false
      if (channel !== '全部' && c.channel !== channel) return false
      return matchesQuery(c, deferredQuery.trim())
    })
  }, [brand, attribute, channel, deferredQuery])

  const hasFilters =
    brand !== '全部' || attribute !== '全部' || channel !== '全部' || query.trim() !== ''

  function resetFilters() {
    setQuery('')
    setBrand('全部')
    setAttribute('全部')
    setChannel('全部')
  }

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />

      <header className="hero">
        <p className="brand">Hotel Flash</p>
        <h1 className="headline">酒店红包速查</h1>
        <p className="lede">
          搜索编号、品牌、折扣或淘口令，一键复制领取。共 {data.coupons.length}{' '}
          条可核销红包。
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

      <RulesPanel rules={data.rules} />

      <section className="toolbar" aria-label="筛选">
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

        <div className="meta-row">
          <p className="result-count">
            显示 <strong>{filtered.length}</strong> / {data.coupons.length}
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
          <p>没有匹配的红包</p>
          <p className="empty-hint">试试更短的关键词，或清除部分筛选条件。</p>
          <button type="button" className="primary-btn" onClick={resetFilters}>
            重置全部
          </button>
        </div>
      ) : (
        <ul className="grid">
          {filtered.map((coupon, index) => (
            <CouponCard key={coupon.id} coupon={coupon} index={index} />
          ))}
        </ul>
      )}

      <footer className="footer">
        <p>
          数据来自 {data.source}
          {data.generatedAt
            ? ` · 生成于 ${new Date(data.generatedAt).toLocaleString('zh-CN')}`
            : ''}
        </p>
      </footer>
    </div>
  )
}
