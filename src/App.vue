<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

// 主題切換
const isDarkMode = ref(false)

// 監聽主題變化，動態修改 body 樣式
watchEffect(() => {
  document.body.classList.toggle('dark-theme', isDarkMode.value)
})

// 取得當前路由，用於判斷是否顯示返回按鈕
const route = useRoute()

const selected = ref([])
const options = ref([
  { value: 'A', text: 'One' },
  { value: 'B', text: 'Two' },
  { value: 'C', text: 'Three' },
])
</script>

<template>
  <div class="app-container" :class="{ dark: isDarkMode }">
    <!-- 頂部導航列 -->
    <header class="navbar">
      <RouterLink to="/" class="logo">🛡️ 資安工具箱</RouterLink>

      <div class="nav-right">
        <!-- 返回首頁按鈕（非首頁時顯示） -->
        <RouterLink v-if="route.path !== '/'" to="/" class="back-btn"> ← 返回首頁 </RouterLink>

        <!-- 主題切換開關 -->
        <label class="switch">
          <input type="checkbox" v-model="isDarkMode" />
          <span class="slider"></span>
        </label>
        <span class="theme-label">{{ isDarkMode ? '深色' : '淺色' }}</span>
      </div>
    </header>

    <!-- 頁面內容區域 -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>

  <span>Selected: {{ selected }}</span>
  <hr />
  <template v-for="item of options" :key="item.value">
    <input type="checkbox" v-model="selected" :value="item.value" /> {{ item.text }}
  </template>

  <select v-model="selected" multiple>
    <option v-for="item of options" :value="item.value" :key="item.value">{{ item.text }}</option>
  </select>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #fff;
  color: #2c3e50;
  transition:
    background 0.3s,
    color 0.3s;
}
.app-container.dark {
  background: #1a1a2e;
  color: #eee;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #42b883;
  color: #fff;
}
.logo {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
.back-btn {
  color: #fff;
  text-decoration: none;
  padding: 5px 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background 0.2s;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.theme-label {
  font-size: 14px;
  color: #fff;
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  transition: 0.3s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #2c3e50;
}
input:checked + .slider:before {
  transform: translateX(20px);
}
.main-content {
  padding: 30px;
}
</style>

<style>
/* 全域樣式 */
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: sans-serif;
  background: #f5f5f5;
  transition: background 0.3s;
}
body.dark-theme {
  background: #0f0f23;
}
</style>
