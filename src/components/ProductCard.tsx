import { useState } from 'react'
import type { HotelProduct } from '../types'

type Props = {
  product: HotelProduct
  index: number
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function ProductCard({ product, index }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!product.taokouling) return
    try {
      await copyText(product.taokouling)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const delay = Math.min(index, 12) * 40

  return (
    <li className="card product-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-top">
        <span className="badge-id">{product.id}</span>
        <span className="badge-brand">{product.group}</span>
      </div>

      <p className="product-store">{product.store}</p>
      <h2 className="product-title">{product.title}</h2>

      <div className="product-tags">
        {product.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {product.note && <p className="product-note">{product.note}</p>}

      <dl className="details product-details">
        <div>
          <dt>覆盖</dt>
          <dd>{product.region || '—'}</dd>
        </div>
        <div>
          <dt>上新</dt>
          <dd>{product.listedAt || '—'}</dd>
        </div>
        <div>
          <dt>状态</dt>
          <dd>{product.availability || '—'}</dd>
        </div>
      </dl>

      {product.skus.length > 0 && (
        <details className="product-skus">
          <summary>子商品选项 · {product.skus.length} 档</summary>
          <ul>
            {product.skus.map((sku) => (
              <li key={sku.id}>
                <strong>{sku.id}</strong>
                <span>{sku.content}</span>
                {sku.tags.length > 0 && (
                  <small>{sku.tags.join(' · ')}</small>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="actions">
        <button
          type="button"
          className="primary-btn"
          onClick={handleCopy}
          disabled={!product.taokouling}
        >
          <span className="btn-label" data-active={copied ? 'true' : 'false'}>
            <span className="btn-idle">复制淘口令</span>
            <span className="btn-done">已复制</span>
          </span>
        </button>
        <span className="ghost-btn is-disabled">无链接</span>
      </div>
    </li>
  )
}
