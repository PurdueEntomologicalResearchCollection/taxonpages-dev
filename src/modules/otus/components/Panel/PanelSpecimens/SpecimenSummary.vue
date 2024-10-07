<!--
A summary of & image thumbnails for a Darwin Core representation
of a specimen, from the TaxonWorks api /otus/<ID>/inventory/dwc.json.
For further reference see https://dwc.tdwg.org/terms/.
-->
<template>
  <!--    <ul class="tree m-2 ml-6 list-disc">-->
  <div v-html="nameAndAuthor(specimen)"/>
  <ul class="tree ml-6 relative">
    <li class="my-2">{{ describeSpecimen(specimen) }}</li>
    <li class="my-2">{{describeDetails(specimen).join(', ')}}</li>
    <GalleryImage
        v-if="images.length"
        :images="images"
        :only-thumbs="true"
    />
  </ul>
</template>

<script setup>
import ImageThumbnail from "@/modules/otus/components/Panel/PanelSpecimens/ImageThumbnail.vue"

const props = defineProps({
  specimen: {
    type: Object,  // Darwin Core schema -- see above for references
    required: true,
  },
  images: {
    type: Array,
    default: [],
  },
  otuId: {
    type: Number,
    required: true,
  },
})

function genusSpecies(specimen) {
  return [specimen.genus,  specimen.specificEpithet].filter(Boolean).join(' ')
}

function nameAndAuthor(specimen) {
  return [`<em>${genusSpecies(specimen)}</em>`, specimen.scientificNameAuthorship].filter(Boolean).join(' ')
}

/** Inspired by taxonpages-orthoptera PanelSpecimenRecords. */
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
  return specimen.coordinateUncertaintyInMeters ? ` to within ${specimen.coordinateUncertaintyInMeters} meters` : ""
}
</script>