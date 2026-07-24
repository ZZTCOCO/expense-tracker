import type { BillType } from './bill'

// 分类数据模型
export interface Category {
  id?: number // 自增主键
  type: BillType // 收入 / 支出
  name: string // 分类名
}
