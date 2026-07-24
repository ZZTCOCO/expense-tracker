import type { BillType } from '@/types/bill'

// 预设分类：首次启动时种入 categories 表，之后由用户管理
export const EXPENSE_CATEGORIES = [
  '餐饮',
  '交通',
  '购物',
  '娱乐',
  '住房',
  '医疗',
  '其他',
]

export const INCOME_CATEGORIES = ['工资', '兼职', '其他']

export const CATEGORIES: Record<BillType, string[]> = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
}
