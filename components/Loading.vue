<template>
  <div v-if="loading" class="intro">
    <h1 class="logo-header">
      <span class="logo">Q</span>
      <span class="logo">u</span>
      <span class="logo">i</span>
      <span class="logo">z</span>
      <span class="logo">M</span>
      <span class="logo">a</span>
      <span class="logo">k</span>
      <span class="logo">e</span>
      <span class="logo">r</span>
      <span class="logo">A</span>
      <span class="logo">I</span>
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(false);

onMounted(() => {
  const intro = document.querySelector(".intro");
  const logoSpans = document.querySelectorAll(".logo");

  setTimeout(() => {
    logoSpans.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      }, (idx + 1) * 400);
    });
  }, 200);

  setTimeout(() => {
    logoSpans.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.remove("active");
        span.classList.add("fade");
      }, (idx + 1) * 50);
    });
  }, 5600);

  setTimeout(() => {
    intro.style.top = "-100vh";
  }, 7000);

  setTimeout(() => {
    loading.value = false;
  }, 8000);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

.intro {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: #1a1a1a;
  transition: 1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-header {
  font-size: 2.5rem;
  letter-spacing: 3px;
}

.logo {
  position: relative;
  display: inline-block;
  color: #ff784b;
  bottom: -20px;
  opacity: 0;
  margin: 0 3px;
}

.logo.active {
  bottom: 0;
  opacity: 1;
  transition: ease-in-out 0.5s;
}

.logo.fade {
  bottom: 50px;
  opacity: 0;
  transition: ease-in-out 0.5s;
}
</style>
