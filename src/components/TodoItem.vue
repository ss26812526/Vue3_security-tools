<!-- 教學文件需要引入的vue檔案 -->
<script setup>
const props = defineProps({
  item: Object,
})
</script>

<template>
  <li>{{ item.text }}</li>
</template>
