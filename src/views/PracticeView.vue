<script setup lang="ts">
// ========== Vue3 練習區 ==========
// 常用引入，依需求使用：
import { ref, reactive, computed, watch, watchEffect, onMounted } from 'vue'

// 在這裡開始練習...
import Comp from '@/components/Comp.vue'

const msg = ref('Hello World!')
const props = {
  greetingMessage: '123',
  obj: { count: 1 },
}
const obj = reactive({ count: 4 })
const addHandler = () => {
  console.log('add')
}
</script>

<template>
  <div class="practice-page">
    <h1>Vue3 練習場</h1>
    <p class="hint">編輯 src/views/PracticeView.vue 開始練習！</p>
    <hr />
    <!-- 在這裡練習 Template -->
    <div class="practice-area">
      <p>-----開始你的練習-----</p>

      <h1>{{ msg }}</h1>
      <input v-model="msg" />
      <br />
      <Comp v-bind="props" @add="addHandler" />
      <br />
      <Comp greeting-message="來自父元件的問候！" :obj="obj" />
    </div>
  </div>
</template>

<style scoped>
.practice-page {
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  color: #42b883;
  border-bottom: 2px solid #42b883;
  padding-bottom: 10px;
}
.hint {
  color: #888;
  font-style: italic;
}
hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 30px 0;
}
.practice-area {
  background: #f9f9f9;
  color: #2c3e50;
  padding: 20px;
  border-radius: 8px;
  min-height: 200px;
}
/* 新增樣式 */
.red {
  color: red;
}
</style>

<style>
/* 深色模式 - 全域樣式 */
body.dark-theme .hint {
  color: #aaa;
}
body.dark-theme hr {
  border-top-color: #333;
}
body.dark-theme .practice-area {
  background: #16213e;
  color: #eee;
}
</style>
