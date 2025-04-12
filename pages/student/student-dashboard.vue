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
          :class="{ active: !selectedCourse }"
          @click="clearCourseSelection"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>

        <!-- Courses Section -->
        <div class="nav-section">
          <div class="nav-section-header">
            <span>My Courses</span>
            <button class="add-icon" @click="showJoinCourseModal = true">
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
                selectedCourse &&
                selectedCourse.id === course.id,
            }"
            @click="checkQuizInProgress(() => selectCourse(course))"
          >
            <div
              class="course-color"
              :style="{ backgroundColor: course.color || '#ff784b' }"
            ></div>
            <div class="course-info">
              <span class="course-code">{{ course.code }}</span>
              <span class="course-title-small">{{ course.name }}</span>
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
          <div class="user-avatar">
            <img :src="user.avatar" alt="User avatar" v-if="user.avatar">
            <div class="avatar-placeholder" v-else>{{ user.initials }}</div>
          </div>
            <p>{{ user.name }}</p>
        </div>
          <div class="navbar-container logout-container" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            <p class="logout">Logout</p>
      </div>
            </div>
          </div>
          
      <!-- Dashboard content -->
      <div class="dashboard-content">
        <!-- Main Dashboard View -->
        <div v-if="!selectedCourse">
          <h1>Welcome, Student!</h1>
          <p>
            This is your dashboard. You can access your courses, quizzes, and materials here.
          </p>

          <div class="stats-container">
          <div class="stat-card">
              <i class="fas fa-graduation-cap stat-icon"></i>
              <h3>{{ courses.length }}</h3>
              <p>Enrolled Courses</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-clipboard-check stat-icon"></i>
              <h3>{{ upcomingQuizzes.length }}</h3>
              <p>Upcoming Quizzes</p>
            </div>
          <div class="stat-card">
              <i class="fas fa-check-circle stat-icon"></i>
              <h3>{{ completedQuizzes.length }}</h3>
              <p>Completed Quizzes</p>
          </div>
        </div>
        
        <div class="upcoming-deadlines">
          <div class="section-header">
            <h2>Upcoming Quizzes</h2>
          </div>
          
          <div class="deadlines-list" v-if="upcomingQuizzes.length">
            <div class="deadline-item" v-for="quiz in upcomingQuizzes" :key="quiz.id">
              <div class="deadline-date">
                <div class="deadline-calendar">
                  <div class="deadline-month">{{ formatMonth(quiz.dueDate) }}</div>
                  <div class="deadline-day">{{ formatDay(quiz.dueDate) }}</div>
                </div>
              </div>
              <div class="deadline-info">
                <h4>{{ quiz.title }}</h4>
                <div class="deadline-meta">
                  <span class="deadline-time">
                    <i class="fas fa-clock"></i> {{ formatTime(quiz.dueDate) }}
                  </span>
                  <span class="deadline-course">
                    {{ courses.find(c => c.id === quiz.courseId)?.code || 'Unknown Course' }}
                  </span>
                </div>
              </div>
              <div class="deadline-action">
                <button class="primary-button" @click="startQuiz(quiz)">Start Quiz</button>
              </div>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <i class="fas fa-calendar-check"></i>
            <p>No upcoming quizzes</p>
          </div>
        </div>
      </div>
      
        <!-- Course View -->
        <div v-else>
          <div class="course-header">
            <div class="course-title">
              <div
                class="course-color-large"
                :style="{ backgroundColor: selectedCourse.color || '#ff784b' }"
              ></div>
              <h1>
                {{ selectedCourse.code }}:
                {{ selectedCourse.name }}
              </h1>
            </div>
          </div>

          <!-- Course Tabs -->
        <div class="course-tabs">
            <div
              class="course-tab"
               :class="{ active: selectedTab === 'Overview' }"
              @click="checkQuizInProgress(() => selectedTab = 'Overview')"
            >
            <i class="fas fa-home"></i> Overview
          </div>
            <div
              class="course-tab"
               :class="{ active: selectedTab === 'Quizzes' }"
              @click="checkQuizInProgress(() => selectedTab = 'Quizzes')"
            >
            <i class="fas fa-tasks"></i> Quizzes
          </div>
            <div
              class="course-tab"
               :class="{ active: selectedTab === 'Materials' }"
              @click="checkQuizInProgress(() => selectedTab = 'Materials')"
            >
            <i class="fas fa-book"></i> Materials
          </div>
            <div
              class="course-tab"
               :class="{ active: selectedTab === 'Quiz Generator' }"
              @click="checkQuizInProgress(() => selectedTab = 'Quiz Generator')"
            >
            <i class="fas fa-magic"></i> Quiz Generator
          </div>
        </div>
        
          <!-- Tab Content -->
        <div class="tab-content">
          <StudentCourseOverview 
            v-if="selectedTab === 'Overview'" 
            :course="selectedCourse" 
          />
          <StudentCourseQuizzes 
            v-else-if="selectedTab === 'Quizzes'" 
            :courseId="selectedCourse.id" 
          />
          <StudentCourseMaterials 
            v-else-if="selectedTab === 'Materials'" 
            :course="selectedCourse"
            @start-quiz="startQuiz"
          />
          <StudentCourseStudyNotes 
            v-else-if="selectedTab === 'Quiz Generator'" 
            :courseId="selectedCourse.id" 
            @start-quiz="startQuiz"
          />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Join Course Modal -->
    <div v-if="showJoinCourseModal" class="modal-overlay" @click.self="showJoinCourseModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-plus-circle"></i> Join New Course</h3>
          <button class="close-btn" @click="showJoinCourseModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="joinCourse">
            <div class="form-group">
              <label for="courseCode">
                <i class="fas fa-hashtag"></i>
                Course Code
              </label>
              <input type="text" id="courseCode" v-model="joinCourseForm.code" placeholder="Enter course code" required>
            </div>
            <div class="form-group">
              <label for="enrollKey">
                <i class="fas fa-key"></i>
                Enrollment Key
              </label>
              <input type="text" id="enrollKey" v-model="joinCourseForm.enrollKey" placeholder="Enter enrollment key" required>
            </div>
            <div class="form-actions">
              <button type="button" class="secondary-button" @click="showJoinCourseModal = false">
                <i class="fas fa-times"></i>
                <span>Cancel</span>
              </button>
              <button type="submit" class="primary-button">
                <i class="fas fa-plus-circle"></i>
                <span>Join Course</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Quiz Taking Modal -->
    <div v-if="showQuizModal" class="modal-overlay" @click.self="confirmCloseQuiz">
      <div class="quiz-modal-content">
        <quiz-taking 
          :quiz="activeQuiz" 
          @close="confirmCloseQuiz" 
          @submit="handleQuizSubmit"
        />
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="modal-overlay">
      <div class="confirmation-modal">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Exit Quiz?</h3>
        </div>
        
        <div class="modal-body">
          <p>Are you sure you want to exit this quiz? <strong>Your quiz will be automatically submitted with your current answers.</strong></p>
        </div>
        
        <div class="modal-footer">
          <button class="secondary-button" @click="cancelExit">
            Return to Quiz
          </button>
          <button class="primary-button warning" @click="confirmExit">
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import StudentCourseOverview from '../../components/student/CourseOverview.vue';
import StudentCourseQuizzes from '../../components/student/CourseQuizzes.vue';
import StudentCourseMaterials from '../../components/student/CourseMaterials.vue';
import StudentCourseStudyNotes from '../../components/student/CourseStudyNotes.vue';
import QuizTaking from '../../components/student/QuizTaking.vue';

// User data
const user = ref({
  id: 'student1',
  name: 'Abdul',
  email: 'abdul@example.com',
  initials: 'AB'
});

// Mock courses data
const courses = ref([
  {
    id: 'course1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Smith',
    credits: 3,
    semester: 'Fall 2023',
    progress: 45,
    description: 'An introductory course to computer science principles and programming fundamentals.'
  },
  {
    id: 'course2',
    code: 'MATH201',
    name: 'Calculus II',
    instructor: 'Dr. Johnson',
    credits: 4,
    semester: 'Fall 2023',
    progress: 75,
    description: 'Advanced calculus topics including integration techniques, sequences, and series.'
  },
  {
    id: 'course3',
    code: 'PHYS101',
    name: 'Introduction to Physics',
    instructor: 'Dr. Williams',
    credits: 4,
    semester: 'Fall 2023',
    progress: 30,
    description: 'Fundamental principles of physics, including mechanics, heat, and sound.'
  }
]);

// Mock quizzes data
const quizzes = ref([
  {
    id: 'quiz1',
    courseId: 'course1',
    title: 'Variables and Data Types',
    dueDate: new Date(2023, 10, 25, 23, 59),
    status: 'pending'
  },
  {
    id: 'quiz2',
    courseId: 'course1',
    title: 'Control Structures',
    dueDate: new Date(2023, 10, 18, 23, 59),
    status: 'completed',
    score: 85
  },
  {
    id: 'quiz3',
    courseId: 'course2',
    title: 'Integration Methods',
    dueDate: new Date(2023, 10, 22, 23, 59),
    status: 'pending'
  },
  {
    id: 'quiz4',
    courseId: 'course2',
    title: 'Series and Convergence',
    dueDate: new Date(2023, 10, 15, 23, 59),
    status: 'completed',
    score: 92
  },
  {
    id: 'quiz5',
    courseId: 'course3',
    title: 'Newton\'s Laws',
    dueDate: new Date(2023, 10, 20, 23, 59),
    status: 'pending'
  }
]);

// Mock activities data
const activities = ref([
  {
    id: 'activity1',
    title: 'Quiz Completed',
    description: 'You scored 85% on "Control Structures" quiz',
    course: 'CS101 - Introduction to Computer Science',
    timestamp: new Date(2023, 10, 15, 14, 30),
    icon: 'fas fa-check-circle'
  },
  {
    id: 'activity2',
    title: 'New Material Available',
    description: 'New lecture slides for "Integration Methods" have been posted',
    course: 'MATH201 - Calculus II',
    timestamp: new Date(2023, 10, 14, 9, 45),
    icon: 'fas fa-book'
  },
  {
    id: 'activity3',
    title: 'Quiz Started',
    description: 'You started the "Series and Convergence" quiz',
    course: 'MATH201 - Calculus II',
    timestamp: new Date(2023, 10, 13, 16, 20),
    icon: 'fas fa-play-circle'
  }
]);

// Mock deadlines data
const deadlines = ref([
  {
    id: 'deadline1',
    title: 'Variables and Data Types Quiz',
    description: 'Complete the quiz on variables and basic data types',
    dueDate: new Date(2023, 10, 25, 23, 59),
    course: 'CS101',
    type: 'Quiz'
  },
  {
    id: 'deadline2',
    title: 'Integration Methods Quiz',
    description: 'Complete the quiz on various integration techniques',
    dueDate: new Date(2023, 10, 22, 23, 59),
    course: 'MATH201',
    type: 'Quiz'
  },
  {
    id: 'deadline3',
    title: 'Newton\'s Laws Quiz',
    description: 'Complete the quiz on Newton\'s laws of motion',
    dueDate: new Date(2023, 10, 20, 23, 59),
    course: 'PHYS101',
    type: 'Quiz'
  }
]);

// State variables
const selectedCourse = ref(null);
const selectedTab = ref('Overview');
const showJoinCourseModal = ref(false);
const joinCourseForm = ref({
  code: '',
  enrollKey: ''
});
const showQuizModal = ref(false);
const showConfirmationModal = ref(false);
const activeQuiz = ref(null);
const pendingAction = ref(null);
const quizStartTime = ref(null);

// Computed properties
const upcomingQuizzes = computed(() => {
  return quizzes.value.filter(quiz => quiz.status === 'pending');
});

const completedQuizzes = computed(() => {
  return quizzes.value.filter(quiz => quiz.status === 'completed');
});

const totalStudyHours = computed(() => {
  // Mock calculation - in a real app this would come from tracked time
  return 26;
});

const upcomingDeadlines = computed(() => {
  return deadlines.value.filter(deadline => {
    return deadline.dueDate > new Date();
  }).sort((a, b) => a.dueDate - b.dueDate);
});

// Methods
function selectCourse(course) {
  // Update the selected course directly
  selectedCourse.value = course;
  
  // Always default to Overview tab when selecting a course
  selectedTab.value = 'Overview';
}

function joinCourse() {
  // Mock implementation - would call an API in a real app
  const newCourse = {
    id: `course${courses.value.length + 1}`,
    code: joinCourseForm.value.code,
    name: `New Course ${joinCourseForm.value.code}`,
    instructor: 'TBD',
    credits: 3,
    semester: 'Fall 2023',
    progress: 0,
    description: 'Course description will be available soon.'
  };
  
  courses.value.push(newCourse);
  joinCourseForm.value = { code: '', enrollKey: '' };
  showJoinCourseModal.value = false;
  
  // Optionally select the new course
  selectCourse(newCourse);
}

function clearCourseSelection() {
  selectedCourse.value = null;
}

function startQuiz(quiz) {
  activeQuiz.value = quiz;
  quizStartTime.value = Date.now();
  showQuizModal.value = true;
}

function confirmCloseQuiz() {
  if (showQuizModal.value) {
    showConfirmationModal.value = true;
    return true; // Indicates we're showing a confirmation
  }
  return false; // No confirmation needed
}

function cancelExit() {
  showConfirmationModal.value = false;
}

function confirmExit() {
  showConfirmationModal.value = false;
  showQuizModal.value = false;
  
  // Process quiz submission
  if (activeQuiz.value) {
    // Auto-submit the quiz with current answers
    handleAutoSubmit();
  }
  
  // If we had a pending action, execute it now
  if (pendingAction.value) {
    pendingAction.value();
    pendingAction.value = null;
  }
}

function handleAutoSubmit() {
  // Calculate a score based on current answers
  const timeSpent = Math.floor((Date.now() - quizStartTime.value) / 1000);
  
  const results = {
    quizId: activeQuiz.value.id,
    score: 0, // The actual score would be calculated based on answers
    timeTaken: timeSpent
  };
  
  console.log('Quiz auto-submitted due to navigation:', activeQuiz.value);
  
  // Reset active quiz
  activeQuiz.value = null;
}

function handleQuizSubmit(results) {
  // Update the quiz with results
  if (activeQuiz.value) {
    activeQuiz.value.status = 'completed';
    activeQuiz.value.completedAt = new Date();
    activeQuiz.value.score = results.score;
    activeQuiz.value.timeTaken = results.timeTaken;
    
    // You would typically save this to the backend
    console.log('Quiz completed:', activeQuiz.value);
    
    // If we want to show results, we could do that here
    // For now, just close the quiz
    showQuizModal.value = false;
    activeQuiz.value = null;
  }
}

// Helper functions for formatting dates
function formatDate(date) {
  if (!date) return '';
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
}

function formatDay(date) {
  return date.getDate();
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// Add a function to check if a navigation action should trigger quiz confirmation
function checkQuizInProgress(action) {
  if (showQuizModal.value) {
    showConfirmationModal.value = true;
    pendingAction.value = action;
    return true;
  }
  
  // No quiz in progress, perform the action immediately
  action();
  return false;
}
</script>

<style scoped>
/* Dashboard Layout */
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Side Panel */
.side-panel {
  width: 280px;
  background-color: #1f2937;
  color: #f3f4f6;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo-container {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.logo-container h1 {
  font-size: 28px;
  font-weight: 700;
  color: #ff784b;
  margin: 0;
  letter-spacing: -0.02em;
}

.side-nav {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  border-radius: 0 6px 6px 0;
  margin-right: 12px;
}

.nav-item i {
  margin-right: 14px;
  width: 18px;
  text-align: center;
  font-size: 16px;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateX(2px);
}

.nav-item.active {
  background-color: rgba(255, 120, 75, 0.18);
  color: #ff784b;
  font-weight: 500;
  position: relative;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 30%;
  height: 40%;
  width: 4px;
  background-color: #ff784b;
  border-radius: 0 2px 2px 0;
}

.nav-section {
  margin-top: 30px;
}

.nav-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 10px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #9ca3af;
  font-weight: 500;
}

.add-icon {
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-icon:hover {
  background-color: rgba(255, 120, 75, 0.3);
  color: #ff784b;
  transform: rotate(90deg);
}

.course-item {
  padding: 10px 24px;
  margin-bottom: 4px;
}

.course-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 12px;
  flex-shrink: 0;
}

.course-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.course-code {
  font-weight: 600;
  font-size: 14px;
}

.course-title-small {
  font-size: 13px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-container {
  padding: 0 24px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.navbar-container {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4b5563;
  margin-right: 12px;
  font-size: 16px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
}

.user-info p {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
}

.logout-container {
  cursor: pointer;
  color: #4b5563;
  transition: color 0.2s;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
}

.logout-container:hover {
  color: #ff784b;
  background-color: #f9fafb;
}

.logout-container i {
  margin-right: 8px;
}

/* Dashboard content */
.dashboard-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background-color: #f9fafb;
}

.dashboard-content h1 {
  font-size: 28px;
  color: #111827;
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.dashboard-content p {
  color: #4b5563;
  margin-bottom: 32px;
  font-size: 16px;
  line-height: 1.5;
}

/* Stats Container */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 36px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0,0,0,0.02);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 28px;
  color: #ff784b;
  margin-bottom: 16px;
}

.stat-card h3 {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.stat-card p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

/* Upcoming Deadlines */
.upcoming-deadlines {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.02);
}

.section-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  color: #111827;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.section-header h2:before {
  content: '';
  width: 4px;
  height: 18px;
  background-color: #ff784b;
  margin-right: 10px;
  border-radius: 2px;
}

.deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deadline-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  background-color: #f9fafb;
  transition: all 0.2s ease;
  border: 1px solid #f3f4f6;
}

.deadline-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 120, 75, 0.1);
}

.deadline-date {
  margin-right: 18px;
}

.deadline-calendar {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 60px;
  text-align: center;
}

.deadline-month {
  background-color: #ff784b;
  color: white;
  padding: 3px 0;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.deadline-day {
  padding: 6px 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.deadline-info {
  flex: 1;
}

.deadline-info h4 {
  margin: 0 0 8px 0;
  font-size: 17px;
  color: #111827;
  font-weight: 600;
}

.deadline-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
}

.deadline-action {
  margin-left: 18px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* Course View */
.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.course-title {
  display: flex;
  align-items: center;
}

.course-color-large {
  width: 16px;
  height: 45px;
  border-radius: 4px;
  margin-right: 16px;
}

.course-title h1 {
  margin: 0;
  font-size: 24px;
}

.course-tabs {
  display: flex;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.course-tab {
  padding: 16px 22px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #4b5563;
  display: flex;
  align-items: center;
  font-size: 15px;
  border-bottom: 3px solid transparent;
}

.course-tab i {
  margin-right: 10px;
  font-size: 16px;
}

.course-tab:hover {
  background-color: #f9fafb;
  color: #374151;
}

.course-tab.active {
  background-color: #f9fafb;
  color: #ff784b;
  border-bottom: 3px solid #ff784b;
  font-weight: 600;
}

.tab-content {
  background-color: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content, .confirmation-modal {
  background-color: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease;
}

.quiz-modal-content {
  background-color: white;
  border-radius: 12px;
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #111827;
  font-weight: 600;
}

.modal-header h3 i {
  color: #ff784b;
  margin-right: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 18px 24px;
  border-top: 1px solid #e5e7eb;
}

/* Forms */
.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #374151;
  font-size: 15px;
}

.form-group input, 
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  color: #111827;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.form-group input:hover, 
.form-group select:hover,
.form-group textarea:hover {
  border-color: #b5bac3;
}

.form-group input:focus, 
.form-group select:focus,
.form-group textarea:focus {
  border-color: #ff784b;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
  background-color: white;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* Buttons */
.primary-button {
  padding: 12px 18px;
  background-color: #ff784b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(255, 120, 75, 0.2);
}

.primary-button:hover {
  background-color: #e5683b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 120, 75, 0.25);
}

.primary-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(255, 120, 75, 0.2);
}

.primary-button.warning {
  background-color: #ef4444;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.primary-button.warning:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.25);
}

.secondary-button {
  padding: 12px 18px;
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.secondary-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  transform: translateY(-2px);
}

.secondary-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .side-panel {
    width: 100%;
    height: auto;
    max-height: 300px;
  }

  .dashboard-content {
    padding: 24px 16px;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .course-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .course-tabs {
    flex-wrap: wrap;
  }

  .course-tab {
    padding: 12px 16px;
    font-size: 14px;
  }

  .tab-content {
    padding: 20px 16px;
  }
}
</style>
