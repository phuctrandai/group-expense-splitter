<template>
  <div class="group bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-lg shadow-sm space-y-4 md:space-y-0">
        <h1 class="text-xl md:text-2xl font-bold text-gray-800">{{ group?.name || 'Đang tải...' }}</h1>
        <div class="flex flex-row justify-between md:justify-end md:space-x-4 w-full md:w-auto">
          <button 
            @click="navigateToExpenses"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-[48%] md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm chi tiêu
          </button>
          <button 
            @click="navigateToSettlement"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center w-[48%] md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Xem kết quả
          </button>
        </div>
      </div>

      <div v-if="group" class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">{{ editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên' }}</h2>
        <form @submit.prevent="editingMember ? saveMemberEdit() : addMember()" class="space-y-6">
          <div>
            <label class="block mb-2 text-gray-700 font-medium">Tên thành viên:</label>
            <input 
              :value="editingMember ? editingMember.name : newMember.name"
              @input="e => editingMember ? editingMember.name = e.target.value : newMember.name = e.target.value"
              type="text" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="Nhập tên thành viên"
            >
          </div>
          <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <button 
              type="submit"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ editingMember ? 'Lưu thay đổi' : 'Thêm thành viên' }}
            </button>
            <button 
              v-if="editingMember"
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
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Danh sách thành viên</h2>
        <div class="grid gap-4">
          <div 
            v-for="member in groupStore.getActiveMembers(group.id)" 
            :key="member.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span class="text-blue-600 font-semibold">{{ member.name.charAt(0) }}</span>
              </div>
              <span class="font-semibold text-gray-800">{{ member.name }}</span>
            </div>
            <div class="flex flex-row justify-between sm:justify-end w-full sm:w-auto space-x-8">
              <button 
                @click="showRemoveMemberPopup(member.id)"
                class="bg-gray-100 rounded-lg text-red-600 hover:text-red-800 transition-colors flex items-center justify-center text-sm sm:w-[60px] py-2 w-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa
              </button>
              <button 
                @click="startEdit(member)"
                class="bg-gray-100 rounded-lg text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center text-sm sm:w-[60px] w-50 py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Sửa
              </button>
            </div>
          </div>

          <div v-if="groupStore.getActiveMembers(group.id).length === 0" class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>Chưa có thành viên nào</p>
            <p class="text-sm mt-2">Thêm thành viên để bắt đầu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ConfirmPopup
    :visible="isConfirmPopupVisible"
    message="Bạn có chắc chắn muốn xóa thành viên này không?"
    @confirm="confirmRemoveMember"
    @cancel="cancelRemoveMember"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'
import ConfirmPopup from '../components/ConfirmPopup.vue';

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const group = ref(null)
const newMember = ref({
  name: ''
})
const editingMember = ref(null)
const isConfirmPopupVisible = ref(false);
const memberToRemove = ref(null);

onMounted(() => {
  const groupId = route.params.id
  groupStore.setCurrentGroup(groupId)
  group.value = groupStore.getCurrentGroup
  console.log('Store actions:', Object.keys(groupStore))
})

const addMember = () => {
  groupStore.addMember(group.value.id, newMember.value.name)
  newMember.value.name = ''
}

const startEdit = (member) => {
  editingMember.value = { ...member }
}

const cancelEdit = () => {
  editingMember.value = null
}

const saveMemberEdit = () => {
  if (!editingMember.value || !group.value) return
  
  try {
    console.log('Updating member:', {
      groupId: group.value.id,
      memberId: editingMember.value.id,
      name: editingMember.value.name
    })
    
    if (typeof groupStore.updateMember !== 'function') {
      console.error('updateMember is not a function:', groupStore)
      return
    }

    groupStore.updateMember(
      group.value.id,
      editingMember.value.id,
      { name: editingMember.value.name }
    )
    editingMember.value = null
    group.value = groupStore.getCurrentGroup
  } catch (error) {
    console.error('Error updating member:', error)
  }
}

const showRemoveMemberPopup = (memberId) => {
  memberToRemove.value = memberId;
  isConfirmPopupVisible.value = true;
};

const confirmRemoveMember = () => {
  if (memberToRemove.value) {
    groupStore.removeMember(group.value.id, memberToRemove.value);
  }
  isConfirmPopupVisible.value = false;
  memberToRemove.value = null;
};

const cancelRemoveMember = () => {
  isConfirmPopupVisible.value = false;
  memberToRemove.value = null;
};

const navigateToExpenses = () => {
  router.push(`/group/${group.value.id}/expenses`)
}

const navigateToSettlement = () => {
  router.push(`/group/${group.value.id}/settlement`)
}

defineExpose({
  startEdit,
  cancelEdit,
  saveMemberEdit,
  addMember,
  showRemoveMemberPopup,
  confirmRemoveMember,
  cancelRemoveMember,
  navigateToExpenses,
  navigateToSettlement
})
</script>

<style scoped>
.group {
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}
</style>