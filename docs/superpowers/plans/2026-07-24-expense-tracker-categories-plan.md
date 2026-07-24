# 记账应用 第二层：分类管理 实现计划

- 日期：2026-07-24
- 关联设计：`docs/superpowers/specs/2026-07-22-expense-tracker-design.md`（第 3 节「后续阶段」第二层：分类管理）
- 依赖：第一层 MVP + 图表 + 暗黑霓虹 UI 已完成
- 状态：已完成（阶段 12–14 全部完成）

## 总览

把写死的预设分类改成「可自定义 + 持久化」。分类存入 IndexedDB（新表），首次为空时种入预设；提供管理页增删；记一笔/编辑的下拉改为读 store。分 3 个阶段，每阶段独立可验证，完成一个提交一次。

## 设计要点

- **数据模型**：新增 `categories` 表 `{ id, type, name }`，Dexie 升级到 v2（保留 bills）。`type` 为 income/expense，`(type,name)` 视为唯一。
- **预设种入**：首次 `loadAll` 发现表为空时，把 `constants/category.ts` 的预设写入（一次性）。之后完全由用户管理。
- **分层**：新增 `stores/category.ts`（loadAll/addCategory/removeCategory + byType）；BillFormDialog 改读 store；`constants` 仅作预设来源。
- **删除策略**：删除分类不影响已有账单（账单存的是字符串）。记一笔下拉在编辑时若当前分类已被删，仍显示出来（追加到选项）。
- **UI**：新增 `/categories` 页（导航「分类」），支出/收入两个区，分类以可关闭 el-tag 展示 + 输入框新增。

---

## 阶段 12：分类数据层 + store
**目标**：分类能存进 IndexedDB、能取出来、预设自动种入。

步骤：
1. `src/types/category.ts`：`Category` 接口（id?/type/name）
2. `src/db/index.ts`：升级 v2，加 `categories: '++id, type, name'`（保留 bills 声明）
3. `src/constants/category.ts`：精简为预设来源（导出数组 + CATEGORIES record）
4. `src/stores/category.ts`：categories state + loadAll(空则种预设) + addCategory + removeCategory + byType，try/catch+ElMessage
5. `App.vue` onMounted 同时 loadAll 分类

**验证**：浏览器实测种入预设、新增、删除、刷新仍在。

## 阶段 13：管理页 + 表单接入
**目标**：能在页面增删分类，记一笔下拉读最新分类。

步骤：
1. `src/views/CategoriesView.vue`：支出/收入两区，el-tag closable 删除 + 输入框新增（去重、非空校验）
2. 路由 `/categories` + 导航「统计」旁加「分类」
3. `BillFormDialog.vue`：分类选项改读 `categoryStore.byType(type)`；编辑时若分类已删仍追加显示

**验证**：新增/删除分类后，记一笔下拉随之变化；编辑旧账单（分类已删）仍能正常显示与保存。

## 阶段 14：收尾
**目标**：稳健、能打包。

步骤：
1. 暗色/亮色主题下管理页外观一致（沿用玻璃卡/霓虹）
2. `npm run build` + `npm run preview` 验证；preview 下确认增删分类持久化

**验证**：build 无报错，preview 功能完整。

---

## 进度跟踪
每完成一个阶段提交一次。

### 完成记录
- ✅ 阶段 12：分类数据层 + store（types/category、db v2 categories 表、constants 精简为预设、stores/category loadAll空则种入/add/remove/byType、App onMounted 加载分类、BillFormDialog 改读 store）——浏览器实测 Dexie 升级+预设种入+增删+持久化正确
- ✅ 阶段 13：管理页 + 表单接入（CategoriesView 支出/收入两区 el-tag closable 删除 + 输入新增去重；路由 /categories + 导航「分类」）——实测新增/删除分类后记一笔下拉随之变化（咖啡加入、医疗移除）
- ✅ 阶段 14：收尾（npm run build 通过，CategoriesView 懒加载；preview 生产构建实测预设种入+新增+刷新持久化正常，明暗主题均 OK）
