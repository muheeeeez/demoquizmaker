import { defineStore } from 'pinia'
import axios from 'axios'
import { useCourseStore, BASE_API_URL } from './courseStore'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    courseStats: {},
    isLoading: false,
    error: null
  }),
  
  getters: {
    // Stats for active course
    activeClassAverage: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse || !state.courseStats[courseStore.activeCourse.id]) {
        return 0
      }
      return state.courseStats[courseStore.activeCourse.id].classAverage
    },
    
    activeCompletionRate: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse || !state.courseStats[courseStore.activeCourse.id]) {
        return 0
      }
      return state.courseStats[courseStore.activeCourse.id].completionRate
    },
    
    activePassRate: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse || !state.courseStats[courseStore.activeCourse.id]) {
        return 0
      }
      return state.courseStats[courseStore.activeCourse.id].passRate
    }
  },
  
  actions: {
    /**
     * Fetch course statistics
     */
    async fetchCourseStats(courseId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/courses/${courseId}/stats`)
        // this.courseStats[courseId] = response.data
        
        // Demo data for now
        this.courseStats[courseId] = {
          classAverage: Math.floor(60 + (courseId * 5) % 25),
          completionRate: Math.floor(70 + (courseId * 7) % 25),
          passRate: Math.floor(65 + (courseId * 8) % 20)
        }
      } catch (err) {
        console.error('Error fetching course stats:', err)
        this.error = 'Failed to load course statistics'
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Load stats for the active course
     */
    async loadActiveStats() {
      const courseStore = useCourseStore()
      if (courseStore.activeCourse) {
        await this.fetchCourseStats(courseStore.activeCourse.id)
      }
    },
    
    /**
     * Fetch stats for dashboard overview
     */
    async fetchGlobalStats() {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/stats/global`)
        // return response.data
        
        // Return some demo global stats
        return {
          totalCourses: 4,
          totalQuizzes: 12,
          totalStudents: 156,
          averageScore: 78
        }
      } catch (err) {
        console.error('Error fetching global stats:', err)
        this.error = 'Failed to load global statistics'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Generate analytics report for a course
     */
    async generateCourseReport(courseId, reportType = 'summary') {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/courses/${courseId}/reports/${reportType}`)
        // return response.data
        
        // Return some demo report data
        return {
          courseId,
          reportType,
          generatedAt: new Date().toISOString(),
          data: {
            summary: {
              quizzesTaken: 82,
              averageScore: 76.4,
              highestScore: 98,
              lowestScore: 54
            },
            trends: {
              weeklyProgress: [65, 68, 72, 75, 76, 78, 80],
              topicPerformance: {
                'Data Structures': 82,
                'Algorithms': 76,
                'Object-Oriented Design': 68,
                'System Architecture': 72
              }
            }
          }
        }
      } catch (err) {
        console.error('Error generating course report:', err)
        this.error = 'Failed to generate course report'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 