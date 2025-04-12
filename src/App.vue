<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link 
              to="/" 
              class="flex flex-row items-center px-2 py-2 text-gray-700 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 my-0 py-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21V9h6v12" />
              </svg>
              <p class="mt-1">Trang Chủ</p>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
</script>