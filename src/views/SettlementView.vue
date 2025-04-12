<template>
  <div class="settlement bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-lg shadow-sm space-y-4 sm:space-y-0">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">Chia tiền nhóm: {{ group?.name
          || 'Đang tải...' }}</h1>
        <div class="flex flex-row justify-between sm:justify-end sm:space-x-3 w-full sm:w-auto">
          <button @click="navigateToExpenses"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-[48%] sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm chi tiêu
          </button>
          <button @click="navigateToGroup"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center w-[48%] sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>

      <div v-if="group" class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Tổng quan</h2>
        <div class="grid gap-4" :class="{'md:grid-cols-2': isEqualParticipation}">
          <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p class="text-gray-600 mb-2">Tổng chi tiêu:</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(totalExpenses) }}</p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg bg-gray-50" v-if="isEqualParticipation">
            <p class="text-gray-600 mb-2">Số tiền mỗi người phải đóng:</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(perPersonAmount) }}</p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg bg-gray-50" v-else>
            <p class="text-gray-600 mb-2">Chi tiết tham gia:</p>
            <p class="text-md text-gray-800">Mỗi người đóng góp khác nhau tùy theo khoản chi tham gia</p>
          </div>
        </div>
      </div>

      <div v-if="group" class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Chi tiết thanh toán</h2>
        <div class="grid gap-4">
          <div v-for="member in group.members" :key="member.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span class="text-blue-600 font-semibold">{{ member.name.charAt(0) }}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">{{ member.name }}</h3>
                <div class="text-gray-600 text-sm mt-1">
                  <p>Đã chi: {{ formatCurrency(getMemberExpenses(member.id)) }}</p>
                  <ul class="ml-4">
                    <li v-for="expense in getMemberPaidExpenses(member.id)" :key="expense.id">
                      <details>
                        <summary class="text-gray-500 text-xs cursor-pointer">{{ expense.category }}: {{
                          formatCurrency(expense.amount) }}</summary>
                      </details>
                    </li>
                  </ul>
                  <p class="mt-2">Cần trả: {{ formatCurrency(getMemberParticipationExpenses(member.id)) }}</p>
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-space-between items-center w-full">
              <div class="text-left w-50">
                <p :class="{
                  'text-green-600': getMemberBalance(member.id) > 0,
                  'text-red-600': getMemberBalance(member.id) < 0,
                  'text-gray-600': getMemberBalance(member.id) === 0
                }" class="text-sm">
                  <span v-if="getMemberBalance(member.id) > 0">Cần thu</span>
                  <span v-else-if="getMemberBalance(member.id) < 0">Cần trả</span>
                  <span v-else>Đã cân bằng</span>
                </p>
              </div>
              <div class="text-right w-50">
                <p :class="{
                  'text-green-600': getMemberBalance(member.id) > 0,
                  'text-red-600': getMemberBalance(member.id) < 0,
                  'text-gray-600': getMemberBalance(member.id) === 0
                }" class="font-semibold text-lg">
                  {{ formatCurrency(getMemberBalance(member.id)) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="group" class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Hướng dẫn thanh toán</h2>
        <div class="space-y-4">
          <div v-for="(payment, index) in paymentInstructions" :key="index"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const navigateToExpenses = () => {
  if (group.value) {
    router.push(`/group/${group.value.id}/expenses`)
  }
}

const navigateToGroup = () => {
  router.push(`/group/${group.value.id}`)
}

const totalExpenses = computed(() => {
  if (!group.value) return 0
  return group.value.expenses.reduce((sum, expense) => sum + expense.amount, 0)
})

// Kiểm tra xem tất cả thành viên có tham gia vào tất cả khoản chi không
const isEqualParticipation = computed(() => {
  if (!group.value || group.value.expenses.length === 0 || group.value.members.length === 0) return true
  
  // Kiểm tra nếu tất cả các khoản chi đều có tất cả thành viên tham gia
  return group.value.expenses.every(expense => {
    // Nếu không có splitBetween hoặc rỗng, coi như không tham gia
    if (!expense.splitBetween || expense.splitBetween.length === 0) return false
    
    // Kiểm tra xem tất cả thành viên đều tham gia vào khoản chi này
    return group.value.members.every(member => 
      expense.splitBetween.includes(member.id)
    )
  })
})

const perPersonAmount = computed(() => {
  if (!group.value || group.value.members.length === 0) return 0
  return totalExpenses.value / group.value.members.length
})

const getMemberParticipationExpenses = (memberId) => {
  if (!group.value) return 0
  
  let totalShare = 0
  
  group.value.expenses.forEach(expense => {
    if (expense.splitBetween && expense.splitBetween.includes(memberId)) {
      const perPersonShare = expense.amount / expense.splitBetween.length
      totalShare += perPersonShare
    }
  })
  
  return totalShare
}

const getMemberExpenses = (memberId) => {
  if (!group.value) return 0
  return group.value.expenses
    .filter(expense => expense.paidBy === memberId)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

const getMemberPaidExpenses = (memberId) => {
  if (!group.value) return []
  return group.value.expenses.filter(expense => expense.paidBy === memberId)
}

const getMemberBalance = (memberId) => {
  const paid = getMemberExpenses(memberId)
  const owes = getMemberParticipationExpenses(memberId)
  return paid - owes
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
  
  debtors.sort((a, b) => a.balance - b.balance)
  creditors.sort((a, b) => b.balance - a.balance)
  
  const instructions = []
  let debtorIndex = 0
  let creditorIndex = 0

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance)
    
    if (amount > 0) {
      instructions.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount)
      })
    }

    debtor.balance += amount
    creditor.balance -= amount

    if (Math.abs(debtor.balance) < 1) debtorIndex++
    if (Math.abs(creditor.balance) < 1) creditorIndex++
  }

  return instructions
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
</script>

<style scoped>
.settlement {
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}
</style>