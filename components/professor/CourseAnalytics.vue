<template>
  <div class="analytics-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading course analytics...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchData" class="action-button">Retry</button>
    </div>
    
    <div v-else-if="courseData">
      <h1>{{ courseData.courseName }} Analytics</h1>
      
      <!-- Performance Trends Section -->
      <div class="analytics-section">
        <div class="section-header">
          <h2>Performance Trends</h2>
          <select v-model="selectedTimeRange" class="time-filter" @change="handleTimeRangeChange">
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="semester">Semester</option>
          </select>
        </div>
        <div class="chart-container">
          <div class="chart-info">
            <h3>Class Average Progress</h3>
            <p>Visualizing average scores over time</p>
          </div>
          <canvas id="performanceChart" ref="performanceChartRef"></canvas>
        </div>
        <div class="metrics-grid">
          <div class="metric-card">
            <h4>Average Score</h4>
            <p class="metric-value">{{ courseData.metrics.averageScore }}%</p>
            <p class="metric-trend" :class="getTrendClass(courseData.metrics.averageScore, courseData.metrics.previousAverageScore)">
              {{ getTrendText(courseData.metrics.averageScore, courseData.metrics.previousAverageScore) }}
            </p>
          </div>
          <div class="metric-card">
            <h4>Pass Rate</h4>
            <p class="metric-value">{{ courseData.metrics.passRate }}%</p>
            <p class="metric-trend" :class="getTrendClass(courseData.metrics.passRate, courseData.metrics.previousPassRate)">
              {{ getTrendText(courseData.metrics.passRate, courseData.metrics.previousPassRate) }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Knowledge Gap Analysis Section -->
      <div class="analytics-section">
        <h2>Knowledge Gap Analysis</h2>
        <div class="gap-category">
          <h3>Challenging Topics</h3>
          <ul class="gap-list">
            <li v-for="(gap, index) in courseData.knowledgeGaps" :key="index">
              <div class="topic-name">{{ gap.topic }} <span class="difficulty-score">{{ gap.difficultyScore }}%</span></div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: gap.difficultyScore + '%' }"></div>
              </div>
              <p class="suggestion">{{ gap.suggestion }}</p>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Student Engagement Section -->
      <div class="analytics-section">
        <h2>Student Engagement</h2>
        <div class="engagement-metrics">
          <div class="engagement-card">
            <div class="engagement-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
              </svg>
            </div>
            <div class="engagement-data">
              <h4>Avg. Quiz Completion Time</h4>
              <p class="metric-value">{{ courseData.engagement.quizCompletionTime }} minutes</p>
              <p class="metric-trend" :class="getTrendClass(courseData.engagement.avgQuizCompletionTime, courseData.engagement.quizCompletionTime, true)">
                {{ getDifferenceText(courseData.engagement.quizCompletionTime, courseData.engagement.avgQuizCompletionTime, true) }} min from average
              </p>
            </div>
          </div>
          <div class="engagement-card">
            <div class="engagement-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
                <path d="M7 12h2v5H7v-5zm4-7h2v12h-2V5zm4 4h2v8h-2v-8z" fill="currentColor"/>
              </svg>
            </div>
            <div class="engagement-data">
              <h4>Participation Rate</h4>
              <p class="metric-value">{{ courseData.engagement.participationRate }}%</p>
              <p class="metric-trend" :class="getTrendClass(courseData.engagement.participationRate, courseData.engagement.previousParticipationRate)">
                {{ getTrendText(courseData.engagement.participationRate, courseData.engagement.previousParticipationRate) }}
              </p>
            </div>
          </div>
          <div class="engagement-card">
            <div class="engagement-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
              </svg>
            </div>
            <div class="engagement-data">
              <h4>Active Students</h4>
              <p class="metric-value">{{ courseData.engagement.activeStudents }}/{{ courseData.engagement.totalStudents }}</p>
              <p class="metric-trend" :class="getTrendClass(courseData.engagement.activeStudents, courseData.engagement.previousActiveStudents)">
                {{ courseData.engagement.activeStudents === courseData.engagement.previousActiveStudents ? 'Same as last week' : getTrendText(courseData.engagement.activeStudents, courseData.engagement.previousActiveStudents) }}
              </p>
            </div>
          </div>
        </div>
        <div class="activity-timeline">
          <h3>Weekly Activity</h3>
          <div class="weekly-activity-container">
            <div class="day-column" v-for="(day, index) in courseData.weeklyActivity.days" :key="index">
              <div class="day-label">{{ day }}</div>
              <div class="activity-meter">
                <div class="activity-level" :style="{ height: courseData.weeklyActivity.activityLevels[index] + '%' }"></div>
              </div>
              <div class="activity-percentage">{{ courseData.weeklyActivity.activityLevels[index] }}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- AI Recommendations Section -->
      <div class="analytics-section">
        <h2>AI Recommendations</h2>
        <div class="recommendations-container">
          <div 
            v-for="(recommendation, index) in courseData.recommendations" 
            :key="index" 
            class="recommendation-card" 
            :class="'priority-' + recommendation.priority"
          >
            <div class="recommendation-header">
              <h3>{{ capitalizeFirst(recommendation.priority) }} Priority</h3>
              <span class="badge">{{ recommendation.category }}</span>
            </div>
            <p>{{ recommendation.message }}</p>
            <button class="action-button">{{ recommendation.action }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { useAnalyticsStore } from '../../stores';
import Chart from 'chart.js/auto';

const props = defineProps({
  course: {
    type: Object,
    required: false
  }
});

const route = useRoute();
const analyticsStore = useAnalyticsStore();

const performanceChartRef = ref(null);
let performanceChart = null;

// Computed properties from store
const courseData = computed(() => analyticsStore.courseData);
const loading = computed(() => analyticsStore.loading);
const error = computed(() => analyticsStore.error);
const selectedTimeRange = computed({
  get: () => analyticsStore.selectedTimeRange,
  set: (value) => analyticsStore.updateTimeRange(value)
});

// Get course ID from props or route as fallback
const courseId = computed(() => {
  // First priority: use the course prop from dashboard if available
  if (props.course && props.course.id) {
    return props.course.id;
  }
  
  // Second priority: use route params or query params
  const routeId = parseInt(route.params.courseId || route.query.courseId || '1', 10);
  return isNaN(routeId) ? 1 : routeId; // Default to 1 for demo if not a valid number
});

const fetchData = async () => {
  await analyticsStore.fetchCourseAnalytics(courseId.value);
  if (courseData.value) {
    setTimeout(() => {
      createPerformanceChart();
    }, 100);
  }
};

const handleTimeRangeChange = async () => {
  await analyticsStore.fetchCourseAnalytics(courseId.value);
  createPerformanceChart();
};

const createPerformanceChart = () => {
  try {
    if (!performanceChartRef.value || !courseData.value) return;
    
    if (performanceChart) {
      performanceChart.destroy();
    }
    
    const ctx = performanceChartRef.value.getContext('2d');
    performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: courseData.value.performanceTrends.labels,
        datasets: [
          {
            label: 'Average Score (%)',
            data: courseData.value.performanceTrends.data,
            fill: true,
            backgroundColor: 'rgba(255, 120, 75, 0.2)',
            borderColor: '#ff784b',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 10,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            titleFont: {
              size: 11
            },
            bodyFont: {
              size: 11
            }
          }
        },
        scales: {
          y: {
            min: 50,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              },
              font: {
                size: 10
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating performance chart:', error);
  }
};

// Helper functions for trend indicators
const getTrendClass = (current, previous, isReversed = false) => {
  const diff = current - previous;
  if (Math.abs(diff) < 0.1) return 'neutral';
  
  if (isReversed) {
    return diff > 0 ? 'negative' : 'positive';
  }
  
  return diff > 0 ? 'positive' : 'negative';
};

const getTrendText = (current, previous) => {
  const diff = current - previous;
  const formattedDiff = Math.abs(diff).toFixed(1);
  
  return diff > 0 ? `+${formattedDiff}% from previous` : `-${formattedDiff}% from previous`;
};

const getDifferenceText = (current, average, isReversed = false) => {
  const diff = current - average;
  const formattedDiff = Math.abs(diff).toFixed(1);
  
  if (isReversed) {
    return diff > 0 ? `+${formattedDiff}` : `-${formattedDiff}`;
  }
  
  return diff > 0 ? `+${formattedDiff}` : `-${formattedDiff}`;
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Watch for changes to the course prop
watch(() => props.course?.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchData();
  }
}, { immediate: true });

onMounted(() => {
  fetchData();
});

onBeforeUnmount(() => {
  // Clean up charts to prevent memory leaks
  if (performanceChart) performanceChart.destroy();
});
</script>

<style scoped>
.analytics-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 120, 75, 0.2);
  border-radius: 50%;
  border-top-color: #ff784b;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #e74c3c;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.analytics-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

h3 {
  color: #34495e;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.time-filter {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-size: 0.9rem;
}

.chart-container {
  margin-bottom: 1.5rem;
  height: 250px;
  position: relative;
}

.chart-info {
  text-align: center;
  margin-bottom: 0.5rem;
}

canvas {
  width: 100%;
  height: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.metric-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.metric-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0.3rem 0;
}

.metric-trend {
  font-size: 0.85rem;
  font-weight: 500;
}

.positive {
  color: #27ae60;
}

.negative {
  color: #e74c3c;
}

.neutral {
  color: #7f8c8d;
}

.gap-category {
  margin-top: 0.5rem;
}

.gap-list {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  max-height: 220px;
  overflow-y: auto;
}

.gap-list li {
  margin-bottom: 0.8rem;
  background: #f9f9f9;
  padding: 0.8rem;
  border-radius: 8px;
}

.topic-name {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.difficulty-score {
  color: #e74c3c;
}

.progress-container {
  width: 100%;
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background-color: #ff784b;
  border-radius: 4px;
}

.suggestion {
  font-size: 0.85rem;
  color: #7f8c8d;
  font-style: italic;
}

.engagement-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.engagement-card {
  display: flex;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.engagement-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #ff784b20;
  border-radius: 50%;
  margin-right: 1rem;
  color: #ff784b;
}

.engagement-data {
  flex: 1;
}

.engagement-data h4 {
  font-size: 0.9rem;
  font-weight: 500;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.weekly-activity-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 150px;
  margin-top: 1rem;
}

.day-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12%;
}

.day-label {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  color: #7f8c8d;
}

.activity-meter {
  width: 100%;
  height: 100px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.activity-level {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #2ecc71;
  border-radius: 0 0 4px 4px;
}

.activity-percentage {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: #7f8c8d;
}

.recommendations-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.recommendation-card {
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.recommendation-header h3 {
  margin-bottom: 0;
}

.badge {
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #ecf0f1;
  color: #7f8c8d;
}

.recommendation-card p {
  margin-bottom: 1rem;
  line-height: 1.4;
  font-size: 0.95rem;
}

.priority-high {
  border-left: 4px solid #e74c3c;
}

.priority-medium {
  border-left: 4px solid #f39c12;
}

.priority-low {
  border-left: 4px solid #3498db;
}

.action-button {
  background-color: #ff784b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #e56e45;
}

@media (max-width: 1024px) {
  .knowledge-gap-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics-container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .metrics-grid, 
  .recommendations-container {
    grid-template-columns: 1fr;
  }
  
  .weekly-activity-container {
    overflow-x: auto;
    justify-content: flex-start;
  }
  
  .day-column {
    width: 60px;
    flex-shrink: 0;
  }

  .chart-container {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 180px;
  }
}
</style> 