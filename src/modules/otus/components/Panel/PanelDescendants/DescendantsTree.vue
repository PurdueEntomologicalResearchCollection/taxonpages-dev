<template>
  <li
    v-if="Object.keys(taxonomy).length"
    :key="taxonomy.otu_id"
  >
    <button-expand
      v-if="!taxonomy.leaf_node"
      v-model="isTreeVisible"
      class="absolute -left-2.5"
    />
    <router-link
      class="text-secondary-color"
      :to="{ name: 'otus-id', params: { id: taxonomy.otu_id } }"
      v-html="taxonomy.name"
    />
    <DescendantsSynonymList
      v-if="taxonomy.nomenclatural_synonyms.length"
      class="pb-4"
      :list="taxonomy.nomenclatural_synonyms"
    />
    <AnimationOpacity>
      <ul
        v-if="descendants.length"
        class="tree"
      >
        <template
          v-for="item in descendants"
          :key="item.otu_id"
        >
          <AnimationOpacity>
            <DescendantsTree
              v-if="isTreeVisible"
              :taxonomy="item"
            />
          </AnimationOpacity>
        </template>
      </ul>
    </AnimationOpacity>
  </li>
</template>

<script setup>
import DescendantsTree from './DescendantsTree.vue'
import DescendantsSynonymList from './DescendantsSynonymList.vue'
import TaxonWorks from '../../../services/TaxonWorks'
import { ref, watch } from 'vue'

const props = defineProps({
  taxonomy: {
    type: Object,
    required: true
  },

  level: {
    type: Number,
    default: 1
  }
})

const isTreeVisible = ref(!!props.taxonomy.descendants.length)
const descendants = ref([...props.taxonomy.descendants])

watch(isTreeVisible, (newVal) => {
  if (newVal) {
    loadDescendants()
  }
})

const loadDescendants = () => {
  if (descendants.value.length) {
    return
  }
  TaxonWorks.getTaxonomy(props.taxonomy.otu_id, {
    params: {
      max_descendants_depth: 1
    }
  })
    .then(({ data }) => {
      descendants.value = data.descendants
    })
    .catch(() => {})
}
</script>

<style lang="scss">
/* Non-scoped styles for recursive tree - needs to apply to all descendant levels */
ul.tree {
  list-style: none;
  margin: 0;
  padding: 0;

  ul.tree {
    margin-left: 20px;
  }

  li {
    position: relative;
    margin: 0;
    padding: 6px 6px 6px 20px; /* Extra left padding for button */
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgb(100, 100, 100);
  }

  li:last-child {
    border-left-color: transparent;
  }

  /* Horizontal branch line - positioned to center on button */
  li:before {
    content: '';
    position: absolute;
    top: 16px;
    left: 0;
    width: 16px; /* Reach to button center */
    height: 0;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgb(100, 100, 100);
  }

  /* L-shaped corner for last child */
  li:last-child:before {
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgb(100, 100, 100);
    height: 16px;
    left: -1px;
    top: 0;
  }
  button.button-expand {
    position: absolute;
    left: 0;
    top: 6px;
    border-radius: 50%;
    z-index: 1;
  }
}

/* Expand button - opaque white background so lines go behind.
 * #app prefix for specificity to beat #main-content #app button reset - OUTSIDE ul.tree block */
#app ul.tree button.button-expand svg {
  background-color: white;
}
</style>
