<script setup lang="ts">
import { ref } from 'vue'
import BillFormDialog from '@/components/BillFormDialog.vue'

const dialogVisible = ref(false)
</script>

<template>
  <div class="view">
    <h1>本月概览</h1>
    <el-button type="primary" size="large" @click="dialogVisible = true">记一笔</el-button>
    <p class="placeholder">概览卡片（待实现）</p>
    <BillFormDialog v-model="dialogVisible" :bill="null" />
  </div>
</template>
