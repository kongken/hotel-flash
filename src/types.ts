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

export type HotelProductSku = {
  id: string
  content: string
  tags: string[]
}

export type HotelProduct = {
  id: string
  group: string
  store: string
  title: string
  region: string
  tags: string[]
  note: string
  listedAt: string | null
  availability: string
  taokouling: string
  skus: HotelProductSku[]
}

export type ProductCatalog = {
  generatedAt: string
  source: string
  groups: string[]
  regions: string[]
  listedDates: string[]
  products: HotelProduct[]
}
