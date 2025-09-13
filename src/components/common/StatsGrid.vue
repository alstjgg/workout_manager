<template>
  <div :style="statsGridStyles">
    <div 
      v-for="stat in stats"
      :key="stat.id"
      :style="statCardStyles"
    >
      <div :style="getStatNumberStyle()">{{ stat.value }}</div>
      <div :style="statCardLabelStyles">{{ stat.label }}</div>
      <div v-if="stat.icon" :style="statIconStyles">{{ stat.icon }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (stats) => {
      return stats.every(stat => 
        stat.hasOwnProperty('id') && 
        stat.hasOwnProperty('value') && 
        stat.hasOwnProperty('label')
      )
    }
  },
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Computed styles
const statsGridStyles = computed(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '24px'
}))

const statCardStyles = computed(() => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  padding: '24px',
  textAlign: 'center',
  border: '1px solid #f3f4f6'
}))

const statCardLabelStyles = computed(() => ({
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '500'
}))

const statIconStyles = computed(() => ({
  fontSize: '24px',
  marginTop: '8px'
}))

const getStatNumberStyle = () => ({
  fontSize: '36px',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777'
})
</script>
