import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { db } from '@/db'
import { CATEGORIES } from '@/constants/category'
import type { Category } from '@/types/category'
import type { BillType } from '@/types/bill'

// 分类状态层：分类持久化在 IndexedDB，组件不直接碰 db
export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  // 按类型取分类
  function byType(type: BillType): Category[] {
    return categories.value.filter((c) => c.type === type)
  }

  // 首次为空时种入预设分类
  async function seedIfEmpty() {
    if ((await db.categories.count()) > 0) return
    const rows: Category[] = [
      ...CATEGORIES.expense.map((name) => ({ type: 'expense' as BillType, name })),
      ...CATEGORIES.income.map((name) => ({ type: 'income' as BillType, name })),
    ]
    await db.categories.bulkAdd(rows)
  }

  async function loadAll() {
    try {
      await seedIfEmpty()
      categories.value = await db.categories.orderBy('id').toArray()
    } catch (e) {
      console.error('加载分类失败', e)
      ElMessage.error('加载分类失败')
    }
  }

  async function addCategory(type: BillType, name: string) {
    try {
      await db.categories.add({ type, name })
      categories.value = await db.categories.orderBy('id').toArray()
    } catch (e) {
      console.error('新增分类失败', e)
      ElMessage.error('新增分类失败')
    }
  }

  async function removeCategory(id: number) {
    try {
      await db.categories.delete(id)
      categories.value = await db.categories.orderBy('id').toArray()
    } catch (e) {
      console.error('删除分类失败', e)
      ElMessage.error('删除分类失败')
    }
  }

  return { categories, byType, loadAll, addCategory, removeCategory }
})
