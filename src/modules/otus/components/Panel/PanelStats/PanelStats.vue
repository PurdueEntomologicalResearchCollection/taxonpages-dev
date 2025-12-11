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
    <VCardContent class="text-sm overflow-auto">
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
                v-if="showDetermined"
                v-bind:title="tooltipToRank()"
            >
              Specimens
            </VTableHeaderCell>
            <VTableHeaderCell
              v-if="!hideNames"
              title="Taxon names"
              class="border-l border-r border-base-border"
              colspan="2"
            >
              Valid names
            </VTableHeaderCell>
            <VTableHeaderCell
              v-if="!hideNames"
              colspan="3"
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
                v-if="showDetermined"
                v-bind:title="tooltipToRank()"
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
            <VTableHeaderCell
              v-if="!hideExtant"
              class="border-l border-base-border"
              >Extant</VTableHeaderCell
            >
            <VTableHeaderCell v-if="!hideFossil">Fossil</VTableHeaderCell>
            <VTableHeaderCell
              v-if="!hideInvalid"
              class="border-l border-base-border"
              >Invalid</VTableHeaderCell
            >
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
                v-if="showDetermined"
                v-bind:title="tooltipToRank(rank)"
            >
              {{ toRank(rank) }}
            </VTableBodyCell>
            <VTableBodyCell v-if="!hideNames" class="border-l border-base-border">
              {{ names.invalid + names.valid_extant + names.valid_fossil }}
            </VTableBodyCell>
            <VTableBodyCell
              v-if="!hideExtant"
              class="border-l border-base-border">{{
              names.valid_extant
            }}</VTableBodyCell>
            <VTableBodyCell v-if="!hideFossil">{{ names.valid_fossil }}</VTableBodyCell>
            <VTableBodyCell
              v-if="!hideInvalid"
              class="border-l border-base-border">{{
              names.invalid
            }}</VTableBodyCell>
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

  // Show "Determined" (specimens determined to this rank) column?
  showDetermined: {
    type: Boolean,
    default: false
  },

  hideNames: {
    type: Boolean,
    default: false
  },

  hideExtant: {
    type: Boolean,
    default: false
  },

  hideFossil: {
    type: Boolean,
    default: false
  },

  hideInvalid: {
    type: Boolean,
    default: false
  }
})

const store = useOtuStore()
const isAdvancedView = ref(props.showTaxa)
const hideNames = ref(props.hideNames)
const showDetermined = ref(props.showDetermined)
const hideExtant = ref(props.hideExtant)
const hideFossil = ref(props.hideFossil)
const hideInvalid = ref(props.hideInvalid)

if (props.showDetermined) {
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
    label: showDetermined.value ? 'Hide determined' : 'Show determined',
    action: () => (showDetermined.value = !showDetermined.value)
  },
  {
    label: hideExtant.value ? 'Show extant' : 'Hide extant',
    action: () => (hideExtant.value = !hideExtant.value)
  },
  {
    label: hideFossil.value ? 'Show fossil' : 'Hide fossil',
    action: () => (hideFossil.value = !hideFossil.value)
  },
  {
    label: hideInvalid.value ? 'Show invalid' : 'Hide invalid',
    action: () => (hideInvalid.value = !hideInvalid.value)
  }
])
</script>
