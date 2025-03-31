<template>
  <div class="overview-tab">
    <!-- Loading indicator -->
    <div v-if="courseStore.isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading course data...</p>
    </div>
    
    <!-- Error message -->
    <div v-else-if="courseStore.error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ courseStore.error }}</p>
      <button @click="courseStore.setActiveCourse(course.id)" class="retry-button">
        <i class="fas fa-sync"></i> Retry
      </button>
    </div>
    
    <!-- Course content -->
    <div v-else>
      <!-- Quick Stats Row -->
      <div class="stats-row">
        <div class="stat-box">
          <i class="fas fa-users stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">{{ course.students }}</span>
            <span class="stat-label">Students</span>
          </div>
        </div>
        <div class="stat-box">
          <i class="fas fa-clipboard-check stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">{{ course.quizzes }}</span>
            <span class="stat-label">Quizzes</span>
          </div>
        </div>
        <div class="stat-box">
          <i class="fas fa-percentage stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">{{ statsStore.activeClassAverage }}%</span>
            <span class="stat-label">Average Score</span>
          </div>
        </div>
        <div class="stat-box">
          <i class="fas fa-check-circle stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">{{ statsStore.activeCompletionRate }}%</span>
            <span class="stat-label">Completion Rate</span>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="two-column-grid">
        <!-- Left Column -->
        <div class="column">
          <!-- Quick Actions -->
          <div class="detail-card">
            <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
            <div class="quick-actions">
              <button @click="createNewQuiz" class="action-button">
                <i class="fas fa-plus"></i> New Quiz
              </button>
              <button @click="addStudent" class="action-button">
                <i class="fas fa-user-plus"></i> Add Students
              </button>
              <button @click="uploadMaterial" class="action-button">
                <i class="fas fa-upload"></i> Upload Materials
              </button>
            </div>
          </div>
          
          <!-- Performance Chart -->
          <div class="detail-card mt-20 class-performance">
            <h3><i class="fas fa-chart-pie"></i> Class Performance</h3>
            
            <div class="pie-chart-container">
              <div class="pie-chart">
                <div class="pie-segment" :style="{
                  background: `conic-gradient(#4C6EF5 0% ${statsStore.activeClassAverage}%, #e5e7eb ${statsStore.activeClassAverage}% 100%)`
                }">
                </div>
                <div class="pie-center">
                  <span>{{ statsStore.activeClassAverage }}%</span>
                  <small>Average</small>
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #4C6EF5"></div>
                  <span>Pass ({{ statsStore.activePassRate }}%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #e5e7eb"></div>
                  <span>Needs Improvement ({{ 100 - statsStore.activePassRate }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="column">
          <!-- Knowledge Gaps -->
          <div class="detail-card">
            <div class="card-header-with-action">
              <h3><i class="fas fa-exclamation-triangle"></i> Knowledge Gaps</h3>
              <button @click="generateMaterials" class="secondary-button">Generate Materials</button>
            </div>
            
            <div class="knowledge-gaps">
              <div class="gap-item" v-for="(gap, index) in materialStore.courseKnowledgeGaps" :key="index">
                <div class="gap-header">
                  <h4>{{ gap.topic }}</h4>
                  <span class="gap-percentage">{{ gap.percentage }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${gap.percentage}%` }"></div>
                </div>
                <p>{{ gap.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- Recent Activity -->
          <div class="detail-card mt-20">
            <div class="card-header-with-action">
              <h3><i class="fas fa-history"></i> Recent Activity</h3>
              <button class="secondary-button">View All</button>
            </div>
            
            <div class="activity-list">
              <div class="activity-item" v-for="(activity, index) in courseActivities" :key="index">
                <div class="activity-icon" :class="activity.type"></div>
                <div class="activity-content">
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.description }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Full Width -->
      <div class="detail-card mt-20">
        <h3><i class="fas fa-robot"></i> Quick Assistant</h3>
        
        <div class="assistant-container">
          <div class="message ai-message">
            <div class="message-avatar">AI</div>
            <div class="message-content">
              <p>Need help with your {{ course.code }} course? Ask me a quick question.</p>
            </div>
          </div>
                    <div class="chat-input">
            <input type="text" placeholder="Type your question here..." v-model="quickQuestion" @keyup.enter="askQuickQuestion" />
            <button class="send-btn" @click="askQuickQuestion"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCourseStore, useStatsStore, useMaterialStore, useQuizStore, useStudentStore, useAssistantStore } from '../../stores'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

// Define emits for tab navigation
const emit = defineEmits(['changeTab'])

// Function to change tab
const navigateToTab = (tabId) => {
  emit('changeTab', tabId)
}

// Use the stores for state management
const courseStore = useCourseStore()
const statsStore = useStatsStore()
const materialStore = useMaterialStore()
const quizStore = useQuizStore()
const studentStore = useStudentStore()
const assistantStore = useAssistantStore()
const quickQuestion = ref('')

// Initialize data when component is mounted
onMounted(async () => {
  // If course data isn't already loaded in the store, set it
  if (!courseStore.activeCourse || courseStore.activeCourse.id !== props.course.id) {
    await courseStore.setActiveCourse(props.course.id)
  }
  
  // Load all required data for the course
  await Promise.all([
    statsStore.loadActiveStats(),
    materialStore.loadActiveMaterials()
  ])
})

// Handler for assistant questions
const askQuickQuestion = async () => {
  if (!quickQuestion.value.trim()) return
  
  try {
    // Call the store action to ask the assistant
    const response = await assistantStore.askQuestion(props.course.id, quickQuestion.value)
    console.log('Assistant response:', response)
    
    // Reset the input
    quickQuestion.value = ''
  } catch (error) {
    console.error('Error asking question:', error)
  }
}

// Handler for generating course materials
const generateMaterials = async () => {
  try {
    // Get topics from knowledge gaps
    const topics = materialStore.courseKnowledgeGaps.map(gap => gap.topic)
    
    // Call the store action to generate materials
    const result = await materialStore.generateMaterials(props.course.id, topics)
    console.log('Generated materials:', result)
    
    // In a real implementation, you would update the UI to show new materials
  } catch (error) {
    console.error('Error generating materials:', error)
  }
}

// Handler for creating a new quiz - now navigates to quizzes tab
const createNewQuiz = async () => {
  try {
    // Navigate to quizzes tab
    navigateToTab('quizzes')
    
    // In a real implementation, you would open a modal to get quiz details
    // For demo purposes, just use placeholder data
    const quizData = {
      title: `New Quiz for ${props.course.code}`,
      questions: [],
      timeLimit: 30,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    }
    
    // Call the store action to create a quiz
    const result = await quizStore.createQuiz(props.course.id, quizData)
    console.log('Created quiz:', result)
  } catch (error) {
    console.error('Error creating quiz:', error)
  }
}

// Handler for adding students - now navigates to students tab
const addStudent = async () => {
  try {
    // Navigate to students tab
    navigateToTab('students')
    
    // In a real implementation, you would open a modal to get student details
    // For demo purposes, just use placeholder data
    const studentData = {
      name: 'New Student',
      email: `student${Date.now()}@example.com`
    }
    
    // Call the store action to add a student
    const result = await studentStore.addStudent(props.course.id, studentData)
    console.log('Added student:', result)
  } catch (error) {
    console.error('Error adding student:', error)
  }
}

// Handler for uploading materials - navigates to materials tab
const uploadMaterial = () => {
  navigateToTab('materials')
}

// Demo data for activities - in a real app, this would come from a store
const courseActivities = computed(() => {
  const courseId = props.course.id
  
  // Different activities based on course ID
  const baseActivities = [
    {
      type: 'quiz',
      title: `New Quiz Published for ${props.course.code}`,
      description: `Quiz ${courseId + 2}: ${props.course.title} Concepts was published`,
      time: '2 hours ago'
    },
    {
      type: 'submission',
      title: 'Quiz Submissions',
      description: `${5 + courseId * 3} students submitted Quiz ${courseId + 1}`,
      time: '1 day ago'
    },
    {
      type: 'feedback',
      title: 'Feedback Provided',
      description: `You provided feedback on ${props.course.code} Quiz ${courseId} results`,
      time: '3 days ago'
    },
    {
      type: 'material',
      title: 'New Material Added',
      description: `Added "Chapter ${courseId + 3}: Key Concepts" to course materials`,
      time: '5 days ago'
    }
  ]
  
  // Return different number of activities for different courses
  return baseActivities.slice(0, Math.min(4, courseId + 2))
})
</script>

<style scoped>
/* Add loading & error styles */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #ff784b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 10px;
  color: #c53030;
  margin-bottom: 20px;
}

.error-message i {
  font-size: 32px;
  margin-bottom: 15px;
}

.retry-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #c53030;
  color: #c53030;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background-color: #c53030;
  color: white;
}

/* Keep existing styles */
.detail-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 25px;
}

.detail-card h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.detail-card h3 i {
  margin-right: 8px;
  color: #ff784b;
}

.mt-20 {
  margin-top: 20px;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-box {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 20px;
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 24px;
  color: #ff784b;
  margin-right: 15px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* Two Column Grid */
.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.action-button {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.action-button i {
  margin-right: 6px;
}

.action-button:hover {
  background-color: #e5e7eb;
}

/* Card Header With Action */
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
.class-performance{
  height: 70%;
}
/* Chart Styles */
.pie-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 200px;
  margin: 150px 0;
}

.pie-chart {
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 20px;
}

.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pie-center span {
  display: block;
  font-size: 22px;
  font-weight: 600;
  color: #111827;
}

.pie-center small {
  display: block;
  font-size: 14px;
  color: #6b7280;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
}

.legend-item span {
  font-size: 14px;
  color: #6b7280;
}

/* Activity List */
.activity-list {
  margin-top: 10px;
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.quiz {
  background-color: rgba(76, 110, 245, 0.1);
  color: #4C6EF5;
}

.activity-icon.submission {
  background-color: rgba(64, 192, 87, 0.1);
  color: #40C057;
}

.activity-icon.feedback {
  background-color: rgba(255, 120, 75, 0.1);
  color: #ff784b;
}

.activity-icon.material {
  background-color: rgba(250, 176, 5, 0.1);
  color: #FAB005;
}

.activity-content h4 {
  font-size: 16px;
  color: #111827;
  margin-bottom: 5px;
}

.activity-content p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 12px;
  color: #9CA3AF;
}

/* Knowledge Gaps */
.knowledge-gaps {
  margin-top: 10px;
}

.gap-item {
  margin-bottom: 20px;
}

.gap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.gap-header h4 {
  font-size: 16px;
  color: #111827;
  margin: 0;
}

.gap-percentage {
  font-weight: 600;
  color: #4b5563;
}

.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress {
  height: 100%;
  background-color: #ff784b;
  border-radius: 4px;
}

.gap-item p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Quick Assistant */
.assistant-container {
  margin-top: 10px;
}

.message {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
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

.message-content {
  background-color: #f9fafb;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  max-width: 80%;
}

.message-content p {
  margin: 0;
  font-size: 14px;
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
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 8px;
  width: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Secondary Button */
.secondary-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.secondary-button:hover {
  background-color: #f3f4f6;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .two-column-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .card-header-with-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .message-content {
    max-width: 90%;
  }
  
  .pie-chart {
    width: 150px;
    height: 150px;
  }
  
  .secondary-button, .action-button {
    width: 100%;
  }
}
</style> 