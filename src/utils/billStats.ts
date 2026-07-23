import type { Bill } from '@/types/bill'

/** 金额四舍五入到 2 位小数 */
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/** 取日期的 'YYYY-MM' 月份前缀 */
function monthPrefixOf(date: string): string {
  return date.slice(0, 7)
}

/** 当前月份前缀 'YYYY-MM' */
export function currentMonthPrefix(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/** 最近 n 个月的 'YYYY-MM'（含当月，升序） */
export function lastNMonthPrefixes(n: number): string[] {
  const now = new Date()
  const result: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return result
}

/** 指定月份的支出按分类汇总，金额降序 */
export function expenseByCategory(
  bills: Bill[],
  monthPrefix: string,
): { name: string; value: number }[] {
  const sums = new Map<string, number>()
  for (const b of bills) {
    if (b.type !== 'expense') continue
    if (monthPrefixOf(b.date) !== monthPrefix) continue
    sums.set(b.category, (sums.get(b.category) ?? 0) + b.amount)
  }
  return Array.from(sums.entries())
    .map(([name, value]) => ({ name, value: round2(value) }))
    .sort((a, b) => b.value - a.value)
}

/** 最近 n 个月（含当月）收支趋势 */
export function monthlyTrend(
  bills: Bill[],
  n = 6,
): { labels: string[]; income: number[]; expense: number[] } {
  const prefixes = lastNMonthPrefixes(n)
  const income = new Array(n).fill(0)
  const expense = new Array(n).fill(0)
  for (const b of bills) {
    const idx = prefixes.indexOf(monthPrefixOf(b.date))
    if (idx === -1) continue
    if (b.type === 'income') income[idx] += b.amount
    else expense[idx] += b.amount
  }
  return {
    labels: prefixes,
    income: income.map(round2),
    expense: expense.map(round2),
  }
}
