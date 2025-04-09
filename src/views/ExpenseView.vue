<template>
  <div class="expenses bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-lg shadow-sm space-y-4 sm:space-y-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">Chi tiêu nhóm {{ group?.name || 'Đang tải...' }}</h1>
        <div class="flex flex-row justify-between sm:justify-end sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="navigateToSettlement"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-[48%] sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Xem kết quả
          </button>
          <button 
            @click="router.back()"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center w-[48%] sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>

      <div v-if="group" class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">{{ editingExpense ? 'Chỉnh sửa chi tiêu' : 'Thêm chi tiêu mới' }}</h2>
        <form @submit.prevent="editingExpense ? saveEdit() : addExpense()" class="space-y-6">
          <div>
            <label class="block mb-2 text-gray-700 font-medium">Danh mục:</label>
            <input 
              :value="editingExpense ? editingExpense.category : newExpense.category"
              @input="e => editingExpense ? editingExpense.category = e.target.value : newExpense.category = e.target.value"
              type="text" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="Nhập danh mục chi tiêu"
            >
          </div>
          <div>
            <label class="block mb-2 text-gray-700 font-medium">Số tiền:</label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-500">₫</span>
              <input 
                :value="editingExpense ? editingExpense.amount : newExpense.amount"
                @input="handleAmountInput"
                type="text" 
                class="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                placeholder="0"
              >
            </div>
          </div>
          <div>
            <label class="block mb-2 text-gray-700 font-medium">Người chi:</label>
            <select 
              :value="editingExpense ? editingExpense.paidBy : newExpense.paidBy"
              @input="e => editingExpense ? editingExpense.paidBy = e.target.value : newExpense.paidBy = e.target.value"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Chọn thành viên</option>
              <option 
                v-for="member in group.members" 
                :key="member.id" 
                :value="member.id"
              >
                {{ member.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block mb-2 text-gray-700 font-medium">Chia cho:</label>
            <div class="space-y-3 border border-gray-200 rounded-lg p-4">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="selectAll" 
                  :checked="isAllMembersSelected"
                  @change="toggleAllMembers"
                  class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                >
                <label for="selectAll" class="ml-2 font-medium text-gray-700">Tất cả mọi người</label>
              </div>
              
              <div class="mt-3 space-y-2 pl-6">
                <div 
                  v-for="member in group.members" 
                  :key="member.id"
                  class="flex items-center"
                >
                  <input 
                    type="checkbox" 
                    :id="`member-${member.id}`" 
                    v-model="selectedMembers"
                    :value="member.id"
                    class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  >
                  <label :for="`member-${member.id}`" class="ml-2 text-gray-700">{{ member.name }}</label>
                </div>
              </div>
              
              <div v-if="selectedMembers.length === 0" class="pl-6 text-red-500 text-sm">
                Vui lòng chọn ít nhất một thành viên
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <button 
              type="submit"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              :disabled="selectedMembers.length === 0"
              :class="{'opacity-50 cursor-not-allowed': selectedMembers.length === 0}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ editingExpense ? 'Lưu thay đổi' : 'Thêm chi tiêu' }}
            </button>
            <button 
              v-if="editingExpense"
              type="button"
              @click="cancelEdit"
              class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy
            </button>
          </div>
        </form>
      </div>

      <div v-if="group" class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Danh sách chi tiêu</h2>
        <div class="grid gap-4">
          <div 
            v-for="expense in group.expenses" 
            :key="expense.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span class="text-blue-600 font-semibold">{{ getMemberName(expense.paidBy).charAt(0) }}</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ expense.category }}</h3>
                    <p class="text-sm text-gray-500">Trả bởi: {{ getMemberName(expense.paidBy) }}</p>
                  </div>
                </div>
                <div class="ml-14">
                  <p class="text-lg font-semibold text-green-600">{{ formatCurrency(expense.amount) }}</p>
                  <div class="mt-2">
                    <p class="text-sm text-gray-600">Chia cho:</p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span 
                        v-for="memberId in expense.splitBetween" 
                        :key="memberId"
                        class="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {{ getMemberName(memberId) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-row justify-between sm:justify-end w-full sm:w-auto sm:ml-4">
                <button 
                  @click="removeExpense(expense.id)"
                  class="text-red-600 hover:text-red-800 transition-colors flex items-center justify-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
                <button 
                  @click="startEdit(expense)"
                  class="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center text-sm ml-8"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="group.expenses.length === 0" class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Chưa có khoản chi tiêu nào</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const group = ref(null)
const selectedMembers = ref([])
const newExpense = ref({
  category: '',
  amount: '',
  paidBy: ''
})
const editingExpense = ref(null)

onMounted(() => {
  const groupId = route.params.id
  groupStore.setCurrentGroup(groupId)
  group.value = groupStore.getCurrentGroup
})

const isAllMembersSelected = computed(() => {
  if (!group.value || !group.value.members || group.value.members.length === 0) return false
  return selectedMembers.value.length === group.value.members.length
})

const toggleAllMembers = (e) => {
  if (e.target.checked) {
    selectedMembers.value = group.value.members.map(member => member.id)
  } else {
    selectedMembers.value = []
  }
}

const formatInputAmount = (value) => {
  // Loại bỏ tất cả ký tự không phải số
  const number = value.replace(/[^\d]/g, '')
  // Chuyển đổi thành số và định dạng lại
  return new Intl.NumberFormat('vi-VN').format(number)
}

const handleAmountInput = (event) => {
  const formattedValue = formatInputAmount(event.target.value)
  if (editingExpense.value) {
    editingExpense.value.amount = formattedValue
  } else {
    newExpense.value.amount = formattedValue
  }
}

const startEdit = (expense) => {
  editingExpense.value = {
    ...expense,
    amount: formatInputAmount(expense.amount.toString())
  }
  // Thiết lập lại danh sách thành viên được chọn
  selectedMembers.value = expense.splitBetween || []
}

const cancelEdit = () => {
  editingExpense.value = null
  selectedMembers.value = []
}

const saveEdit = () => {
  if (!editingExpense.value || !group.value) return
  if (selectedMembers.value.length === 0) return
  
  const amount = parseInt(editingExpense.value.amount.replace(/[^\d]/g, ''))
  const updatedExpense = {
    category: editingExpense.value.category,
    amount: amount,
    paidBy: editingExpense.value.paidBy,
    splitBetween: [...selectedMembers.value]
  }
  
  try {
    groupStore.updateExpense(group.value.id, editingExpense.value.id, updatedExpense)
    editingExpense.value = null
    selectedMembers.value = []
    group.value = groupStore.getCurrentGroup
  } catch (error) {
    console.error('Error updating expense:', error)
  }
}

const addExpense = () => {
  if (selectedMembers.value.length === 0) return
  
  // Chuyển đổi chuỗi số có định dạng thành số
  const amount = parseInt(newExpense.value.amount.replace(/[^\d]/g, ''))
  const expense = {
    id: Date.now().toString(),
    category: newExpense.value.category,
    amount: amount,
    paidBy: newExpense.value.paidBy,
    splitBetween: [...selectedMembers.value]
  }
  
  groupStore.addExpense(group.value.id, expense)
  newExpense.value = {
    category: '',
    amount: '',
    paidBy: ''
  }
  selectedMembers.value = []
  group.value = groupStore.getCurrentGroup
}

const removeExpense = (expenseId) => {
  groupStore.removeExpense(group.value.id, expenseId)
  group.value = groupStore.getCurrentGroup
}

const getMemberName = (memberId) => {
  const member = group.value.members.find(m => m.id === memberId)
  return member ? member.name : 'Không xác định'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const navigateToSettlement = () => {
  if (group.value) {
    router.push(`/group/${group.value.id}/settlement`)
  }
}

// Export các hàm cần thiết
defineExpose({
  startEdit,
  cancelEdit,
  saveEdit,
  addExpense,
  removeExpense,
  handleAmountInput,
  toggleAllMembers,
  navigateToSettlement
})
</script>

<style scoped>
.expenses {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>