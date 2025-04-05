<template>
  <div class="results-modal">
    <div class="modal-header">
      <h3>Quiz Results: {{ quiz.title }}</h3>
      <button class="close-button" @click="$emit('close')"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-content">
      <div class="quiz-stats">
        <div class="stat-card">
          <div class="stat-value">{{ quiz.submissions }}</div>
          <div class="stat-label">Total Submissions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ quiz.averageScore }}%</div>
          <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ Math.floor(quiz.averageScore * 0.8) }}%</div>
          <div class="stat-label">Passing Rate</div>
        </div>
      </div>
      
      <!-- Knowledge gaps section -->
      <div class="section">
        <h4><i class="fas fa-exclamation-triangle"></i> Knowledge Gaps</h4>
        <div v-if="knowledgeGaps.length > 0" class="knowledge-gaps">
          <div v-for="(gap, index) in knowledgeGaps" :key="index" class="gap-item">
            <div class="gap-content">
              <h5>{{ gap.topic }}</h5>
              <p>{{ gap.description }}</p>
            </div>
            <div class="gap-percentage">{{ gap.percentage }}%</div>
          </div>
        </div>
        <div v-else class="empty-message">
          <p>No significant knowledge gaps detected in this quiz.</p>
        </div>
      </div>
      
      <!-- Top performing students -->
      <div class="section">
        <h4><i class="fas fa-award"></i> Top Performing Students</h4>
        <div v-if="topStudents.length > 0" class="top-students">
          <div v-for="(student, index) in topStudents" :key="index" class="student-item">
            <div class="student-rank">{{ index + 1 }}</div>
            <div class="student-info">
              <h5>{{ student.name }}</h5>
              <p>{{ student.email }}</p>
            </div>
            <div class="student-score">{{ student.score }}%</div>
          </div>
        </div>
        <div v-else class="empty-message">
          <p>No submissions received yet.</p>
        </div>
      </div>
      
      <!-- Question performance -->
      <div class="section">
        <h4><i class="fas fa-chart-bar"></i> Question Performance</h4>
        <div class="question-stats">
          <div v-for="(question, index) in questionStats" :key="index" class="question-stat-item">
            <div class="question-number">Q{{ index + 1 }}</div>
            <div class="question-performance-bar">
              <div class="progress-bar" :style="{ width: `${question.correctPercentage}%` }"></div>
            </div>
            <div class="question-percentage">{{ question.correctPercentage }}%</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="secondary-button" @click="$emit('close')">Close</button>
      <button class="primary-button">
        <i class="fas fa-download"></i> Export Results
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Generate simulated data for the results
const knowledgeGaps = ref([])
const topStudents = ref([])
const questionStats = ref([])

// Generate mock data on component mount
onMounted(() => {
  generateMockData()
})

function generateMockData() {
  // Generate knowledge gaps
  if (props.quiz.submissions > 0) {
    const gapCount = Math.floor(Math.random() * 3) + 1
    const topics = [
      'Variable Scope', 'Control Structures', 'Object-Oriented Concepts',
      'Functions', 'Data Types', 'Memory Management',
      'Algorithms', 'Error Handling', 'Recursion'
    ]
    
    for (let i = 0; i < gapCount; i++) {
      knowledgeGaps.value.push({
        topic: topics[Math.floor(Math.random() * topics.length)],
        description: 'Students struggle with applying this concept correctly in problem solving scenarios.',
        percentage: Math.floor(Math.random() * 30) + 40
      })
    }
    
    // Generate top students
    const studentCount = Math.min(5, props.quiz.submissions)
    const names = [
      'Emily Johnson', 'Michael Chen', 'Sarah Martinez', 
      'David Kim', 'Jessica Brown', 'Alex Thompson'
    ]
    
    for (let i = 0; i < studentCount; i++) {
      topStudents.value.push({
        name: names[Math.floor(Math.random() * names.length)],
        email: `student${i + 1}@example.com`,
        score: Math.floor(Math.random() * 15) + 85
      })
    }
    
    // Sort by score descending
    topStudents.value.sort((a, b) => b.score - a.score)
    
    // Generate question stats
    const questionCount = props.quiz.questions
    
    for (let i = 0; i < questionCount; i++) {
      questionStats.value.push({
        correctPercentage: Math.floor(Math.random() * 60) + 40
      })
    }
  }
}
</script>

<style scoped>
.results-modal {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
}

.close-button:hover {
  color: #1f2937;
}

.modal-content {
  padding: 20px 25px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 15px 25px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  background-color: #f9fafb;
}

.quiz-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  margin: 0 10px;
}

.stat-card:first-child {
  margin-left: 0;
}

.stat-card:last-child {
  margin-right: 0;
}

.stat-card .stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #4C6EF5;
  margin-bottom: 5px;
}

.stat-card .stat-label {
  font-size: 14px;
  color: #6b7280;
}

.section {
  margin-bottom: 30px;
}

.section h4 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.section h4 i {
  margin-right: 10px;
  color: #4C6EF5;
}

.knowledge-gaps .gap-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 10px;
}

.gap-content h5 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #1f2937;
}

.gap-content p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.gap-percentage {
  font-size: 18px;
  font-weight: 600;
  color: #ef4444;
}

.top-students .student-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
}

.student-rank {
  width: 30px;
  height: 30px;
  background-color: #4C6EF5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: 600;
}

.student-info {
  flex: 1;
}

.student-info h5 {
  margin: 0 0 3px 0;
  font-size: 15px;
  color: #1f2937;
}

.student-info p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.student-score {
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
}

.question-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.question-number {
  width: 40px;
  font-weight: 500;
  color: #4b5563;
}

.question-performance-bar {
  flex: 1;
  height: 16px;
  background-color: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4C6EF5;
}

.question-percentage {
  width: 50px;
  text-align: right;
  font-weight: 500;
  color: #4b5563;
}

.empty-message {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  text-align: center;
  color: #6b7280;
}

.secondary-button {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.secondary-button:hover {
  background-color: #e5e7eb;
}

.primary-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #ff784b;
  color: white;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-button:hover {
  background-color: #f96a3a;
}

@media (max-width: 768px) {
  .quiz-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-card {
    margin: 0;
  }
}
</style> 