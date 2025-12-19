<script setup lang="ts">
import { ref, computed } from 'vue'

// 響應式資料
const rawText = ref('')
const base64Input = ref('')

// Base64 驗證用的正則表達式
const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

// 計算屬性：檢查輸入是否為合法 Base64
const isValidBase64 = computed(() => {
  if (!base64Input.value) return null
  return base64Regex.test(base64Input.value)
})

// 計算屬性：解碼 Base64
const decodedResult = computed(() => {
  if (!isValidBase64.value) return ''
  try {
    const binary = atob(base64Input.value)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  } catch {
    return '解碼失敗'
  }
})

// 計算屬性：編碼 Base64
const base64Result = computed(() => {
  if (!rawText.value) return ''
  try {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(rawText.value)
    const binary = String.fromCharCode(...bytes)
    return btoa(binary)
  } catch {
    return '編碼出錯'
  }
})
</script>

<template>
  <div class="page">
    <h1>Base64 編碼器</h1>

    <div class="card">
      <label>原始文字 (Plain Text):</label>
      <textarea v-model="rawText" placeholder="請輸入要編碼的文字..."></textarea>
    </div>

    <div class="card result">
      <label>編碼結果 (Base64):</label>
      <div class="output">{{ base64Result }}</div>
    </div>

    <hr />

    <h2>Base64 驗證器</h2>
    <div class="card">
      <label>輸入要驗證的 Base64 字串:</label>
      <textarea v-model="base64Input" placeholder="請輸入 Base64 字串..."></textarea>
    </div>

    <div class="card result">
      <label>驗證結果:</label>
      <div class="output" :class="{ valid: isValidBase64 === true, invalid: isValidBase64 === false }">
        <span v-if="isValidBase64 === null">請輸入要驗證的字串</span>
        <span v-else-if="isValidBase64">✅ 合法的 Base64 字串<br />解碼結果：{{ decodedResult }}</span>
        <span v-else>❌ 不合法的 Base64 字串</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 600px;
  margin: 0 auto;
}
.card {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
textarea {
  height: 100px;
  padding: 10px;
  margin-top: 8px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #2c3e50;
}
.output {
  background: #2d3436;
  color: #55efc4;
  padding: 15px;
  border-radius: 4px;
  min-height: 50px;
  word-break: break-all;
  margin-top: 8px;
}
h1 {
  color: #2c3e50;
  border-bottom: 2px solid #42b883;
  padding-bottom: 10px;
}
h2 {
  color: #2c3e50;
  margin-top: 10px;
}
hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 30px 0;
}
.valid {
  background: #00b894 !important;
  color: #fff !important;
}
.invalid {
  background: #d63031 !important;
  color: #fff !important;
}
/* 深色模式樣式 */
:global(body.dark-theme) .page h1,
:global(body.dark-theme) .page h2 {
  color: #eee;
}
:global(body.dark-theme) textarea {
  background: #16213e;
  color: #eee;
  border-color: #0f3460;
}
:global(body.dark-theme) hr {
  border-top-color: #0f3460;
}
</style>
