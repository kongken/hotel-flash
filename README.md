# Hotel Flash

酒店红包速查：根据 `hotel-coupon.xlsx` 生成可搜索、可筛选的静态站点，适合部署到 Cloudflare Pages。

## 本地开发

```bash
npm install
npm run dev
```

`predev` / `prebuild` 会自动把 `hotel-coupon.xlsx` 转成 `src/data/coupons.json`。

单独更新数据：

```bash
npm run data
```

## 构建

```bash
npm run build
```

产物在 `dist/`。

## 部署到 Cloudflare Pages

1. 把仓库推到 GitHub / GitLab
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → 连接仓库
3. 构建设置：
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 保存并部署

或用 Wrangler 直接上传：

```bash
npm run build
npx wrangler pages deploy dist --project-name=hotel-flash
```

## 更新红包数据

替换根目录的 `hotel-coupon.xlsx`，重新部署（或本地 `npm run data` 后提交生成的 JSON）。
