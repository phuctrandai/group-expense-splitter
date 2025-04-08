<template>
  <div class="settlement bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h1 class="text-3xl font-bold text-gray-800">Kết quả chia tiền nhóm {{ group?.name || 'Đang tải...' }}</h1>
        <button 
          @click="router.back()"
          class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </button>
      </div>

      <div v-if="group" class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Tổng quan</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p class="text-gray-600 mb-2">Tổng chi tiêu:</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(totalExpenses) }}</p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p class="text-gray-600 mb-2">Số tiền mỗi người phải đóng:</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(perPersonAmount) }}</p>
          </div>
        </div>
      </div>

      <div v-if="group" class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Chi tiết thanh toán</h2>
        <div class="grid gap-4">
          <div 
            v-for="member in group.members" 
            :key="member.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span class="text-blue-600 font-semibold">{{ member.name.charAt(0) }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{{ member.name }}</h3>
                  <p class="text-gray-600 text-sm mt-1">
                    Đã chi: {{ formatCurrency(getMemberExpenses(member.id)) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p 
                  :class="{
                    'text-green-600': getMemberBalance(member.id) > 0,
                    'text-red-600': getMemberBalance(member.id) < 0
                  }"
                  class="font-semibold text-lg"
                >
                  {{ formatCurrency(getMemberBalance(member.id)) }}
                </p>
                <p 
                  :class="{
                    'text-green-600': getMemberBalance(member.id) > 0,
                    'text-red-600': getMemberBalance(member.id) < 0
                  }"
                  class="text-sm"
                >
                  {{ getMemberBalance(member.id) > 0 ? 'Cần thu' : 'Cần trả' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="group" class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Hướng dẫn thanh toán</h2>
        <div class="space-y-4">
          <div 
            v-for="(payment, index) in paymentInstructions" 
            :key="index"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span class="text-blue-600 font-semibold">{{ index + 1 }}</span>
              </div>
              <p class="text-gray-800">
                <span class="font-semibold text-red-600">{{ payment.from }}</span>
                cần trả
                <span class="font-semibold text-green-600">{{ payment.to }}</span>
                số tiền
                <span class="font-semibold text-gray-800">{{ formatCurrency(payment.amount) }}</span>
              </p>
            </div>
          </div>

          <div v-if="paymentInstructions.length === 0" class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Không cần thanh toán thêm</p>
            <p class="text-sm mt-2">Mọi người đã thanh toán đủ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const group = ref(null)

onMounted(() => {
  const groupId = route.params.id
  groupStore.setCurrentGroup(groupId)
  group.value = groupStore.getCurrentGroup
})

const totalExpenses = computed(() => {
  if (!group.value) return 0
  return group.value.expenses.reduce((sum, expense) => sum + expense.amount, 0)
})

const perPersonAmount = computed(() => {
  if (!group.value || group.value.members.length === 0) return 0
  return totalExpenses.value / group.value.members.length
})

const getMemberExpenses = (memberId) => {
  if (!group.value) return 0
  return group.value.expenses
    .filter(expense => expense.paidBy === memberId)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

const getMemberBalance = (memberId) => {
  const paid = getMemberExpenses(memberId)
  return paid - perPersonAmount.value
}

const paymentInstructions = computed(() => {
  if (!group.value) return []
  
  const balances = group.value.members.map(member => ({
    id: member.id,
    name: member.name,
    balance: getMemberBalance(member.id)
  }))

  const debtors = balances.filter(b => b.balance < 0)
  const creditors = balances.filter(b => b.balance > 0)
  
  const instructions = []
  let debtorIndex = 0
  let creditorIndex = 0

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    
    const amount = Math.min(-debtor.balance, creditor.balance)
    
    if (amount > 0) {
      instructions.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount
      })
    }

    debtor.balance += amount
    creditor.balance -= amount

    if (debtor.balance === 0) debtorIndex++
    if (creditor.balance === 0) creditorIndex++
  }

  return instructions
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
</script>

<style scoped>
.settlement {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style> 