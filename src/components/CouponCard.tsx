import { useState } from 'react'
import type { Coupon } from '../types'

type Props = {
  coupon: Coupon
  index: number
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

export function CouponCard({ coupon, index }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const payload = coupon.taokouling || coupon.url || ''
    if (!payload) return
    try {
      await copyText(payload)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const delay = Math.min(index, 12) * 40

  return (
    <li className="card" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-top">
        <span className="badge-id">{coupon.id}</span>
        <span className="badge-brand">{coupon.brand}</span>
      </div>

      <p className="discount">{coupon.discount || '—'}</p>
      <p className="attribute">{coupon.attribute || '未标注属性'}</p>

      <dl className="details">
        <div>
          <dt>渠道</dt>
          <dd>{coupon.channel || '—'}</dd>
        </div>
        <div>
          <dt>上新</dt>
          <dd>{coupon.listedAt || '—'}</dd>
        </div>
        <div>
          <dt>抽奖房晚</dt>
          <dd>
            {coupon.lotteryNights == null ? '—' : coupon.lotteryNights}
          </dd>
        </div>
      </dl>

      <div className="actions">
        <button
          type="button"
          className="primary-btn"
          onClick={handleCopy}
          disabled={!coupon.taokouling && !coupon.url}
        >
          <span className="btn-label" data-active={copied ? 'true' : 'false'}>
            <span className="btn-idle">复制淘口令</span>
            <span className="btn-done">已复制</span>
          </span>
        </button>
        {coupon.url ? (
          <a
            className="ghost-btn"
            href={coupon.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            打开链接
          </a>
        ) : (
          <span className="ghost-btn is-disabled">无链接</span>
        )}
      </div>
    </li>
  )
}
