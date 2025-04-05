<template>
  <div class="chart-container">
    <div class="chart-header">
      <h4>{{ title }}</h4>
      <div class="chart-actions">
        <select v-model="selectedPeriod" @change="updateChartData">
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>
    </div>
    
    <div class="chart-wrapper">
      <div v-if="isLoading" class="chart-loading">
        <div class="spinner"></div>
        <p>Loading data...</p>
      </div>
      <canvas ref="chartCanvas" v-else></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  title: {
    type: String,
    default: 'Student Engagement'
  },
  courseId: {
    type: [Number, String],
    required: true
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const chartCanvas = ref(null)
const chart = ref(null)
const selectedPeriod = ref('week')
const isLoading = ref(true)

// Watch for changes in data
watch(() => props.data, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    updateChartData()
  }
}, { deep: true })

// Initialize chart on mount
onMounted(() => {
  if (props.data && Object.keys(props.data).length > 0) {
    initChart()
  } else {
    // If no data is provided, generate mock data
    generateMockData()
  }
})

// Initialize the chart
function initChart() {
  const ctx = chartCanvas.value.getContext('2d')
  
  const chartData = getChartData()
  
  chart.value = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: 6
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      elements: {
        line: {
          tension: 0.3
        }
      }
    }
  })
  
  isLoading.value = false
}

// Update chart data based on period selection
function updateChartData() {
  isLoading.value = true
  
  setTimeout(() => {
    const chartData = getChartData()
    
    if (chart.value) {
      chart.value.data = chartData
      chart.value.update()
    } else {
      initChart()
    }
    
    isLoading.value = false
  }, 500)
}

// Generate data based on selected period
function getChartData() {
  const periods = {
    'week': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      count: 7
    },
    'month': {
      labels: Array.from({ length: 30 }, (_, i) => i + 1),
      count: 30
    },
    'year': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      count: 12
    }
  }
  
  const period = periods[selectedPeriod.value]
  
  // Use provided data or generate random data
  const data = props.data[selectedPeriod.value] || generateRandomData(period.count)
  
  return {
    labels: period.labels,
    datasets: [
      {
        label: 'Material Views',
        data: data.materialViews,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Assignment Submissions',
        data: data.assignments,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        pointBackgroundColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Forum Activity',
        data: data.forumActivity,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  }
}

// Generate random data with realistic patterns
function generateRandomData(count) {
  const materialViews = []
  const assignments = []
  const forumActivity = []
  
  for (let i = 0; i < count; i++) {
    // Material views typically high (10-50)
    materialViews.push(Math.floor(Math.random() * 40) + 10)
    
    // Assignments typically lower (0-15)
    assignments.push(Math.floor(Math.random() * 15))
    
    // Forum activity typically medium (5-25)
    forumActivity.push(Math.floor(Math.random() * 20) + 5)
  }
  
  return {
    materialViews,
    assignments,
    forumActivity
  }
}

// Generate mock data for all periods
function generateMockData() {
  const mockData = {
    week: generateRandomData(7),
    month: generateRandomData(30),
    year: generateRandomData(12)
  }
  
  // Initialize chart after generating data
  setTimeout(() => {
    props.data = mockData
    initChart()
  }, 800)
}
</script>

<style scoped>
.chart-container {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.chart-header h4 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.chart-actions select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  color: #4b5563;
  background-color: white;
}

.chart-wrapper {
  flex: 1;
  padding: 15px;
  position: relative;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
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

.chart-loading p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style> 