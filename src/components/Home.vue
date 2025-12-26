<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="tab">Home component {{ count }}</div>
  <button @click="count++">+</button>
</template>
