<template>
  <div class="student-list-container">
    <div class="list-header">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search students..." 
            @input="filterStudents"
          >
        </div>
        <div class="filter-dropdown">
          <select v-model="selectedStatus" @change="filterStudents">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="action-buttons">
        <button class="action-button export-btn" @click="exportStudents">
          <i class="fas fa-file-export"></i> Export
        </button>
        <button class="action-button message-btn" @click="messageSelected" :disabled="selectedStudents.length === 0">
          <i class="fas fa-envelope"></i> Message
          <span v-if="selectedStudents.length > 0" class="selected-badge">{{ selectedStudents.length }}</span>
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading students...</p>
    </div>
    
    <div v-else-if="filteredStudents.length === 0" class="empty-state">
      <i class="fas fa-user-graduate empty-icon"></i>
      <p v-if="searchTerm || selectedStatus !== 'all'">No students match your search criteria.</p>
      <p v-else>No students are enrolled in this course yet.</p>
    </div>
    
    <div v-else class="student-table-container">
      <table class="student-table">
        <thead>
          <tr>
            <th class="select-column">
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll"
                >
                <span class="checkmark"></span>
              </label>
            </th>
            <th 
              class="student-column sortable"
              @click="toggleSort('name')"
            >
              Student
              <i v-if="sortField === 'name'" :class="['sort-icon', sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down']"></i>
              <i v-else class="sort-icon fas fa-sort"></i>
            </th>
            <th 
              class="email-column"
            >
              Email
            </th>
            <th 
              class="grade-column sortable"
              @click="toggleSort('grade')"
            >
              Current Grade
              <i v-if="sortField === 'grade'" :class="['sort-icon', sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down']"></i>
              <i v-else class="sort-icon fas fa-sort"></i>
            </th>
            <th 
              class="progress-column sortable"
              @click="toggleSort('progress')"
            >
              Progress
              <i v-if="sortField === 'progress'" :class="['sort-icon', sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down']"></i>
              <i v-else class="sort-icon fas fa-sort"></i>
            </th>
            <th 
              class="status-column sortable"
              @click="toggleSort('status')"
            >
              Status
              <i v-if="sortField === 'status'" :class="['sort-icon', sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down']"></i>
              <i v-else class="sort-icon fas fa-sort"></i>
            </th>
            <th 
              class="lastactive-column sortable"
              @click="toggleSort('lastActive')"
            >
              Last Active
              <i v-if="sortField === 'lastActive'" :class="['sort-icon', sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down']"></i>
              <i v-else class="sort-icon fas fa-sort"></i>
            </th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="student in filteredStudents" 
            :key="student.id"
            :class="{ 'selected-row': isStudentSelected(student.id) }"
          >
            <td class="select-column">
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  :checked="isStudentSelected(student.id)" 
                  @change="toggleStudentSelection(student.id)"
                >
                <span class="checkmark"></span>
              </label>
            </td>
            <td class="student-column">
              <div class="student-info">
                <div class="student-avatar" :style="getAvatarStyle(student)">
                  {{ getInitials(student.name) }}
                </div>
                <div class="student-name">{{ student.name }}</div>
              </div>
            </td>
            <td class="email-column">{{ student.email }}</td>
            <td class="grade-column">
              <span :class="getGradeClass(student.grade)">{{ student.grade }}</span>
            </td>
            <td class="progress-column">
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: `${student.progress}%` }"></div>
              </div>
              <div class="progress-text">{{ student.progress }}%</div>
            </td>
            <td class="status-column">
              <span :class="['status-badge', `status-${student.status.toLowerCase()}`]">
                {{ student.status }}
              </span>
            </td>
            <td class="lastactive-column">
              {{ formatLastActive(student.lastActive) }}
            </td>
            <td class="actions-column">
              <button class="table-action-button" title="View Profile" @click="viewStudentProfile(student)">
                <i class="fas fa-user"></i>
              </button>
              <button class="table-action-button" title="Message" @click="messageStudent(student)">
                <i class="fas fa-envelope"></i>
              </button>
              <button class="table-action-button" title="View Submissions" @click="viewSubmissions(student)">
                <i class="fas fa-file-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="filteredStudents.length > 0" class="pagination">
      <button 
        class="pagination-button" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      
      <button 
        class="pagination-button" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['view-profile', 'message', 'view-submissions', 'message-selected', 'export'])

// State variables
const students = ref([])
const filteredStudents = ref([])
const isLoading = ref(true)
const searchTerm = ref('')
const selectedStatus = ref('all')
const selectedStudentIds = ref([])
const sortField = ref('name')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const selectedStudents = computed(() => {
  return filteredStudents.value.filter(student => isStudentSelected(student.id))
})

const isAllSelected = computed(() => {
  return filteredStudents.value.length > 0 && 
    filteredStudents.value.every(student => isStudentSelected(student.id))
})

const totalPages = computed(() => {
  if (!filteredStudents.value.length) return 1
  return Math.ceil(filteredStudents.value.length / itemsPerPage)
})

// Fetch students on mount
onMounted(() => {
  fetchStudents()
})

// Watch for changes in search term or status filter
watch([searchTerm, selectedStatus], () => {
  filterStudents()
  currentPage.value = 1 // Reset to first page when filter changes
})

// Fetch students data
async function fetchStudents() {
  isLoading.value = true
  
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    students.value = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        grade: 'A',
        progress: 85,
        status: 'Active',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        avatarColor: '#4338ca'
      },
      {
        id: 2,
        name: 'Emma Johnson',
        email: 'emma.j@example.com',
        grade: 'B+',
        progress: 72,
        status: 'Active',
        lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        avatarColor: '#0284c7'
      },
      {
        id: 3,
        name: 'Michael Williams',
        email: 'michael.w@example.com',
        grade: 'C',
        progress: 45,
        status: 'At-Risk',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        avatarColor: '#ea580c'
      },
      {
        id: 4,
        name: 'Sophia Brown',
        email: 'sophia.b@example.com',
        grade: 'A-',
        progress: 92,
        status: 'Active',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        avatarColor: '#16a34a'
      },
      {
        id: 5,
        name: 'James Jones',
        email: 'james.j@example.com',
        grade: 'D+',
        progress: 38,
        status: 'At-Risk',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        avatarColor: '#be185d'
      },
      {
        id: 6,
        name: 'Olivia Garcia',
        email: 'olivia.g@example.com',
        grade: 'B',
        progress: 65,
        status: 'Active',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
        avatarColor: '#7c3aed'
      },
      {
        id: 7,
        name: 'Robert Miller',
        email: 'robert.m@example.com',
        grade: 'F',
        progress: 12,
        status: 'Inactive',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
        avatarColor: '#b91c1c'
      },
      {
        id: 8,
        name: 'Ava Davis',
        email: 'ava.d@example.com',
        grade: 'A+',
        progress: 98,
        status: 'Active',
        lastActive: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
        avatarColor: '#4d7c0f'
      },
      {
        id: 9,
        name: 'William Rodriguez',
        email: 'william.r@example.com',
        grade: 'B-',
        progress: 58,
        status: 'Active',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        avatarColor: '#0891b2'
      },
      {
        id: 10,
        name: 'Isabella Martinez',
        email: 'isabella.m@example.com',
        grade: 'C+',
        progress: 50,
        status: 'At-Risk',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        avatarColor: '#9333ea'
      },
      {
        id: 11,
        name: 'David Thompson',
        email: 'david.t@example.com',
        grade: 'Incomplete',
        progress: 25,
        status: 'Inactive',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
        avatarColor: '#b45309'
      },
      {
        id: 12,
        name: 'Mia Anderson',
        email: 'mia.a@example.com',
        grade: 'B+',
        progress: 78,
        status: 'Active',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
        avatarColor: '#6d28d9'
      }
    ]
    
    filterStudents()
  } catch (error) {
    console.error('Error fetching students:', error)
  } finally {
    isLoading.value = false
  }
}

// Filter and sort students based on search term and status
function filterStudents() {
  let filtered = [...students.value]
  
  // Apply search filter
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(term) || 
      student.email.toLowerCase().includes(term)
    )
  }
  
  // Apply status filter
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(student => 
      student.status.toLowerCase() === selectedStatus.value.toLowerCase()
    )
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    // Handle special cases for sorting
    if (sortField.value === 'lastActive') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else if (sortField.value === 'grade') {
      // Custom sort for grades
      const gradeValues = {
        'A+': 12, 'A': 11, 'A-': 10,
        'B+': 9, 'B': 8, 'B-': 7,
        'C+': 6, 'C': 5, 'C-': 4,
        'D+': 3, 'D': 2, 'D-': 1,
        'F': 0, 'Incomplete': -1
      }
      aVal = gradeValues[aVal] || -2
      bVal = gradeValues[bVal] || -2
    }
    
    // Sort direction
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })
  
  filteredStudents.value = filtered
}

// Toggle sort field and direction
function toggleSort(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  
  filterStudents()
}

// Check if a student is selected
function isStudentSelected(studentId) {
  return selectedStudentIds.value.includes(studentId)
}

// Toggle selection of a student
function toggleStudentSelection(studentId) {
  const index = selectedStudentIds.value.indexOf(studentId)
  if (index === -1) {
    selectedStudentIds.value.push(studentId)
  } else {
    selectedStudentIds.value.splice(index, 1)
  }
}

// Toggle selection of all students
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedStudentIds.value = []
  } else {
    selectedStudentIds.value = filteredStudents.value.map(student => student.id)
  }
}

// Get avatar style
function getAvatarStyle(student) {
  return {
    backgroundColor: student.avatarColor || '#4b5563'
  }
}

// Get initials from name
function getInitials(name) {
  if (!name) return ''
  
  const words = name.split(' ')
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

// Get CSS class for grade display
function getGradeClass(grade) {
  if (!grade) return ''
  
  const gradeValue = grade.charAt(0).toUpperCase()
  
  if (gradeValue === 'A') return 'grade-a'
  if (gradeValue === 'B') return 'grade-b'
  if (gradeValue === 'C') return 'grade-c'
  if (gradeValue === 'D') return 'grade-d'
  if (gradeValue === 'F' || grade === 'Incomplete') return 'grade-f'
  
  return ''
}

// Format last active date
function formatLastActive(dateString) {
  if (!dateString) return 'Never'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  
  return date.toLocaleDateString()
}

// View student profile
function viewStudentProfile(student) {
  emit('view-profile', student)
}

// Message a single student
function messageStudent(student) {
  emit('message', [student])
}

// Message selected students
function messageSelected() {
  const selected = students.value.filter(student => selectedStudentIds.value.includes(student.id))
  emit('message-selected', selected)
}

// View student submissions
function viewSubmissions(student) {
  emit('view-submissions', student)
}

// Export students list
function exportStudents() {
  emit('export', selectedStudents.value.length > 0 ? selectedStudents.value : filteredStudents.value)
}

// Change page
function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}
</script>

<style scoped>
.student-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 15px;
}

.search-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.filter-dropdown select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #4b5563;
  background-color: white;
  min-width: 140px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-btn {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.export-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.message-btn {
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
  position: relative;
}

.message-btn:hover {
  background-color: #4338ca;
  border-color: #4338ca;
}

.message-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.selected-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state, .empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.loading-state p, .empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.student-table-container {
  overflow-x: auto;
  flex: 1;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 950px;
}

.student-table th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 500;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}

.student-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: #f3f4f6;
}

.sort-icon {
  margin-left: 6px;
  font-size: 12px;
  color: #9ca3af;
}

.student-table tr:hover td {
  background-color: #f9fafb;
}

.selected-row td {
  background-color: #eff6ff !important;
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 24px;
  margin-bottom: 0;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  height: 20px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #9ca3af;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4C6EF5;
  border-color: #4C6EF5;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.select-column {
  width: 40px;
}

.student-column {
  min-width: 200px;
}

.email-column {
  min-width: 200px;
}

.grade-column, .status-column {
  width: 120px;
}

.progress-column {
  width: 120px;
}

.lastactive-column {
  width: 120px;
}

.actions-column {
  width: 120px;
  text-align: right;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.student-name {
  font-weight: 500;
}

.progress-bar-container {
  width: 80px;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar {
  height: 100%;
  background-color: #4C6EF5;
  border-radius: 4px;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #ecfdf5;
  color: #047857;
}

.status-at-risk {
  background-color: #fff7ed;
  color: #c2410c;
}

.status-inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}

.grade-a {
  color: #047857;
  font-weight: 600;
}

.grade-b {
  color: #0284c7;
  font-weight: 600;
}

.grade-c {
  color: #b45309;
  font-weight: 600;
}

.grade-d {
  color: #b91c1c;
  font-weight: 600;
}

.grade-f {
  color: #7f1d1d;
  font-weight: 600;
}

.table-action-button {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 4px;
}

.table-action-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #d1d5db;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.pagination-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #9ca3af;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 16px;
  font-size: 14px;
  color: #4b5563;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-filter {
    width: 100%;
  }
  
  .search-box {
    max-width: none;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-button {
    flex: 1;
    justify-content: center;
  }
}
</style> 