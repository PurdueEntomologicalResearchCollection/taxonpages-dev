<template>
  <VCard>
    <ClientOnly>
      <VSpinner
          v-if="isLoading.dwc"
          logo-class="w-8 h-8"
          legend=""
      />
    </ClientOnly>
    <VCardHeader class="flex justify-between">
      <h2 class="text-md">
        In the Collection
        <template v-if="Array.isArray(inventoryDWC)">
          <span v-if="typeof total === 'number' && total < perPage && page === 1">
            ({{total}})
          </span>
          <span v-else>
            (<router-link
                v-if="page > 1"
                :to="{ name: 'otus-id', params: { id: otuId } }"
                class="text-primary-500"
                v-html="'&lt;&lt;'"
                @click="page--"
            />
            {{ (page - 1) * perPage + 1}}–{{(page - 1) * perPage + inventoryDWC.length}} of {{total}}
            <router-link
              v-if="inventoryDWC.length === perPage"
              :to="{ name: 'otus-id', params: { id: otuId } }"
              class="text-primary-500"
              v-html="'&gt;&gt;'"
              @click="page++"
          />)
          </span>
        </template>
      </h2>
      <PanelDropdown panel-key="panel:specimens" />
    </VCardHeader>
    <VCardContent class="text-sm">
      <p v-if="typeof inventoryDWC === 'string'" v-html="inventoryDWC"/>
      <ul v-else class="tree ml-2">
        <li v-for="specimen in inventoryDWC" :key="specimen.id" class="mt-1">
          <SpecimenSummary
              :specimen="specimen"
              :otu-id="otuId"
              :images="getSpecimenImages(specimen)"
          />
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

const props = defineProps({
  otuId: {
    type: [String, Number],
    required: true
  }
})

const inventoryDWC = ref("Loading...")
const inventoryGallery = ref(undefined)
const isLoading = ref({dwc: false, gallery: false})
const page = ref(1)
const perPage = ref(20)
// TODO populate once the API has this info
const total = ref("???")

const getSpecimenImages = (specimen) => {
  return !inventoryGallery.value ? [] : inventoryGallery.value.filter(
      // just the images for this specimen
      i => i.dwc_occurrence_id === specimen.id
  ).reduce(
      // extract image records from the rest of the API response
      (result, i) => [...result, ...i.images], []
  )
}

watch(
  () => [props.otuId , page.value],
  async () => {
    if (!props.otuId) {
      inventoryDWC.value = 'No OTU specified.'
      return
    }

    isLoading.value = {...isLoading.value, dwc: true}
    useOtuPageRequest('panel:specimens', () =>
      TaxonWorks.getDescendantsDarwinCore(
          props.otuId,
          {per: perPage.value, page: page.value},
      )
    ).then(({data}) => {
      inventoryDWC.value = data
      // if we've reached the end, so we know the total
      if (Array.isArray(data) && data.length < perPage.value) {
        total.value = (page.value - 1) * perPage.value + data.length
      }
    }).catch(
        e => inventoryDWC.value = `Error loading Darwin Core: ${e}`
    ).finally(() => isLoading.value = {...isLoading.value, dwc: false})

    isLoading.value = {...isLoading.value, gallery: true}
    useOtuPageRequest('panel:gallery', () =>
      TaxonWorks.getDescendantsImageGallery(props.otuId)
    ).then(({data}) => {
      inventoryGallery.value = data
    }).catch(
        e => console.error(`Error loading gallery: ${e}`)
    ).finally(() => isLoading.value = {...isLoading.value, gallery: false})
  },
  {immediate: true}
)
</script>
