<script setup lang="ts">
import { ref, computed } from 'vue'

// 輸入文字
const inputText = ref('')

// Hash 結果
const hashResults = ref<{ algorithm: string; hash: string }[]>([])

// 是否正在計算
const isLoading = ref(false)

// 支援的現代安全雜湊演算法
const algorithms = ['SHA-256', 'SHA-384', 'SHA-512']

// 將 ArrayBuffer 轉換為十六進位字串
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// 計算 Hash
async function calculateHash() {
  if (!inputText.value) {
    hashResults.value = []
    return
  }

  isLoading.value = true
  const encoder = new TextEncoder()
  const data = encoder.encode(inputText.value)

  const results: { algorithm: string; hash: string }[] = []

  for (const algo of algorithms) {
    try {
      const hashBuffer = await crypto.subtle.digest(algo, data)
      const hashHex = bufferToHex(hashBuffer)
      results.push({ algorithm: algo, hash: hashHex })
    } catch (e) {
      results.push({ algorithm: algo, hash: '計算失敗' })
    }
  }

  hashResults.value = results
  isLoading.value = false
}

// 複製到剪貼簿
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    alert('已複製到剪貼簿！')
  } catch {
    alert('複製失敗')
  }
}

// 輸入是否為空
const isEmpty = computed(() => !inputText.value.trim())

// ========== AES-256 加密功能 ==========
const aesPlainText = ref('')
const aesPassword = ref('')
const aesEncrypted = ref('')
const aesDecrypted = ref('')
const aesError = ref('')

// 從密碼產生 AES 金鑰
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// AES-256-GCM 加密
async function encryptAES() {
  aesError.value = ''
  aesEncrypted.value = ''

  if (!aesPlainText.value || !aesPassword.value) {
    aesError.value = '請輸入要加密的文字和密碼'
    return
  }

  try {
    const encoder = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveKey(aesPassword.value, salt)

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(aesPlainText.value)
    )

    // 組合: salt(16) + iv(12) + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
    combined.set(salt, 0)
    combined.set(iv, salt.length)
    combined.set(new Uint8Array(encrypted), salt.length + iv.length)

    // 轉 Base64
    aesEncrypted.value = btoa(String.fromCharCode(...combined))
  } catch {
    aesError.value = '加密失敗'
  }
}

// AES-256-GCM 解密
async function decryptAES() {
  aesError.value = ''
  aesDecrypted.value = ''

  if (!aesEncrypted.value || !aesPassword.value) {
    aesError.value = '請輸入加密文字和密碼'
    return
  }

  try {
    // 從 Base64 解碼
    const combined = Uint8Array.from(atob(aesEncrypted.value), (c) => c.charCodeAt(0))

    // 拆分: salt(16) + iv(12) + ciphertext
    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 28)
    const ciphertext = combined.slice(28)

    const key = await deriveKey(aesPassword.value, salt)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    )

    const decoder = new TextDecoder()
    aesDecrypted.value = decoder.decode(decrypted)
  } catch {
    aesError.value = '解密失敗（密碼錯誤或資料損壞）'
  }
}
</script>

<template>
  <div class="page">
    <h1>Hash 產生器</h1>
    <p class="description">使用現代安全的雜湊演算法（SHA-2 系列）</p>

    <div class="card">
      <label>輸入文字：</label>
      <textarea
        v-model="inputText"
        placeholder="請輸入要產生 Hash 的文字..."
        @input="calculateHash"
      ></textarea>
    </div>

    <div class="info-box">
      <h3>關於演算法</h3>
      <ul>
        <li><strong>SHA-256</strong>：256 位元，最廣泛使用，適合一般用途</li>
        <li><strong>SHA-384</strong>：384 位元，較高安全性</li>
        <li><strong>SHA-512</strong>：512 位元，最高安全性，適合高敏感資料</li>
      </ul>
      <p class="warning">⚠️ MD5 和 SHA-1 已被證明不安全，本工具不提供這些過時的演算法。</p>
    </div>

    <div v-if="isLoading" class="loading">計算中...</div>

    <div v-else-if="hashResults.length > 0" class="results">
      <h2>Hash 結果</h2>
      <div v-for="result in hashResults" :key="result.algorithm" class="result-card">
        <div class="result-header">
          <span class="algo-name">{{ result.algorithm }}</span>
          <button class="copy-btn" @click="copyToClipboard(result.hash)">複製</button>
        </div>
        <div class="hash-value">{{ result.hash }}</div>
      </div>
    </div>

    <div v-else-if="isEmpty" class="empty-state">
      <p>請輸入文字以產生 Hash 值</p>
    </div>

    <hr class="section-divider" />

    <!-- ========== AES-256 加密區塊 ========== -->
    <h2>AES-256-GCM 加密</h2>
    <p class="description">使用密碼進行對稱加密，可加密也可解密</p>

    <div class="info-box aes-info">
      <h3>關於 AES-256-GCM</h3>
      <ul>
        <li><strong>AES-256</strong>：256 位元金鑰，目前最安全的對稱加密標準</li>
        <li><strong>GCM 模式</strong>：提供加密 + 完整性驗證，防止資料被竄改</li>
        <li><strong>PBKDF2</strong>：從密碼安全地衍生金鑰（10 萬次迭代）</li>
      </ul>
    </div>

    <div class="card">
      <label>密碼（金鑰）：</label>
      <input
        type="password"
        v-model="aesPassword"
        placeholder="請輸入加密/解密用的密碼..."
        class="password-input"
      />
    </div>

    <div class="aes-grid">
      <!-- 加密區 -->
      <div class="aes-box">
        <h3>加密</h3>
        <textarea
          v-model="aesPlainText"
          placeholder="輸入要加密的原始文字..."
        ></textarea>
        <button class="action-btn" @click="encryptAES">加密</button>
      </div>

      <!-- 解密區 -->
      <div class="aes-box">
        <h3>解密</h3>
        <textarea
          v-model="aesEncrypted"
          placeholder="輸入加密後的文字（或從左側加密產生）..."
        ></textarea>
        <button class="action-btn decrypt-btn" @click="decryptAES">解密</button>
      </div>
    </div>

    <div v-if="aesError" class="error-msg">{{ aesError }}</div>

    <div v-if="aesEncrypted && !aesError" class="result-card">
      <div class="result-header">
        <span class="algo-name">加密結果</span>
        <button class="copy-btn" @click="copyToClipboard(aesEncrypted)">複製</button>
      </div>
      <div class="hash-value">{{ aesEncrypted }}</div>
    </div>

    <div v-if="aesDecrypted" class="result-card success-card">
      <div class="result-header">
        <span class="algo-name success-text">解密結果</span>
        <button class="copy-btn" @click="copyToClipboard(aesDecrypted)">複製</button>
      </div>
      <div class="hash-value">{{ aesDecrypted }}</div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 700px;
  margin: 0 auto;
}
h1 {
  color: #2c3e50;
  border-bottom: 2px solid #42b883;
  padding-bottom: 10px;
}
.description {
  color: #666;
  margin-bottom: 20px;
}
.card {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 8px;
}
textarea {
  height: 120px;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
}
textarea:focus {
  outline: none;
  border-color: #42b883;
}
.info-box {
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}
.info-box h3 {
  margin: 0 0 10px 0;
  color: #2e7d32;
}
.info-box ul {
  margin: 0;
  padding-left: 20px;
}
.info-box li {
  margin-bottom: 5px;
}
.warning {
  margin: 10px 0 0 0;
  color: #c62828;
  font-size: 0.9rem;
}
.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
.results h2 {
  color: #2c3e50;
  margin-bottom: 15px;
}
.result-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.algo-name {
  font-weight: bold;
  color: #42b883;
}
.copy-btn {
  background: #42b883;
  color: #fff;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.copy-btn:hover {
  background: #369970;
}
.hash-value {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  word-break: break-all;
  background: #2d3436;
  color: #55efc4;
  padding: 10px;
  border-radius: 4px;
}
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}
/* AES 區塊樣式 */
.section-divider {
  border: none;
  border-top: 2px dashed #ddd;
  margin: 40px 0;
}
h2 {
  color: #2c3e50;
  margin-bottom: 5px;
}
.aes-info {
  background: #e3f2fd;
  border-color: #90caf9;
}
.aes-info h3 {
  color: #1565c0;
}
.aes-info li {
  color: #1976d2;
}
.password-input {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
}
.password-input:focus {
  outline: none;
  border-color: #42b883;
}
.aes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
}
.aes-box {
  display: flex;
  flex-direction: column;
}
.aes-box h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1rem;
}
.aes-box textarea {
  height: 100px;
  margin-bottom: 10px;
}
.action-btn {
  background: #42b883;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}
.action-btn:hover {
  background: #369970;
}
.decrypt-btn {
  background: #3498db;
}
.decrypt-btn:hover {
  background: #2980b9;
}
.error-msg {
  background: #ffebee;
  color: #c62828;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}
.success-card {
  border-left: 4px solid #3498db;
}
.success-text {
  color: #3498db;
}
@media (max-width: 600px) {
  .aes-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 深色模式 */
body.dark-theme .page h1 {
  color: #eee;
}
body.dark-theme .page .description {
  color: #aaa;
}
body.dark-theme .page textarea {
  background: #16213e;
  color: #eee;
  border-color: #0f3460;
}
body.dark-theme .page .info-box {
  background: #1a3a1a;
  border-color: #2e7d32;
}
body.dark-theme .page .info-box h3 {
  color: #81c784;
}
body.dark-theme .page .info-box li {
  color: #c8e6c9;
}
body.dark-theme .page .results h2 {
  color: #eee;
}
body.dark-theme .page .result-card {
  background: #16213e;
}
body.dark-theme .page .empty-state {
  color: #666;
}
body.dark-theme .page .section-divider {
  border-top-color: #0f3460;
}
body.dark-theme .page h2,
body.dark-theme .page .aes-box h3 {
  color: #eee;
}
body.dark-theme .page .aes-info {
  background: #0d253f;
  border-color: #1565c0;
}
body.dark-theme .page .aes-info h3 {
  color: #64b5f6;
}
body.dark-theme .page .aes-info li {
  color: #90caf9;
}
body.dark-theme .page .password-input {
  background: #16213e;
  color: #eee;
  border-color: #0f3460;
}
body.dark-theme .page .error-msg {
  background: #3d1a1a;
  color: #ef9a9a;
}
</style>
