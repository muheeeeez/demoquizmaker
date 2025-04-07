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
              <label>Students</label>
              <span>{{ course.students || '45' }} Enrolled</span>
            </div>
            <div class="info-item">
              <label>Start Date</label>
              <span>{{ getFormattedDate() }}</span>
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
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e9ecef" stroke-width="12" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  fill="none" 
                  stroke="#4361ee" 
                  stroke-width="12"
                  stroke-dasharray="339.2"
                  :stroke-dashoffset="339.2 - (339.2 * progress / 100)"
                  transform="rotate(-90, 60, 60)"
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
              <button 
                v-if="deadline.type === 'Quiz'" 
                class="primary-button"
                @click="$emit('take-quiz', deadline)"
              >
                Take Quiz
              </button>
              <button 
                v-else 
                class="secondary-button"
                @click="viewDeadline(deadline)"
              >
                View Details
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
    title: 'Programming Assignment 2',
    description: 'Implement a simple calculator application',
    month: 'Apr',
    day: '22',
    time: '11:59 PM',
    type: 'Assignment'
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
}

.overview-header {
  margin-bottom: 20px;
}

.overview-header h2 {
  margin: 0;
  color: #212529;
  font-size: 24px;
  font-weight: 600;
}

.overview-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.overview-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.overview-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.card-header {
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #343a40;
  display: flex;
  align-items: center;
}

.card-header h3 i {
  margin-right: 10px;
  color: #4361ee;
}

.card-content {
  padding: 20px;
}

/* Course Summary Card */
.course-description {
  margin-top: 0;
  margin-bottom: 20px;
  color: #495057;
  line-height: 1.5;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 12px;
  color: #868e96;
  margin-bottom: 5px;
}

.info-item span {
  font-weight: 500;
  color: #343a40;
}

/* Progress Card */
.progress-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
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
  font-size: 28px;
  font-weight: bold;
  color: #343a40;
}

.progress-label {
  font-size: 12px;
  color: #868e96;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #343a40;
}

.stat-label {
  font-size: 12px;
  color: #868e96;
  margin-top: 5px;
}

/* Deadlines Card */
.deadlines-card {
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #868e96;
}

.deadlines-list {
  display: flex;
  flex-direction: column;
}

.deadline-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;
}

.deadline-item:last-child {
  border-bottom: none;
}

.deadline-date {
  margin-right: 20px;
}

.deadline-calendar {
  width: 60px;
  text-align: center;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.deadline-month {
  background-color: #4361ee;
  color: white;
  font-size: 12px;
  padding: 2px 0;
  text-transform: uppercase;
}

.deadline-day {
  font-size: 24px;
  font-weight: bold;
  padding: 5px 0;
  color: #343a40;
}

.deadline-info {
  flex-grow: 1;
}

.deadline-info h4 {
  margin: 0 0 5px;
  color: #343a40;
}

.deadline-info p {
  margin: 0 0 10px;
  color: #495057;
  font-size: 14px;
}

.deadline-meta {
  display: flex;
  font-size: 12px;
  color: #868e96;
}

.deadline-time {
  margin-right: 15px;
}

.deadline-time i {
  margin-right: 5px;
}

.deadline-type {
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #f8f9fa;
}

.deadline-type.Quiz {
  background-color: #e7f5ff;
  color: #4361ee;
}

.deadline-type.Assignment {
  background-color: #fff3bf;
  color: #f08c00;
}

.deadline-type.Exam {
  background-color: #ffe3e3;
  color: #e03131;
}

.deadline-action {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.primary-button, .secondary-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.primary-button {
  background-color: #4361ee;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #3b4fd8;
}

.secondary-button {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
}

.secondary-button:hover {
  background-color: #e9ecef;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .deadline-item {
    flex-direction: column;
  }
  
  .deadline-date {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .deadline-action {
    margin-left: 0;
    margin-top: 15px;
  }
  
  .deadline-action button {
    width: 100%;
  }
}
</style> 