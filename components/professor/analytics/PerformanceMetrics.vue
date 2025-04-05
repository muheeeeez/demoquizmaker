<template>
  <div class="metrics-container">
    <div class="metrics-header">
      <h4>{{ title }}</h4>
      <div class="refresh-button" @click="refreshData" :class="{ loading: isLoading }">
        <i class="fas fa-sync-alt"></i>
      </div>
    </div>
    
    <div v-if="isLoading" class="metrics-loading">
      <div class="spinner"></div>
      <p>Loading metrics...</p>
    </div>
    
    <div v-else class="metrics-grid">
      <div v-for="(metric, index) in metrics" :key="index" class="metric-card">
        <div class="metric-icon" :style="{ backgroundColor: metric.bgColor }">
          <i :class="metric.icon"></i>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ formatValue(metric.value, metric.format) }}</div>
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-trend" v-if="metric.trend">
            <i :class="getTrendIcon(metric.trend)"></i>
            <span :class="getTrendClass(metric.trend)">{{ Math.abs(metric.trend) }}%</span>
            <span class="trend-period">vs last period</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Course Performance'
  },
  courseId: {
    type: [Number, String],
    required: true
  }
})

const metrics = ref([])
const isLoading = ref(true)

// Fetch metrics on component mount
onMounted(() => {
  fetchMetrics()
})

// Fetch performance metrics (simulated)
function fetchMetrics() {
  isLoading.value = true
  
  // Simulate API delay
  setTimeout(() => {
    metrics.value = generateMockMetrics()
    isLoading.value = false
  }, 1000)
}

// Refresh data
function refreshData() {
  fetchMetrics()
}

// Generate mock metrics data
function generateMockMetrics() {
  return [
    {
      label: 'Avg. Completion Rate',
      value: Math.floor(Math.random() * 25) + 75, // 75-100%
      format: 'percent',
      icon: 'fas fa-chart-pie',
      bgColor: 'rgba(79, 70, 229, 0.1)',
      trend: Math.floor(Math.random() * 10) - 3 // -3 to +7%
    },
    {
      label: 'Avg. Assignment Score',
      value: Math.floor(Math.random() * 20) + 75, // 75-95%
      format: 'percent',
      icon: 'fas fa-tasks',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      trend: Math.floor(Math.random() * 14) - 6 // -6 to +8%
    },
    {
      label: 'Active Students',
      value: Math.floor(Math.random() * 30) + 70, // 70-100%
      format: 'percent',
      icon: 'fas fa-users',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      trend: Math.floor(Math.random() * 12) - 2 // -2 to +10%
    },
    {
      label: 'Student Satisfaction',
      value: Math.floor(Math.random() * 15) + 85, // 85-100%
      format: 'percent',
      icon: 'fas fa-smile',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      trend: Math.floor(Math.random() * 8) - 1 // -1 to +7%
    },
    {
      label: 'Total Course Hours',
      value: Math.floor(Math.random() * 50) + 150, // 150-200
      format: 'number',
      icon: 'fas fa-clock',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      label: 'Materials Engagement',
      value: Math.floor(Math.random() * 20) + 75, // 75-95%
      format: 'percent',
      icon: 'fas fa-book-reader',
      bgColor: 'rgba(79, 70, 229, 0.1)',
      trend: Math.floor(Math.random() * 15) - 5 // -5 to +10%
    }
  ]
}

// Format metric value based on format type
function formatValue(value, format) {
  switch (format) {
    case 'percent':
      return `${value}%`
    case 'currency':
      return `$${value}`
    case 'decimal':
      return value.toFixed(2)
    default:
      return value
  }
}

// Get trend icon based on trend value
function getTrendIcon(trendValue) {
  if (trendValue > 0) {
    return 'fas fa-arrow-up'
  } else if (trendValue < 0) {
    return 'fas fa-arrow-down'
  } else {
    return 'fas fa-minus'
  }
}

// Get trend class based on trend value
function getTrendClass(trendValue) {
  if (trendValue > 0) {
    return 'trend-up'
  } else if (trendValue < 0) {
    return 'trend-down'
  } else {
    return 'trend-neutral'
  }
}
</script>

<style scoped>
.metrics-container {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.metrics-header h4 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.refresh-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}

.refresh-button:hover {
  background-color: #e5e7eb;
}

.refresh-button.loading i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.metrics-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #4C6EF5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.metrics-loading p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.metric-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #4C6EF5;
  font-size: 22px;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.metric-trend i {
  margin-right: 4px;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.trend-neutral {
  color: #6b7280;
}

.trend-period {
  color: #9ca3af;
  margin-left: 4px;
}

@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 