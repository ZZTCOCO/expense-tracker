<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useBillStore } from '@/stores/bill'
import { getCategories } from '@/constants/category'
import type { Bill, BillType } from '@/types/bill'

const props = defineProps<{
  modelValue: boolean
  // 传入则编辑，不传 / null 则新增
  bill?: Bill | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const store = useBillStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)

interface FormState {
  type: BillType
  amount: number | undefined
  category: string
  date: string
  note: string
}

const form = reactive<FormState>({
  type: 'expense',
  amount: undefined,
  category: '',
  date: '',
  note: '',
})

// 受控的弹窗显隐
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

// 分类随类型切换
const categoryOptions = computed(() => getCategories(form.type))
watch(() => form.type, (t) => {
  if (!getCategories(t).includes(form.category)) {
    form.category = ''
  }
})

const rules: FormRules<FormState> = {
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    {
      validator: (_r, value, cb) =>
        !value || value <= 0 ? cb(new Error('金额必须大于 0')) : cb(),
      trigger: 'blur',
    },
  ],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
}

function today(): string {
  const now = new Date()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

// 弹窗打开时初始化表单
watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    if (props.bill) {
      form.type = props.bill.type
      form.amount = props.bill.amount
      form.category = props.bill.category
      form.date = props.bill.date
      form.note = props.bill.note ?? ''
    } else {
      form.type = 'expense'
      form.amount = undefined
      form.category = ''
      form.date = today()
      form.note = ''
    }
    formRef.value?.clearValidate()
  },
)

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid || !form.amount) return
    submitting.value = true
    try {
      if (props.bill?.id != null) {
        await store.updateBill({
          id: props.bill.id,
          type: form.type,
          amount: form.amount,
          category: form.category,
          date: form.date,
          note: form.note || undefined,
          createdAt: props.bill.createdAt,
        })
      } else {
        await store.addBill({
          type: form.type,
          amount: form.amount,
          category: form.category,
          date: form.date,
          note: form.note || undefined,
          createdAt: Date.now(),
        })
      }
      visible.value = false
    } finally {
      submitting.value = false
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="bill?.id != null ? '编辑账单' : '记一笔'"
    width="460px"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="64px">
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio-button value="expense">支出</el-radio-button>
          <el-radio-button value="income">收入</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number
          v-model="form.amount"
          :min="0"
          :precision="2"
          :step="1"
          controls-position="right"
          placeholder="请输入金额"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
          <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input
          v-model="form.note"
          type="textarea"
          :rows="2"
          maxlength="50"
          show-word-limit
          placeholder="选填"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>
