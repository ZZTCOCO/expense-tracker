<script setup lang="ts">
defineProps<{
  title: string
  value: string
  type?: 'income' | 'expense' | 'balance'
}>()
</script>

<template>
  <el-card shadow="hover" class="summary-card">
    <div class="summary-title">{{ title }}</div>
    <div :class="['summary-value', type]">{{ value }}</div>
  </el-card>
</template>

<style scoped>
.summary-card {
  flex: 1 1 0;
}

.summary-title {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.summary-value {
  font-size: 30px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.summary-value.income {
  color: var(--neon-income);
  text-shadow: var(--glow-income);
}

.summary-value.expense {
  color: var(--neon-expense);
  text-shadow: var(--glow-expense);
}

.summary-value.balance {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}
</style>
