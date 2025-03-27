<template>
  <div>
    <div class="top-container">
      <div><h1>QuizMakerAI</h1></div>
      <div class="navbar">
        <div class="navbar-container">
          <img src="/public/images/user.png" alt="User Icon" />
          <p>Abdul-muiz Olaleye</p>
        </div>
        <div class="navbar-container">
          <img src="/public/images/logout.png" alt="Logout Icon" />
          <p class="logout">Logout</p>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card">
        <h2>Upload & Generate Quiz</h2>
        <p>
          Upload your study materials and let our AI generate personalized
          quizzes instantly.
        </p>
        <div class="button-group">
          <button class="primary-btn">
            <!-- <NuxtLink to="/professor/short-test/short-test-upload"
              >Upload File</NuxtLink
            > -->
          </button>
        </div>
      </div>
      <div :class="['card', { disabled: !configEnabled }]">
        <h2>Quiz Configuration</h2>
        <p>
          Configure your quiz settings here. This feature is currently disabled.
        </p>
        <div class="button-group">
          <button class="secondary-btn" :disabled="!configEnabled">
            Configure Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuizConfig } from "~/composables/useQuizConfig";

const { configEnabled } = useQuizConfig();
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

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 768px) {
  .top-container {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
