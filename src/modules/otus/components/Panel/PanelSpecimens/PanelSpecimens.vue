<template>
  <VCard>
    <ClientOnly>
      <VSpinner
          v-if="isLoading.dwc"
          logo-class="w-8 h-8"
          legend=""
      />
    </ClientOnly>
    <VCardHeader>
      <div class="flex justify-between items-center">
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
      </div>
      <div v-if="enableSpecimenTags" class="mt-4">
        <MultiSelectTags
          v-model="selectedTagIds"
          :tags="availableTags"
          label="Filter by tags"
        />
      </div>
    </VCardHeader>
    <VCardContent class="text-sm">
      <p v-if="typeof inventoryDWC === 'string'" v-html="inventoryDWC"/>
      <ul v-else class="tree">
        <li v-for="specimen in inventoryDWC" :key="specimen.id" class="py-3 border-b border-base-border last:border-none first:pt-0 last:pb-0">
          <SpecimenSummary
              :specimen="specimen"
              :otu-id="otuId"
              :images="getSpecimenImages(specimen)"
              :notes="getNotes(specimen)"
              :tags="getTags(specimen)"
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
import MultiSelectTags from '@/components/MultiSelect/MultiSelectTags.vue'
import { useSpecimenTags } from '@/modules/otus/composables/useSpecimenTags'

const props = defineProps({
  otuId: {
    type: [String, Number],
    required: true
  }
})

const inventoryDWC = ref("Loading...")
const inventoryGallery = ref(undefined)
const inventoryNotes = ref(undefined)
const inventoryTags = ref(undefined)
const isLoading = ref({dwc: false, gallery: false, notes: false, tags: false})
const page = ref(1)
const perPage = ref(20)
const total = ref("???")

// Feature flag for specimen tag filtering
const enableSpecimenTags = __APP_ENV__.enable_specimen_tags || false

// Initialize tag helpers conditionally
const tagHelpers = enableSpecimenTags ? useSpecimenTags() : null

// Use tag helpers if available, otherwise use defaults
const availableTags = tagHelpers?.availableTags || ref([])
const selectedTagIds = tagHelpers?.selectedTagIds || ref([])
const loadTags = tagHelpers?.loadTags || (() => {})
const getFilteredSpecimens = tagHelpers?.getFilteredSpecimens ||
  ((otuId, options) => TaxonWorks.getDescendantsDarwinCore(otuId, options))

// Load tags when component mounts (only if feature is enabled)
if (enableSpecimenTags && loadTags) {
  loadTags()
}

const getSpecimenImages = (specimen) => {
  return !inventoryGallery.value ? [] : inventoryGallery.value.filter(
      // just the images for this specimen
      i => i.dwc_occurrence_id === specimen.id
  ).reduce(
      // extract image records from the rest of the API response
      (result, i) => [...result, ...i.images], []
  )
}

const getNotes = (specimen) => {
  return !inventoryNotes.value ? [] : inventoryNotes.value.filter(
      // just the notes for this specimen
      n => n.note_object_id === specimen.dwc_occurrence_object_id
  )
}

const getTags = (specimen) => {
  return !inventoryTags.value ? [] : inventoryTags.value.filter(
      // just the notes for this specimen
      n => n.tag_object_id === specimen.dwc_occurrence_object_id
  )
}

watch(
  () => [props.otuId, page.value, selectedTagIds.value],
  async () => {
    if (!props.otuId) {
      inventoryDWC.value = 'No OTU specified.'
      return
    }

    isLoading.value = {...isLoading.value, dwc: true}
    
    // Create cache key that includes selected tags
    const cacheKey = selectedTagIds.value.length > 0 
      ? `panel:specimens:${selectedTagIds.value.join(',')}` 
      : 'panel:specimens'
    
    useOtuPageRequest(cacheKey, () =>
      getFilteredSpecimens(
          props.otuId,
          {per: perPage.value, page: page.value}
      )
    ).then(({data, headers}) => {
      // console.log({panel: "specimens", headers, data})
      inventoryDWC.value = data
      total.value = Number(headers['pagination-total'])

      // Nested API requests: Get notes & tags for all specimens
      const collectionObjectIds = data.map(s => s.dwc_occurrence_object_id)
      isLoading.value = {...isLoading.value, notes: true, tags: true}
      makeLoader('panel:notes', 'notes', TaxonWorks.getCollectionObjectsNotes, inventoryNotes)(collectionObjectIds)
      makeLoader('panel:tags', 'tags', TaxonWorks.getCollectionObjectsTags, inventoryTags)(collectionObjectIds)

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

// Helper function to create a loader function for notes and tags
const makeLoader = (cacheKey, loadingKey, urlGenerator, localRef) => {
  return async (collectionObjectIds) => {
    try {
      isLoading.value = {...isLoading.value, [loadingKey]: true}
      const {data} = await useOtuPageRequest(cacheKey, () => urlGenerator(collectionObjectIds))
      localRef.value = data
    }
    catch (e) {
      console.error(`Error loading ${loadingKey}: ${e}`)
    }
    finally {
      isLoading.value = {...isLoading.value, [loadingKey]: false}
    }
  }
}

</script>
