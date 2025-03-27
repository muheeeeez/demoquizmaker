<template>
  <div v-if="loading" class="loading-screen">
    <div class="spinner"></div>
    <h2>QuizMakerAI</h2>
  </div>
</template>

<script setup>
const loading = ref(true);

onMounted(() => {
  setTimeout(() => (loading.value = false), 1000);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}
.loading-screen {
  position: fixed;
  inset: 0;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ff784b;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h2 {
  color: #ff784b;
  font-family: Inter, sans-serif;
  font-size: 22px;
}
</style>
