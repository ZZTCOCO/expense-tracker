<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBillStore } from '@/stores/bill'
import BillFormDialog from '@/components/BillFormDialog.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import type { Bill } from '@/types/bill'

const store = useBillStore()
const dialogVisible = ref(false)

const recentBills = computed(() => store.bills.slice(0, 8))

function formatAmount(b: Bill) {
  return (b.type === 'income' ? '+' : '-') + b.amount.toFixed(2)
}

function formatYuan(n: number) {
  return `¥${n.toFixed(2)}`
}
</script>

<template>
  <div class="view">
    <h1>本月概览</h1>

    <div class="summary-row">
      <SummaryCard title="本月收入" :value="formatYuan(store.totalIncome)" type="income" />
      <SummaryCard title="本月支出" :value="formatYuan(store.totalExpense)" type="expense" />
      <SummaryCard title="本月结余" :value="formatYuan(store.balance)" type="balance" />
    </div>

    <div class="section">
      <div class="section-header">
        <h2>最近账单</h2>
        <el-button type="primary" @click="dialogVisible = true">记一笔</el-button>
      </div>

      <el-empty v-if="recentBills.length === 0" description="暂无账单，去记一笔吧" />

      <ul v-else class="recent-list">
        <li v-for="b in recentBills" :key="b.id" class="recent-item">
          <span class="recent-date">{{ b.date }}</span>
          <el-tag :type="b.type === 'income' ? 'success' : 'danger'" effect="light" size="small">
            {{ b.category }}
          </el-tag>
          <span v-if="b.note" class="recent-note">{{ b.note }}</span>
          <span :class="['recent-amount', b.type]">{{ formatAmount(b) }}</span>
        </li>
      </ul>
    </div>

    <BillFormDialog v-model="dialogVisible" :bill="null" />
  </div>
</template>

<style scoped>
.summary-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.section {
  margin-top: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-header h2 {
  margin: 0;
}

.recent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid var(--neon-border);
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-date {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  width: 96px;
  font-variant-numeric: tabular-nums;
}

.recent-note {
  flex: 1;
  color: var(--el-text-color-regular);
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-amount {
  margin-left: auto;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.recent-amount.income {
  color: var(--neon-income);
  text-shadow: var(--glow-income-sm);
}

.recent-amount.expense {
  color: var(--neon-expense);
  text-shadow: var(--glow-expense-sm);
}

@media (max-width: 640px) {
  .summary-row {
    flex-direction: column;
  }

  .section-header {
    flex-wrap: wrap;
  }

  .recent-date {
    width: auto;
  }
}
</style>
