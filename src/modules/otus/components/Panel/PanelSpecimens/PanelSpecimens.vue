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
        {{ (void (isSinglePage = typeof total === 'number' && total < perPage && page === 1)) }}
        {{ (void (isLoaded = Array.isArray(inventoryDWC))) }}
        In the Collection
        <template v-if="isLoaded">
          <span v-if="isSinglePage">
            ({{total}})
          </span>
          <span v-else>
            ({{ (page - 1) * perPage + 1}}–{{(page - 1) * perPage + inventoryDWC.length}} of {{total}})
          </span>
          </template>
      </h2>
      <h3 v-if="isLoaded && !isSinglePage">
            {{ void(showFirst = page > 1) }}
            {{ void(showPrev = page > 1) }}
            {{ void(showNext = inventoryDWC.length === perPage) }}
            {{ void(showLast = showNext && typeof total === 'number' && total > (page - 1) * perPage + inventoryDWC.length) }}
            <span v-if="showPrev || showNext" class="ml-2">
              <router-link
                  v-if="showFirst"
                  :to="{ name: 'otus-id', params: { id: otuId } }"
                  class="hover:text-gray-900 text-secondary-color ml-2"
                  v-html="'<<'"
                  @click="page = 1"
              />
              <span v-if="!showFirst" v-html="'<<'" class="ml-2"/>
              <router-link
                  v-if="showPrev"
                  :to="{ name: 'otus-id', params: { id: otuId } }"
                  class="hover:text-gray-900 text-secondary-color ml-2"
                  v-html="'prev'"
                  @click="page--"
              />
              <span v-if="!showPrev" class="ml-2">prev</span>
              <router-link
                  v-if="showNext"
                  :to="{ name: 'otus-id', params: { id: otuId } }"
                  class="hover:text-gray-900 text-secondary-color ml-2"
                  v-html="'next'"
                  @click="page++"
              />
              <span v-if="!showNext" v-html="'next'" class="ml-2"/>
              <router-link
                  v-if="showLast"
                  :to="{ name: 'otus-id', params: { id: otuId } }"
                  class="hover:text-gray-900 text-secondary-color ml-2"
                  v-html="'>>'"
                  @click="page = Math.ceil(total / perPage)"
                />
              <span v-if="!showLast" v-html="'>>'" class="ml-2"/>
            </span>
      </h3>
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
