<script setup>
defineProps(['title'])
defineEmits(['big', 'small'])
</script>

<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('big')">+</button>
    <button @click="$emit('small')">-</button>
  </div>
</template>
