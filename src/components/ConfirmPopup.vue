<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-lg font-semibold mb-4">{{ message }}</h2>
      <div class="flex justify-end space-x-4">
        <button @click="onCancel" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Hủy</button>
        <button @click="onConfirm" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Xác nhận</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: 'Bạn có chắc chắn?'
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    onConfirm() {
      this.$emit('confirm');
    },
    onCancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.fixed {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>