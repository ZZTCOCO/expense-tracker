import { copyFileSync, existsSync } from 'node:fs'

// GitHub Pages 不支持 SPA 路由回退：用 index.html 副本作 404.html，
// 深链（如 /bills）刷新时返回 SPA 入口，由前端路由接管。
if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html')
  console.log('[postbuild] 已生成 dist/404.html（GitHub Pages SPA 兜底）')
} else {
  console.warn('[postbuild] 未找到 dist/index.html，跳过 404 生成')
}
