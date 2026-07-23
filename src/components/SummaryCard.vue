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
}

.summary-value {
  font-size: 28px;
  font-weight: 600;
}

.summary-value.income {
  color: var(--el-color-success);
}

.summary-value.expense {
  color: var(--el-color-danger);
}

.summary-value.balance {
  color: var(--el-color-primary);
}
</style>
