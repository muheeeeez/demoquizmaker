<template>
  <div class="auth-container">
    <div class="tabs">
      <button
        @click="currentComponentName = 'ProfessorLogin'"
        :class="{ active: currentComponentName === 'ProfessorLogin' }"
      >
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.121 17.804A9.824 9.824 0 0112 14c2.45 0 4.707.91 6.379 2.404M15 11a3 3 0 11-6 0 3 3 0 016 0zM19.07 5.93a10 10 0 11-14.14 0 10 10 0 0114.14 0z"
          />
        </svg>
        Login
      </button>
      <button
        @click="currentComponentName = 'ProfessorRegister'"
        :class="{ active: currentComponentName === 'ProfessorRegister' }"
      >
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Register
      </button>
    </div>
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ProfessorLogin from "~/components/ProfessorLogin.vue";
import ProfessorRegister from "~/components/ProfessorRegister.vue";

const currentComponentName = ref("ProfessorLogin");
const componentsMap = {
  ProfessorLogin,
  ProfessorRegister,
};
const currentComponent = computed(
  () => componentsMap[currentComponentName.value]
);
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

.auth-container {
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tabs {
  display: flex;
  gap: 80px;
  margin-bottom: 1rem;
  justify-content: center;
}

.tabs button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1rem;
  transition: color 0.2s;
}
.icon {
  width: 18px;
  height: 18px;
}

.tabs button.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}
.tabs button:hover {
  color: #ff784b;
}
</style>
