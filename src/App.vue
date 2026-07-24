<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useBillStore } from '@/stores/bill'
import { useCategoryStore } from '@/stores/category'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const billStore = useBillStore()
const categoryStore = useCategoryStore()
const { isDark, toggle } = useTheme()

// 应用启动时加载账单与分类
onMounted(() => {
  billStore.loadAll()
  categoryStore.loadAll()
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
        <el-menu-item index="/stats">统计</el-menu-item>
        <el-menu-item index="/categories">分类</el-menu-item>
      </el-menu>
      <div class="theme-toggle">
        <el-switch
          :model-value="isDark"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
          aria-label="切换明暗主题"
          @change="toggle"
        />
      </div>
    </el-header>
    <el-main class="app-main">
      <div class="app-content">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>
