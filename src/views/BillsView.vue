<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useBillStore } from '@/stores/bill'
import BillTable from '@/components/BillTable.vue'
import BillFormDialog from '@/components/BillFormDialog.vue'
import type { Bill } from '@/types/bill'

const store = useBillStore()

// 月份筛选：null 表示全部
const selectedMonth = ref<string | null>(null)

const filteredBills = computed(() => {
  const month = selectedMonth.value
  if (!month) return store.bills
  return store.bills.filter((b) => b.date.startsWith(month))
})

// 编辑弹窗
const dialogVisible = ref(false)
const editingBill = ref<Bill | null>(null)

function openAdd() {
  editingBill.value = null
  dialogVisible.value = true
}

function openEdit(bill: Bill) {
  editingBill.value = bill
  dialogVisible.value = true
}

async function confirmRemove(bill: Bill) {
  try {
    await ElMessageBox.confirm('确定删除这条账单吗？', '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return // 用户取消
  }
  if (bill.id != null) {
    await store.removeBill(bill.id)
    ElMessage.success('已删除')
  }
}
</script>

<template>
  <div class="view">
    <div class="bills-header">
      <h1>账单列表</h1>
      <div class="bills-actions">
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          placeholder="全部月份"
          value-format="YYYY-MM"
          clearable
          style="width: 180px"
        />
        <el-button type="primary" @click="openAdd">记一笔</el-button>
      </div>
    </div>
    <BillTable :bills="filteredBills" @edit="openEdit" @remove="confirmRemove" />
    <BillFormDialog v-model="dialogVisible" :bill="editingBill" />
  </div>
</template>

<style scoped>
.bills-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.bills-header h1 {
  margin: 0;
}

.bills-actions {
  display: flex;
  gap: 12px;
}
</style>
