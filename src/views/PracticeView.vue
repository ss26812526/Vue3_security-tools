<script setup lang="ts">
// ========== Vue3 練習區 ==========
// 常用引入，依需求使用：
import { ref, reactive, computed, watch, watchEffect } from 'vue'

// 在這裡開始練習...
import TodoItem from '@/components/TodoItem.vue'
import TodoList from '@/components/TodoList.vue'

const gorceryList = ref([
  { id: 0, text: 'Vegetables' },
  { id: 1, text: 'Cheese' },
  { id: 2, text: 'Whatever else humans are supposed to eat' },
])
</script>

<template>
  <div class="practice-page">
    <h1>Vue3 練習場</h1>
    <p class="hint">編輯 src/views/PracticeView.vue 開始練習！</p>

    <hr />

    <!-- 在這裡練習 Template -->
    <div class="practice-area">
      <p>-----開始你的練習-----</p>

      <ol>
        <!-- <li v-for="item of gorceryList">{{ item.text }}</li> -->
        <TodoItem v-for="item of gorceryList" :key="item.id" :item="item" />
      </ol>

      <ol>
        <TodoList :list="gorceryList" />
      </ol>
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
