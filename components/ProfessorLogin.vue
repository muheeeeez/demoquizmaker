<template>
  <div class="page">
    <div>
      <div>
        <h1>Professor Login</h1>
        <p>Access your dashboard to manage your courses and assessments</p>
        <div class="form-container">
          <form @submit.prevent="handleLogin">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              v-model="email"
              required
            />
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              v-model="password"
              required
            />
            <input type="submit" value="Login" />
            <div class="links-container">
              <nuxt-link
                to="/authentication/forgot-password"
                class="login-link"
              >
                Forgot Password
              </nuxt-link>
              <nuxt-link
                to="/authentication/request-magic-link"
                class="login-link"
              >
                Use Magic Link
              </nuxt-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "#app";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/stores";

const email = ref("");
const password = ref("");
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  const payload = {
    email: email.value,
    password: password.value,
  };

  try {
    const data = await $fetch(
      "https://genertia-quizmakerbackend.onrender.com/auth/login/password",
      {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!data.user?.role || data.user.role.toLowerCase() !== "professor") {
      toast.warning("This account isn't registered for professor login.");
      router.push("/");
      return;
    }

    authStore.setAuth({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    });

    toast.success("Authentication successful");
    router.push("/professor/professor-dashboard");
  } catch (error) {
    toast.error("An error occurred during login");
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

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 65vh;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

form {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

h1 {
  color: #333;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
}

p {
  color: #555;
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  color: #222;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  height: 45px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
  transition: border-color 0.3s;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #ff784b;
  outline: none;
  background: #fff9f6;
}

input[type="submit"] {
  width: 100%;
  height: 44px;
  padding: 10px;
  background-color: #ff784b;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
  transition: background-color 0.3s, color 0.3s;
}

input[type="submit"]:hover {
  background: transparent;
  color: #ff784b;
  border: 1px solid #ff784b;
}
.links-container {
  text-align: center;
}

.login-link {
  display: block;
  color: #666;
  font-size: 14px;
  margin: 5px 0;
  text-decoration: none;
}

.login-link:hover {
  color: #333;
  text-decoration: underline;
}
@media (max-width: 768px) {
  form {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }

  p {
    font-size: 14px;
  }

  input[type="email"],
  input[type="password"] {
    height: 40px;
    font-size: 14px;
  }

  input[type="submit"] {
    font-size: 14px;
  }

  .login-link {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  form {
    width: 90%;
  }

  h1 {
    font-size: 22px;
  }

  p {
    font-size: 13px;
  }

  input[type="submit"] {
    font-size: 13px;
  }

  .login-link {
    font-size: 12px;
  }
}
</style>
