<template>
  <div class="reset-password-container">
    <h1>Reset Your Password</h1>
    <p>Please enter your new password below.</p>
    <form @submit.prevent="handleResetPassword">
      <label for="password">New Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter new password"
        required
      />
      <!-- Optionally display the token for debugging; you may remove this field later -->
      <!-- <label for="token">Token (auto-filled)</label>
      <input
        type="text"
        id="token"
        v-model="token"
        placeholder="Your token"
        readonly
      /> -->
      <button type="submit">Reset Password</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";

const router = useRouter();
const route = useRoute();
const $toast = toast;

const password = ref("");
const token = ref("");
onMounted(() => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  if (params.get("type") === "recovery" && params.get("access_token")) {
    token.value = params.get("access_token");
  } else {
    $toast.error("Invalid or missing reset token.");
  }
});

const handleResetPassword = async () => {
  if (!password.value || !token.value) {
    $toast.error("Please provide a new password.");
    return;
  }
  try {
    await $fetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          password: password.value,
          token: token.value,
        },
      }
    );
    $toast.success("Your password has been reset successfully.");
    router.push("/auth/login");
  } catch (error) {
    $toast.error("Failed to reset password. Please try again.");
    console.error("Reset password error:", error);
  }
};
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.reset-password-container h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #111827;
}

.reset-password-container p {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #6b7280;
}

.reset-password-container form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.reset-password-container label {
  font-size: 0.9rem;
  color: #374151;
  text-align: left;
}

.reset-password-container input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.reset-password-container button {
  padding: 10px;
  font-size: 1rem;
  background-color: #ff784b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-password-container button:hover {
  background-color: #ff6332;
}
</style>
