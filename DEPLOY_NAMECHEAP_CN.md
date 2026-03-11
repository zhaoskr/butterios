# Butterios 上线说明（Namecheap + www.butterios.com）

## 你现在已有
- 前端网站模板目录：`storefront/`
- 入口文件：`storefront/index.html`

## 方案（推荐）
使用 **Cloudflare Pages** 免费托管静态站点，然后在 Namecheap 把 `www` 解析到 Cloudflare。

## 步骤 1：上传网站到 GitHub
1. 新建一个 GitHub 仓库（如 `butterios-store`）。
2. 把本项目中的 `storefront` 文件夹内容推送到仓库根目录（`index.html`、`styles.css`、`app.js`）。

## 步骤 2：Cloudflare Pages 部署
1. 登录 Cloudflare，进入 Pages。
2. 选择 Connect to Git，连接你的 GitHub 仓库。
3. Build 设置：
   - Framework preset: `None`
   - Build command: 留空
   - Build output directory: `/`
4. 点击 Deploy，部署完成后会获得一个 `*.pages.dev` 地址。

## 步骤 3：绑定自定义域名
1. 在 Cloudflare Pages 项目里点 Custom domains。
2. 添加域名：`www.butterios.com`。
3. Cloudflare 会给出 DNS 记录目标（通常是 CNAME 指向 `xxxx.pages.dev`）。

## 步骤 4：Namecheap 配置 DNS
在 Namecheap -> Domain List -> `butterios.com` -> Advanced DNS：
1. 添加/修改一条 `CNAME Record`
   - Host: `www`
   - Value: Cloudflare 提供的 `xxxx.pages.dev`
   - TTL: Automatic
2. 如需把裸域 `butterios.com` 跳转到 `www`：
   - 添加 URL Redirect Record（301）
   - Host: `@`
   - Value: `https://www.butterios.com`

## 步骤 5：等待生效
- DNS 通常 5-30 分钟生效，少数情况可到 24 小时。
- 生效后访问：`https://www.butterios.com`

## 下一步可扩展
- 接 Stripe Checkout（真实支付）
- 接 ShipStation/UPS 运费接口
- 接 CMS（商品后台管理）
- 接 Google Analytics + Meta Pixel（美国电商投放）
