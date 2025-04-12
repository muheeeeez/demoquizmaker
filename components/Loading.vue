<template>
  <div v-if="loading" class="intro">
    <div class="loading-content">
      <h1 class="logo-header">
        <span class="logo">G</span>
        <span class="logo">e</span>
        <span class="logo">n</span>
        <span class="logo">e</span>
        <span class="logo">r</span>
        <span class="logo">t</span>
        <span class="logo">i</span>
        <span class="logo">a</span>
        <span class="logo">a</span>
        <!-- <span class="logo">.</span> -->
        <!-- <span class="logo">I</span> -->
      </h1>
      <div class="loader">
        <div class="loader-bar"></div>
      </div>
      <div class="tagline">Empowering Education with AI</div>
    </div>
    
    <!-- Background elements -->
    <div class="background-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="square square-1"></div>
      <div class="square square-2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(true);

onMounted(() => {
  const logoSpans = document.querySelectorAll(".logo");
  const loader = document.querySelector(".loader-bar");
  const intro = document.querySelector(".intro");
  const tagline = document.querySelector(".tagline");

  // Animate each letter of the logo
  setTimeout(() => {
    logoSpans.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      }, (idx + 1) * 150);
    });
  }, 500);

  // Show tagline with delay
  setTimeout(() => {
    tagline.classList.add("active");
  }, 2500);

  // Animate the loader
  setTimeout(() => {
    loader.classList.add("loading");
  }, 2800);

  // Complete loading animation
  setTimeout(() => {
    logoSpans.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("fade");
      }, (idx + 1) * 50);
    });
    tagline.classList.add("fade");
    loader.classList.add("complete");
  }, 4500);

  // Hide the loading screen
  setTimeout(() => {
    intro.classList.add("fade-out");
  }, 5500);

  // Remove from DOM
  setTimeout(() => {
    loading.value = false;
  }, 6500);
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
  background: linear-gradient(135deg, #2a2f4e 0%, #1a1e35 100%);
  transition: opacity 1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.intro.fade-out {
  opacity: 0;
}

.loading-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-header {
  font-size: 3.5rem;
  letter-spacing: 3px;
  margin-bottom: 30px;
}

.logo {
  position: relative;
  display: inline-block;
  color: transparent;
  background: linear-gradient(45deg, #ff784b, #ff9a76);
  background-clip: text;
  -webkit-background-clip: text;
  font-weight: 700;
  transform: translateY(20px);
  opacity: 0;
  text-shadow: 0 5px 25px rgba(255, 120, 75, 0.3);
}

.logo.active {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), 
              opacity 0.5s ease;
}

.logo.fade {
  transform: translateY(-20px) scale(0.9);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.loader {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.loader-bar {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #ff784b, #ff9a76);
  border-radius: 10px;
  transition: width 1.7s cubic-bezier(0.19, 1, 0.22, 1);
}

.loader-bar.loading {
  width: 90%;
}

.loader-bar.complete {
  width: 100%;
  background: linear-gradient(90deg, #ff784b, #ff9a76);
  transition: width 0.3s ease;
}

.tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  letter-spacing: 2px;
  transform: translateY(10px);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.tagline.active {
  transform: translateY(0);
  opacity: 1;
}

.tagline.fade {
  transform: translateY(-10px);
  opacity: 0;
}

/* Background elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: linear-gradient(45deg, #ff784b, #ff9a76);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -50px;
  animation: floatAnimation 8s infinite ease-in-out;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: 50px;
  left: -50px;
  animation: floatAnimation 12s infinite ease-in-out reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: 30%;
  right: 25%;
  animation: floatAnimation 10s infinite ease-in-out 2s;
}

.square {
  position: absolute;
  opacity: 0.05;
  background: white;
  transform: rotate(45deg);
}

.square-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 20%;
  animation: rotateAnimation 15s infinite linear;
}

.square-2 {
  width: 50px;
  height: 50px;
  bottom: 15%;
  right: 15%;
  animation: rotateAnimation 12s infinite linear reverse;
}

@keyframes floatAnimation {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive adaptations */
@media (max-width: 768px) {
  .logo-header {
    font-size: 2.5rem;
  }
  
  .loader {
    width: 250px;
  }
  
  .tagline {
    font-size: 0.9rem;
  }
}
</style>
