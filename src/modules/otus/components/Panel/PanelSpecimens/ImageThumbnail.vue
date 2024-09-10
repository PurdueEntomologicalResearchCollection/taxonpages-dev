<template>
  <VCard class="mb-4">
    <ClientOnly>
      <img
          v-if="imageInfo"
          :src="imageInfo.thumb"
          alt="Collection thumbnail"
          class="object-cover"
      />
      <div v-if="errorMessage" class="text-red-500">
        {{ errorMessage }}
      </div>
    </ClientOnly>
  </VCard>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useOtuPageRequest } from "@/modules/otus/helpers/useOtuPageRequest.js"
import TaxonWorks from "@/modules/otus/services/TaxonWorks.js"

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
})

// An image description from TaxonWorks, with thumbnail, various resolutions, etc.
const imageInfo = ref(null)
const isLoading = ref(false)
const errorMessage = ref(null)

watch(
    () => props.imageUrl,
    async () => {
      isLoading.value = true
      errorMessage.value = false
      try {
        const response = await useOtuPageRequest('component:thumbnail', () =>
            TaxonWorks.getImageFromUrl(props.imageUrl)
        )
        imageInfo.value = response.data
      }
      catch (e) {
        console.error(e)
        errorMessage.value = `Error loading image: ${e}`
      }
      finally {
        isLoading.value = false
      }
    },
    {immediate: true}
  )
</script>