<template>
  <div>
    <div class="top-container">
      <div><h1>QuizMakerAI</h1></div>
      <div class="navbar">
        <div class="navbar-container">
          <img src="/images/user.png" alt="User Icon" />
          <p>{{ name }}</p>
        </div>
        <div class="navbar-container" @click="logout">
          <img src="/images/logout.png" alt="Logout Icon" />
          <p class="logout">{{ isLoggingOut ? "Logging out..." : "Logout" }}</p>
        </div>
      </div>
    </div>

    <div class="card-container">
      <div class="card">
        <h2>Short Test</h2>
        <p>Quick checks to see how students are doing right now.</p>
        <div class="button-group">
          <button class="primary-btn">
            <NuxtLink to="/professor/short-test/preparing-short-test"
              >Create</NuxtLink
            >
          </button>
          <button class="secondary-btn">Analytics</button>
        </div>
      </div>
      <div class="card">
        <h2>Midterm Test</h2>
        <p>Evaluate student performance mid-way through.</p>
        <div class="button-group">
          <button class="primary-btn">
            <NuxtLink to="/professor/midterm-test/create">Create</NuxtLink>
          </button>
          <button class="secondary-btn">Analytics</button>
        </div>
      </div>
      <div class="card">
        <h2>Final Exam</h2>
        <p>Comprehensive assessments for end-of-course evaluation.</p>
        <div class="button-group">
          <button class="primary-btn">
            <NuxtLink to="/professor/final-exam/create">Create</NuxtLink>
          </button>
          <button class="secondary-btn">Analytics</button>
        </div>
      </div>
      <div class="card">
        <h2>Study Quizzes</h2>
        <p>Practice quizzes to help students reinforce learning.</p>
        <div class="button-group">
          <button class="primary-btn">
            <NuxtLink to="/professor/study-quizzes/create">Create</NuxtLink>
          </button>
          <button class="secondary-btn">Analytics</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const $toast = toast;
const isLoggingOut = ref(false);
const authStore = useAuthStore();
const name = computed(() =>
  authStore.user && authStore.user.name ? authStore.user.name : "Guest"
);

const logout = async () => {
  if (!confirm("Are you sure you want to logout?")) return;

  isLoggingOut.value = true;
  try {
    authStore.logout();
    router.push("/");
    $toast.success("You have been logged out successfully.");
  } catch (error) {
    $toast.error("An error occurred during logout.");
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
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
a {
  text-decoration: none;
  color: #fff;
}
.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.top-container h1 {
  color: #ff784b;
  font-size: 26px;
  font-weight: bold;
}

.navbar {
  display: flex;
  gap: 30px;
  align-items: center;
}

.navbar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  cursor: pointer;
}

.logout:hover {
  color: #ff784b;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 40px;
  background-color: #f9fafb;
  min-height: 300px;
}

.card {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #111827;
  font-size: 20px;
  margin-bottom: 10px;
}

.card p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 12px;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.primary-btn {
  background-color: #ff784b;
  color: white;
}

.primary-btn:hover {
  background-color: #ff6332;
}

.secondary-btn {
  background-color: #e5e7eb;
  color: #374151;
}

.secondary-btn:hover {
  background-color: #d1d5db;
}
</style>
