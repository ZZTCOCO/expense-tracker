# 记账应用（Expense Tracker）设计文档

- 日期：2026-07-22
- 状态：已确认，待实现
- 类型：纯前端本地应用（前端练手项目）

## 1. 项目概述

一个本地记账应用，用于练习前端开发。单用户、单设备，数据存储在浏览器（IndexedDB），不依赖后端。浏览器即跨平台运行时，构建产物可在 Windows / Mac / Linux 上运行。

### 1.1 目标
- 练习前端核心技能：Vue 组件化、状态管理（Pinia）、表单、列表 CRUD、本地持久化（IndexedDB）
- 产出一个能真实日常使用的记账工具

### 1.2 非目标（YAGNI，本期不做）
- 多用户 / 账号登录（本地单用户）
- 多设备同步（无后端）
- 预算、图表、导出、多账户（属于后续阶段）

## 2. 技术栈

| 角色 | 选型 |
|---|---|
| 框架 | Vue 3（Composition API） |
| 语言 | TypeScript |
| 构建 | Vite |
| 状态管理 | Pinia |
| UI 组件库 | Element Plus |
| 图表（后续阶段） | ECharts + vue-echarts |
| 本地存储 | IndexedDB，用 Dexie.js 封装 |
| 路由 | Vue Router |

运行平台：PC 端 Web。预留响应式扩展能力。

## 3. MVP 功能范围（第一层）

1. **记一笔**：金额、收入/支出、分类、日期、备注
2. **账单列表**：查看所有记录，按时间倒序，支持编辑、删除，支持月份筛选
3. **本月概览**：总收入、总支出、结余（卡片展示）
4. **数据持久化**：IndexedDB，关闭浏览器后数据保留

后续阶段（不在本期 MVP）：
- 第二层：图表（收支趋势折线、分类占比饼图）、分类管理
- 第三层：预算设置、数据导出、多账户

## 4. 整体架构与目录结构

```
expense-tracker/
├── src/
│   ├── views/           # 页面级组件
│   │   ├── HomeView.vue       # 概览页
│   │   └── BillsView.vue      # 账单列表页
│   ├── components/      # 可复用组件
│   │   ├── SummaryCard.vue    # 收支概览卡片
│   │   ├── BillFormDialog.vue # 记一笔/编辑弹窗
│   │   └── BillTable.vue      # 账单表格
│   ├── stores/          # Pinia 状态
│   │   └── bill.ts            # 账单 store
│   ├── db/              # 数据访问层
│   │   └── index.ts           # Dexie 封装
│   ├── types/           # TS 类型
│   │   └── bill.ts
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── docs/
└── ...
```

**分层与数据流向**：`views`（页面）→ `components`（组件）→ `stores`（状态）→ `db`（存储）。数据单向流动，每层职责单一：
- **views**：页面组装、路由入口
- **components**：可复用 UI 单元，仅通过 props / emits 与外部通信
- **stores**：业务状态与操作，组件不直接访问 db
- **db**：唯一的 IndexedDB 访问出口

## 5. 页面结构

### 5.1 概览页 HomeView
- 顶部 3 张 `SummaryCard`：本月收入、本月支出、本月结余
- 一个醒目的"记一笔"按钮（打开 `BillFormDialog`）
- 下方"最近账单"列表（最近 5~10 条）

### 5.2 账单页 BillsView
- 顶部月份筛选（Element Plus DatePicker，月份模式）
- `BillTable`：表格展示全部记录，按日期倒序，每行有编辑、删除操作

### 5.3 记一笔 / 编辑 BillFormDialog
- Element Plus Dialog 弹窗
- 表单字段：类型（收入/支出 单选）、金额（数字输入）、分类（下拉，随类型切换选项）、日期（DatePicker）、备注（文本框）
- 新增和编辑共用同一组件（编辑时回填数据）

### 5.4 整体布局
- 顶部导航栏：应用名 + 页面切换（概览 / 账单）
- 主内容区居中，最大宽度约 1000px

## 6. 数据模型

```ts
// src/types/bill.ts
export type BillType = 'income' | 'expense';

export interface Bill {
  id: number;            // 自增主键（Dexie 自增）
  type: BillType;        // 收入 or 支出
  amount: number;        // 金额（元）
  category: string;      // 分类，如 '餐饮'
  date: string;          // 'YYYY-MM-DD'
  note?: string;         // 备注（可选）
  createdAt: number;     // 创建时间戳（ms）
}
```

### 预设分类（MVP 写死）
- 支出：餐饮 / 交通 / 购物 / 娱乐 / 住房 / 医疗 / 其他
- 收入：工资 / 兼职 / 其他

（自定义分类管理在第二层实现。）

## 7. 数据流

```
用户在 BillFormDialog 提交
  → store.addBill(bill) / updateBill(bill)
    → db.bills.add(...) / put(...)
      → 返回后 store 刷新 bills 列表
        → 概览卡片（getter 计算）、账单表格自动更新（Vue 响应式）
```

- 删除：`store.removeBill(id)` → `db.bills.delete(id)` → 刷新
- 概览数据：store 中由 bills 列表经 getter 计算得出（过滤本月、按类型求和）

## 8. 数据访问层（Dexie）

```ts
// src/db/index.ts
import Dexie, { Table } from 'dexie';
import { Bill } from '@/types/bill';

class BillDB extends Dexie {
  bills!: Table<Bill, number>;
  constructor() {
    super('expense-tracker');
    this.version(1).stores({
      bills: '++id, type, category, date',
    });
  }
}

export const db = new BillDB();
```

- `++id`：自增主键
- 索引：`type`、`category`、`date`（用于筛选 / 查询）

## 9. 状态管理（Pinia store 概要）

```ts
// src/stores/bill.ts（概要）
export const useBillStore = defineStore('bill', () => {
  const bills = ref<Bill[]>([]);

  // getters
  const totalIncome = computed(...);   // 本月收入
  const totalExpense = computed(...);  // 本月支出
  const balance = computed(...);       // 结余

  // actions
  async function loadAll() { ... }
  async function addBill(bill) { ... }
  async function updateBill(bill) { ... }
  async function removeBill(id) { ... }

  return { bills, totalIncome, totalExpense, balance,
           loadAll, addBill, updateBill, removeBill };
});
```

应用启动时调用 `loadAll()` 初始化数据（在 `App.vue` 的 `onMounted` 中）。

## 10. 错误处理

- **表单校验**：用 Element Plus 的 Form 校验（金额必填且 > 0、分类必选、日期必选）。校验不通过不提交，显示错误提示。
- **存储操作**：`db` 的增删改查用 `try/catch` 包裹，失败时用 `ElMessage.error()` 提示用户，并在控制台打印错误。
- **空数据**：账单列表为空时显示空状态提示（"暂无账单，去记一笔吧"）。

## 11. 测试

本期 MVP 以**手动验证**为主（练手项目，重点在前端核心技能）。核心纯函数（如金额计算、本月过滤）可后续用 Vitest 补单元测试，作为练习延伸。

## 12. 打包与运行

- 开发：`npm run dev`（Vite 本地开发服务器）
- 构建：`npm run build` → 产出 `dist/` 静态文件
- 预览：`npm run preview`
- 跨平台：浏览器即跨平台运行时，构建产物部署到任意静态服务器或本地浏览器即可在 Windows / Mac / Linux 运行
- 未来如需桌面安装包：可用 Tauri 套壳，代码基本不变
