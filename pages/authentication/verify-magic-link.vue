<template>
  <div class="verify-page">
    <div class="verify-card">
      <h1 class="verify-title">Verifying Magic Link...</h1>
      <p class="verify-error" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const errorMessage = ref("");

const verifyMagicLink = async (magicToken) => {
  try {
    const data = await $fetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/login/magic-link",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { token: magicToken },
      }
    );

    toast.success("Magic link verified successfully!");
    authStore.setAuth(data);
    if (
      authStore.user?.role &&
      authStore.user.role.toLowerCase() === "professor"
    ) {
      router.push("/professor/professor-dashboard");
    } else {
      router.push("/student/student-dashboard");
    }
  } catch (error) {
    toast.error("Verification failed. Please try logging in again.");
    errorMessage.value = "Verification failed. Please try logging in again.";
    console.error("Magic link verification error:", error);
  }
};

onMounted(() => {
  const hash = route.hash;
  if (hash) {
    const params = new URLSearchParams(hash.slice(1));
    const magicToken = params.get("access_token");
    if (magicToken) {
      verifyMagicLink(magicToken);
    } else {
      errorMessage.value = "No magic token provided in the URL.";
    }
  } else {
    errorMessage.value = "No magic link parameters found.";
  }
});
</script>

<style scoped>
.verify-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background-color: #f9fafb;
  padding: 24px;
}

.verify-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 32px;
  max-width: 550px;
  width: 100%;
  text-align: center;
}

.verify-title {
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 700;
  color: #0f0f0f;
}

.verify-error {
  margin-top: 16px;
  color: #d41f1f;
  font-size: 16px;
}
</style>
