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

  hideNames: {
    type: Boolean,
    default: false
  }
})

const store = useOtuStore()
const isAdvancedView = ref(props.showTaxa)
const hideNames = ref(props.hideNames)

const menuOptions = computed(() => [
  {
    label: isAdvancedView.value ? 'Hide taxa' : 'Show taxa',
    action: () => (isAdvancedView.value = !isAdvancedView.value)
  },
  {
    label: hideNames.value ? 'Show names' : 'Hide names',
    action: () => (hideNames.value = !hideNames.value)
  }
])
</script>
