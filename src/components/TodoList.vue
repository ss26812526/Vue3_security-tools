<script setup>
const props = defineProps({
  list: Array,
})
</script>

<template>
  <ol>
    <li v-for="item of list" :key="item.id">{{ item.text }}</li>
  </ol>
</template>
