import { defineStore } from 'pinia'
import axios from 'axios'
import { useCourseStore, BASE_API_URL } from './courseStore'

// Demo student data
const demoStudents = {
  1: [
    {
      id: 1001,
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      quizzesCompleted: 4,
      averageScore: 92,
      lastActive: '2023-04-05T14:30:00Z'
    },
    {
      id: 1002,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      quizzesCompleted: 3,
      averageScore: 88,
      lastActive: '2023-04-05T09:15:00Z'
    },
    {
      id: 1003,
      name: 'Sarah Martinez',
      email: 'sarah.martinez@example.com',
      quizzesCompleted: 4,
      averageScore: 95,
      lastActive: '2023-04-05T16:45:00Z'
    },
    {
      id: 1004,
      name: 'David Kim',
      email: 'david.kim@example.com',
      quizzesCompleted: 2,
      averageScore: 78,
      lastActive: '2023-04-04T10:20:00Z'
    },
    {
      id: 1005,
      name: 'Jessica Brown',
      email: 'jessica.brown@example.com',
      quizzesCompleted: 4,
      averageScore: 91,
      lastActive: '2023-04-05T11:30:00Z'
    }
  ],
  2: [
    {
      id: 2001,
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      quizzesCompleted: 2,
      averageScore: 84,
      lastActive: '2023-04-04T13:45:00Z'
    },
    {
      id: 2002,
      name: 'Olivia Wilson',
      email: 'olivia.wilson@example.com',
      quizzesCompleted: 2,
      averageScore: 91,
      lastActive: '2023-04-05T09:30:00Z'
    },
    {
      id: 2003,
      name: 'Ethan Rodriguez',
      email: 'ethan.rodriguez@example.com',
      quizzesCompleted: 1,
      averageScore: 75,
      lastActive: '2023-04-03T15:20:00Z'
    }
  ]
}

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: {},
    activeStudent: null,
    searchQuery: '',
    currentPage: 1,
    studentsPerPage: 10,
    isLoading: false,
    error: null
  }),
  
  getters: {
    // Get students for active course
    courseStudents: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return []
      
      return state.students[courseStore.activeCourse.id] || []
    },
    
    // Search and pagination
    filteredStudents: (state) => {
      const query = state.searchQuery.toLowerCase().trim()
      
      // If no search, return all students for the current course
      if (!query) return state.courseStudents
      
      // Filter students by name or email
      return state.courseStudents.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.email.toLowerCase().includes(query)
      )
    },
    
    paginatedStudents: (state) => {
      const start = (state.currentPage - 1) * state.studentsPerPage
      const end = start + state.studentsPerPage
      
      return state.filteredStudents.slice(start, end)
    },
    
    totalPages: (state) => {
      return Math.ceil(state.filteredStudents.length / state.studentsPerPage)
    },
    
    // Get student by ID
    getStudentById: (state) => (studentId) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return null
      
      const courseStudents = state.students[courseStore.activeCourse.id] || []
      return courseStudents.find(student => student.id === studentId) || null
    }
  },
  
  actions: {
    /**
     * Fetch students for a course
     */
    async fetchStudents(courseId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/courses/${courseId}/students`)
        // this.students[courseId] = response.data
        
        // Demo data for now
        this.students[courseId] = demoStudents[courseId] || []
      } catch (err) {
        console.error('Error fetching students:', err)
        this.error = 'Failed to load students'
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Load students for the active course
     */
    async loadActiveStudents() {
      const courseStore = useCourseStore()
      if (courseStore.activeCourse) {
        await this.fetchStudents(courseStore.activeCourse.id)
      }
    },
    
    /**
     * Set active student
     */
    setActiveStudent(studentId) {
      const student = this.getStudentById(studentId)
      this.activeStudent = student
    },
    
    /**
     * Update search query
     */
    updateSearchQuery(query) {
      this.searchQuery = query
      this.currentPage = 1 // Reset to first page when searching
    },
    
    /**
     * Go to next page
     */
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    
    /**
     * Go to previous page
     */
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    
    /**
     * Set page
     */
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    
    /**
     * Add a student to a course
     */
    async addStudent(courseId, studentData) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/students`, studentData)
        // return response.data
        
        console.log('Adding student:', studentData, 'to course:', courseId)
        
        // Generate a unique ID for the new student
        const newStudentId = Date.now()
        
        // Create a new student object
        const newStudent = {
          id: newStudentId,
          ...studentData,
          quizzesCompleted: 0,
          averageScore: 0,
          lastActive: new Date().toISOString()
        }
        
        // Add to local store
        if (!this.students[courseId]) {
          this.students[courseId] = []
        }
        
        this.students[courseId].push(newStudent)
        
        return { success: true, message: 'Student added (demo)', student: newStudent }
      } catch (err) {
        console.error('Error adding student:', err)
        this.error = 'Failed to add student'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Remove a student from a course
     */
    async removeStudent(courseId, studentId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.delete(`${BASE_API_URL}/courses/${courseId}/students/${studentId}`)
        // return response.data
        
        console.log('Removing student:', studentId, 'from course:', courseId)
        
        // Remove from local store
        if (this.students[courseId]) {
          this.students[courseId] = this.students[courseId].filter(s => s.id !== studentId)
          
          // Clear active student if it's the one being removed
          if (this.activeStudent && this.activeStudent.id === studentId) {
            this.activeStudent = null
          }
        }
        
        return { success: true, message: 'Student removed (demo)' }
      } catch (err) {
        console.error('Error removing student:', err)
        this.error = 'Failed to remove student'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Fetch student details
     */
    async fetchStudentDetails(courseId, studentId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.get(`${BASE_API_URL}/courses/${courseId}/students/${studentId}`)
        // return response.data
        
        // Get basic student info from our store
        const student = this.getStudentById(studentId)
        
        if (!student) {
          this.error = 'Student not found'
          return null
        }
        
        // Add additional demo data for details
        const details = {
          ...student,
          quizResults: [
            { quizId: 101, title: 'Introduction to Programming', score: 90, completedAt: '2023-03-20T14:30:00Z' },
            { quizId: 102, title: 'Data Types and Operators', score: 85, completedAt: '2023-03-25T10:15:00Z' },
          ],
          attendance: 92,
          progress: 78,
          strengths: ['Algorithm Design', 'Problem Solving'],
          weaknesses: ['Data Structures', 'Time Complexity']
        }
        
        return details
      } catch (err) {
        console.error('Error fetching student details:', err)
        this.error = 'Failed to load student details'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 