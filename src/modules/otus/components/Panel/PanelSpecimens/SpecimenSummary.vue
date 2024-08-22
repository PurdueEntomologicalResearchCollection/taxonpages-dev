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
    <ul class="m-2 ml-6 list-disc">
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
const props = defineProps({
  specimen: {
    type: Object,  // Darwin Core schema -- see above for references
    required: true,
  }
})

/** Based on taxonpages-orthoptera PanelSpecimenRecords. */
function describeSpecimen(specimen) {
  return [
    specimen.catalogNumber,
    describeLocation(specimen),
    specimen.year,
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