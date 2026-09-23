export type Coupon = {
  id: string
  brand: string
  attribute: string
  discount: string
  taokouling: string
  url: string | null
  channel: string
  listedAt: string | null
  lotteryNights: number | null
}

export type CouponCatalog = {
  generatedAt: string
  source: string
  rules: string[]
  brands: string[]
  attributes: string[]
  channels: string[]
  coupons: Coupon[]
}
