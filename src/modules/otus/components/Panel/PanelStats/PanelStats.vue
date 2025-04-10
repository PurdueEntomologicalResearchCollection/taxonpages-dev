<template>
  <VCard>
    <VSpinner
      v-if="store.catalog.isLoading"
      logo-class="w-8 h-8"
      legend=""
    />
    <VCardHeader class="flex justify-between">
      <h2 class="text-md">Stats</h2>
      <PanelDropdown
        panel-key="taxonomy"
        :menu-options="menuOptions"
      />
    </VCardHeader>
    <VCardContent class="text-sm">
      <VTable>
        <VTableHeader>
          <VTableHeaderRow>
            <VTableHeaderCell class="bg-base-foreground" />
            <VTableHeaderCell
              v-if="isAdvancedView"
              title="OTUs linked to valid protonyms"
            >
              Taxa
            </VTableHeaderCell>
            <VTableHeaderCell
                v-if="showToRank"
                v-bind:title="tooltipToRank()"
            >
              Specimens
            </VTableHeaderCell>
            <VTableHeaderCell
              v-if="!hideNames"
              title="Taxon names"
              class="border-l border-base-border"
            >
              Names
            </VTableHeaderCell>
            <VTableHeaderCell
              v-if="!hideNames"
              colspan="2"
              class="bg-base-foreground"
            />
          </VTableHeaderRow>
          <VTableHeaderRow>
            <VTableHeaderCell>Rank</VTableHeaderCell>
            <VTableHeaderCell
              v-if="isAdvancedView"
              title="OTUs linked to valid protonyms"
              >Total</VTableHeaderCell
            >
            <VTableHeaderCell
                v-if="showToRank"
                v-bind:title="tooltipToRank()"
                class="border-base-border"
            >
              Determined
            </VTableHeaderCell>
            <VTableHeaderCell
              v-if="!hideNames"
              title="Taxon names"
              class="border-l border-base-border"
            >
              Total
            </VTableHeaderCell>
            <VTableHeaderCell v-if="!hideNames">
              Valid
            </VTableHeaderCell>
            <VTableHeaderCell v-if="!hideNames">
              Invalid
            </VTableHeaderCell>
          </VTableHeaderRow>
        </VTableHeader>
        <VTableBody>
          <VTableBodyRow
            v-for="{ rank, taxa, names } in store.catalog.stats"
            :key="rank"
          >
            <VTableBodyCell class="capitalize">{{ rank }}</VTableBodyCell>
            <VTableBodyCell v-if="isAdvancedView">{{ taxa }}</VTableBodyCell>
            <VTableBodyCell
                v-if="showToRank"
                v-bind:title="tooltipToRank(rank)"
                v-title="tooltipToRank(rank)"
            >
              {{ toRank(rank) }}
            </VTableBodyCell>
            <VTableBodyCell v-if="!hideNames" class="border-l border-base-border">
              {{ names.invalid + names.valid }}
            </VTableBodyCell>
            <VTableBodyCell v-if="!hideNames">{{ names.valid }}</VTableBodyCell>
            <VTableBodyCell v-if="!hideNames">{{ names.invalid }}</VTableBodyCell>
          </VTableBodyRow>
        </VTableBody>
      </VTable>
    </VCardContent>
  </VCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useOtuStore } from '@/modules/otus/store/store'
import PanelDropdown from '../PanelDropdown.vue'

const props = defineProps({
  otuId: {
    type: [Number, String],
    required: true
  },

  taxonId: {
    type: [Number, String],
    required: true
  },

  taxon: {
    type: Object,
    default: undefined
  },

  otu: {
    type: Object,
    default: undefined
  },

  showTaxa: {
    type: Boolean,
    default: false
  },

  // Show "Determined to Rank" column?
  showToRank: {
    type: Boolean,
    default: false
  },

  hideNames: {
    type: Boolean,
    default: false
  }
})

const store = useOtuStore()
const isAdvancedView = ref(props.showTaxa)
const hideNames = ref(props.hideNames)
const showToRank = ref(props.showToRank)

if (props.showToRank) {
  store.loadToRank(props.otuId)
}

const tooltipToRank = (rank) =>
    rank
        ? `${toRank(rank)} specimens are determined ${rank.indexOf('speci') >= 0 ? 'fully' : 'only' } to ${rank}.`
        : "How many specimens are determined only to this rank?"

const toRank = (rank) => {
  const rankLc = rank.toLowerCase()
  const data = store.determinedToRank.data
  if (store.determinedToRank.isLoading) return "..."
  else if (!data) return "—" // not yet loaded, or failed
  else {
    if (rankLc in data) return data[rankLc] ?? 0 // null means 0 in the API response
    else return "missing"
  }
}

const menuOptions = computed(() => [
  {
    label: isAdvancedView.value ? 'Hide taxa' : 'Show taxa',
    action: () => (isAdvancedView.value = !isAdvancedView.value)
  },
  {
    label: hideNames.value ? 'Show names' : 'Hide names',
    action: () => (hideNames.value = !hideNames.value)
  },
  {
    label: showToRank.value ? 'Hide to rank' : 'Show to rank',
    action: () => (showToRank.value = !showToRank.value)
  }
])
</script>
