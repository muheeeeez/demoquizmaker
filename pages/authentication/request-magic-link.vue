<template>
  <div class="auth-page">
    <div class="form-wrapper">
      <form class="magic-form" @submit.prevent="handleLogin">
        <h1>Request a Magic Login Link</h1>
        <p>
          Enter your email address below and we'll send you a magic login link.
        </p>

        <input
          type="email"
          id="email"
          placeholder="Your email address"
          v-model="email"
          required
        />

        <input type="submit" value="Send Magic Login Link" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "#app";
import { toast } from "vue3-toastify";

const email = ref("");
const router = useRouter();

const handleLogin = async () => {
  const payload = { email: email.value };

  try {
    const data = await $fetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/login/magic-link",
      {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }
    );

    toast.success("Magic login link sent to your email.");
  } catch (error) {
    toast.error("An error occurred while sending the magic login link.");
    console.error(error);
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f9fafb;
  padding: 24px;
}
.form-wrapper {
  width: 100%;
  max-width: 550px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 32px;
}
.magic-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.magic-form h1 {
  color: #0f0f0f;
  font-size: 32px;
  text-align: center;
  margin-bottom: 8px;
  font-weight: 700;
}
.magic-form p {
  color: #555;
  font-size: 16px;
  text-align: center;
  margin-bottom: 16px;
}
.magic-form input[type="email"] {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  margin-bottom: 0;
  border: 1px solid #ccc;
  border-radius: 9999px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}
.magic-form input[type="email"]:focus {
  border-color: #ff784b;
}
.magic-form input[type="submit"] {
  width: 100%;
  height: 48px;
  padding: 10px;
  background-color: #ff784b;
  color: #fff;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  transition: background-color 0.3s, color 0.3s;
}
.magic-form input[type="submit"]:hover {
  background-color: #fff;
  color: #ff784b;
  border: 1px solid #ff784b;
}
</style>
