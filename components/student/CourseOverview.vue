<template>
  <div class="course-overview">
    <div class="overview-header">
      <h2>Course Overview</h2>
    </div>

    <div class="overview-cards">
      <!-- Course Summary Card -->
      <div class="overview-card course-summary">
        <div class="card-header">
          <h3><i class="fas fa-info-circle"></i> Course Information</h3>
        </div>
        <div class="card-content">
          <p class="course-description">{{ course.description || 'No description available for this course.' }}</p>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Course Code</label>
              <span>{{ course.code }}</span>
            </div>
            <div class="info-item">
              <label>Instructor</label>
              <span>Professor Sarah Williams</span>
            </div>
            <div class="info-item">
              <label>Start Date</label>
              <span>{{ getFormattedDate() }}</span>
            </div>
            <div class="info-item">
              <label>Credits</label>
              <span>{{ course.credits || 3 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Card -->
      <div class="overview-card progress-summary">
        <div class="card-header">
          <h3><i class="fas fa-chart-line"></i> Your Progress</h3>
        </div>
        <div class="card-content">
          <div class="progress-container">
            <div class="progress-circle">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="#edf2f7" stroke-width="12" />
                <circle 
                  cx="70" 
                  cy="70" 
                  r="60" 
                  fill="none" 
                  stroke="#ff784b" 
                  stroke-width="12"
                  stroke-dasharray="376.8"
                  :stroke-dashoffset="376.8 - (376.8 * progress / 100)"
                  transform="rotate(-90, 70, 70)"
                  stroke-linecap="round"
                />
              </svg>
              <div class="progress-text">
                <span class="progress-percentage">{{ progress }}%</span>
                <span class="progress-label">Complete</span>
              </div>
            </div>
          </div>

          <div class="progress-stats">
            <div class="stat-item">
              <span class="stat-value">{{ completedQuizzes }}</span>
              <span class="stat-label">Completed Quizzes</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ pendingQuizzes }}</span>
              <span class="stat-label">Pending Quizzes</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ averageScore }}%</span>
              <span class="stat-label">Average Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Deadlines -->
    <div class="overview-card deadlines-card">
      <div class="card-header">
        <h3><i class="fas fa-calendar-alt"></i> Upcoming Deadlines</h3>
      </div>
      <div class="card-content">
        <div v-if="upcomingDeadlines.length === 0" class="empty-state">
          <i class="fas fa-calendar-check"></i>
          <p>No upcoming deadlines for this course.</p>
        </div>
        <div v-else class="deadlines-list">
          <div v-for="(deadline, index) in upcomingDeadlines" :key="index" class="deadline-item">
            <div class="deadline-date">
              <div class="deadline-calendar">
                <div class="deadline-month">{{ deadline.month }}</div>
                <div class="deadline-day">{{ deadline.day }}</div>
              </div>
            </div>
            <div class="deadline-info">
              <h4>{{ deadline.title }}</h4>
              <p>{{ deadline.description }}</p>
              <div class="deadline-meta">
                <span class="deadline-time"><i class="fas fa-clock"></i> {{ deadline.time }}</span>
                <span class="deadline-type" :class="deadline.type">{{ deadline.type }}</span>
              </div>
            </div>
            <div class="deadline-action">
              <button v-if="deadline.type === 'Quiz'" class="primary-button" @click="viewDeadline(deadline)">
                <i class="fas fa-play-circle"></i>
                <span>Start Quiz</span>
              </button>
              <button v-else class="secondary-button" @click="viewDeadline(deadline)">
                <i class="fas fa-eye"></i>
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

// Mock data for course progress
const completedQuizzes = ref(3);
const pendingQuizzes = ref(2);
const averageScore = ref(82);
const progress = computed(() => {
  return Math.round((completedQuizzes.value / (completedQuizzes.value + pendingQuizzes.value)) * 100);
});

// Mock data for upcoming deadlines
const upcomingDeadlines = ref([
  {
    title: 'Quiz 3: Control Structures',
    description: 'Test your knowledge of conditionals and loops',
    month: 'Apr',
    day: '15',
    time: '11:59 PM',
    type: 'Quiz'
  },

  {
    title: 'Midterm Exam',
    description: 'Covers all topics from weeks 1-5',
    month: 'May',
    day: '01',
    time: '10:00 AM',
    type: 'Exam'
  }
]);

// Function to format date (simulate data from the backend)
const getFormattedDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30); // Start date is about a month ago
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Function to handle viewing a deadline
const viewDeadline = (deadline) => {
  console.log('Viewing deadline:', deadline);
  // In a real implementation, this would navigate to the deadline details
};
</script>

<style scoped>
.course-overview {
  margin-bottom: 30px;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.overview-header {
  margin-bottom: 24px;
}

.overview-header h2 {
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 12px;
}

.overview-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #ff784b;
  border-radius: 2px;
}

.overview-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.overview-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.overview-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.card-header {
  background-color: #f9fafb;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.card-header h3 i {
  margin-right: 10px;
  color: #ff784b;
}

.card-content {
  padding: 24px;
}

/* Course Summary Card */
.course-description {
  margin-top: 0;
  margin-bottom: 24px;
  color: #4b5563;
  line-height: 1.6;
  font-size: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
  font-weight: 500;
}

.info-item span {
  font-weight: 600;
  color: #111827;
  font-size: 15px;
}

/* Progress Card */
.progress-container {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.progress-circle {
  position: relative;
  width: 140px;
  height: 140px;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.progress-percentage {
  font-size: 34px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
}

.progress-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background-color: #f3f4f6;
  transform: translateY(-2px);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* Deadlines Card */
.deadlines-card {
  margin-top: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

.deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deadline-item {
  display: flex;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 10px;
  transition: all 0.2s ease;
  border: 1px solid #f3f4f6;
}

.deadline-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 120, 75, 0.1);
}

.deadline-date {
  margin-right: 20px;
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
  flex-grow: 1;
}

.deadline-info h4 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 17px;
  font-weight: 600;
}

.deadline-info p {
  margin: 0 0 12px;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.5;
}

.deadline-meta {
  display: flex;
  font-size: 14px;
  color: #6b7280;
  gap: 16px;
}

.deadline-time {
  display: flex;
  align-items: center;
}

.deadline-time i {
  margin-right: 6px;
}

.deadline-type {
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.deadline-type.Quiz {
  background-color: #fff4f0;
  color: #ff784b;
}

.deadline-type.Assignment {
  background-color: #f0f9ff;
  color: #0284c7;
}

.deadline-type.Exam {
  background-color: #ffe4e6;
  color: #e11d48;
}

.deadline-action {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.primary-button, .secondary-button {
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  gap: 8px;
}

.primary-button {
  background-color: #ff784b;
  color: white;
  border: none;
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

.secondary-button {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.secondary-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  transform: translateY(-2px);
}

.secondary-button:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .deadline-item {
    flex-direction: column;
    gap: 16px;
  }
  
  .deadline-date {
    margin-right: 0;
  }
  
  .deadline-action {
    margin-left: 0;
    width: 100%;
  }
  
  .deadline-action button {
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .progress-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style> 