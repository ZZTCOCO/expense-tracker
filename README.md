# 记账（Expense Tracker）

本地记账应用，单用户、单设备，数据存储在浏览器 IndexedDB，无需后端。前端练手项目。

## 技术栈

- Vue 3（Composition API）+ TypeScript
- Vite 构建
- Pinia 状态管理
- Vue Router 路由
- Element Plus UI 组件库
- Dexie.js（IndexedDB 封装）做本地持久化

## 功能（MVP）

- **记一笔**：金额、收入/支出、分类、日期、备注，表单校验
- **账单列表**：按日期倒序，编辑、删除，月份筛选，空状态
- **本月概览**：本月收入 / 支出 / 结余卡片 + 最近账单
- **本地持久化**：关闭浏览器后数据保留

## 目录结构

```
src/
├── views/           # 页面：HomeView（概览）、BillsView（账单）
├── components/      # 组件：SummaryCard、BillFormDialog、BillTable
├── stores/          # Pinia：bill.ts
├── db/              # Dexie 数据访问层
├── types/           # Bill 类型
├── constants/       # 预设分类
└── router/          # 路由
```

数据流向：`views → components → stores → db`，单向流动，每层职责单一。

## 开发与构建

```bash
npm install      # 安装依赖
npm run dev      # 本地开发
npm run build    # 类型检查 + 生产构建到 dist/（含 PWA 产物 + 404.html 兜底）
npm run preview  # 预览构建产物
npm run pwa-assets  # 由 public/icon.svg 重新生成全套 PWA 图标
```

## PWA 与部署

应用是可安装的 PWA（离线可用）。

- **图标**：源图 `public/icon.svg`，用 `npm run pwa-assets` 生成 `public/` 下全套图标（改了源图后重跑）。
- **配置**：`vite.config.ts` 的 `VitePWA`（manifest + autoUpdate + workbox 预缓存）；`base: './'` 兼容任意子路径。
- **GitHub Pages 路由兜底**：`scripts/postbuild.mjs` 在 build 后生成 `dist/404.html`，深链刷新也能回退到 SPA。

### 部署到 GitHub Pages（国内可访问）

1. 在 GitHub 建一个仓库，把项目推上去（`git push`）。
2. 仓库 **Settings → Pages → Source** 选 **GitHub Actions**。
3. 推送到 `main` 会自动触发 `.github/workflows/deploy.yml` 构建 + 发布。
4. 完成后访问 `https://<用户名>.github.io/<仓库名>/`，浏览器点「安装」即可装到桌面、离线使用。

> 在 Vercel / Netlify 等也直接可用（相对路径，无需改 base）；那两个平台国内访问不稳定。

## 文档

- 设计：`docs/superpowers/specs/2026-07-22-expense-tracker-design.md`
- 实现计划：`docs/superpowers/plans/2026-07-22-expense-tracker-plan.md`
