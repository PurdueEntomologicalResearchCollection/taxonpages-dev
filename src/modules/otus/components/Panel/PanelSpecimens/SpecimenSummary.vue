<!--
A text summary of a Darwin Core representation of a specimen,
from the TaxonWorks api /otus/<ID>/inventory/dwc.json.
For further reference see https://dwc.tdwg.org/terms/.
-->
<template>
  <details>
    <summary class="cursor-pointer">
      {{ describeSpecimen(specimen) }}
    </summary>
    <ul class="tree m-2 ml-6 relative">
<!--    <ul class="tree m-2 ml-6 list-disc">-->
      <li v-if="!!specimen.associatedMedia">
        <PanelGallery :otu-id="otuId"/>
      </li>
      <Tree :children="describeDetails(specimen).map(detail => ({label: detail}))">
        <span v-html="describeDetails(specimen).join(', ')"/>
      </Tree>
      <li v-for="detail in describeDetails(specimen)" v-html="detail" :key="detail?.id"/>
      <li>
        <details>
          <summary class="cursor-pointer">Full Record ({{Object.keys(specimen).length}} items)</summary>
          <dl class="m-2 ml-6">
            <template v-for="entry in Object.entries(specimen)" :key="entry[0]">
              <dt>{{ entry[0] }}</dt>
              <dd class="ml-4 mb-2">{{ entry[1] }}</dd>
            </template>
          </dl>
        </details>
      </li>
    </ul>
  </details>
</template>

<script setup>

// Where I was
// Problem: We want to see photos of inventory items, but the current OTU may be a higher taxon (eg family)
// than the photos (eg species).
// For each inventory item, we're fetching the Darwin Core info, which includes an image URL
// but not thumbnails etc, as returned by getOtuImages() or the OTU ID, which we could use to get images.
// Possible solution: Find the most-specific OTU for the DarwinCore item, and use it to fetch images.
// Possible solution: Fetch images based on collection item instead of OTU.

import Tree from "@/modules/otus/components/Panel/PanelSpecimens/Tree.vue"
import PanelGallery from "@/modules/otus/components/Panel/PanelGallery/PanelGallery.vue"

const props = defineProps({
  specimen: {
    type: Object,  // Darwin Core schema -- see above for references
    required: true,
  },
  otuId: {
    type: Number,
    required: true,
  }
})

/** Based on taxonpages-orthoptera PanelSpecimenRecords. */
function describeSpecimen(specimen) {
  return [
    specimen.catalogNumber,
    describeLocation(specimen),
    specimen.year,
    specimen.associatedMedia && 'photo',
    // `length ${JSON.stringify(item).length}`,
  ].filter(Boolean).join("; ")
}

function describeDetails(specimen) {
  return [
    describeCollectionDate(specimen),
    specimen.recordedBy && `Recorded by ${specimen.recordedBy}`,
    describeIdentifiedBy(specimen),
    specimen.georeferencedBy && `Georeferenced by ${specimen.georeferencedBy}${describeGeoreferenceUncertainty(specimen)}`,
    // CollectionObject #1234
    specimen.dwc_occurrence_object_id && `${specimen.dwc_occurrence_object_type} #${specimen.dwc_occurrence_object_id}`,
  ].filter(Boolean)
}

function describeLocation(specimen) {
  return [
    specimen.country && specimen.country,
    specimen.stateProvince && specimen.stateProvince,
    specimen.county && `${specimen.county} County`,
  ].filter(Boolean).join(", ")
}

function describeIdentifiedBy(specimen) {
  return [
    specimen.identifiedBy && `Identified by ${specimen.identifiedBy}`,
    specimen.dateIdentified,
  ].filter(Boolean).join(", ")
}

function describeCollectionDate(specimen) {
  if (!specimen.year) return null
  const date = new Date(specimen.year, specimen.month, specimen.day)
  return `Collected ${date.toLocaleDateString()}`
}

function describeGeoreferenceUncertainty(specimen) {
  return specimen.coordinateUncertaintyInMeters && ` to within ${specimen.coordinateUncertaintyInMeters} meters`
}
</script>