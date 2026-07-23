import type { BillType } from '@/types/bill'

// 预设分类（MVP 写死；自定义分类管理在第二层实现）
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

// 按账单类型取对应分类列表
export function getCategories(type: BillType): string[] {
  return CATEGORIES[type]
}
