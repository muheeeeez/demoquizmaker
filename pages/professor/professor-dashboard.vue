<template>
  <div>
    <div class="top-container">
      <div class="logo-container">
        <h1>QuizMakerAI</h1>
      </div>
      <div class="navbar">
        <div class="navbar-container user-info">
          <img src="/images/user.png" alt="User Icon" />
          <p>{{ name }}</p>
        </div>
        <div class="navbar-container logout-container" @click="logout">
          <img src="/images/logout.png" alt="Logout Icon" />
          <p class="logout">{{ isLoggingOut ? "Logging out..." : "Logout" }}</p>
        </div>
      </div>
    </div>
    <div class="container">
      <h1>
        Welcome, {{ name }}
        <img src="/images/hand.png" alt="Hand Icon" class="hand-icon" />
      </h1>
    </div>
    <div class="button-group top-buttons">
      <button class="primary-btn" @click="showModal = true">
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
        Create a New Course
      </button>
      <button class="secondary-btn" @click="fetchCourses">
        Refresh Courses
      </button>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>Create a New Course</h2>
        <label for="course-title">Title</label>
        <input
          id="course-title"
          type="text"
          v-model="courseTitle"
          placeholder="Enter course title"
        />
        <label for="course-description">Description</label>
        <textarea
          id="course-description"
          rows="3"
          v-model="courseDescription"
          placeholder="Enter course description"
        ></textarea>
        <div class="modal-buttons">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" @click="createCourse">
            Create Course
          </button>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card" v-for="course in courses" :key="course.id">
        <h2>{{ course.title }}</h2>
        <p>Course Code: {{ course.access_code }}</p>
        <p>Students Enrolled: {{ course.student_count }}</p>
        <div class="button-set">
          <button class="btn-primary">
            <NuxtLink :to="`/professor/${course.id}`">Manage Course</NuxtLink>
          </button>
          <button class="btn-secondary" @click="regenerateCode(course.id)">
            Regenerate Code
          </button>
        </div>
      </div>
    </div>
    <div class="announcement-card">
      <h1>Announcements</h1>
      <p>Upcoming quiz in Calculus 101 on Friday, 3 PM.</p>
      <p>Check out new resources in Physics 202.</p>
      <p>Midterm exam schedule has been updated.</p>
      <p>New study materials are available for History 101.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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
const showModal = ref(false);
const courseTitle = ref("");
const courseDescription = ref("");
const courses = ref([]);
const fetchCourses = async () => {
  $toast.info("Courses Refreshing...");
  try {
    const response = await $fetch(
      "https://genertia-quizmakerbackend.onrender.com/professor/courses?active_only=false",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    courses.value = response;
    $toast.success("Courses refreshed.");
  } catch (error) {
    $toast.error("Failed to fetch courses.");
    console.error("Fetch courses error:", error);
  }
};
const createCourse = async () => {
  if (!courseTitle.value.trim() || !courseDescription.value.trim()) {
    $toast.error("Please fill in all course details.");
    return;
  }
  const payload = {
    title: courseTitle.value,
    description: courseDescription.value,
    is_active: true,
  };

  try {
    $toast.info("Creating Course...");
    const newCourse = await $fetch(
      "https://genertia-quizmakerbackend.onrender.com/professor/courses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: payload,
      }
    );
    $toast.success("Course created successfully.");
    courses.value.push(newCourse);
    courseTitle.value = "";
    courseDescription.value = "";
    showModal.value = false;
  } catch (error) {
    $toast.error("Failed to create course.");
    console.error("Create course error:", error);
  }
};
const closeModal = () => {
  showModal.value = false;
};
const regenerateCode = async (courseId) => {
  try {
    $toast.info("Regenerating access code...");
    const newCodeData = await $fetch(
      `https://genertia-quizmakerbackend.onrender.com/professor/courses/${courseId}/regenerate-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    $toast.success("Access code regenerated successfully.");
    const updatedCourse = courses.value.find(
      (course) => course.id === courseId
    );
    if (updatedCourse) {
      updatedCourse.access_code =
        newCodeData.access_code || newCodeData.additionalProp1;
    }
  } catch (error) {
    $toast.error("Failed to regenerate course access code.");
    console.error("Regenerate code error:", error);
  }
};
const logout = async () => {
  if (!confirm("Are you sure you want to logout?")) return;
  isLoggingOut.value = true;
  try {
    await $fetch("https://genertia-quizmakerbackend.onrender.com/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    $toast.success("You have been logged out successfully.");
    authStore.logout();
    router.push("/");
  } catch (error) {
    $toast.error("An error occurred during logout.");
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
  }
};

onMounted(() => {
  fetchCourses();
});
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
.container {
  padding: 30px 50px;
  margin-bottom: 30px;
}
.container h1 {
  font-size: 30.5px;
  color: #111827;
}
.container p {
  color: #4b5563;
  font-size: 15.5px;
  padding: 10px 0px;
}
.hand-icon {
  width: 32px;
  height: 32px;
  margin-left: 8px;
  vertical-align: middle;
}

.icon {
  width: 18px;
  height: 18px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 45px;
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
  width: 400px;
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
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  margin-bottom: 60px;
}
.primary-btn {
  cursor: pointer;
  width: 230px;
  height: 50px;
  padding: 0px 8px;
  border: 0;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #5664f5;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
}
.primary-btn:hover {
  background-color: #ffffff;
  border: 1.5px solid #5664f5;
  color: #030303;
}
.secondary-btn {
  cursor: pointer;
  width: 182px;
  height: 50px;
  padding: 0px 8px;
  border: 1.5px solid #5664f5;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #ffffff;
  color: #030303;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  outline: none;
  text-align: center;
}
.secondary-btn:hover {
  background-color: #5664f5;
  color: #ffffff;
}

.button-set {
  display: flex;
  gap: 12px;
}
.btn-primary {
  background-color: #ff784b;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background-color: #d1d5db;
}
.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}

.announcement-card {
  padding: 20px 60px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.announcement-card h1 {
  font-size: 35px;
  margin-bottom: 20px;
}
.announcement-card p {
  font-size: 20px;
  line-height: 45px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal-content h2 {
  margin-bottom: 12px;
  font-size: 22px;
}
.modal-content label {
  font-weight: 600;
}
.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 12px;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
@media (max-width: 768px) {
  .top-container {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
  .navbar {
    margin-top: 10px;
    gap: 15px;
  }
  .button-group {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 20px;
    gap: 15px;
  }
  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
  .card-container {
    padding: 20px;
    gap: 20px;
  }
  .card {
    width: auto;
  }
  .announcement-card {
    padding: 20px;
    margin-top: 20px;
  }
}
@media (max-width: 480px) {
  .container {
    padding: 20px;
  }
  .container h1 {
    font-size: 26px;
  }

  .logo-container h1 {
    font-size: 22px;
  }
  .primary-btn,
  .secondary-btn {
    font-size: 14px;
    height: auto;
    padding: 10px;
  }
  .icon {
    width: 16px;
    height: 16px;
  }
  .announcement-card h1 {
    font-size: 26px;
  }
  .announcement-card p {
    font-size: 16px;
    line-height: 28px;
  }
}
</style>
