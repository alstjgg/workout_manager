<template>
  <BaseModal
    v-model="modalVisible"
    :title="modalTitle"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input 
          type="date" 
          v-model="formData.date"
          :max="todayDate"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
        <input 
          type="number" 
          step="0.1"
          v-model.number="formData.weight"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          :placeholder="weightPlaceholder"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Muscle Mass (kg)</label>
        <input 
          type="number" 
          step="0.1"
          v-model.number="formData.muscleMass"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          :placeholder="musclePlaceholder"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Body Fat (%)</label>
        <input 
          type="number" 
          step="0.1"
          min="5"
          max="50"
          v-model.number="formData.bodyFat"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          :placeholder="bodyFatPlaceholder"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Visceral Fat Level</label>
        <input 
          type="number" 
          min="1"
          max="30"
          v-model.number="formData.visceralFat"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          :placeholder="visceralPlaceholder"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          v-model="formData.notes"
          placeholder="How are you feeling? Any observations?"
          rows="2"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div class="flex space-x-3 mt-6">
        <button 
          type="button"
          @click="handleClose"
          class="flex-1 py-3 rounded-lg font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit"
          :disabled="!isFormValid"
          :class="[
            'flex-1 py-3 rounded-lg font-semibold text-white transition-opacity',
            isFormValid ? buttonColor : 'bg-gray-400 cursor-not-allowed'
          ]"
        >
          {{ submitText }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

// Modal visibility
const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Form data
const formData = ref({
  date: new Date().toISOString().split('T')[0],
  weight: null,
  muscleMass: null,
  bodyFat: null,
  visceralFat: null,
  notes: ''
})

// Reset form when modal opens
watch(modalVisible, (isVisible) => {
  if (isVisible) {
    resetForm()
  }
})

// Computed properties
const todayDate = computed(() => new Date().toISOString().split('T')[0])

const modalTitle = computed(() => 
  `Update Body Composition - User ${props.currentUser}`
)

const submitText = computed(() => 'Save Measurement')

const buttonColor = computed(() => 
  props.currentUser === 'A' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-pink-500 hover:bg-pink-600'
)

const userProfile = computed(() => userStore.userProfiles[props.currentUser])

const weightPlaceholder = computed(() => 
  props.currentUser === 'A' ? '48.3' : '65.2'
)

const musclePlaceholder = computed(() => 
  props.currentUser === 'A' ? '22.1' : '26.8'
)

const bodyFatPlaceholder = computed(() => 
  props.currentUser === 'A' ? '18.5' : '27.2'
)

const visceralPlaceholder = computed(() => 
  props.currentUser === 'A' ? '2' : '4'
)

const isFormValid = computed(() => {
  return formData.value.date && 
         formData.value.weight && formData.value.weight > 0 &&
         formData.value.muscleMass && formData.value.muscleMass > 0 &&
         formData.value.bodyFat && formData.value.bodyFat > 0 &&
         formData.value.visceralFat && formData.value.visceralFat > 0
})

// Methods
const resetForm = () => {
  formData.value = {
    date: new Date().toISOString().split('T')[0],
    weight: null,
    muscleMass: null,
    bodyFat: null,
    visceralFat: null,
    notes: ''
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  const measurementData = {
    date: formData.value.date,
    weight: formData.value.weight,
    skeletalMuscleMass: formData.value.muscleMass,
    bodyFatPercentage: formData.value.bodyFat,
    visceralFat: formData.value.visceralFat,
    notes: formData.value.notes
  }
  
  // Add to user store
  userStore.addBodyCompositionEntry(measurementData)
  
  // Emit event for parent component
  emit('submit', measurementData)
  
  // Close modal
  handleClose()
  
  console.log(`📊 Body composition saved for User ${props.currentUser}:`, measurementData)
}

const handleClose = () => {
  modalVisible.value = false
  resetForm()
}
</script>