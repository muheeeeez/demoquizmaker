<template>
  <div class="auth-container">
    <div class="tabs">
      <button
        @click="currentComponentName = 'StudentLogin'"
        :class="{ active: currentComponentName === 'StudentLogin' }"
      >
        Login
      </button>
      <button
        @click="currentComponentName = 'StudentRegister'"
        :class="{ active: currentComponentName === 'StudentRegister' }"
      >
        Register
      </button>
    </div>
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import StudentLogin from "~/components/StudentLogin.vue";
import StudentRegister from "~/components/StudentRegister.vue";

const currentComponentName = ref("StudentLogin");
const componentsMap = {
  StudentLogin,
  StudentRegister,
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
  /* width: 100%; */
  margin: 0 auto;
  padding: 1rem;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-bottom: 1rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1rem;
}

.tabs button.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}
</style>
