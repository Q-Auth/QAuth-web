# QAuth Web

这是一个 Next.js 16 项目，已配置为 **Cloudflare Workers** 可直接部署。

## 本地开发

```bash
npm install
npm run dev
```

## Cloudflare Workers 部署（默认配置可用）

### 1) 首次登录 Cloudflare

```bash
npx wrangler login
```

### 2) 一键构建并部署

```bash
npm run cf:deploy
```

> 以上命令会先用 OpenNext 构建 Worker 输出，再调用 Wrangler 部署。

## Cloudflare Pages（Git）里如何填 Build 设置

如果你使用 Cloudflare Dashboard 的 Git 自动部署，请使用：

- **Build command**: `npm run cf:build`
- **Build output directory**: `.open-next/assets`

并在项目根目录保留 `wrangler.jsonc`（本仓库已提供），这样默认流程即可识别 Worker 入口和静态资源目录。

## 为什么你之前报错（WORKER_SELF_REFERENCE）

你截图中的错误是：服务绑定 `WORKER_SELF_REFERENCE` 指向了 `qauth-web`，但该 Worker 在账号里不存在。

本仓库当前配置 **不需要** 这个 service binding。请在 Cloudflare Dashboard 的 Worker/Pages 设置中删除旧的 `WORKER_SELF_REFERENCE` 绑定（如果存在），然后重新部署。

## 可用命令

- `npm run cf:build`：构建 Cloudflare Worker 产物
- `npm run cf:preview`：本地预览 Worker
- `npm run cf:deploy`：构建并发布到 Cloudflare
