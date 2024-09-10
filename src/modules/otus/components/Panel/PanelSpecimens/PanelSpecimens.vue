<template>
  <VCard>
    <ClientOnly>
      <VSpinner
          v-if="isLoading"
          logo-class="w-8 h-8"
          legend=""
      />
    </ClientOnly>
    <VCardHeader class="flex justify-between">
      <h2 class="text-md">
        In the Collection
        <span v-if="Array.isArray(inventoryDWC)"> [{{ inventoryDWC.length }}]</span>
      </h2>
      <PanelDropdown panel-key="panel:specimens" />
    </VCardHeader>
    <VCardContent class="text-sm">
      <p v-if="typeof inventoryDWC === 'string'" v-html="inventoryDWC"/>
      <ul v-else class="tree ml-2">
        <li v-for="specimen in inventoryDWC" :key="specimen.id" class="mt-1">
          <SpecimenSummary :specimen="specimen" :otu-id="otuId"/>
          <div v-if="specimen.associatedMedia" class="ml-2 flex flex-row gap-4">
            <ImageThumbnail
                v-for="imageUrl in specimen.associatedMedia.split('|')"
                :imageUrl="imageUrl.trim()"
            />
          </div>
        </li>
      </ul>
    </VCardContent>
  </VCard>
</template>

<script setup>
import { ref, watch } from 'vue'
import PanelDropdown from '../PanelDropdown.vue'
import { useOtuPageRequest } from "@/modules/otus/helpers/useOtuPageRequest.js"
import TaxonWorks from "@/modules/otus/services/TaxonWorks.js"
import SpecimenSummary from "@/modules/otus/components/Panel/PanelSpecimens/SpecimenSummary.vue"
import ImageThumbnail from "@/modules/otus/components/Panel/PanelSpecimens/ImageThumbnail.vue"

const props = defineProps({
  otuId: {
    type: [String, Number],
    required: true
  }
})

const inventoryDWC = ref("Loading...")
const isLoading = ref(false)

watch(
    () => props.otuId,
    async () => {
      if (!props.otuId) {
        inventoryDWC.value = 'No OTU specified.'
        return
      }

      isLoading.value = true
      useOtuPageRequest('panel:specimens', () =>
        TaxonWorks.getOtuInventoryDarwinCore(props.otuId)
      ).then(({data}) => {
        inventoryDWC.value = data
      }).catch(
          e => inventoryDWC.value = `Error: ${e}`
      ).finally(() => isLoading.value = false)
    },
    {immediate: true}
  )

</script>
