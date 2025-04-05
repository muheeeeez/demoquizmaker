<template>
  <div class="analytics-container">
    <div class="analytics-header">
      <h3><i class="fas fa-chart-line"></i> Course Analytics</h3>
      <div class="timeframe-selector">
        <span>Viewing data for:</span>
        <select v-model="selectedTimeframe">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>
    </div>
    
    <div class="analytics-content">
      <!-- Top row - Performance Metrics -->
      <div class="analytics-row">
        <performance-metrics 
          :course-id="course.id"
          title="Course Performance Metrics"
        />
      </div>
      
      <!-- Middle row - Charts -->
      <div class="analytics-row charts-row">
        <div class="chart-column">
          <engagement-chart 
            :course-id="course.id"
            title="Student Engagement"
          />
        </div>
        <div class="chart-column">
          <engagement-chart 
            :course-id="course.id"
            title="Learning Progress"
            :data="learningProgressData"
          />
        </div>
      </div>
      
      <!-- Bottom row - Student Progress Table -->
      <div class="analytics-row">
        <student-progress 
          :course-id="course.id"
          title="Student Performance"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EngagementChart from './EngagementChart.vue'
import PerformanceMetrics from './PerformanceMetrics.vue'
import StudentProgress from './StudentProgress.vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const selectedTimeframe = ref('30')
const learningProgressData = ref({})

// Initialize with mock data for learning progress chart
onMounted(() => {
  generateLearningProgressData()
})

// Generate mock data for learning progress chart
function generateLearningProgressData() {
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const monthLabels = Array.from({ length: 30 }, (_, i) => i + 1)
  const yearLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Helper to generate random data with upward trend
  const generateTrendingData = (count, minStart, maxStart, minIncrease, maxIncrease) => {
    const data = []
    let value = Math.floor(Math.random() * (maxStart - minStart)) + minStart
    
    for (let i = 0; i < count; i++) {
      // Add some noise but maintain overall upward trend
      const noise = Math.random() > 0.7 ? -Math.floor(Math.random() * 3) : Math.floor(Math.random() * (maxIncrease - minIncrease)) + minIncrease
      value = Math.max(0, Math.min(100, value + noise))
      data.push(value)
    }
    
    return data
  }
  
  // Generate data for week, month, and year views
  learningProgressData.value = {
    week: {
      materialViews: generateTrendingData(7, 20, 40, 2, 5),
      assignments: generateTrendingData(7, 10, 25, 1, 3),
      forumActivity: generateTrendingData(7, 5, 15, 1, 4)
    },
    month: {
      materialViews: generateTrendingData(30, 20, 30, 1, 3),
      assignments: generateTrendingData(30, 10, 20, 1, 2),
      forumActivity: generateTrendingData(30, 5, 10, 0, 2)
    },
    year: {
      materialViews: generateTrendingData(12, 10, 30, 3, 8),
      assignments: generateTrendingData(12, 5, 15, 2, 5),
      forumActivity: generateTrendingData(12, 2, 10, 1, 4)
    }
  }
}
</script>

<style scoped>
.analytics-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.analytics-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
  display: flex;
  align-items: center;
}

.analytics-header h3 i {
  margin-right: 10px;
  color: #4C6EF5;
}

.timeframe-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4b5563;
  font-size: 14px;
}

.timeframe-selector select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  color: #1f2937;
  background-color: white;
}

.analytics-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analytics-row {
  flex: 1;
}

.charts-row {
  display: flex;
  gap: 20px;
}

.chart-column {
  flex: 1;
}

@media (max-width: 1024px) {
  .charts-row {
    flex-direction: column;
  }
  
  .chart-column {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .analytics-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .timeframe-selector {
    width: 100%;
  }
}
</style> 