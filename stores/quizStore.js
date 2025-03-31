import { defineStore } from 'pinia'
import axios from 'axios'
import { useCourseStore, BASE_API_URL } from './courseStore'

// Demo quiz data
const demoQuizzes = {
  1: [
    {
      id: 101,
      title: 'Introduction to Programming',
      description: 'Basic concepts of programming and variables',
      dueDate: '2023-04-15',
      timeLimit: 30,
      questionCount: 10,
      status: 'active'
    },
    {
      id: 102,
      title: 'Data Types and Operators',
      description: 'Understanding data types and basic operators',
      dueDate: '2023-04-22',
      timeLimit: 25,
      questionCount: 8,
      status: 'active'
    },
    {
      id: 103,
      title: 'Control Structures',
      description: 'If statements, loops, and conditional logic',
      dueDate: '2023-04-29',
      timeLimit: 40,
      questionCount: 12,
      status: 'draft'
    }
  ],
  2: [
    {
      id: 201,
      title: 'Limits and Continuity',
      description: 'Understanding the concept of limits',
      dueDate: '2023-04-18',
      timeLimit: 35,
      questionCount: 10,
      status: 'active'
    },
    {
      id: 202,
      title: 'Derivatives',
      description: 'Calculating and applying derivatives',
      dueDate: '2023-04-25',
      timeLimit: 45,
      questionCount: 15,
      status: 'active'
    }
  ]
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: {},
    activeQuiz: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    // Get quizzes for active course
    courseQuizzes: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return []
      
      return state.quizzes[courseStore.activeCourse.id] || []
    },
    
    // Get active quizzes (not drafts)
    activeQuizzes: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return []
      
      const courseQuizzes = state.quizzes[courseStore.activeCourse.id] || []
      return courseQuizzes.filter(quiz => quiz.status === 'active')
    },
    
    // Get draft quizzes
    draftQuizzes: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return []
      
      const courseQuizzes = state.quizzes[courseStore.activeCourse.id] || []
      return courseQuizzes.filter(quiz => quiz.status === 'draft')
    },
    
    // Get quiz by ID
    getQuizById: (state) => (quizId) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return null
      
      const courseQuizzes = state.quizzes[courseStore.activeCourse.id] || []
      return courseQuizzes.find(quiz => quiz.id === quizId) || null
    }
  },
  
  actions: {
    /**
     * Fetch quizzes for a course
     */
    async fetchQuizzes(courseId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/courses/${courseId}/quizzes`)
        // this.quizzes[courseId] = response.data
        
        // Demo data for now
        this.quizzes[courseId] = demoQuizzes[courseId] || []
      } catch (err) {
        console.error('Error fetching quizzes:', err)
        this.error = 'Failed to load quizzes'
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Load quizzes for the active course
     */
    async loadActiveQuizzes() {
      const courseStore = useCourseStore()
      if (courseStore.activeCourse) {
        await this.fetchQuizzes(courseStore.activeCourse.id)
      }
    },
    
    /**
     * Set active quiz
     */
    setActiveQuiz(quizId) {
      const quiz = this.getQuizById(quizId)
      this.activeQuiz = quiz
    },
    
    /**
     * Create a new quiz
     */
    async createQuiz(courseId, quizData) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/quizzes`, quizData)
        // return response.data
        
        console.log('Creating quiz:', quizData, 'for course:', courseId)
        // Demo implementation - just log data
        
        // Generate a unique ID for the new quiz
        const newQuizId = Date.now()
        
        // Create a new quiz object
        const newQuiz = {
          id: newQuizId,
          ...quizData,
          status: quizData.status || 'draft',
          questionCount: quizData.questions ? quizData.questions.length : 0
        }
        
        // Add to local store
        if (!this.quizzes[courseId]) {
          this.quizzes[courseId] = []
        }
        
        this.quizzes[courseId].push(newQuiz)
        
        return { success: true, message: 'Quiz created (demo)', quiz: newQuiz }
      } catch (err) {
        console.error('Error creating quiz:', err)
        this.error = 'Failed to create quiz'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Update a quiz
     */
    async updateQuiz(courseId, quizId, quizData) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.put(`${BASE_API_URL}/courses/${courseId}/quizzes/${quizId}`, quizData)
        // return response.data
        
        console.log('Updating quiz:', quizId, 'with data:', quizData)
        // Demo implementation - update local data
        
        if (this.quizzes[courseId]) {
          const quizIndex = this.quizzes[courseId].findIndex(q => q.id === quizId)
          
          if (quizIndex !== -1) {
            // Update quiz
            this.quizzes[courseId][quizIndex] = {
              ...this.quizzes[courseId][quizIndex],
              ...quizData,
              questionCount: quizData.questions ? quizData.questions.length : this.quizzes[courseId][quizIndex].questionCount
            }
            
            // Update active quiz if it's the one being edited
            if (this.activeQuiz && this.activeQuiz.id === quizId) {
              this.activeQuiz = this.quizzes[courseId][quizIndex]
            }
          }
        }
        
        return { success: true, message: 'Quiz updated (demo)' }
      } catch (err) {
        console.error('Error updating quiz:', err)
        this.error = 'Failed to update quiz'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Delete a quiz
     */
    async deleteQuiz(courseId, quizId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.delete(`${BASE_API_URL}/courses/${courseId}/quizzes/${quizId}`)
        // return response.data
        
        console.log('Deleting quiz:', quizId, 'from course:', courseId)
        // Demo implementation - remove from local data
        
        if (this.quizzes[courseId]) {
          this.quizzes[courseId] = this.quizzes[courseId].filter(q => q.id !== quizId)
          
          // Clear active quiz if it's the one being deleted
          if (this.activeQuiz && this.activeQuiz.id === quizId) {
            this.activeQuiz = null
          }
        }
        
        return { success: true, message: 'Quiz deleted (demo)' }
      } catch (err) {
        console.error('Error deleting quiz:', err)
        this.error = 'Failed to delete quiz'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Duplicate a quiz
     */
    async duplicateQuiz(courseId, quizId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/quizzes/${quizId}/duplicate`)
        // return response.data
        
        console.log('Duplicating quiz:', quizId, 'from course:', courseId)
        // Demo implementation - duplicate in local data
        
        if (this.quizzes[courseId]) {
          const originalQuiz = this.quizzes[courseId].find(q => q.id === quizId)
          
          if (originalQuiz) {
            // Create a duplicate with a new ID
            const duplicatedQuiz = {
              ...originalQuiz,
              id: Date.now(),
              title: `Copy of ${originalQuiz.title}`,
              status: 'draft'
            }
            
            this.quizzes[courseId].push(duplicatedQuiz)
            return { success: true, message: 'Quiz duplicated (demo)', quiz: duplicatedQuiz }
          }
        }
        
        return { success: false, message: 'Quiz not found' }
      } catch (err) {
        console.error('Error duplicating quiz:', err)
        this.error = 'Failed to duplicate quiz'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 