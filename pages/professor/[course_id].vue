<template>
  <div class="page-wrapper">
    <header class="top-container">
      <div class="logo-container">
        <h1>QuizMakerAI</h1>
      </div>
      <nav class="navbar">
        <div class="navbar-container user-info">
          <img src="/images/user.png" alt="User Icon" />
          <p>{{ name }}</p>
        </div>
        <div class="navbar-container logout-container" @click="logout">
          <img src="/images/logout.png" alt="Logout Icon" />
          <p class="logout">{{ isLoggingOut ? "Logging out..." : "Logout" }}</p>
        </div>
      </nav>
    </header>
    <section class="course-info container" v-if="course">
      <h1>Course Title: {{ course.title }}</h1>
      <h3>Course Code: {{ course.access_code }}</h3>
      <p>{{ course.description }}</p>
    </section>
    <section class="course-info container" v-else>
      <p>Loading course details...</p>
    </section>
    <section class="action-buttons container">
      <div class="button-group">
        <button @click="viewAnalytics">View Analytics</button>
        <button @click="startQuiz">Start Quiz</button>

        <button @click="openUpdateModal">Update Course</button>

        <button @click="openDeleteModal" class="delete">Delete Course</button>
        <button>
          <Nuxt-link to="/professor/notes-upload">Upload and View Notes</Nuxt-link>
        </button>
      </div>
    </section>

    <div
      v-if="showUpdateModal"
      class="modal-overlay"
      @click.self="closeUpdateModal"
    >
      <div class="modal-content">
        <h2>Update Course</h2>
        <label for="update-course-title">Title</label>
        <input
          id="update-course-title"
          type="text"
          v-model="updateCourseTitle"
          placeholder="Enter course title"
        />
        <label for="update-course-description">Description</label>
        <textarea
          id="update-course-description"
          rows="3"
          v-model="updateCourseDescription"
          placeholder="Enter course description"
        ></textarea>

        <div class="modal-buttons">
          <button class="btn-secondary" @click="closeUpdateModal">
            Cancel
          </button>
          <button class="btn-primary" @click="confirmUpdateCourse">
            Update Course
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click.self="closeDeleteModal"
    >
      <div class="modal-content">
        <h2>Confirm Delete Course</h2>
        <p>
          Are you sure you want to delete this course? This action cannot be
          undone.
        </p>
        <div class="modal-buttons">
          <button class="btn-secondary" @click="closeDeleteModal">
            Cancel
          </button>
          <button class="btn-primary" @click="confirmDeleteCourse">
            Delete Course
          </button>
        </div>
      </div>
    </div>

    <main class="body-container">
      <section class="student-list">
        <div class="list-header">
          <h2>Enrolled Students</h2>
          <div class="search">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search Students"
            />
            <button @click="addStudent">Add Students</button>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Enrollment Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.user_id">
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.enrolled_at }}</td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="3" class="no-data">No students found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="history">
        <h2>Assessments & Past Quizzes</h2>
        <div class="card-container">
          <div
            class="card"
            v-for="assessment in assessments"
            :key="assessment.id"
          >
            <h3>{{ assessment.title }}</h3>
            <p>Average Score: {{ assessment.averageScore }}%</p>
            <p>Date: {{ assessment.date }}</p>
          </div>
          <div v-if="assessments.length === 0" class="no-data">
            <p>No assessments available.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const route = useRoute();
const $toast = toast;
const authStore = useAuthStore();

const isLoggingOut = ref(false);
const course = ref(null);
const students = ref([]);
const assessments = ref([]);
const searchQuery = ref("");

const name = computed(() =>
  authStore.user && authStore.user.name ? authStore.user.name : "Guest"
);

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;
  return students.value.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchCourseDetails = async () => {
  const courseId = route.params.course_id;
  try {
    const data = await $fetch(
      `https://genertia-quizmakerbackend.onrender.com/professor/courses/${courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    course.value = data;
    $toast.success("Course details loaded.");
  } catch (err) {
    $toast.error("Failed to fetch course details.");
    console.error("Fetch course details error:", err);
  }
};

const fetchStudents = async () => {
  const courseId = route.params.course_id;
  $toast.info("Fetching Students list");
  try {
    const data = await $fetch(
      `https://genertia-quizmakerbackend.onrender.com/professor/courses/${courseId}/students`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    students.value = data;
    $toast.info("Students list successfully fetched");
  } catch (err) {
    $toast.error("Failed to fetch students.");
    console.error("Fetch students error:", err);
  }
};
const fetchAssessments = () => {
  $toast.info("Fetching Assements History");
};
const showUpdateModal = ref(false);
const updateCourseTitle = ref("");
const updateCourseDescription = ref("");
const updateCourseActive = ref(true);

const openUpdateModal = () => {
  if (course.value) {
    updateCourseTitle.value = course.value.title;
    updateCourseDescription.value = course.value.description;
    updateCourseActive.value = course.value.is_active;
    showUpdateModal.value = true;
  }
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
};

const confirmUpdateCourse = async () => {
  const courseId = route.params.course_id;
  const payload = {
    title: updateCourseTitle.value,
    description: updateCourseDescription.value,
    is_active: true,
  };
  try {
    const updatedCourse = await $fetch(
      `https://genertia-quizmakerbackend.onrender.com/professor/courses/${courseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: payload,
      }
    );
    course.value = updatedCourse;
    $toast.success("Course updated successfully.");
    closeUpdateModal();
  } catch (error) {
    $toast.error("Failed to update course.");
    console.error("Update course error:", error);
  }
};
const showDeleteModal = ref(false);

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const confirmDeleteCourse = async () => {
  const courseId = route.params.course_id;
  try {
    await $fetch(
      `https://genertia-quizmakerbackend.onrender.com/professor/courses/${courseId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    $toast.success("Course deleted successfully.");
    router.push("/professor/professor-dashboard");
  } catch (error) {
    $toast.error("Failed to delete course.");
    console.error("Delete course error:", error);
  }
};
const viewAnalytics = () => {
  $toast.info("View analytics functionality coming soon!");
};

const startQuiz = () => {
  $toast.info("Start quiz functionality coming soon!");
};

const addStudent = () => {
  $toast.info("Add student functionality coming soon!");
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
  } catch (err) {
    $toast.error("An error occurred during logout.");
    console.error("Logout error:", err);
  } finally {
    isLoggingOut.value = false;
  }
};

onMounted(() => {
  fetchCourseDetails();
  fetchStudents();
  fetchAssessments();
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  cursor: pointer;
}
.container {
  padding: 20px 60px;
  background-color: #f7f7f7;
}

.course-info h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.course-info h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #555;
}

.course-info p {
  font-size: 16px;
  line-height: 1.5;
  color: #666;
}
.action-buttons {
  padding: 10px 60px;
  background-color: #f7f7f7;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
}

.button-group button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background-color: #5664f5;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-group button:hover {
  background-color: #4a53d4;
}

.button-group button.delete {
  background-color: red;
}

.button-group button.delete:hover {
  background-color: darkred;
}

.body-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 60px;
  flex: 1;
}

.student-list {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.search {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search input {
  width: 250px;
  height: 38px;
  padding: 0 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search button {
  height: 38px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background-color: #5664f5;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search button:hover {
  background-color: #4a53d4;
}

.table-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f1f1f1;
  position: sticky;
  top: 0;
  z-index: 1;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #888;
}
.history {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history h2 {
  margin-bottom: 15px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background-color: #fafafa;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

.card h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
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
@media (max-width: 768px) {
  .top-container,
  .container,
  .top-buttons,
  .body-container {
    padding: 20px;
  }
  .navbar {
    gap: 15px;
  }
  .search input {
    width: 180px;
  }
  .table-container {
    max-height: 250px;
  }
}

@media (max-width: 480px) {
  .top-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar {
    margin-top: 10px;
  }
  .body-container {
    padding: 10px;
  }
  .button-group {
    flex-direction: column;
  }
}
</style>
