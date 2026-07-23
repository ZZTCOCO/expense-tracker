<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBillStore } from '@/stores/bill'

const route = useRoute()
const billStore = useBillStore()

// 应用启动时加载全部账单
onMounted(() => {
  billStore.loadAll()
})
</script>

<template>
  <el-container class="app-layout">
    <el-header class="app-header">
      <div class="app-name">记账</div>
      <el-menu
        class="app-menu"
        mode="horizontal"
        :ellipsis="false"
        :default-active="route.path"
        router
      >
        <el-menu-item index="/">概览</el-menu-item>
        <el-menu-item index="/bills">账单</el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="app-main">
      <div class="app-content">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>
