<template>
  <VCard>
    <ClientOnly>
      <VSpinner
          v-if="isLoading.dwc"
          logo-class="w-8 h-8"
          legend=""
      />
    </ClientOnly>
    <VCardHeader class="flex justify-between items-center">
      <h2 class="text-md">
        {{ (void (isSinglePage = typeof total === 'number' && total < perPage && page === 1)) }}
        {{ (void (isLoaded = Array.isArray(inventoryDWC))) }}
        {{ (void (dwcCount = isLoaded ? inventoryDWC.length : 0)) }}
        In the Collection
        <template v-if="isLoaded">
          <span v-if="isSinglePage">
            ({{total}})
          </span>
          <span v-else>
            ({{ (page - 1) * perPage + 1}}–{{(page - 1) * perPage + dwcCount}} of {{total}})
          </span>
          </template>
      </h2>
      <p v-if="isLoaded && !isSinglePage" class="text-sm mx-2">
            {{ void(showFirst = page > 1) }}
            {{ void(showPrev = page > 1) }}
            {{ void(showNext = dwcCount === perPage) }}
            {{ void(showLast = showNext && typeof total === 'number' && total > (page - 1) * perPage + dwcCount) }}
            <router-link
                v-if="showFirst"
                :to="{ name: 'otus-id', params: { id: otuId } }"
                class="hover:text-gray-900 text-secondary-color ml-2"
                v-html="'<<'"
                @click="page = 1"
            />
            <span v-else v-html="'<<'" class="ml-2"/>
            <router-link
                v-if="showPrev"
                :to="{ name: 'otus-id', params: { id: otuId } }"
                class="hover:text-gray-900 text-secondary-color ml-2"
                v-html="'prev'"
                @click="page--"
            />
            <span v-else class="ml-2">prev</span>
            <router-link
                v-if="showNext"
                :to="{ name: 'otus-id', params: { id: otuId } }"
                class="hover:text-gray-900 text-secondary-color ml-2"
                v-html="'next'"
                @click="page++"
            />
            <span v-else v-html="'next'" class="ml-2"/>
            <router-link
                v-if="showLast"
                :to="{ name: 'otus-id', params: { id: otuId } }"
                class="hover:text-gray-900 text-secondary-color ml-2"
                v-html="'>>'"
                @click="page = Math.ceil(total / perPage)"
              />
            <span v-else v-html="'>>'" class="ml-2"/>
      </p>
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
    ).then(({data, headers}) => {
      // console.log({panel: "specimens", headers, data})
      inventoryDWC.value = data
      total.value = Number(headers['pagination-total'])
    }).catch(
        e => inventoryDWC.value = `Error loading Darwin Core: ${e}`
    ).finally(() => isLoading.value = {...isLoading.value, dwc: false})

    isLoading.value = {...isLoading.value, gallery: true}
    useOtuPageRequest('panel:gallery', () =>
      TaxonWorks.getDescendantsImageGallery(props.otuId)
    ).then(({data, headers}) => {
      // console.log({panel: "gallery", headers, data})
      inventoryGallery.value = data
    }).catch(
        e => console.error(`Error loading gallery: ${e}`)
    ).finally(() => isLoading.value = {...isLoading.value, gallery: false})
  },
  {immediate: true}
)
</script>
