<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tag in availableTags"
        :key="tag.id"
        @click="toggleTag(tag)"
        type="button"
        :title="getTagTooltip(tag)"
        :class="[
          'inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border transition-colors duration-200',
          isSelected(tag) 
            ? 'border-blue-500 text-blue-700 shadow-sm' 
            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
        ]"
        :style="getTagStyle(tag)"
      >
        <span 
          v-if="tag.cssColor" 
          class="inline-block w-2 h-2 rounded-full mr-2"
          :style="{ backgroundColor: tag.cssColor }"
        ></span>
        {{ tag.name }}
        <svg 
          v-if="isSelected(tag)"
          class="ml-2 h-4 w-4" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div v-if="availableTags.length === 0" class="text-gray-500 text-sm py-2">
        No tags available
      </div>
    </div>
    
    <div v-if="selectedTags.length > 0" class="mt-2 text-xs text-gray-600">
      {{ selectedTags.length }} tag{{ selectedTags.length !== 1 ? 's' : '' }} selected
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedTags = computed(() => {
  return props.tags.filter(tag => props.modelValue.includes(tag.id))
})

const availableTags = computed(() => {
  return props.tags
})

const isSelected = (tag) => {
  return props.modelValue.includes(tag.id)
}

const toggleTag = (tag) => {
  const currentSelection = [...props.modelValue]
  const index = currentSelection.indexOf(tag.id)
  
  if (index > -1) {
    currentSelection.splice(index, 1)
  } else {
    currentSelection.push(tag.id)
  }
  
  emit('update:modelValue', currentSelection)
}

const getTagStyle = (tag) => {
  if (tag.cssColor && isSelected(tag)) {
    return {
      backgroundColor: tag.cssColor + '20',
      borderColor: tag.cssColor,
      color: tag.cssColor
    }
  }
  return {}
}

const getTagTooltip = (tag) => {
  // Priority order for descriptions:
  // 1. API definition (from TaxonWorks)
  // 2. Our hardcoded description (for enhancement)
  // 3. Basic fallback
  
  if (tag.description && tag.description !== tag.name) {
    // We have a custom description from our config
    return `${tag.name}: ${tag.description}`
  } else if (tag.definition) {
    // We have an API definition
    return `${tag.name}: ${tag.definition}`
  } else {
    // Fallback for unknown tags
    return `${tag.name}: Specimen tag`
  }
}
</script>