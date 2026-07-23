import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { db } from '@/db'
import type { Bill } from '@/types/bill'

// 账单状态层：所有数据操作走 store，组件不直接碰 db
export const useBillStore = defineStore('bill', () => {
  const bills = ref<Bill[]>([])

  // 当前月份前缀 'YYYY-MM'，用于概览统计
  function currentMonthPrefix(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  // 是否属于本月
  function isThisMonth(date: string): boolean {
    return date.startsWith(currentMonthPrefix())
  }

  const round = (n: number) => Math.round(n * 100) / 100

  // 本月收入
  const totalIncome = computed(() =>
    round(
      bills.value
        .filter((b) => b.type === 'income' && isThisMonth(b.date))
        .reduce((sum, b) => sum + b.amount, 0),
    ),
  )

  // 本月支出
  const totalExpense = computed(() =>
    round(
      bills.value
        .filter((b) => b.type === 'expense' && isThisMonth(b.date))
        .reduce((sum, b) => sum + b.amount, 0),
    ),
  )

  // 本月结余
  const balance = computed(() => round(totalIncome.value - totalExpense.value))

  // 加载全部账单（按日期倒序）
  async function loadAll() {
    try {
      bills.value = await db.bills.orderBy('date').reverse().toArray()
    } catch (e) {
      console.error('加载账单失败', e)
      ElMessage.error('加载账单失败')
    }
  }

  // 新增账单
  async function addBill(bill: Bill) {
    try {
      // 去掉响应式代理，Dexie 无法存储 Proxy
      await db.bills.add(toRaw(bill))
      await loadAll()
    } catch (e) {
      console.error('新增账单失败', e)
      ElMessage.error('新增账单失败')
    }
  }

  // 更新账单
  async function updateBill(bill: Bill) {
    try {
      await db.bills.put(toRaw(bill))
      await loadAll()
    } catch (e) {
      console.error('更新账单失败', e)
      ElMessage.error('更新账单失败')
    }
  }

  // 删除账单
  async function removeBill(id: number) {
    try {
      await db.bills.delete(id)
      await loadAll()
    } catch (e) {
      console.error('删除账单失败', e)
      ElMessage.error('删除账单失败')
    }
  }

  return {
    bills,
    totalIncome,
    totalExpense,
    balance,
    loadAll,
    addBill,
    updateBill,
    removeBill,
  }
})
