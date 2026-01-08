<template>
  <div class="flex flex-col">
    <h1 class="order-2 dark:text-gray-100">
      <span>
        <span
          :title="store.taxon?.short_status"
          v-html="store.taxon?.full_name_tag"
        />
        <span
          v-if="!store.taxon?.is_valid"
          class="ml-1 text-red-600"
          title="Invalid"
        >
          &#10005;
        </span>
        <span
          v-if="store.taxon.descorator_status.length"
          class="text-base-soft text-base"
        >
          ({{ store.taxon.descorator_status.join('; ') }})
        </span>
      </span>
    </h1>
    <p class="order-1 text-2xl like-a-header capitalize">
      {{ store.taxon?.rank || 'Combination' }}
    </p>
    <h2
      v-if="store.taxonomy.commonNames?.length"
      class="order-3 text-1xl"
    >
      <CommonNames />
    </h2>
  </div>
</template>

<script setup>
import { useOtuStore } from '../store/store'
import CommonNames from './CommonNames.vue'

const store = useOtuStore()
</script>
