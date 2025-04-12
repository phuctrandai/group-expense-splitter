<template>
  <div class="home bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Group Expense Splitter</h1>
        <p class="text-gray-600 text-sm">Quản lý chi tiêu nhóm một cách dễ dàng và hiệu quả</p>
      </div>

      <div class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Tạo nhóm mới</h2>
        <form @submit.prevent="createGroup" class="space-y-6">
          <div>
            <label class="block mb-2 text-gray-700 font-medium">Tên nhóm:</label>
            <input v-model="newGroup.name" type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required placeholder="Nhập tên nhóm của bạn">
          </div>
          <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <button type="submit"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tạo nhóm
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Các nhóm của bạn</h2>
        <div class="grid gap-4">
          <div v-for="group in groups" :key="group.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            @click="navigateToGroup(group.id)">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold text-gray-800">{{ group.name }}</h3>
                <p class="text-gray-600 text-sm mt-1">
                  {{ group.members.length }} thành viên
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div v-if="groups.length === 0" class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>Chưa có nhóm nào</p>
            <p class="text-sm mt-2">Tạo nhóm mới để bắt đầu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'

const router = useRouter()
const groupStore = useGroupStore()
const groups = ref([])
const newGroup = ref({
  name: ''
})

onMounted(() => {
  groups.value = groupStore.groups
})

const createGroup = () => {
  const group = groupStore.createGroup(newGroup.value.name)
  newGroup.value.name = ''
  navigateToGroup(group.id)
}

const navigateToGroup = (groupId) => {
  router.push(`/group/${groupId}`)
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}
</style> 