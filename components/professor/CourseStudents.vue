<template>
  <div class="students-tab">
    <div class="detail-card">
      <div class="card-header-with-action">
        <h3><i class="fas fa-user-graduate"></i> Enrolled Students</h3>
        <div class="header-actions">
          <!-- Export Options -->
          <div class="export-options">
            <button class="export-btn" @click="exportData('pdf')">
              <i class="fas fa-file-pdf"></i> Export PDF
            </button>
            <button class="export-btn" @click="exportData('excel')">
              <i class="fas fa-file-excel"></i> Export Excel
            </button>
          </div>
          <button class="secondary-button" @click="showAddStudentModal = true">
            <i class="fas fa-user-plus"></i> Add Student
          </button>
        </div>
      </div>
      
      <div class="search-filters">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search students..." 
            v-model="searchQuery" 
          />
          <button class="search-btn" @click="searchStudents">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <div class="filter-options">
          <select v-model="progressFilter" @change="applyFilters">
            <option value="all">All Progress</option>
            <option value="high">High (>80%)</option>
            <option value="medium">Medium (50-80%)</option>
            <option value="low">Low (50%)</option>
          </select>
          
          <select v-model="activityFilter" @change="applyFilters">
            <option value="all">All Activity</option>
            <option value="recent">Active (Last 7 days)</option>
            <option value="inactive">Inactive (>7 days)</option>
          </select>
        </div>
      </div>
      
      <div class="student-list">
        <div class="list-header">
          <span class="col-name"><i class="fas fa-user"></i> Name</span>
          <span class="col-email"><i class="fas fa-envelope"></i> Email</span>
          <span class="col-quizzes"><i class="fas fa-clipboard-check"></i> Quizzes</span>
          <span class="col-score"><i class="fas fa-chart-line"></i> Avg. Score</span>
          <span class="col-progress"><i class="fas fa-tasks"></i> Progress</span>
          <span class="col-active"><i class="fas fa-clock"></i> Last Active</span>
          <span class="col-actions"><i class="fas fa-cog"></i> Actions</span>
        </div>
        
        <div v-if="isLoading" class="loading-message">
          <div class="spinner"></div>
          <p>Loading student data...</p>
        </div>
        
        <div v-else-if="paginatedStudents.length === 0" class="empty-state">
          <i class="fas fa-users empty-icon"></i>
          <p>No students match your search criteria.</p>
        </div>
        
        <template v-else>
          <div 
            v-for="student in paginatedStudents" 
            :key="student.id" 
            class="list-item"
            :class="{'inactive': isInactive(student.lastActive)}"
          >
            <span class="col-name">{{ student.name }}</span>
            <span class="col-email">{{ student.email }}</span>
            <span class="col-quizzes">{{ student.quizzesCompleted }} / {{ course.quizzes }}</span>
            <span class="col-score">
              <span class="score-badge" :class="getScoreClass(student.averageScore)">
                {{ student.averageScore }}%
              </span>
            </span>
            <span class="col-progress">
              <div class="progress-bar">
                <div 
                  class="progress" 
                  :style="{ 
                    width: `${calculateProgress(student)}%`,
                    backgroundColor: getProgressColor(calculateProgress(student))
                  }"
                ></div>
              </div>
              <span class="progress-text">{{ calculateProgress(student) }}%</span>
            </span>
            <span class="col-active">{{ formatLastActive(student.lastActive) }}</span>
            <span class="col-actions">
              <button class="action-btn" @click="viewStudentDetails(student)">
                <i class="fas fa-chart-bar"></i> Performance
              </button>
              <button class="action-btn" @click="sendMessage(student)">
                <i class="fas fa-envelope"></i> Message
              </button>
            </span>
          </div>
        </template>
        
        <div class="pagination">
          <div class="pagination-info">
            Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredStudents.length }} students
          </div>
          <div class="pagination-controls">
            <button :disabled="currentPage === 1" @click="prevPage">
              <i class="fas fa-chevron-left"></i> Previous
            </button>
            <div class="page-numbers">
              <button 
                v-for="page in displayedPages" 
                :key="page" 
                @click="setPage(page)"
                :class="{ active: currentPage === page }"
              >
                {{ page }}
              </button>
            </div>
            <button :disabled="currentPage === totalPages" @click="nextPage">
              Next <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="per-page-selector">
            <label for="per-page">Per page:</label>
            <select id="per-page" v-model="studentsPerPage" @change="currentPage = 1">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Student Performance Modal -->
    <div v-if="showStudentModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <i class="fas fa-user-graduate"></i> 
            {{ selectedStudent.name }} - Performance Details
          </h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Student Info Summary -->
          <div class="student-summary">
            <div class="student-avatar">
              {{ getInitials(selectedStudent.name) }}
            </div>
            <div class="student-info">
              <h4>{{ selectedStudent.name }}</h4>
              <p>{{ selectedStudent.email }}</p>
              <div class="info-badges">
                <span class="info-badge">
                  <i class="fas fa-clipboard-check"></i> 
                  {{ selectedStudent.quizzesCompleted }}/{{ course.quizzes }} Quizzes
                </span>
                <span class="info-badge" :class="getScoreClass(selectedStudent.averageScore)">
                  <i class="fas fa-chart-line"></i> 
                  {{ selectedStudent.averageScore }}% Average
                </span>
                <span class="info-badge">
                  <i class="fas fa-clock"></i> 
                  Last Active: {{ formatLastActive(selectedStudent.lastActive) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Performance Charts -->
          <div class="performance-charts">
            <div class="chart-section">
              <h4><i class="fas fa-chart-bar"></i> Quiz Performance</h4>
              <div class="bar-chart">
                <div 
                  v-for="(result, index) in studentPerformance.quizResults" 
                  :key="index" 
                  class="chart-item"
                >
                  <div class="chart-label">{{ truncateText(result.title, 20) }}</div>
                  <div class="chart-bar-container">
                    <div 
                      class="chart-bar-value" 
                      :style="{ 
                        width: `${result.score}%`,
                        backgroundColor: getProgressColor(result.score)
                      }"
                    ></div>
                    <span class="chart-value">{{ result.score }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="strengths-weaknesses">
              <div class="strength-section">
                <h4><i class="fas fa-star"></i> Strengths</h4>
                <ul class="strength-list">
                  <li v-for="(strength, index) in studentPerformance.strengths" :key="index">
                    <i class="fas fa-check-circle"></i> {{ strength }}
                  </li>
                </ul>
              </div>
              <div class="weakness-section">
                <h4><i class="fas fa-exclamation-triangle"></i> Areas for Improvement</h4>
                <ul class="weakness-list">
                  <li v-for="(weakness, index) in studentPerformance.weaknesses" :key="index">
                    <i class="fas fa-exclamation-circle"></i> {{ weakness }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Notes & Recommendations -->
          <div class="student-notes">
            <h4><i class="fas fa-clipboard"></i> Instructor Notes</h4>
            <textarea 
              v-model="studentNotes" 
              placeholder="Add notes about this student's performance..." 
              rows="3"
            ></textarea>
            <div class="notes-actions">
              <button class="secondary-button" @click="saveNotes">
                <i class="fas fa-save"></i> Save Notes
              </button>
              <button class="ai-suggest-btn" @click="getAIRecommendations">
                <i class="fas fa-robot"></i> Get AI Recommendations
              </button>
            </div>
          </div>
          
          <div v-if="aiRecommendations" class="ai-recommendations">
            <h4><i class="fas fa-lightbulb"></i> AI Teaching Recommendations</h4>
            <div class="recommendation-card">
              <p v-for="(rec, index) in aiRecommendations" :key="index">
                <i class="fas fa-angle-right"></i> {{ rec }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="export-btn" @click="exportStudentData(selectedStudent.id)">
            <i class="fas fa-file-export"></i> Export Report
          </button>
          <button class="secondary-button" @click="sendMessage(selectedStudent)">
            <i class="fas fa-envelope"></i> Message Student
          </button>
          <button class="primary-button" @click="closeModal">
            <i class="fas fa-check"></i> Done
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add Student Modal -->
    <div v-if="showAddStudentModal" class="modal-overlay" @click.self="closeAddStudentModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-user-plus"></i> Add New Student</h3>
          <button class="close-btn" @click="closeAddStudentModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="addNewStudent">
            <div class="form-row">
              <div class="form-group">
                <label for="studentName">Full Name</label>
                <input 
                  type="text" 
                  id="studentName" 
                  v-model="newStudent.name" 
                  placeholder="Enter student's full name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="studentEmail">Email</label>
                <input 
                  type="email" 
                  id="studentEmail" 
                  v-model="newStudent.email" 
                  placeholder="Enter student's email"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="studentId">Student ID (Optional)</label>
              <input 
                type="text" 
                id="studentId" 
                v-model="newStudent.studentId" 
                placeholder="Enter student ID (if applicable)"
              />
            </div>
            
            <div class="form-actions">
              <button type="button" class="secondary-button" @click="closeAddStudentModal">
                Cancel
              </button>
              <button type="submit" class="primary-button">
                <i class="fas fa-user-plus"></i> Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStudentsStore } from '../../stores'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

// Store
const studentsStore = useStudentsStore()

// Component state
const searchQuery = ref('')
const progressFilter = ref('all')
const activityFilter = ref('all')
const currentPage = ref(1)
const studentsPerPage = ref(10)
const isLoading = computed(() => studentsStore.loading)
const errorMessage = computed(() => studentsStore.error)
const showStudentModal = ref(false)
const showAddStudentModal = ref(false)
const selectedStudent = ref({})
const studentPerformance = ref({})
const studentNotes = ref('')
const aiRecommendations = ref(null)
const newStudent = ref({
  name: '',
  email: '',
  studentId: ''
})

// Initialize data
onMounted(async () => {
  await loadStudents()
})

// Watch for course changes
watch(() => props.course?.id, async (newCourseId, oldCourseId) => {
  if (newCourseId && newCourseId !== oldCourseId) {
    await loadStudents()
  }
}, { immediate: false })

// Load students data
async function loadStudents() {
  try {
    await studentsStore.fetchStudents(props.course.id)
  } catch (error) {
    console.error('Error loading students:', error)
  }
}

// Set filters in the store
function updateSearchQuery() {
  studentsStore.updateSearchQuery(searchQuery.value)
}

function updateProgressFilter() {
  studentsStore.updateProgressFilter(progressFilter.value)
}

function updateActivityFilter() {
  studentsStore.updateActivityFilter(activityFilter.value)
}

// Computed students based on filters and pagination
const filteredStudents = computed(() => 
  studentsStore.getFilteredStudents(props.course.id)
)

const paginatedStudents = computed(() => 
  studentsStore.getPaginatedStudents(props.course.id)
)

const totalPages = computed(() => 
  studentsStore.getTotalPages(props.course.id)
)

const startIndex = computed(() => 
  (currentPage.value - 1) * studentsPerPage.value
)

const endIndex = computed(() => 
  Math.min(startIndex.value + studentsPerPage.value, filteredStudents.value.length)
)

const displayedPages = computed(() => {
  const allPages = Array.from({ length: totalPages.value }, (_, i) => i + 1)
  if (totalPages.value <= 5) return allPages
  
  const current = currentPage.value
  if (current <= 3) return allPages.slice(0, 5)
  if (current >= totalPages.value - 2) return allPages.slice(-5)
  return allPages.slice(current - 3, current + 2)
})

// Navigation methods
function searchStudents() {
  updateSearchQuery()
}

function applyFilters() {
  updateProgressFilter()
  updateActivityFilter()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    studentsStore.setPage(currentPage.value)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    studentsStore.setPage(currentPage.value)
  }
}

function setPage(page) {
  currentPage.value = page
  studentsStore.setPage(page)
}

// Helper functions
function calculateProgress(student) {
  // Calculate overall progress based on quizzes completed and average score
  const quizCompletion = (student.quizzesCompleted / props.course.quizzes) * 100
  const scoreWeight = student.averageScore * 0.5
  const progressValue = (quizCompletion * 0.5) + scoreWeight
  
  return Math.round(progressValue)
}

function getProgressColor(percentage) {
  if (percentage >= 80) return '#4CAF50' // Green
  if (percentage >= 60) return '#FFC107' // Yellow
  if (percentage >= 40) return '#FF9800' // Orange
  return '#F44336' // Red
}

function getScoreClass(score) {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  if (score >= 60) return 'fair'
  return 'poor'
}

function isInactive(lastActiveDate) {
  const lastActive = new Date(lastActiveDate)
  const now = new Date()
  const diffTime = Math.abs(now - lastActive)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 7
}

function formatLastActive(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
  })
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Action handlers
async function viewStudentDetails(student) {
  selectedStudent.value = student
  showStudentModal.value = true
  
  try {
    // Fetch detailed performance data
    const details = await studentsStore.fetchStudentDetails(props.course.id, student.id)
    studentPerformance.value = details
    studentNotes.value = details.notes || ''
  } catch (error) {
    console.error('Error fetching student details:', error)
  }
}

function sendMessage(student) {
  console.log('Send message to', student.name)
  // This would integrate with your messaging system
  alert(`Message feature for ${student.name} coming soon!`)
}

function closeModal() {
  showStudentModal.value = false
  aiRecommendations.value = null
}

function closeAddStudentModal() {
  showAddStudentModal.value = false
  newStudent.value = {
    name: '',
    email: '',
    studentId: ''
  }
}

async function exportData(format) {
  console.log(`Exporting data in ${format} format`)
  
  // This would be connected to a real export function
  // For demo purposes, we'll just show an alert
  alert(`Exporting student data as ${format.toUpperCase()}... (Demo)`)
}

async function exportStudentData(studentId) {
  console.log(`Exporting data for student ID: ${studentId}`)
  alert(`Exporting performance report for ${selectedStudent.value.name}... (Demo)`)
}

async function saveNotes() {
  try {
    await studentsStore.updateStudentNotes(props.course.id, selectedStudent.value.id, studentNotes.value)
    alert('Notes saved successfully!')
  } catch (error) {
    console.error('Error saving notes:', error)
    alert('Failed to save notes. Please try again.')
  }
}

async function getAIRecommendations() {
  // This would fetch AI-powered recommendations from your backend
  console.log('Getting AI recommendations for student:', selectedStudent.value.id)
  
  // Simulate loading
  aiRecommendations.value = ['Loading recommendations...']
  
  // Simulate API call delay
  setTimeout(() => {
    aiRecommendations.value = [
      `Provide more practice on ${studentPerformance.value.weaknesses[0]}.`,
      `Consider using visual aids to help with ${studentPerformance.value.weaknesses[1]}.`,
      `Pair this student with peers who excel in the areas they find challenging.`,
      `Recommend additional reading materials focused on their areas for improvement.`
    ]
  }, 1500)
}

async function addNewStudent() {
  try {
    await studentsStore.addStudent(props.course.id, {
      name: newStudent.value.name,
      email: newStudent.value.email,
      // Additional fields would be processed here
    })
    
    closeAddStudentModal()
    alert(`Student ${newStudent.value.name} added successfully!`)
  } catch (error) {
    console.error('Error adding student:', error)
    alert('Failed to add student. Please try again.')
  }
}
</script>

<style scoped>
.detail-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 25px;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.card-header-with-action h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.card-header-with-action h3 i {
  margin-right: 8px;
  color: #ff784b;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.export-options {
  display: flex;
  gap: 8px;
}

.export-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background-color: #e5e7eb;
}

.export-btn i {
  font-size: 14px;
}

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
  gap: 6px;
}

.secondary-button:hover {
  background-color: #f3f4f6;
}

.primary-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #4C6EF5;
  color: white;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.primary-button:hover {
  background-color: #3b5bdb;
}

/* Search and Filters */
.search-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-bar {
  display: flex;
  width: 100%;
  max-width: 400px;
}

.search-bar input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 6px 0 0 6px;
  outline: none;
  font-size: 14px;
}

.search-bar input:focus {
  border-color: #4C6EF5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.search-btn {
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 0 15px;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-options select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.filter-options select:focus {
  border-color: #4C6EF5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

/* Student List */
.student-list {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.list-header {
  display: flex;
  padding: 12px 15px;
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.list-header span, .list-item span {
  padding: 0 8px;
}

.col-name {
  flex: 1.2;
  min-width: 120px;
}

.col-email {
  flex: 1.5;
  min-width: 180px;
}

.col-quizzes, .col-score {
  flex: 0.8;
  min-width: 80px;
  text-align: center;
}

.col-progress {
  flex: 1.2;
  min-width: 120px;
}

.col-active {
  flex: 1;
  min-width: 100px;
}

.col-actions {
  flex: 1.2;
  min-width: 160px;
  text-align: right;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  transition: background-color 0.2s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f9fafb;
}

.list-item.inactive {
  background-color: #f9fafb;
  color: #9ca3af;
}

.score-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  color: white;
}

.score-badge.excellent {
  background-color: #4CAF50;
}

.score-badge.good {
  background-color: #8BC34A;
}

.score-badge.average {
  background-color: #FFC107;
}

.score-badge.fair {
  background-color: #FF9800;
}

.score-badge.poor {
  background-color: #F44336;
}

.progress-bar {
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
  width: 80%;
}

.progress {
  height: 100%;
  border-radius: 3px;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
}

.action-btn {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 5px;
}

.action-btn:hover {
  background-color: #e5e7eb;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #eee;
  font-size: 14px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-info {
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-controls button {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button:not(:disabled):hover {
  background-color: #e5e7eb;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-numbers button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.page-numbers button.active {
  background-color: #4C6EF5;
  color: white;
  border-color: #4C6EF5;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
}

.per-page-selector select {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0;
}

.modal-header h3 i {
  margin-right: 8px;
  color: #4C6EF5;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
}

/* Student Details Modal */
.student-summary {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.student-avatar {
  width: 60px;
  height: 60px;
  background-color: #4C6EF5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.student-info h4 {
  font-size: 18px;
  margin: 0 0 5px 0;
  color: #1f2937;
}

.student-info p {
  margin: 0 0 10px 0;
  color: #6b7280;
}

.info-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background-color: #f3f4f6;
  border-radius: 15px;
  font-size: 13px;
  color: #4b5563;
}

.info-badge i {
  font-size: 12px;
}

.info-badge.excellent,
.info-badge.good {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.info-badge.average {
  background-color: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.info-badge.fair,
.info-badge.poor {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.performance-charts {
  margin-bottom: 25px;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-section h4 {
  font-size: 16px;
  color: #1f2937;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-item {
  display: flex;
  align-items: center;
}

.chart-label {
  width: 150px;
  font-size: 14px;
  color: #4b5563;
}

.chart-bar-container {
  flex: 1;
  height: 20px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.chart-bar-value {
  height: 100%;
  transition: width 0.5s ease-in-out;
}

.chart-value {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

.strengths-weaknesses {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.strength-section h4,
.weakness-section h4 {
  font-size: 16px;
  color: #1f2937;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-section h4 i {
  color: #4CAF50;
}

.weakness-section h4 i {
  color: #F44336;
}

.strength-list,
.weakness-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.strength-list li,
.weakness-list li {
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-list li i {
  color: #4CAF50;
}

.weakness-list li i {
  color: #F44336;
}

.student-notes {
  margin-bottom: 20px;
}

.student-notes h4 {
  font-size: 16px;
  color: #1f2937;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-notes textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
}

.student-notes textarea:focus {
  border-color: #4C6EF5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.notes-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.ai-suggest-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.ai-suggest-btn:hover {
  background-color: #e5e7eb;
}

.ai-suggest-btn i {
  color: #4C6EF5;
}

.ai-recommendations {
  margin-bottom: 20px;
}

.ai-recommendations h4 {
  font-size: 16px;
  color: #1f2937;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-recommendations h4 i {
  color: #4C6EF5;
}

.recommendation-card {
  background-color: rgba(76, 110, 245, 0.05);
  border: 1px solid rgba(76, 110, 245, 0.1);
  border-radius: 6px;
  padding: 12px 15px;
}

.recommendation-card p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #4b5563;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.recommendation-card p:last-child {
  margin-bottom: 0;
}

.recommendation-card p i {
  color: #4C6EF5;
  margin-top: 4px;
}

/* Form Styles */
.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus {
  border-color: #4C6EF5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Loading & Empty States */
.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4C6EF5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6b7280;
}

.empty-icon {
  font-size: 40px;
  color: #e5e7eb;
  margin-bottom: 15px;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .strengths-weaknesses {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
  }
  
  .filter-options {
    width: 100%;
  }
  
  .filter-options select {
    flex: 1;
  }
  
  .list-header {
    display: none; /* Hide header on mobile */
  }
  
  .list-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
  
  .list-item span {
    width: 100%;
    padding: 5px 0;
    display: flex;
    align-items: center;
  }
  
  .list-item span::before {
    content: attr(data-label);
    font-weight: 600;
    margin-right: 10px;
    min-width: 80px;
  }
  
  .col-name, .col-email, .col-quizzes, .col-score, .col-progress, .col-active, .col-actions {
    flex: 1;
    text-align: left;
    min-width: auto;
  }
  
  .col-actions {
    margin-top: 10px;
  }
  
  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 480px) {
  .card-header-with-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .export-options {
    width: 100%;
  }
  
  .export-btn, .secondary-button {
    flex: 1;
    justify-content: center;
  }
  
  .filter-options {
    flex-direction: column;
  }
  
  .page-numbers button {
    width: 28px;
    height: 28px;
  }
}
</style>