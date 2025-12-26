<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">點選新增 {{ count }} 次數</button>
</template>
