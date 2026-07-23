// 账单类型：收入 / 支出
export type BillType = 'income' | 'expense'

// 账单数据模型
export interface Bill {
  id?: number // 自增主键（Dexie 写入后生成；新增时无 id）
  type: BillType // 收入 or 支出
  amount: number // 金额（元）
  category: string // 分类，如 '餐饮'
  date: string // 'YYYY-MM-DD'
  note?: string // 备注（可选）
  createdAt: number // 创建时间戳（ms）
}
