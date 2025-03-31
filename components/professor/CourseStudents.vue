<template>
  <div class="students-tab">
    <div class="detail-card">
      <div class="card-header-with-action">
        <h3><i class="fas fa-user-graduate"></i> Enrolled Students</h3>
        <button class="secondary-button"><i class="fas fa-user-plus"></i> Add Student</button>
      </div>
      
      <div class="search-bar">
        <input type="text" placeholder="Search students..." v-model="searchQuery" />
        <button class="search-btn" @click="searchStudents"><i class="fas fa-search"></i></button>
      </div>
      
      <div class="student-list">
        <div class="list-header">
          <span><i class="fas fa-user"></i> Name</span>
          <span><i class="fas fa-envelope"></i> Email</span>
          <span><i class="fas fa-clipboard-check"></i> Quizzes Completed</span>
          <span><i class="fas fa-chart-line"></i> Average Score</span>
          <span class="list-actions"><i class="fas fa-cog"></i> Actions</span>
        </div>
        
        <div v-for="student in paginatedStudents" :key="student.id" class="list-item">
          <span>{{ student.name }}</span>
          <span>{{ student.email }}</span>
          <span>{{ student.quizzesCompleted }} / {{ course.quizzes }}</span>
          <span>{{ student.averageScore }}%</span>
          <span class="list-actions">
            <button class="action-btn"><i class="fas fa-eye"></i> View</button>
            <button class="action-btn"><i class="fas fa-envelope"></i> Message</button>
          </span>
        </div>
        
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="prevPage"><i class="fas fa-chevron-left"></i> Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="nextPage">Next <i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const searchQuery = ref('')
const currentPage = ref(1)
const studentsPerPage = 5

// Generate students based on course
const allStudents = computed(() => {
  const studentsList = []
  
  // Generate different student data for each course
  const startId = 1000 + (props.course.id * 100)
  
  for (let i = 0; i < props.course.students; i++) {
    const studentId = startId + i
    const quizzesCompleted = Math.min(
      props.course.quizzes, 
      Math.max(0, props.course.quizzes - Math.floor(i / 5))
    )
    
    studentsList.push({
      id: studentId,
      name: getStudentName(studentId),
      email: getStudentEmail(studentId),
      quizzesCompleted,
      averageScore: Math.floor(60 + (props.course.id * 3) + (i % 30))
    })
  }
  
  return studentsList
})

// Filter students by search query
const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) {
    return allStudents.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return allStudents.value.filter(student => 
    student.name.toLowerCase().includes(query) || 
    student.email.toLowerCase().includes(query)
  )
})

// Paginate students
const paginatedStudents = computed(() => {
  const startIndex = (currentPage.value - 1) * studentsPerPage
  return filteredStudents.value.slice(startIndex, startIndex + studentsPerPage)
})

// Total pages
const totalPages = computed(() => 
  Math.ceil(filteredStudents.value.length / studentsPerPage)
)

// Navigation
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Helper functions for generating realistic student data
function getStudentName(id) {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Lucas', 'Sophia', 'Mason', 'Isabella', 'Ethan', 
                      'Mia', 'Jacob', 'Amelia', 'Benjamin', 'Charlotte', 'William', 'Abigail', 'James', 'Emily', 'Alexander',
                      'Samantha', 'Michael', 'Sofia', 'David', 'Ella']
  
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
                    'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White']
  
  // Use the student id to consistently generate the same name for the same id
  const firstNameIndex = (id * 7) % firstNames.length
  const lastNameIndex = (id * 13) % lastNames.length
  
  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`
}

function getStudentEmail(id) {
  const name = getStudentName(id).toLowerCase().split(' ')
  return `${name[0]}.${name[1]}${id % 100}@university.edu`
}

const searchStudents = () => {
  currentPage.value = 1
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

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.search-btn {
  background-color: #ff784b;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 15px;
  cursor: pointer;
}

.list-header {
  display: flex;
  padding: 10px 15px;
  background-color: #f9fafb;
  font-weight: 500;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.list-header span, .list-item span {
  flex: 1;
  max-width: 200px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.list-item:last-child {
  border-bottom: none;
}

.action-btn {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #eee;
  margin-top: 15px;
}

.pagination button {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary-button:hover {
  background-color: #f3f4f6;
}

@media (max-width: 768px) {
  .list-header, .list-item {
    font-size: 14px;
  }
  
  .action-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .card-header-with-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .search-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-bar input {
    border-radius: 4px;
  }
  
  .search-btn {
    border-radius: 4px;
    width: 100%;
  }
  
  .list-header {
    display: none;
  }
  
  .list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .list-item span {
    width: 100%;
    max-width: none;
  }
}

.list-header i {
  margin-right: 5px;
  color: #6b7280;
}

.action-btn i {
  margin-right: 4px;
}
</style> 