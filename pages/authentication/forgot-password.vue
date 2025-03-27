<template>
  <div class="auth-page">
    <div class="form-wrapper">
      <form class="reset-form" @submit.prevent="handleLogin">
        <h1>Reset Your Password</h1>
        <p>
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>

        <input
          type="email"
          id="email"
          placeholder="Your email address"
          v-model="email"
          required
        />

        <input type="submit" value="Send Recovery Email Link" />
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
  try {
    const payload = { email: email.value };
    const { data, error } = await useFetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/forgot-password",
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (error.value) {
      toast.error("Login failed");
      console.error("API error:", error.value);
    } else {
      toast.success("Reset password link sent successfully");
      router.push("/authentication/professor-auth");
    }
  } catch (err) {
    toast.error("An error occurred while sending the reset password link");
    console.error("Unexpected error:", err);
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

.reset-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reset-form h1 {
  color: #0f0f0f;
  font-size: 32px;
  text-align: center;
  margin-bottom: 8px;
  font-weight: 700;
}

.reset-form p {
  color: #555;
  font-size: 16px;
  text-align: center;
  margin-bottom: 16px;
}

.reset-form input[type="email"] {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border: 1px solid #ccc;
  border-radius: 9999px;
  outline: none;
  transition: border-color 0.3s;
}

.reset-form input[type="email"]:focus {
  border-color: #ff784b;
}

.reset-form input[type="submit"] {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 9999px;
  background-color: #ff784b;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.reset-form input[type="submit"]:hover {
  background-color: #fff;
  color: #ff784b;
  border: 1px solid #ff784b;
}
</style>
