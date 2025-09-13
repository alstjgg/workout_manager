<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>
      
      <div class="mb-4">
        <slot></slot>
      </div>
      
      <div class="flex space-x-3">
        <button 
          v-if="showCancel"
          @click="$emit('cancel')"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button 
          v-if="showConfirm"
          @click="$emit('confirm')"
          :class="confirmButtonClass"
          class="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  currentUser: {
    type: String,
    default: 'A',
    validator: value => ['A', 'B'].includes(value)
  }
})

// Emits
defineEmits(['close', 'cancel', 'confirm'])

// Computed
const confirmButtonClass = computed(() => {
  const baseClass = 'text-white'
  const userColor = props.currentUser === 'A' 
    ? 'bg-purple-500 hover:bg-purple-600' 
    : 'bg-pink-500 hover:bg-pink-600'
  return `${baseClass} ${userColor}`
})
</script>
