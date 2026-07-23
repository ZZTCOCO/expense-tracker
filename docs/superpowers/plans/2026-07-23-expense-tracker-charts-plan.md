# 记账应用 第二层：收支图表 实现计划

- 日期：2026-07-23
- 关联设计：`docs/superpowers/specs/2026-07-22-expense-tracker-design.md`（第 3 节「后续阶段」第二层）
- 依赖：第一层 MVP 已完成（阶段 0–7）
- 状态：进行中

## 总览

在 MVP 基础上加收支可视化，分 3 个阶段。新增「统计」页（第三个导航项），放两张图：
1. **本月分类支出占比饼图**：本月各支出分类的金额占比
2. **近 6 个月收支趋势折线**：收入 / 支出两条线按月汇总

图表数据由 store.bills 经**纯函数**计算（可单测），组件只负责渲染。每阶段独立可验证，完成一个提交一次。

## 设计要点

- **图表库**：ECharts + vue-echarts，按需引入（echarts/core + Pie/Line + 必要 components），全局注册 `<v-chart>`。
- **分层**：`StatsView`（页面）→ `utils/billStats.ts`（纯聚合函数）← `stores/bill`（数据源）。store 不变，图表逻辑独立可测。
- **放置**：新建 `StatsView` + 导航「统计」(`/stats`)，保持 HomeView 聚焦概览。
- **空数据**：本月无支出 → 饼图空状态；6 个月无数据 → 折线显示零值线，不报错。

---

## 阶段 8：图表脚手架 + 统计纯函数
**目标**：依赖装好、`<v-chart>` 可用、统计页骨架可访问、聚合函数可跑。

步骤：
1. 安装 `echarts`、`vue-echarts`
2. `src/plugins/echarts.ts`：按需 `use([CanvasRenderer, PieChart, LineChart, Title/Tooltip/Legend/Grid])`，导出 VChart
3. `main.ts`：注册 `app.component('VChart', VChart)`
4. 路由加 `/stats` → `StatsView`（懒加载）；导航加「统计」菜单项
5. `src/utils/billStats.ts`：
   - `expenseByCategory(bills, monthPrefix)` → `[{ name, value }]`（本月支出按分类汇总，降序）
   - `lastNMonthPrefixes(n)` → 最近 n 个月 'YYYY-MM'
   - `monthlyTrend(bills, n=6)` → `{ labels, income[], expense[] }`

**验证**：构建通过；浏览器实测两个纯函数对样例数据输出正确。

## 阶段 9：饼图 + 折线图
**目标**：两张图按 store 数据正确渲染。

步骤：
1. `StatsView.vue`：
   - 顶部月份选择（默认本月）+ 饼图（选中月份的支出分类占比）
   - 下方折线图（近 6 个月收入/支出趋势）
   - 用 `utils/billStats` 的 computed 喂数据
2. 配色：收入绿、支出红（与表格/卡片一致）；饼图分类用默认调色板
3. 空状态：本月无支出时饼图区显示「本月暂无支出」

**验证**：造数据后两张图数字/占比正确；切月份饼图变；空数据不报错。

## 阶段 10：收尾
**目标**：稳健、能打包。

步骤：
1. 响应式：窄屏两张图纵向堆叠
2. `npm run build` + `npm run preview` 验证；浏览器在 preview 下确认图表渲染

**验证**：build 无报错，preview 图表功能完整。

---

## 进度跟踪
每完成一个阶段提交一次（如 `feat: 阶段8 图表脚手架与统计纯函数`）。

### 完成记录
- ✅ 阶段 8：图表脚手架 + 统计纯函数（echarts+vue-echarts 按需插件、`/stats` 路由+导航、StatsView 占位、utils/billStats 纯函数实测正确；echarts 改为 StatsView 局部懒加载，主包不膨胀）
