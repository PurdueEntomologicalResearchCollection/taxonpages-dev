<template>
  <Autocomplete
    class="print:hidden min-w-full mb-2 md:min-w-fit md:m-2 md:ml-0 md:w-96"
    url="/otus/autocomplete"
    query-param="term"
    label="label_html"
    :autofocus="autofocus"
    :params="{ having_taxon_name_only: true, include_common_names: true }"
    @select="loadOtu"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Autocomplete from '@/components/Autocomplete/Autocomplete.global.vue'

const router = useRouter()

const props = defineProps({
  autofocus: {
    type: Boolean,
    default: false
  }
})

const loadOtu = ({ id, otu_valid_id }) => {
  router.push({
    name: 'otus-id-overview',
    params: {
      id: otu_valid_id || id
    }
  })
}
</script>
