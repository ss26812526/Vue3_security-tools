<script setup>
defineProps(['message'])
</script>

<template>
  <div class="alert-box">
    <string>Error!</string>
    <br />
    {{ message }}
  </div>
</template>

<style scoped>
.alert-box {
  color: #666;
  border: 1px solid red;
  border-radius: 4px;
  padding: 20px;
  background-color: #f8f8f8;
}
</style>
