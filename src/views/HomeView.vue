<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <h1>資安工具箱</h1>
    <p class="subtitle">選擇你需要的工具</p>

    <div class="tool-grid">
      <RouterLink to="/base64" class="tool-card">
        <div class="icon">🔐</div>
        <h3>Base64 編碼器</h3>
        <p>文字與 Base64 互相轉換、驗證</p>
      </RouterLink>

      <!-- 未來可以在這裡新增更多工具卡片 -->
      <div class="tool-card coming-soon">
        <div class="icon">🔒</div>
        <h3>Hash 產生器</h3>
        <p>MD5 / SHA-1 / SHA-256（即將推出）</p>
      </div>

      <div class="tool-card coming-soon">
        <div class="icon">🔑</div>
        <h3>密碼產生器</h3>
        <p>產生隨機安全密碼（即將推出）</p>
      </div>

      <RouterLink to="/practice" class="tool-card practice">
        <div class="icon">📝</div>
        <h3>Vue3 練習場</h3>
        <p>學習與複習 Vue3 語法</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
}
.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 40px;
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.tool-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  cursor: pointer;
}
.tool-card:hover {
  border-color: #42b883;
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.tool-card .icon {
  font-size: 3rem;
  margin-bottom: 15px;
}
.tool-card h3 {
  color: #2c3e50;
  margin: 0 0 10px 0;
}
.tool-card p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}
.coming-soon {
  opacity: 0.5;
  cursor: not-allowed;
}
.coming-soon:hover {
  transform: none;
  border-color: #e0e0e0;
  box-shadow: none;
}
/* 深色模式 */
:global(body.dark-theme) h1 {
  color: #eee;
}
:global(body.dark-theme) .subtitle {
  color: #aaa;
}
:global(body.dark-theme) .tool-card {
  background: #1a1a2e;
  border-color: #0f3460;
}
:global(body.dark-theme) .tool-card h3 {
  color: #eee;
}
:global(body.dark-theme) .tool-card p {
  color: #aaa;
}
:global(body.dark-theme) .tool-card:hover {
  border-color: #42b883;
}
</style>
