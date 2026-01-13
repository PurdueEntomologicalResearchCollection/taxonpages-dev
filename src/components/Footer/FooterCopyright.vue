<template>
  <div class="tp-footer-copyright flex items-center text-md gap-2">
    <component
      :is="copyright_image_link ? 'a' : 'span'"
      :href="copyright_image_link"
      class="min-w-fit"
      v-if="copyright_image"
    >
      <img
        :src="copyright_image"
        alt="copyright"
      />
    </component>
    <span>{{ copyright_text }}</span>
  </div>
</template>

<script setup>
const { copyright_image, copyright_image_link, copyright_text } = __APP_ENV__
</script>
