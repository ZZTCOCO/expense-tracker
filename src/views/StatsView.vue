<script setup lang="ts">
import { ref, computed } from 'vue'
import VChart from '@/plugins/echarts'
import { useBillStore } from '@/stores/bill'
import {
  expenseByCategory,
  monthlyTrend,
  currentMonthPrefix,
} from '@/utils/billStats'

const store = useBillStore()

// 饼图月份（默认本月）
const selectedMonth = ref(currentMonthPrefix())

const pieData = computed(() => expenseByCategory(store.bills, selectedMonth.value))
const trend = computed(() => monthlyTrend(store.bills, 6))

const pieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
  legend: { bottom: 0 },
  series: [
    {
      name: '支出分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%' },
      data: pieData.value,
    },
  ],
}))

const lineOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['收入', '支出'] },
  grid: { left: 48, right: 20, top: 36, bottom: 30 },
  xAxis: { type: 'category', data: trend.value.labels },
  yAxis: { type: 'value' },
  series: [
    {
      name: '收入',
      type: 'line',
      smooth: true,
      data: trend.value.income,
      itemStyle: { color: '#67c23a' },
      areaStyle: { opacity: 0.1 },
    },
    {
      name: '支出',
      type: 'line',
      smooth: true,
      data: trend.value.expense,
      itemStyle: { color: '#f56c6c' },
      areaStyle: { opacity: 0.1 },
    },
  ],
}))
</script>

<template>
  <div class="view">
    <h1>收支统计</h1>

    <el-card shadow="hover" class="chart-card">
      <div class="chart-head">
        <h2>支出分类占比</h2>
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          placeholder="选择月份"
          value-format="YYYY-MM"
          style="width: 160px"
        />
      </div>
      <v-chart v-if="pieData.length" class="chart" :option="pieOption" autoresize />
      <el-empty v-else description="该月份暂无支出" />
    </el-card>

    <el-card shadow="hover" class="chart-card">
      <h2>近 6 个月收支趋势</h2>
      <v-chart class="chart" :option="lineOption" autoresize />
    </el-card>
  </div>
</template>

<style scoped>
.chart-card {
  margin-bottom: 16px;
}

.chart-card h2 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
}

.chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.chart-head h2 {
  margin: 0;
}

.chart {
  height: 320px;
}

@media (max-width: 640px) {
  .chart-head {
    flex-wrap: wrap;
    gap: 8px;
  }

  .chart {
    height: 260px;
  }
}
</style>
