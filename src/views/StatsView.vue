<script setup lang="ts">
import { ref, computed } from 'vue'
import VChart from '@/plugins/echarts'
import { useBillStore } from '@/stores/bill'
import { useTheme } from '@/composables/useTheme'
import {
  expenseByCategory,
  monthlyTrend,
  currentMonthPrefix,
} from '@/utils/billStats'

const store = useBillStore()
const { isDark } = useTheme()

// 饼图月份（默认本月）
const selectedMonth = ref(currentMonthPrefix())

const pieData = computed(() => expenseByCategory(store.bills, selectedMonth.value))
const trend = computed(() => monthlyTrend(store.bills, 6))

// 主题相关配色（切白天时图表自动适配）
const palette = computed(() =>
  isDark.value
    ? ['#22d3ee', '#a855f7', '#34d399', '#fb7185', '#f59e0b', '#38bdf8', '#f472b6']
    : ['#0891b2', '#7c3aed', '#059669', '#e11d48', '#d97706', '#0284c7', '#db2777'],
)
const axisLabel = computed(() => (isDark.value ? '#94a3b8' : '#6b7280'))
const axisLine = computed(() =>
  isDark.value ? 'rgba(148,163,184,0.25)' : 'rgba(15,23,42,0.15)',
)
const splitLine = computed(() =>
  isDark.value ? 'rgba(148,163,184,0.1)' : 'rgba(15,23,42,0.08)',
)
const legendText = computed(() => (isDark.value ? '#cbd5e1' : '#374151'))
const incomeColor = computed(() => (isDark.value ? '#34d399' : '#059669'))
const expenseColor = computed(() => (isDark.value ? '#fb7185' : '#e11d48'))
const tooltipStyle = computed(() => ({
  backgroundColor: isDark.value ? 'rgba(17, 22, 42, 0.92)' : 'rgba(255,255,255,0.95)',
  borderColor: isDark.value ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15,23,42,0.1)',
  borderWidth: 1,
  textStyle: { color: isDark.value ? '#e5e7eb' : '#1f2533' },
}))
const pieBorder = computed(() => (isDark.value ? 'rgba(11,15,26,0.8)' : '#fff'))

const pieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)', ...tooltipStyle.value },
  legend: { bottom: 0, textStyle: { color: legendText.value } },
  color: palette.value,
  series: [
    {
      name: '支出分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: pieBorder.value, borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%', color: legendText.value },
      data: pieData.value,
    },
  ],
}))

const lineOption = computed(() => {
  const inc = incomeColor.value
  const exp = expenseColor.value
  const shadow = (c: string) => (isDark.value ? { shadowColor: c, shadowBlur: 10 } : {})
  return {
    tooltip: { trigger: 'axis', ...tooltipStyle.value },
    legend: { data: ['收入', '支出'], textStyle: { color: legendText.value }, bottom: 0 },
    grid: { left: 48, right: 20, top: 28, bottom: 64 },
    xAxis: {
      type: 'category',
      data: trend.value.labels,
      axisLine: { lineStyle: { color: axisLine.value } },
      axisLabel: { color: axisLabel.value },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: splitLine.value } },
      axisLabel: { color: axisLabel.value },
    },
    series: [
      {
        name: '收入',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: trend.value.income,
        lineStyle: { color: inc, width: 3, ...shadow('rgba(52,211,153,0.6)') },
        itemStyle: { color: inc },
        areaStyle: { color: `${inc}1f` },
      },
      {
        name: '支出',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: trend.value.expense,
        lineStyle: { color: exp, width: 3, ...shadow('rgba(251,113,133,0.6)') },
        itemStyle: { color: exp },
        areaStyle: { color: `${exp}1f` },
      },
    ],
  }
})
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
