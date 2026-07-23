<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
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
