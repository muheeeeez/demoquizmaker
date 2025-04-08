<template>
  <div class="dashboard-layout">
    <!-- Side Panel -->
    <div class="side-panel">
      <div class="logo-container">
        <h1>Genertiaa</h1>
      </div>
      <nav class="side-nav">
        <div
          class="nav-item"
          :class="{ active: activeSection === 'dashboard' }"
          @click="setActiveSection('dashboard')"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>

        <!-- Courses Section -->
        <div class="nav-section">
          <div class="nav-section-header">
            <span>Courses</span>
            <button class="add-icon" @click="showAddCourseModal = true">
              +
            </button>
          </div>

          <!-- Courses List -->
          <div
            v-for="course in courses"
            :key="course.id"
            class="nav-item course-item"
            :class="{
              active:
                activeCourse &&
                activeCourse.id === course.id,
            }"
            @click="selectCourse(course)"
          >
            <div
              class="course-color"
              :style="{ backgroundColor: course.color }"
            ></div>
            <div class="course-info">
              <span class="course-code">{{ course.code }}</span>
              <span class="course-title-small">{{ course.title }}</span>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="top-container">
        <div class="navbar">
          <div class="navbar-container user-info">
            <img src="/images/user.png" alt="User Icon" />
            <p>Professor Sarah Williams</p>
          </div>
          <div class="navbar-container logout-container" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            <p class="logout">
              {{ isLoggingOut ? "Logging out..." : "Logout" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Dashboard content -->
      <div class="dashboard-content">
        <!-- Main Dashboard View -->
        <div v-if="activeSection === 'dashboard'">
          <h1>Welcome, Professor!</h1>
          <p>
            This is your dashboard. You can manage your courses and quizzes
            here.
          </p>

          <div class="stats-container">
            <div class="stat-card">
              <i class="fas fa-graduation-cap stat-icon"></i>
              <h3>{{ courses.length }}</h3>
              <p>Courses</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-clipboard-check stat-icon"></i>
              <h3>{{ totalQuizzes }}</h3>
              <p>Quizzes</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-users stat-icon"></i>
              <h3>{{ totalStudents }}</h3>
              <p>Students</p>
            </div>
          </div>
        </div>

        <!-- Course View -->
        <div v-else-if="activeCourse">
          <div class="course-header">
            <div class="course-title">
              <div
                class="course-color-large"
                :style="{ backgroundColor: activeCourse.color }"
              ></div>
              <h1>
                {{ activeCourse.code }}:
                {{ activeCourse.title }}
              </h1>
            </div>
            <button class="primary-button" @click="navigateToQuizzes">
              <i class="fas fa-plus"></i> New Quiz
            </button>
          </div>

          <!-- Course Tabs -->
          <div class="course-tabs">
            <div
              v-for="tab in courseTabs"
              :key="tab.id"
              class="course-tab"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon"></i> {{ tab.name }}
            </div>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Overview Tab -->
            <CourseOverview
              v-if="activeTab === 'overview'"
              :course="activeCourse"
              @change-tab="handleTabChange"
            />

            <!-- Quizzes Tab -->
            <CourseQuizzes
              v-else-if="activeTab === 'quizzes'"
              :course="activeCourse"
              :show-generated-quiz="showGeneratedQuiz"
              :generated-quiz="generatedQuizData"
              @clear-generated-quiz="clearGeneratedQuiz"
            />
            <CourseMaterials
              v-else-if="activeTab === 'materials'"
              :course="activeCourse"
              @change-tab="handleTabChange"
              @quiz-generated="handleQuizGenerated"
            />
            <!-- Students Tab -->
            <CourseStudents
              v-else-if="activeTab === 'students'"
              :course="activeCourse"
            />
            <CourseAnalytics
              v-else-if="activeTab === 'analytics'"
              :course="activeCourse"
            />
            <!-- AI Chatbot Tab -->
            <CourseAIAssistant
              v-else-if="activeTab === 'ai-assistant'"
              :course="activeCourse"
            />
            <!-- Settings Tab -->
            <CourseSettings
              v-else-if="activeTab === 'settings'"
              :course="activeCourse"
              @regenerateAccessCode="regenerateAccessCode"
              @updateCourse="updateCourse"
              @deleteCourse="deleteCourse"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Add Course Modal -->
    <div v-if="showAddCourseModal" class="modal-overlay" @click.self="showAddCourseModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-plus-circle"></i> Create New Course</h3>
          <button class="close-btn" @click="showAddCourseModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="createCourse">
            <div class="form-group">
              <label for="courseCode">Course Code</label>
              <input 
                type="text" 
                id="courseCode" 
                v-model="newCourse.code" 
                placeholder="e.g., CS101" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="courseTitle">Course Title</label>
              <input 
                type="text" 
                id="courseTitle" 
                v-model="newCourse.title" 
                placeholder="e.g., Introduction to Computer Science" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="courseDescription">Description</label>
              <textarea 
                id="courseDescription" 
                v-model="newCourse.description" 
                placeholder="Enter course description..." 
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Course Color</label>
              <div class="color-options">
                <div 
                  v-for="color in courseColors" 
                  :key="color"
                  class="color-option"
                  :class="{ active: newCourse.color === color }"
                  :style="{ backgroundColor: color }"
                  @click="newCourse.color = color"
                ></div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="secondary-button" @click="showAddCourseModal = false">
                Cancel
              </button>
              <button type="submit" class="primary-button" :disabled="isCreatingCourse">
                <i class="fas fa-plus"></i>
                {{ isCreatingCourse ? 'Creating...' : 'Create Course' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  useStudentsStore,
  useMaterialsStore,
  useOverviewStore,
  useAnalyticsStore,
  useAuthStore,
  BASE_API_URL
} from "../../stores";
import CourseOverview from "../../components/professor/CourseOverview.vue";
import CourseQuizzes from "../../components/professor/CourseQuizzes.vue";
import CourseStudents from "../../components/professor/CourseStudents.vue";
import CourseAIAssistant from "../../components/professor/CourseAIAssistant.vue";
import CourseMaterials from "../../components/professor/CourseMaterials.vue";
import CourseAnalytics from "../../components/professor/CourseAnalytics.vue";
import CourseSettings from "../../components/professor/CourseSettings.vue";

// Add Font Awesome
const fontAwesomeScript = document.createElement("link");
fontAwesomeScript.setAttribute("rel", "stylesheet");
fontAwesomeScript.setAttribute(
  "href",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
);
document.head.appendChild(fontAwesomeScript);

const router = useRouter();
const studentsStore = useStudentsStore();
const materialsStore = useMaterialsStore();
const overviewStore = useOverviewStore();
const analyticsStore = useAnalyticsStore();

// Local course state to replace courseStore
const courses = ref([]);
const activeCourse = ref(null);
const isLoading = ref(false);
const error = ref(null);

const activeSection = ref("dashboard");
const isLoggingOut = ref(false);
const activeTab = ref("overview");
const showAddCourseModal = ref(false);
const totalQuizzes = ref(12);
const totalStudents = ref(156);

// Course creation
const isCreatingCourse = ref(false);
const newCourse = ref({
  code: '',
  title: '',
  description: '',
  color: '#4C6EF5'
});

// Colors for course creation
const courseColors = [
  '#4C6EF5', // Blue
  '#F03E3E', // Red
  '#40C057', // Green
  '#FAB005', // Yellow
  '#7950F2', // Purple
  '#12B886', // Teal
  '#FD7E14', // Orange
  '#1C7ED6', // Sky Blue
  '#7048E8', // Indigo
  '#F783AC'  // Pink
];

// Course access code
const courseAccessCode = ref('');
const isGeneratingCode = ref(false);

// Mock course data
const DEMO_COURSES = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Fundamental concepts of programming and computer science.',
    students: 45,
    quizzes: 5,
    color: '#4C6EF5',
    accessCode: 'CS101-ABC123'
  },
  {
    id: 2,
    code: 'MATH200',
    title: 'Advanced Calculus',
    description: 'In-depth exploration of calculus concepts including limits, derivatives, and integrals.',
    students: 32,
    quizzes: 4,
    color: '#F03E3E',
    accessCode: 'MATH200-XYZ789'
  },
  {
    id: 3,
    code: 'PHYS150',
    title: 'Physics for Scientists',
    description: 'Physical principles and their applications in modern technology and scientific research.',
    students: 28,
    quizzes: 3,
    color: '#40C057',
    accessCode: 'PHYS150-DEF456'
  },
  {
    id: 4,
    code: 'ENG210',
    title: 'Creative Writing',
    description: 'Techniques and practice in writing fiction, poetry, and creative non-fiction.',
    students: 51,
    quizzes: 0,
    color: '#FAB005',
    accessCode: 'ENG210-GHI789'
  }
];

// Load courses
const fetchCourses = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Use demo data in place of API call
    courses.value = DEMO_COURSES;
  } catch (err) {
    console.error('Error fetching courses:', err);
    error.value = 'Failed to load courses';
  } finally {
    isLoading.value = false;
  }
};

// Set active course
const setActiveCourse = async (courseId) => {
  isLoading.value = true;
  const course = courses.value.find(c => c.id === courseId);
  
  if (!course) {
    error.value = 'Course not found';
    isLoading.value = false;
    return;
  }
  
  activeCourse.value = course;
  courseAccessCode.value = course.accessCode;
  isLoading.value = false;
};

// Create a new course
const createCourse = async () => {
  if (!newCourse.value.code || !newCourse.value.title) {
    alert('Please enter course code and title');
    return;
  }
  
  isCreatingCourse.value = true;
  
  try {
    // Generate a random access code
    const accessCode = `${newCourse.value.code}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Create new course object
    const newCourseObj = {
      id: courses.value.length + 1,
      code: newCourse.value.code,
      title: newCourse.value.title,
      description: newCourse.value.description || 'No description available',
      students: 0,
      quizzes: 0,
      color: newCourse.value.color,
      accessCode: accessCode
    };
    
    // In a real app, this would be an API call
    // Wait for 1 second to simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add to courses list
    courses.value.push(newCourseObj);
    
    // Reset form
    newCourse.value = {
      code: '',
      title: '',
      description: '',
      color: '#4C6EF5'
    };
    
    // Close modal
    showAddCourseModal.value = false;
    
    // Show confirmation
    alert('Course created successfully!');
    
  } catch (err) {
    console.error('Error creating course:', err);
    alert('Failed to create course. Please try again.');
  } finally {
    isCreatingCourse.value = false;
  }
};

// Regenerate course access code
const regenerateAccessCode = async () => {
  if (!activeCourse.value) return;
  
  isGeneratingCode.value = true;
  
  try {
    // Generate a new access code
    const newAccessCode = `${activeCourse.value.code}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await new Promise(resolve => setTimeout(resolve, 1000));
    

    activeCourse.value.accessCode = newAccessCode;
    courseAccessCode.value = newAccessCode;
    
    alert('Access code regenerated successfully!');
    
  } catch (err) {
    console.error('Error regenerating access code:', err);
    alert('Failed to regenerate access code. Please try again.');
  } finally {
    isGeneratingCode.value = false;
  }
};

// Delete course
const deleteCourse = async () => {
  if (!activeCourse.value) return;
  
  // Confirm deletion
  if (!confirm(`Are you sure you want to delete ${activeCourse.value.code}: ${activeCourse.value.title}? This action cannot be undone.`)) {
    return;
  }
  
  try {
    // In a real app, this would be an API call
    // Wait for 1 second to simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove from courses list
    courses.value = courses.value.filter(c => c.id !== activeCourse.value.id);
    
    // Reset active course
    activeCourse.value = null;
    
    // Go back to dashboard
    activeSection.value = 'dashboard';
    
    // Show confirmation
    alert('Course deleted successfully!');
    
  } catch (err) {
    console.error('Error deleting course:', err);
    alert('Failed to delete course. Please try again.');
  }
};

// Load courses when component is mounted
onMounted(async () => {
  await fetchCourses();
});

// Course tabs
const courseTabs = [
  { id: "overview", name: "Overview", icon: "fas fa-home" },
  { id: "quizzes", name: "Quizzes", icon: "fas fa-clipboard-list" },
  { id: "students", name: "Students", icon: "fas fa-user-graduate" },
  { id: "materials", name: "Materials", icon: "fas fa-book" },
  { id: "analytics", name: "Analytics", icon: "fas fa-chart-bar" },
  { id: "ai-assistant", name: "AI Assistant", icon: "fas fa-robot" },
  { id: "settings", name: "Settings", icon: "fas fa-cog" },
];

const setActiveSection = (section) => {
  activeSection.value = section;
  activeCourse.value = null;
};

const selectCourse = async (course) => {
  // Set the active course
  await setActiveCourse(course.id);
  
  // Load data for the course in relevant stores
  if (activeTab.value === 'students') {
    await studentsStore.fetchStudents(course.id);
  } else if (activeTab.value === 'materials') {
    await materialsStore.fetchMaterials(course.id);
  } else if (activeTab.value === 'analytics') {
    await analyticsStore.fetchCourseAnalytics(course.id);
  } else if (activeTab.value === 'overview') {
    await overviewStore.fetchCourseOverview(course.id);
  }
  
  activeSection.value = null;
};

const logout = () => {
  isLoggingOut.value = true;
  setTimeout(() => {
    router.push("/login");
  }, 1000);
};

// Handler for tab changes from child components
const handleTabChange = (tab) => {
  activeTab.value = tab;
  
  // Load data for the active tab if needed
  if (activeCourse.value) {
    if (tab === 'students') {
      studentsStore.fetchStudents(activeCourse.value.id);
    } else if (tab === 'materials') {
      materialsStore.fetchMaterials(activeCourse.value.id);
    } else if (tab === 'analytics') {
      analyticsStore.fetchCourseAnalytics(activeCourse.value.id);
    } else if (tab === 'overview') {
      overviewStore.fetchCourseOverview(activeCourse.value.id);
    }
  }
};

// Add update course function
const updateCourse = async (updatedCourseData) => {
  if (!activeCourse.value) return;
  
  try {
    // In a real app, this would be an API call
    // Wait for 1 second to simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the course in the courses list
    const index = courses.value.findIndex(c => c.id === updatedCourseData.id);
    if (index !== -1) {
      courses.value[index] = {
        ...courses.value[index],
        code: updatedCourseData.code,
        title: updatedCourseData.title,
        description: updatedCourseData.description,
        color: updatedCourseData.color
      };
      
      // Update active course
      activeCourse.value = courses.value[index];
    }
    
    return true;
  } catch (err) {
    console.error('Error updating course:', err);
    alert('Failed to update course. Please try again.');
    return false;
  }
};

// Navigate to quizzes tab and create new quiz
const navigateToQuizzes = () => {
  activeTab.value = 'quizzes';
  handleTabChange('quizzes');
}

// New quiz generation handling
const showGeneratedQuiz = ref(false);
const generatedQuizData = ref(null);
const clearGeneratedQuiz = () => {
  showGeneratedQuiz.value = false;
  generatedQuizData.value = null;
};

const handleQuizGenerated = (quizData) => {
  showGeneratedQuiz.value = true;
  generatedQuizData.value = quizData;
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

.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* Side Panel Styles */
.side-panel {
  width: 280px;
  background-color: #2a2f4e;
  color: #ffffff;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  z-index: 10;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.side-panel::-webkit-scrollbar {
  width: 6px;
}

.side-panel::-webkit-scrollbar-track {
  background: transparent;
}

.side-panel::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

.side-panel::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.logo-container {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container h1 {
  color: #ff784b;
  font-size: 24px;
  font-weight: bold;
}

.side-nav {
  display: flex;
  flex-direction: column;
  padding: 15px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #e5e7eb;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item:focus {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Make sure we maintain keyboard focus outlines for accessibility */
.nav-item:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

/* Course Section in Side Nav */
.nav-section {
  margin: 15px 0;
}

.nav-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 25px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.add-icon {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.3s;
}

.add-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.course-item {
  padding: 12px 15px 12px 25px;
  font-size: 15px;
  margin: 4px 10px;
  border-radius: 8px;
}

.course-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.course-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.course-code {
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-title-small {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 280px;
}

.top-container {
  display: flex;
  justify-content: flex-end;
  padding: 15px 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

.dashboard-content {
  padding: 30px 40px;
  background-color: #f9fafb;
  min-height: calc(100vh - 64px);
}

.dashboard-content h1 {
  font-size: 28px;
  color: #111827;
  margin-bottom: 15px;
}

.dashboard-content p {
  color: #4b5563;
  font-size: 16px;
  margin-bottom: 24px;
}

/* Dashboard Stats */
.stats-container {
  display: flex;
  gap: 24px;
  margin-top: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  min-width: 150px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 32px;
  color: #ff784b;
  margin-bottom: 8px;
}

/* Course Header */
.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.course-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.course-color-large {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

/* Course Tabs */
.course-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 25px;
}

.course-tab {
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  position: relative;
  transition: all 0.2s;
}

.course-tab.active {
  color: #ff784b;
}

.course-tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ff784b;
}

.course-tab:hover:not(.active) {
  color: #111827;
  background-color: rgba(0, 0, 0, 0.02);
}

/* Tab Content */
.tab-content {
  margin-bottom: 40px;
}

.detail-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.detail-card h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.details-stats {
  display: flex;
  gap: 40px;
  margin: 25px 0;
}

.detail-stat {
  display: flex;
  flex-direction: column;
}

.detail-value {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.detail-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 5px;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.card-header-with-action h3 {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

/* Quiz List */
.quiz-list,
.student-list,
.materials-list {
  margin-top: 20px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item-content {
  flex: 1;
}

.list-item-content h4,
.list-item-content h5 {
  margin-bottom: 5px;
  color: #1f2937;
}

.list-item-content p {
  margin-bottom: 0;
  font-size: 14px;
  color: #6b7280;
}

.list-item-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-state p {
  margin-bottom: 20px;
  color: #6b7280;
}

/* Student List */
.list-header {
  display: flex;
  padding: 10px 15px;
  background-color: #f9fafb;
  font-weight: 500;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.list-header span,
.list-item span {
  flex: 1;
  max-width: 200px;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.search-btn {
  background-color: #ff784b;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 15px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #eee;
}

.pagination button {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Materials */
.material-category {
  margin-bottom: 30px;
}

.material-category h4 {
  font-size: 16px;
  color: #374151;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px dashed #e5e7eb;
}

/* Analytics */
.analytics-summary {
  display: flex;
  gap: 20px;
  margin: 25px 0;
}

.analytic-card {
  flex: 1;
  background-color: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.analytic-card h4 {
  font-size: 24px;
  color: #111827;
  margin-bottom: 5px;
}

.chart-container {
  margin: 25px 0;
}

.chart-container h4 {
  margin-bottom: 15px;
  color: #1f2937;
}

.mock-chart {
  height: 200px;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.chart-bar {
  width: 40px;
  background-color: #4c6ef5;
  border-radius: 4px 4px 0 0;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.full-width {
  width: 100%;
  margin-top: 15px;
}

/* Chatbot */
.chat-container {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 80%;
}

.ai-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4b5563;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #4c6ef5;
  color: white;
}

.message-content {
  background-color: white;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background-color: #4c6ef5;
  color: white;
}

.message-content p {
  margin-bottom: 5px;
}

.message-content p:last-child {
  margin-bottom: 0;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

.send-btn {
  background-color: #4c6ef5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  cursor: pointer;
}

/* Buttons */
.primary-button,
.secondary-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button {
  background-color: #ff784b;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #f96a3a;
}

.secondary-button {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary-button:hover {
  background-color: #f3f4f6;
}

/* Responsive Design */
@media (max-width: 992px) {
  .side-panel {
    width: 240px;
  }

  .main-content {
    margin-left: 240px;
  }
}

@media (max-width: 768px) {
  .side-panel {
    width: 220px;
  }

  .main-content {
    margin-left: 220px;
  }

  .top-container {
    padding: 15px 20px;
  }

  .course-item {
    padding: 10px 15px 10px 30px;
  }

  .course-tabs {
    overflow-x: auto;
  }

  .course-tab {
    padding: 12px 15px;
    white-space: nowrap;
  }

  .analytics-summary {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .side-panel {
    width: 100%;
    height: auto;
    position: relative;
    overflow-y: visible;
  }

  .side-nav {
    flex-direction: column;
    padding: 10px 0;
  }

  .nav-section {
    margin: 5px 0;
  }

  .logo-container {
    text-align: center;
  }

  .logo-container h1 {
    display: block;
    font-size: 18px;
  }

  .main-content {
    margin-left: 0;
  }

  .stats-container {
    flex-direction: column;
    gap: 15px;
  }

  .course-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .details-stats {
    flex-direction: column;
    gap: 20px;
  }

  .list-header,
  .list-item {
    display: none;
  }

  .list-item.mobile-view {
    display: block;
    padding: 15px 0;
  }

  .list-item.mobile-view .list-item-content {
    margin-bottom: 10px;
  }

  .list-item.mobile-view .list-item-actions {
    justify-content: flex-start;
  }

  .search-bar {
    flex-direction: column;
    gap: 10px;
  }

  .search-bar input {
    border-radius: 4px;
  }

  .search-btn {
    border-radius: 4px;
    width: 100%;
  }
}

.nav-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
  margin-right: 8px;
}

.course-tab i {
  margin-right: 8px;
}

.stat-icon {
  font-size: 24px;
  color: #ff784b;
  margin-bottom: 10px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(17, 24, 39, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.modal-header h3 i {
  color: #4C6EF5;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

/* Form styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4C6EF5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}
</style>
