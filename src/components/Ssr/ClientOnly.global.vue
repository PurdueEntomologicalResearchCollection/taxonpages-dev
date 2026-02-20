<template>
  <slot v-if="show"></slot>
  <div v-else aria-hidden="true"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const show = ref(false)

onMounted(() => {
  show.value = true
})
</script>
