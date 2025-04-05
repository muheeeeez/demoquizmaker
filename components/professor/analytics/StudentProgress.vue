<template>
  <div class="progress-container">
    <div class="progress-header">
      <h4>{{ title }}</h4>
      <div class="header-actions">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search students..." 
            @input="filterStudents"
          >
        </div>
        <button class="export-button" @click="exportData">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="progress-loading">
      <div class="spinner"></div>
      <p>Loading student data...</p>
    </div>
    
    <div v-else-if="filteredStudents.length === 0" class="empty-state">
      <i class="fas fa-search empty-icon"></i>
      <p v-if="searchTerm">No students match your search criteria.</p>
      <p v-else>No student data available for this course.</p>
    </div>
    
    <div v-else class="progress-table">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th @click="sortBy('progress')" class="sortable-header">
              Progress
              <i :class="getSortIcon('progress')"></i>
            </th>
            <th @click="sortBy('grade')" class="sortable-header">
              Current Grade
              <i :class="getSortIcon('grade')"></i>
            </th>
            <th @click="sortBy('lastActive')" class="sortable-header">
              Last Active
              <i :class="getSortIcon('lastActive')"></i>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td class="student-cell">
              <div class="student-avatar">{{ getInitials(student.name) }}</div>
              <div class="student-info">
                <div class="student-name">{{ student.name }}</div>
                <div class="student-email">{{ student.email }}</div>
              </div>
            </td>
            <td>
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: `${student.progress}%`, backgroundColor: getProgressColor(student.progress) }"></div>
                <span class="progress-text">{{ student.progress }}%</span>
              </div>
            </td>
            <td>
              <div class="grade-badge" :class="getGradeClass(student.grade)">
                {{ student.grade }}
              </div>
            </td>
            <td>{{ formatDate(student.lastActive) }}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" title="Send Message">
                  <i class="fas fa-envelope"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Student Progress'
  },
  courseId: {
    type: [Number, String],
    required: true
  }
})

const students = ref([])
const filteredStudents = ref([])
const isLoading = ref(true)
const searchTerm = ref('')
const sortColumn = ref('progress')
const sortDirection = ref('desc')

// Fetch student data on component mount
onMounted(() => {
  fetchStudentData()
})

// Fetch student data (simulated)
function fetchStudentData() {
  isLoading.value = true
  
  // Simulate API delay
  setTimeout(() => {
    students.value = generateMockStudentData()
    filterStudents()
    isLoading.value = false
  }, 1200)
}

// Generate mock student data
function generateMockStudentData() {
  const firstNames = ['Emma', 'Noah', 'Olivia', 'Liam', 'Sophia', 'Mason', 'Ava', 'Jacob', 'Isabella', 'William']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson']
  
  const mockStudents = []
  
  for (let i = 0; i < 12; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
    
    mockStudents.push({
      id: i + 1,
      name: name,
      email: email,
      progress: Math.floor(Math.random() * 101), // 0-100%
      grade: calculateGrade(Math.floor(Math.random() * 41) + 60), // 60-100%
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) // 0-10 days ago
    })
  }
  
  return mockStudents
}

// Calculate letter grade from percentage
function calculateGrade(percentage) {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

// Filter students based on search term
function filterStudents() {
  if (!searchTerm.value) {
    filteredStudents.value = [...students.value]
  } else {
    const term = searchTerm.value.toLowerCase()
    filteredStudents.value = students.value.filter(student => 
      student.name.toLowerCase().includes(term) || 
      student.email.toLowerCase().includes(term)
    )
  }
  
  // Sort the filtered results
  sortStudents()
}

// Sort students by column
function sortBy(column) {
  if (sortColumn.value === column) {
    // Toggle direction if same column
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Default to descending for new column
    sortColumn.value = column
    sortDirection.value = 'desc'
  }
  
  sortStudents()
}

// Sort students based on current sort column and direction
function sortStudents() {
  filteredStudents.value.sort((a, b) => {
    let comparison = 0
    
    if (sortColumn.value === 'progress') {
      comparison = a.progress - b.progress
    } else if (sortColumn.value === 'grade') {
      comparison = getGradeValue(a.grade) - getGradeValue(b.grade)
    } else if (sortColumn.value === 'lastActive') {
      comparison = new Date(a.lastActive) - new Date(b.lastActive)
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
}

// Get numerical value for grade for sorting
function getGradeValue(grade) {
  const gradeValues = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 }
  return gradeValues[grade] || 0
}

// Get sort icon class based on current sort state
function getSortIcon(column) {
  if (sortColumn.value !== column) {
    return 'fas fa-sort'
  }
  
  return sortDirection.value === 'asc' 
    ? 'fas fa-sort-up' 
    : 'fas fa-sort-down'
}

// Format date to relative time
function formatDate(date) {
  const now = new Date()
  const diffTime = Math.abs(now - new Date(date))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return new Date(date).toLocaleDateString()
}

// Get progress color based on completion percentage
function getProgressColor(progress) {
  if (progress < 30) return '#ef4444' // red
  if (progress < 70) return '#f97316' // orange
  return '#10b981' // green
}

// Get class for grade badge
function getGradeClass(grade) {
  const classes = {
    'A': 'grade-a',
    'B': 'grade-b',
    'C': 'grade-c',
    'D': 'grade-d',
    'F': 'grade-f'
  }
  
  return classes[grade] || ''
}

// Get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Export data function (simulated)
function exportData() {
  alert('In a real application, this would export student data to CSV or Excel.')
}
</script>

<style scoped>
.progress-container {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 15px;
}

.progress-header h4 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  padding: 8px 12px 8px 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 220px;
}

.export-button {
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
  gap: 8px;
}

.export-button:hover {
  background-color: #4662d9;
}

.progress-loading, .empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #4C6EF5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 48px;
  color: #e5e7eb;
  margin-bottom: 15px;
}

.progress-loading p, .empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.progress-table {
  flex: 1;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  font-size: 14px;
}

.sortable-header {
  cursor: pointer;
  white-space: nowrap;
}

.sortable-header i {
  margin-left: 4px;
  color: #9ca3af;
}

td {
  color: #1f2937;
  font-size: 14px;
}

.student-cell {
  display: flex;
  align-items: center;
}

.student-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4C6EF5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  margin-right: 12px;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.student-email {
  font-size: 12px;
  color: #6b7280;
}

.progress-bar-container {
  width: 120px;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
}

.progress-text {
  position: absolute;
  right: -28px;
  top: -5px;
  font-size: 12px;
  color: #6b7280;
}

.grade-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  min-width: 28px;
}

.grade-a {
  background-color: #dcfce7;
  color: #15803d;
}

.grade-b {
  background-color: #e0f2fe;
  color: #0369a1;
}

.grade-c {
  background-color: #fef9c3;
  color: #854d0e;
}

.grade-d {
  background-color: #ffedd5;
  color: #9a3412;
}

.grade-f {
  background-color: #fee2e2;
  color: #b91c1c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

@media (max-width: 768px) {
  .progress-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .search-box, .search-box input {
    width: 100%;
  }
}
</style> 