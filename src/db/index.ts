import Dexie, { type Table } from 'dexie'
import type { Bill } from '@/types/bill'

// 数据访问层：唯一的 IndexedDB 访问出口
class BillDB extends Dexie {
  bills!: Table<Bill, number>

  constructor() {
    super('expense-tracker')
    // ++id 自增主键；type/category/date 建索引以便筛选与查询
    this.version(1).stores({
      bills: '++id, type, category, date',
    })
  }
}

export const db = new BillDB()
