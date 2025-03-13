<!--
A summary of & image thumbnails for a Darwin Core representation
of a specimen, from the TaxonWorks api /otus/<ID>/inventory/dwc.json.
For further reference see https://dwc.tdwg.org/terms/.
-->
<template>
  <div v-html="nameAndAuthor(specimen)" class="font-bold mb-2"/>
  <ul class="tree ml-7 relative list-disc">
    <li class="my-1 last:mb-0" v-if="describeSpecimen(specimen)">{{ describeSpecimen(specimen) }}</li>
    <li class="my-1 last:mb-0" v-if="describeDetails(specimen).length">{{ describeDetails(specimen).join(', ') }}</li>
    <GalleryImage
        v-if="images.length"
        :images="images"
        :only-thumbs="true"
    />
    <li v-for="note in notes" :key="note.id" class="my-1 last:mb-0">
      Note: {{ note.text }}
    </li>
    <li v-for="tag in tags" :key="tag.id" class="my-1 last:mb-0">
      Tag: {{ tag.keyword?.name ?? "no name provided" }}
    </li>
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
  notes: {
    type: Array,
    default: [],
  },
  tags: {
    type: Array,
    default: [],
  },
})

function genusSpecies(specimen) {
  return [specimen.genus, specimen.specificEpithet].filter(Boolean).join(' ')
}

function nameAndAuthor(specimen) {
  // scientificName contains most specific available rank
  // italicize the genus + species
  return specimen.scientificName
      .replace(genusSpecies(specimen), `<em>${genusSpecies(specimen)}</em>`)
      .replace(specimen.family, `Family ${specimen.family}`)
      .replace(specimen.order, `Order ${specimen.order}`)
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
    specimen.individualCount !== 1 && `${specimen.individualCount} specimens`,
    describeCollectionDate(specimen),
    specimen.recordedBy && `Recorded by ${specimen.recordedBy}`,
    describeIdentifiedBy(specimen),
    specimen.georeferencedBy && `Geolocated by ${specimen.georeferencedBy}${describeGeoreferenceUncertainty(specimen)}`,
    // CollectionObject #1234
    // specimen.dwc_occurrence_object_id && `${specimen.dwc_occurrence_object_type} #${specimen.dwc_occurrence_object_id}`,
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