<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoryStore } from '@/stores/category'
import type { BillType } from '@/types/bill'

const store = useCategoryStore()

const newName = ref<Record<BillType, string>>({ expense: '', income: '' })

const sections: { type: BillType; label: string }[] = [
  { type: 'expense', label: '支出分类' },
  { type: 'income', label: '收入分类' },
]

async function add(type: BillType) {
  const name = newName.value[type].trim()
  if (!name) return
  if (store.byType(type).some((c) => c.name === name)) {
    ElMessage.warning('该分类已存在')
    return
  }
  await store.addCategory(type, name)
  newName.value[type] = ''
  ElMessage.success('已添加')
}

async function remove(id: number, name: string) {
  await store.removeCategory(id)
  ElMessage.success(`已删除「${name}」`)
}
</script>

<template>
  <div class="view">
    <h1>分类管理</h1>
    <p class="hint">新增或删除收支分类；删除不影响已有账单。</p>

    <el-card v-for="sec in sections" :key="sec.type" class="cat-card">
      <h2>{{ sec.label }}</h2>
      <div class="cat-tags">
        <template v-if="store.byType(sec.type).length">
          <el-tag
            v-for="c in store.byType(sec.type)"
            :key="c.id"
            closable
            :type="sec.type === 'income' ? 'success' : 'danger'"
            effect="light"
            @close="remove(c.id!, c.name)"
          >
            {{ c.name }}
          </el-tag>
        </template>
        <span v-else class="empty">暂无分类</span>
      </div>
      <div class="cat-add">
        <el-input
          v-model="newName[sec.type]"
          placeholder="新分类名"
          maxlength="10"
          style="width: 200px"
          @keyup.enter="add(sec.type)"
        />
        <el-button type="primary" @click="add(sec.type)">添加</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.hint {
  color: var(--app-text-dim);
  margin: -8px 0 16px;
  font-size: 14px;
}

.cat-card {
  margin-bottom: 16px;
}

.cat-card h2 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
}

.cat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  min-height: 28px;
  align-items: center;
}

.cat-tags .empty {
  color: var(--app-text-dim);
  font-size: 14px;
}

.cat-add {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .cat-add {
    flex-wrap: wrap;
  }
}
</style>
