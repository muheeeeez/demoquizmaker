<template>
  <div class="dashboard-container">
    <div class="dashboard-sidebar">
      <div class="sidebar-header">
        <h1>Student Dashboard</h1>
      </div>
      <div class="sidebar-courses">
        <h3>My Courses</h3>
        <ul class="course-list">
          <li v-for="course in courses" :key="course.id" 
              :class="{ active: selectedCourse && selectedCourse.id === course.id }"
              @click="checkQuizInProgress(() => selectCourse(course))">
            <span class="course-code">{{ course.code }}</span>
            <span class="course-name">{{ course.name }}</span>
          </li>
        </ul>
        <button class="join-course-btn" @click="showJoinCourseModal = true">
          <i class="fas fa-plus"></i> Join New Course
        </button>
      </div>
    </div>
    
    <div class="dashboard-main">
      <div class="dashboard-header">
        <div class="breadcrumbs">
          <span @click="clearCourseSelection" class="dashboard-home-link">Dashboard</span>
          <span v-if="selectedCourse"> &gt; {{ selectedCourse.name }}</span>
          <span v-if="selectedTab && selectedCourse"> &gt; {{ selectedTab }}</span>
        </div>
        <div class="user-profile">
          <span class="user-name">{{ user.name }}</span>
          <div class="user-avatar">
            <img :src="user.avatar" alt="User avatar" v-if="user.avatar">
            <div class="avatar-placeholder" v-else>{{ user.initials }}</div>
          </div>
        </div>
      </div>
      
      <!-- Course not selected - show dashboard overview -->
      <div v-if="!selectedCourse" class="dashboard-overview">
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ courses.length }}</span>
              <span class="stat-label">Enrolled Courses</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ upcomingQuizzes.length }}</span>
              <span class="stat-label">Upcoming Quizzes</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ completedQuizzes.length }}</span>
              <span class="stat-label">Completed Quizzes</span>
            </div>
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
      
      <!-- Course selected - show course content and tabs -->
      <div v-else class="course-content">
        <div class="course-tabs">
          <div class="tab" 
               :class="{ active: selectedTab === 'Overview' }"
               @click="checkQuizInProgress(() => selectedTab = 'Overview')">
            <i class="fas fa-home"></i> Overview
          </div>
          <div class="tab" 
               :class="{ active: selectedTab === 'Quizzes' }"
               @click="checkQuizInProgress(() => selectedTab = 'Quizzes')">
            <i class="fas fa-tasks"></i> Quizzes
          </div>
          <div class="tab" 
               :class="{ active: selectedTab === 'Materials' }"
               @click="checkQuizInProgress(() => selectedTab = 'Materials')">
            <i class="fas fa-book"></i> Materials
          </div>
          <div class="tab" 
               :class="{ active: selectedTab === 'Quiz Generator' }"
               @click="checkQuizInProgress(() => selectedTab = 'Quiz Generator')">
            <i class="fas fa-magic"></i> Quiz Generator
          </div>
        </div>
        
        <!-- Tab content -->
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
    
    <!-- Join Course Modal -->
    <div class="modal" v-if="showJoinCourseModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Join New Course</h2>
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
  name: 'John Doe',
  email: 'john.doe@example.com',
  initials: 'JD'
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
/* Base & Layout */
.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255, 120, 75, 0.03) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(58, 134, 255, 0.03) 0%, transparent 20%),
    radial-gradient(circle at 60% 40%, rgba(10, 166, 120, 0.03) 0%, transparent 30%);
  font-family: 'Inter', sans-serif;
  color: #333;
  overflow: hidden;
}

/* Sidebar Styling */
.dashboard-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #ffffff 0%, #fefefe 100%);
  box-shadow: 3px 0 20px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  z-index: 10;
  border-right: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
}

.dashboard-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, transparent 40%, rgba(255, 120, 75, 0.04) 100%);
  z-index: -1;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.sidebar-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff784b;
  position: relative;
  display: inline-block;
}

.sidebar-header h1::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 40%;
  height: 3px;
  background: linear-gradient(90deg, #ff784b, transparent);
  border-radius: 3px;
}

.sidebar-courses {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ff784b #f0f2f5;
}

.sidebar-courses::-webkit-scrollbar {
  width: 6px;
}

.sidebar-courses::-webkit-scrollbar-track {
  background: #f0f2f5;
  border-radius: 3px;
}

.sidebar-courses::-webkit-scrollbar-thumb {
  background-color: rgba(255, 120, 75, 0.3);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.sidebar-courses::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 120, 75, 0.5);
}

.sidebar-courses h3 {
  margin: 0 0 1rem 0;
  font-size: 0.85rem;
  color: #667085;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
}

.sidebar-courses h3::after {
  content: '';
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(0,0,0,0.07), transparent);
  margin-left: 0.5rem;
}

.course-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.course-list li {
  padding: 0.8rem 1rem;
  border-radius: 10px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  position: relative;
  background-color: rgba(255, 255, 255, 0.6);
}

.course-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 120, 75, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 10px;
  z-index: -1;
}

.course-list li:hover {
  background-color: #fff;
  border-color: #ffeae0;
  transform: translateX(3px) scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.course-list li:hover::before {
  opacity: 1;
}

.course-list li.active {
  background: #fff;
  border-color: rgba(255, 120, 75, 0.2);
  box-shadow: 0 5px 15px rgba(255, 120, 75, 0.15);
}

.course-list li.active::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 15%;
  bottom: 15%;
  width: 4px;
  background: linear-gradient(180deg, #ff784b, #ff9b7b);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 2px 8px rgba(255, 120, 75, 0.3);
}

.course-list li.active .course-code {
  color: #ff784b;
  text-shadow: 0 0 1px rgba(255, 120, 75, 0.1);
}

.course-code {
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #334155;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.course-name {
  font-size: 0.85rem;
  color: #64748B;
}

.join-course-btn {
  padding: 0.9rem;
  background: linear-gradient(135deg, #ff784b, #fa6a38);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(255, 106, 56, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.join-course-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.7s ease;
}

.join-course-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 7px 15px rgba(255, 106, 56, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

.join-course-btn:hover::before {
  left: 100%;
}

.join-course-btn i {
  margin-right: 0.5rem;
  transition: transform 0.3s ease;
}

.join-course-btn:hover i {
  transform: rotate(90deg);
}

/* Main Content Area Styling */
.dashboard-main {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(102, 112, 133, 0.3) #f9fafb;
}

.dashboard-main::-webkit-scrollbar {
  width: 8px;
}

.dashboard-main::-webkit-scrollbar-track {
  background: #f9fafb;
}

.dashboard-main::-webkit-scrollbar-thumb {
  background-color: rgba(102, 112, 133, 0.3);
  border-radius: 20px;
  border: 2px solid #f9fafb;
}

.dashboard-header {
  height: 70px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(234, 236, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 5;
}

.breadcrumbs {
  color: #475467;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.breadcrumbs span {
  margin-right: 0.4rem;
  position: relative;
}

.breadcrumbs span:not(:last-child)::after {
  content: '›';
  margin-left: 0.4rem;
  color: #98A2B3;
  font-size: 1.1rem;
  line-height: 1;
}

.user-profile {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.3rem 0.5rem 0.3rem 0.8rem;
  border-radius: 30px;
  border: 1px solid rgba(234, 236, 240, 0.8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.user-profile:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.user-name {
  margin-right: 1rem;
  font-weight: 600;
  color: #101828;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9b7b, #ff784b);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.user-avatar::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: 50%;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dashboard Overview Styling */
.dashboard-overview {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.8rem;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(234, 236, 240, 0.6);
  border: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  z-index: 2;
}

.stat-card::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.05;
  background-image: radial-gradient(circle at 0% 0%, var(--card-accent-color, rgba(255, 120, 75, 0.2)) 0%, transparent 50%);
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(234, 236, 240, 0.8);
}

.stat-card:hover::after {
  opacity: 0.1;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.2rem;
  font-size: 1.5rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 1;
}

.stat-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  z-index: -1;
}

/* Each stat card gets its unique accent color */
.stat-card:nth-child(1) { --card-accent-color: rgba(255, 165, 0, 0.2); }
.stat-card:nth-child(2) { --card-accent-color: rgba(58, 134, 255, 0.2); }
.stat-card:nth-child(3) { --card-accent-color: rgba(12, 166, 120, 0.2); }
.stat-card:nth-child(4) { --card-accent-color: rgba(138, 43, 226, 0.2); }

/* Vary icon backgrounds with enhanced shadows */
.stat-card:nth-child(1) .stat-icon { 
  background-color: #FFF6E5; 
  color: #FFA500; 
  box-shadow: 0 8px 16px rgba(255, 165, 0, 0.15), inset 0 -3px 6px rgba(255, 165, 0, 0.1); 
}
.stat-card:nth-child(2) .stat-icon { 
  background-color: #EBF5FF; 
  color: #3A86FF; 
  box-shadow: 0 8px 16px rgba(58, 134, 255, 0.15), inset 0 -3px 6px rgba(58, 134, 255, 0.1); 
}
.stat-card:nth-child(3) .stat-icon { 
  background-color: #E6FCF5; 
  color: #0CA678; 
  box-shadow: 0 8px 16px rgba(12, 166, 120, 0.15), inset 0 -3px 6px rgba(12, 166, 120, 0.1); 
}
.stat-card:nth-child(4) .stat-icon { 
  background-color: #F3E8FF; 
  color: #8A2BE2; 
  box-shadow: 0 8px 16px rgba(138, 43, 226, 0.15), inset 0 -3px 6px rgba(138, 43, 226, 0.1); 
}

.stat-card:hover .stat-icon {
  transform: rotate(-12deg) scale(1.15) translateY(-5px);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1D2939;
  margin-bottom: 0.25rem;
  background: linear-gradient(90deg, var(--value-color-1, #1D2939), var(--value-color-2, #334155));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

/* Custom gradient for each stat value */
.stat-card:nth-child(1) .stat-value { --value-color-1: #1D2939; --value-color-2: #664d00; }
.stat-card:nth-child(2) .stat-value { --value-color-1: #1D2939; --value-color-2: #004599; }
.stat-card:nth-child(3) .stat-value { --value-color-1: #1D2939; --value-color-2: #065f43; }
.stat-card:nth-child(4) .stat-value { --value-color-1: #1D2939; --value-color-2: #5c1e9e; }

.stat-label {
  font-size: 0.9rem;
  color: #667085;
  font-weight: 500;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(234, 236, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #101828;
  position: relative;
  display: inline-block;
  padding-left: 1rem;
}

.section-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 65%;
  background: linear-gradient(180deg, #ff784b, #ff9b7b);
  border-radius: 4px;
}

.section-header .view-all {
  font-size: 0.85rem;
  color: #ff784b;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.section-header .view-all:hover {
  color: #fa6a38;
  transform: translateX(2px);
}

.section-header .view-all i {
  font-size: 0.7rem;
}

.recent-activity,
.upcoming-deadlines {
  background-color: white;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
  border: none;
}

.recent-activity::before,
.upcoming-deadlines::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 120, 75, 0.03) 0%, transparent 70%);
  z-index: 0;
}

.recent-activity::before {
  top: -50px;
  right: -50px;
}

.upcoming-deadlines::before {
  bottom: -50px;
  left: -50px;
}

.activity-list,
.deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  z-index: 1;
}

.activity-item,
.deadline-item {
  display: flex;
  align-items: center;
  padding: 1.3rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(242, 244, 247, 0.8);
  position: relative;
  overflow: hidden;
}

.activity-item::after,
.deadline-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(249, 250, 251, 0.5) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.activity-item:hover,
.deadline-item:hover {
  background-color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.03);
  border-color: rgba(234, 236, 240, 0.8);
}

.activity-item:hover::after,
.deadline-item:hover::after {
  opacity: 1;
}

/* Activity Item Specific Styling */
.activity-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.2rem;
  font-size: 1.2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.activity-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  z-index: -1;
}

/* Activity Item Specific Icon Color with enhanced effects */
.activity-item .activity-icon.fa-check-circle { 
  background-color: #E6FCF5; 
  color: #0CA678; 
  box-shadow: 0 6px 12px rgba(12, 166, 120, 0.1), inset 0 -2px 5px rgba(12, 166, 120, 0.05);
}
.activity-item .activity-icon.fa-book { 
  background-color: #FFF6E5; 
  color: #FFA500; 
  box-shadow: 0 6px 12px rgba(255, 165, 0, 0.1), inset 0 -2px 5px rgba(255, 165, 0, 0.05);
}
.activity-item .activity-icon.fa-play-circle { 
  background-color: #F3E8FF; 
  color: #8A2BE2; 
  box-shadow: 0 6px 12px rgba(138, 43, 226, 0.1), inset 0 -2px 5px rgba(138, 43, 226, 0.05);
}

.activity-item:hover .activity-icon {
  transform: scale(1.1) rotate(-8deg);
}

.activity-content {
  flex-grow: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.activity-title {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #344054;
  font-size: 0.98rem;
}

.activity-description {
  font-size: 0.88rem;
  color: #667085;
  margin-bottom: 0.7rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-meta {
  display: flex;
  font-size: 0.78rem;
  color: #98A2B3;
  gap: 1.2rem;
}

.activity-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.activity-meta span i {
  font-size: 0.7rem;
}

/* Deadline Item Specific Styling */
.deadline-date {
  margin-right: 1.5rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.deadline-calendar {
  width: 60px;
  height: 65px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center center;
  position: relative;
}

.deadline-item:hover .deadline-calendar {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
}

.deadline-calendar::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.9);
  pointer-events: none;
}

.deadline-month {
  background: linear-gradient(135deg, #ff784b, #ff9b7b);
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
}

.deadline-month::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%);
}

.deadline-day {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 800;
  color: #344054;
  position: relative;
  padding-bottom: 0.3rem;
}

.deadline-day::after {
  content: '';
  position: absolute;
  left: 30%;
  bottom: 0.6rem;
  width: 40%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  border-radius: 1px;
}

.deadline-info {
  flex: 1;
  min-width: 0;
  margin-right: 1rem;
  position: relative;
  z-index: 1;
}

.deadline-info h4 {
  margin: 0 0 0.4rem 0;
  font-size: 0.98rem;
  font-weight: 600;
  color: #344054;
}

.deadline-info p {
  margin: 0 0 0.7rem 0;
  font-size: 0.88rem;
  color: #667085;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.deadline-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  font-size: 0.78rem;
  color: #667085;
}

.deadline-meta span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.deadline-meta span i {
  font-size: 0.85rem;
  opacity: 0.8;
}

.deadline-type {
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.deadline-item:hover .deadline-type {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

/* Enhanced deadline type styles */
.deadline-type.Quiz { 
  background: linear-gradient(135deg, #EBF5FF, #daeaff); 
  color: #3A86FF; 
  border: 1px solid rgba(58, 134, 255, 0.1);
}
.deadline-type.Exam { 
  background: linear-gradient(135deg, #FFF6E5, #ffefd0); 
  color: #FFA500; 
  border: 1px solid rgba(255, 165, 0, 0.1);
}

.deadline-action {
  min-width: 110px;
  text-align: right;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.deadline-action button {
  position: relative;
  overflow: hidden;
}

.deadline-action button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 15px;
  bottom: -10px;
  left: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.03));
  border-radius: 50%;
  transition: all 0.3s ease;
}

.deadline-action button:hover::after {
  bottom: -5px;
}

/* Course Content Area Styling */
.course-content {
  padding: 2rem;
  position: relative;
}

.course-content::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  background: radial-gradient(circle, rgba(58, 134, 255, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.course-tabs {
  display: flex;
  margin-bottom: 2rem;
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 16px;
  padding: 0.6rem;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.tab {
  padding: 0.9rem 1.3rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-radius: 12px;
  border-bottom: none;
  color: #475467;
  flex: 1;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.tab::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent, rgba(0, 0, 0, 0.01), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab i {
  color: #98A2B3;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 1.1rem;
  position: relative;
}

.tab:hover {
  background-color: rgba(255, 255, 255, 0.5);
  color: #ff784b;
}

.tab:hover::before {
  opacity: 1;
}

.tab:hover i {
  color: #ff784b;
  transform: translateY(-2px);
}

.tab.active {
  background-color: white;
  color: #ff784b;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.tab.active i {
  color: #ff784b;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  width: 40%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ff784b, transparent);
  border-radius: 3px 3px 0 0;
}

.tab-content {
  position: relative;
  z-index: 1;
  min-height: 300px;
}

/* Modal Styling (Enhanced) */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 1.5rem;
  animation: fadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-content {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.modal-content::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, rgba(255, 120, 75, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.modal-header {
  padding: 1.5rem 1.8rem;
  background: linear-gradient(135deg, #ff784b, #ff9b7b);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
}

.close-btn::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-btn:hover::after {
  opacity: 1;
}

.modal-body {
  padding: 1.8rem;
  overflow-y: auto;
  flex: 1;
  position: relative;
  z-index: 1;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  color: #344054;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.form-group label i {
  color: #98A2B3;
  font-size: 0.85rem;
}

.form-group:focus-within label {
  color: #ff784b;
}

.form-group:focus-within label i {
  color: #ff784b;
}

.form-group input {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 1px solid #D0D5DD;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #101828;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
  background-color: white;
}

.form-group input:hover {
  border-color: #b9c0cb;
  box-shadow: 0 2px 4px rgba(16, 24, 40, 0.05);
}

.form-group input:focus {
  outline: none;
  border-color: #ff784b;
  box-shadow: 0 0 0 4px rgba(255, 120, 75, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
}

/* Enhanced Button Styles */
.primary-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #ff784b, #fa6a38);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 15px rgba(255, 106, 56, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  position: relative;
  overflow: hidden;
}

.primary-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.7s ease;
  z-index: 1;
}

.primary-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 20px rgba(255, 106, 56, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

.primary-button:hover::before {
  left: 100%;
}

.primary-button i {
  font-size: 1rem;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.primary-button:hover i {
  transform: translateX(2px);
}

.primary-button span {
  position: relative;
  z-index: 2;
}

.secondary-button {
  padding: 0.8rem 1.5rem;
  background-color: white;
  color: #344054;
  border: 1px solid #D0D5DD;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.05);
  position: relative;
  overflow: hidden;
}

.secondary-button::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, transparent, rgba(0, 0, 0, 0.02), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.secondary-button:hover {
  background-color: #f9fafb;
  border-color: #aeb6c1;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(16, 24, 40, 0.08);
}

.secondary-button:hover::before {
  opacity: 1;
}

/* Enhanced Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 120, 75, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 120, 75, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 120, 75, 0); }
}

/* Enhanced Responsive Adjustments */
@media (max-width: 1200px) {
  .dashboard-sidebar {
    width: 260px;
  }
}

@media (max-width: 992px) {
  .dashboard-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .dashboard-sidebar {
    width: 100%;
    height: auto;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  }
  
  .sidebar-courses {
    max-height: 250px;
    flex-grow: 0;
  }

  .dashboard-header {
    padding: 0 1.5rem;
    height: 65px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.2rem;
  }
  
  .course-tabs {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0.5rem;
    border-radius: 12px;
  }
  
  .tab {
    flex: 0 0 auto;
    min-width: 120px;
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .activity-item,
  .deadline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.2rem 1rem;
  }

  .activity-icon,
  .deadline-date {
    margin-right: 0;
    align-self: flex-start;
  }

  .deadline-action {
    width: 100%;
    margin-top: 1rem;
    text-align: left;
  }
  
  .dashboard-overview, 
  .course-content {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .modal-content {
    max-width: 92%;
  }
}

@media (max-width: 576px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
    justify-content: center;
  }
  
  .user-profile {
    gap: 0.5rem;
    padding: 0.2rem 0.3rem 0.2rem 0.5rem;
  }
  
  .user-name {
    display: none;
  }
  
  .dashboard-header {
    padding: 0 1rem;
    height: 60px;
  }
  
  .dashboard-overview, 
  .course-content {
    padding: 1rem;
    gap: 1.2rem;
  }
  
  .course-tabs {
    padding: 0.3rem;
    margin-bottom: 1.2rem;
  }
  
  .tab {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
    gap: 0.4rem;
    min-width: 100px;
  }
  
  .modal {
    padding: 0.8rem;
  }
  
  .modal-header {
    padding: 1.2rem 1.5rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
}

.dashboard-home-link {
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  font-weight: 600;
}

.dashboard-home-link:hover {
  color: #ff784b;
}

.dashboard-home-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background-color: #ff784b;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.dashboard-home-link:hover::after {
  transform: scaleX(1);
}

/* Add CSS for the quiz modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.quiz-modal-content {
  width: 90%;
  max-width: 900px;
  height: 90vh;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.confirmation-modal {
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #ff784b, #ff9b7b);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #e0e0e0;
}

.primary-button, .secondary-button {
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.primary-button {
  background: linear-gradient(135deg, #ff784b, #ff9b7b);
  color: white;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 120, 75, 0.2);
}

.secondary-button {
  background-color: #f0f2f5;
  color: #555;
}

.secondary-button:hover {
  background-color: #e2e6eb;
}

.primary-button.warning {
  background: linear-gradient(135deg, #ff4b4b, #ff7b7b);
}
</style>
