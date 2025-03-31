import { defineStore } from 'pinia'
import axios from 'axios'

// Demo data that will later be replaced by API calls
const DEMO_COURSES = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Fundamental concepts of programming and computer science.',
    students: 45,
    quizzes: 5,
    color: '#4C6EF5'
  },
  {
    id: 2,
    code: 'MATH200',
    title: 'Advanced Calculus',
    description: 'In-depth exploration of calculus concepts including limits, derivatives, and integrals.',
    students: 32,
    quizzes: 4,
    color: '#F03E3E'
  },
  {
    id: 3,
    code: 'PHYS150',
    title: 'Physics for Scientists',
    description: 'Physical principles and their applications in modern technology and scientific research.',
    students: 28,
    quizzes: 3,
    color: '#40C057'
  },
  {
    id: 4,
    code: 'ENG210',
    title: 'Creative Writing',
    description: 'Techniques and practice in writing fiction, poetry, and creative non-fiction.',
    students: 51,
    quizzes: 0,
    color: '#FAB005'
  }
]

export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    activeCourse: null,
    isLoading: false,
    error: null
  }),

  getters: {
    // Course related getters
    getCourseById: (state) => (id) => {
      return state.courses.find(course => course.id === id) || null
    }
  },

  actions: {
    /**
     * Load all courses (demo data initially, later from API)
     */
    async fetchCourses() {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/courses`)
        // this.courses = response.data
        
        // Demo data for now
        this.courses = DEMO_COURSES
      } catch (err) {
        console.error('Error fetching courses:', err)
        this.error = 'Failed to load courses'
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Set active course and load associated data
     */
    async setActiveCourse(courseId) {
      this.isLoading = true
      const course = this.getCourseById(courseId)
      
      if (!course) {
        this.error = 'Course not found'
        this.isLoading = false
        return
      }
      
      this.activeCourse = course
      this.isLoading = false
    },
    
    /**
     * Create a new course
     */
    async createCourse(courseData) {
      try {
        // TODO: Implement API call
        // const response = await axios.post(`${BASE_API_URL}/courses`, courseData)
        // return response.data
        
        console.log('Creating course:', courseData)
        // Demo implementation - just log data
        return { success: true, message: 'Course created (demo)' }
      } catch (err) {
        console.error('Error creating course:', err)
        this.error = 'Failed to create course'
        throw err
      }
    },
    
    /**
     * Update a course
     */
    async updateCourse(courseId, courseData) {
      try {
        // TODO: Implement API call
        // const response = await axios.put(`${BASE_API_URL}/courses/${courseId}`, courseData)
        // return response.data
        
        console.log('Updating course:', courseId, 'with data:', courseData)
        // Demo implementation - just log data
        return { success: true, message: 'Course updated (demo)' }
      } catch (err) {
        console.error('Error updating course:', err)
        this.error = 'Failed to update course'
        throw err
      }
    },
    
    /**
     * Delete a course
     */
    async deleteCourse(courseId) {
      try {
        // TODO: Implement API call
        // const response = await axios.delete(`${BASE_API_URL}/courses/${courseId}`)
        // return response.data
        
        console.log('Deleting course:', courseId)
        // Demo implementation - just log data
        return { success: true, message: 'Course deleted (demo)' }
      } catch (err) {
        console.error('Error deleting course:', err)
        this.error = 'Failed to delete course'
        throw err
      }
    }
  }
}) 