# QAuth Web

QAuth Web 已重构为 **Vue 3 + Vite + Tailwind CSS + shadcn 风格组件** 的单页应用。页面保留 QAuth 的产品首页、完整 Demo、Docs、安全设计和路线图，并通过右上角语言按钮在中文与英文之间切换。

## 本地开发

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
npm run preview
```

## Cloudflare Pages 部署

```bash
npm run cf:deploy
```

如果使用 Cloudflare Dashboard 的 Git 自动部署，请填写：

- **Build command**: `npm run cf:build`
- **Build output directory**: `dist`

## 可用命令

- `npm run dev`：启动 Vite 本地开发服务
- `npm run build`：构建静态产物到 `dist`
- `npm run preview`：本地预览生产产物
- `npm run lint`：运行 `vue-tsc --noEmit` 类型检查
- `npm run cf:build`：构建 Cloudflare Pages 产物
- `npm run cf:preview`：构建并使用 Wrangler 本地预览 Pages 产物
- `npm run cf:deploy`：构建并部署到 Cloudflare Pages
