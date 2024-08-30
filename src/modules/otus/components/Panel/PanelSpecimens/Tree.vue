<template>
  <li>
    <button-expand
        v-if="hasChildren"
        v-model="isExpanded"
        class="absolute -left-2.5"
    />
    <slot>
      <span class="test-primary-500" v-html="label" @click="onclick" />
    </slot>
    <ul v-if="hasChildren">
      <Tree
          v-for="(item, index) in children"
          :key="index"
          :level="level + 1"
          :label="item.label"
          :children="item.children"
          @click="item.onclick"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  label: {
    type: String,
  },
  level: {
    type: Number,
    default: 1
  },
  onClick: {
    type: Function,
  },
  children: {
    type: Object,
  },
})

const hasChildren = ref(!!props.children)
const isExpanded = ref(false)

</script>