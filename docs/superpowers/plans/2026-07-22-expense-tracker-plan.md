# 记账应用（Expense Tracker）实现计划

- 日期：2026-07-22
- 关联设计：`docs/superpowers/specs/2026-07-22-expense-tracker-design.md`
- 状态：进行中（阶段 0、1 已完成）

### 完成记录
- ✅ 阶段 0：项目脚手架（`cadb053`）
- ✅ 阶段 1：路由与布局骨架（导航栏 + `/`、`/bills` 路由切换，构建通过）
- ✅ 阶段 2：数据层（types/bill.ts + db/index.ts Dexie + constants/category.ts，IndexedDB 读写已实测通过）
- ✅ 阶段 3：Pinia 状态层（bill store：loadAll/addBill/updateBill/removeBill + 本月 getters；add/update 用 toRaw 避开响应式 Proxy 存储问题；错误处理 try/catch+ElMessage 已内置，浏览器实测增删改查+本月统计正确）
- ✅ 阶段 4：记一笔 BillFormDialog（新增/编辑共用；类型/金额/分类随类型切换/日期/备注；表单校验；提交走 store）——浏览器实测：填表提交入库+刷新仍在、空提交校验拦截、切收入分类变工资/兼职/其他
- ✅ 阶段 5：账单列表 BillTable + BillsView（6 列、日期倒序、金额带+/-、空备注—、编辑回填、删除确认、月份筛选、空状态）——浏览器实测增删改查+筛选+空状态全部正常

## 总览

从空目录到可用的记账应用 MVP，分 8 个阶段。先打地基（0–3：脚手架 / 骨架 / 数据层 / 状态层），再盖楼层（4–6：记一笔 / 列表 / 概览），最后收尾（7）。**每阶段独立可验证**，完成一个就提交一次 git commit。

## 环境 / 前置
- Node.js（建议 18+）
- 包管理：npm
- 项目目录：`/Users/zhangzhitao/ZZT/workspace/expense-tracker`

---

## 阶段 0：项目脚手架
**目标**：把空项目变成能跑的 Vue3 + TS 工程，依赖装齐。

步骤：
1. Vite 脚手架创建：`npm create vite@latest . -- --template vue-ts`（在当前目录）
2. 安装依赖：`element-plus`、`@element-plus/icons-vue`、`pinia`、`vue-router`、`dexie`
3. 配置 `@` 路径别名（`vite.config.ts` + `tsconfig.json`）
4. 全量引入 Element Plus（MVP 图省事，后续可改按需）

**验证**：`npm run dev`，浏览器打开看到 Vue 默认页。
**讲解点**：为什么用 Vite、为什么配 `@` 别名、Element Plus 全量 vs 按需。

## 阶段 1：路由与布局骨架
**目标**：两个页面能切换，整体布局成型。

步骤：
1. 配置 Vue Router：`/` → HomeView，`/bills` → BillsView
2. `App.vue`：顶部导航栏（应用名 + 两个菜单项）+ `<router-view>` 主内容区
3. 创建空的 `HomeView.vue`、`BillsView.vue`（标题占位）
4. 主内容区居中，max-width 1000px

**验证**：点导航能在概览 / 账单两页切换，URL 变化。

## 阶段 2：数据层（地基）
**目标**：数据能存进 IndexedDB、能取出来（还没界面）。

步骤：
1. `src/types/bill.ts`：`Bill` 接口、`BillType` 类型
2. `src/db/index.ts`：Dexie 配置，定义 `bills` 表（`++id, type, category, date` 索引）
3. `src/constants/category.ts`：预设分类（支出 / 收入列表）

**验证**：浏览器控制台 `db.bills.add({...})` 写入，`db.bills.toArray()` 读出。
**讲解点**：为什么用 Dexie、索引怎么设计。

## 阶段 3：Pinia 状态层
**目标**：所有数据操作走 store，组件不直接碰 db。

步骤：
1. `src/stores/bill.ts`：
   - state：`bills` 列表
   - actions：`loadAll` / `addBill` / `updateBill` / `removeBill`
   - getters：`totalIncome` / `totalExpense` / `balance`（本月）
2. `main.ts` 启用 Pinia
3. `App.vue` `onMounted` 调 `loadAll()`

**验证**：临时调 `store.addBill`，看 IndexedDB 和 store 列表都更新。
**讲解点**：Composition API 写 store、getter 怎么算"本月"。

## 阶段 4：记一笔（BillFormDialog）
**目标**：能通过弹窗记一笔并存下来。

步骤：
1. `BillFormDialog.vue`：Element Plus Dialog + Form
2. 字段：类型（radio）、金额（InputNumber）、分类（Select，随类型切换）、日期（DatePicker）、备注（Input）
3. Element Plus 表单校验（金额 > 0、必填项）
4. 提交：`store.addBill`（新增）或 `updateBill`（编辑）
5. 概览页放"记一笔"按钮打开弹窗

**验证**：填表提交 → 数据进 IndexedDB → 列表出现新记录 → 刷新页面还在。

## 阶段 5：账单列表（BillTable + BillsView）
**目标**：完整展示和管理所有账单。

步骤：
1. `BillTable.vue`：Element Plus Table，列：日期 / 类型 / 分类 / 金额 / 备注 / 操作
2. 按日期倒序
3. 操作列：编辑（打开 `BillFormDialog` 回填）、删除（确认弹窗 → `store.removeBill`）
4. 月份筛选（DatePicker month 模式）
5. 空状态提示

**验证**：增删改查全部正常，筛选生效。

## 阶段 6：概览页（SummaryCard + HomeView）
**目标**：一眼看清本月收支。

步骤：
1. `SummaryCard.vue`：单张卡片（标题 + 金额）
2. `HomeView`：3 张卡片（收入 / 支出 / 结余，来自 store getter）+ 最近账单（前 5~10 条）
3. 记一笔按钮

**验证**：记几笔后，概览数字正确变化。

## 阶段 7：收尾
**目标**：稳健、能打包。

步骤：
1. 错误处理：db 操作加 `try/catch` + `ElMessage.error`
2. 样式打磨：间距、配色、响应式初步
3. 删除脚手架默认内容、清理 `console`
4. `npm run build` 验证构建通过
5. `npm run preview` 验证产物可运行

**验证**：build 无报错，preview 打开功能完整。

---

## 进度跟踪
每完成一个阶段，提交一次 git commit（如 `feat: 阶段0 项目脚手架`），便于回溯。
