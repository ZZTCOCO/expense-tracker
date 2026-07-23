<script setup lang="ts">
import type { Bill, BillType } from '@/types/bill'

defineProps<{
  bills: Bill[]
}>()

const emit = defineEmits<{
  (e: 'edit', bill: Bill): void
  (e: 'remove', bill: Bill): void
}>()

function typeText(t: BillType) {
  return t === 'income' ? '收入' : '支出'
}

function typeTagType(t: BillType) {
  return t === 'income' ? 'success' : 'danger'
}

function amountText(b: Bill) {
  return (b.type === 'income' ? '+' : '-') + b.amount.toFixed(2)
}
</script>

<template>
  <el-table :data="bills" stripe empty-text="暂无账单，去记一笔吧">
    <el-table-column label="日期" prop="date" width="130" />
    <el-table-column label="类型" width="90">
      <template #default="{ row }">
        <el-tag :type="typeTagType(row.type)" effect="light">{{ typeText(row.type) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="分类" prop="category" width="110" />
    <el-table-column label="金额" width="150">
      <template #default="{ row }">
        <span :class="['amount', row.type]">{{ amountText(row) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="备注" min-width="160" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.note || '—' }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="140" fixed="right">
      <template #default="{ row }">
        <el-button link type="primary" @click="emit('edit', row)">编辑</el-button>
        <el-button link type="danger" @click="emit('remove', row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.amount {
  font-weight: 600;
}
.amount.income {
  color: var(--el-color-success);
}
.amount.expense {
  color: var(--el-color-danger);
}
</style>
