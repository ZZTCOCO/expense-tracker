import Dexie, { type Table } from 'dexie'
import type { Bill } from '@/types/bill'
import type { Category } from '@/types/category'

// 数据访问层：唯一的 IndexedDB 访问出口
class BillDB extends Dexie {
  bills!: Table<Bill, number>
  categories!: Table<Category, number>

  constructor() {
    super('expense-tracker')
    // v1：账单表
    this.version(1).stores({
      bills: '++id, type, category, date',
    })
    // v2：新增分类表（bills 声明保留）
    this.version(2).stores({
      bills: '++id, type, category, date',
      categories: '++id, type, name',
    })
  }
}

export const db = new BillDB()
