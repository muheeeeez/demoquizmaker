import { defineStore } from 'pinia'
import axios from 'axios'
import { useCourseStore, BASE_API_URL } from './courseStore'

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    conversationHistory: {},
    isLoading: false,
    error: null
  }),
  
  getters: {
    // Get conversation history for active course
    activeConversation: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return []
      
      return state.conversationHistory[courseStore.activeCourse.id] || []
    }
  },
  
  actions: {
    /**
     * Initialize conversation for a course
     */
    initializeConversation(courseId) {
      if (!this.conversationHistory[courseId]) {
        // Initialize with a welcome message
        const courseStore = useCourseStore();
        const course = courseStore.getCourseById(courseId);
        
        const welcomeMessage = course 
          ? `Hello! I'm your AI assistant for ${course.code}: ${course.title}. How can I help you today?` 
          : 'Hello! I\'m your AI assistant. How can I help you today?';
        
        this.conversationHistory[courseId] = [
          {
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date().toISOString()
          }
        ];
      }
    },
    
    /**
     * Ask a question to the assistant
     */
    async askQuestion(courseId, question) {
      if (!question.trim()) return
      
      this.isLoading = true
      this.error = null
      
      try {
        // Initialize conversation if it doesn't exist
        if (!this.conversationHistory[courseId]) {
          this.initializeConversation(courseId)
        }
        
        // Add user message to history
        this.conversationHistory[courseId].push({
          role: 'user',
          content: question,
          timestamp: new Date().toISOString()
        })
        
        // TODO: Replace with API call once backend is ready
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/assistant/ask`, { 
        //   question,
        //   conversationHistory: this.conversationHistory[courseId]
        // })
        // const responseText = response.data.response
        
        // Generate a demo response based on the question
        let responseText = this.generateDemoResponse(question, courseId)
        
        // Add assistant response to history
        this.conversationHistory[courseId].push({
          role: 'assistant',
          content: responseText,
          timestamp: new Date().toISOString()
        })
        
        return responseText
      } catch (err) {
        console.error('Error asking question:', err)
        this.error = 'Failed to get response from assistant'
        
        // Add error message to conversation
        this.conversationHistory[courseId].push({
          role: 'assistant',
          content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
          timestamp: new Date().toISOString(),
          isError: true
        })
        
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Generate quiz based on a topic
     */
    async generateQuiz(courseId, topic, options = {}) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/assistant/generate-quiz`, { 
        //   topic,
        //   options
        // })
        // const responseText = response.data.response
        
        console.log('Generating quiz for topic:', topic, 'in course:', courseId, 'with options:', options)
        
        // In a real application, this would generate a quiz using AI
        // For demo, we'll just return a placeholder structure
        
        const questionCount = options.questionCount || 5
        const difficulty = options.difficulty || 'medium'
        
        // Generate demo questions
        const questions = []
        for (let i = 1; i <= questionCount; i++) {
          questions.push({
            id: i,
            text: `Sample question ${i} about ${topic} (${difficulty} difficulty)`,
            options: [
              { id: `${i}_a`, text: 'Option A', isCorrect: i % 4 === 0 },
              { id: `${i}_b`, text: 'Option B', isCorrect: i % 4 === 1 },
              { id: `${i}_c`, text: 'Option C', isCorrect: i % 4 === 2 },
              { id: `${i}_d`, text: 'Option D', isCorrect: i % 4 === 3 }
            ],
            explanation: `This is an explanation for question ${i} about ${topic}.`
          })
        }
        
        return {
          success: true,
          message: 'Quiz generated successfully (demo)',
          quiz: {
            title: `Quiz on ${topic}`,
            description: `Test your knowledge of ${topic}`,
            questions,
            timeLimit: options.timeLimit || 30,
            passingScore: options.passingScore || 70,
            difficulty
          }
        }
      } catch (err) {
        console.error('Error generating quiz:', err)
        this.error = 'Failed to generate quiz'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Analyze performance data
     */
    async analyzePerformance(courseId, data) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/assistant/analyze`, { data })
        // const responseText = response.data.response
        
        console.log('Analyzing performance data for course:', courseId)
        
        // In a real application, this would analyze performance data using AI
        // For demo, we'll just return a placeholder analysis
        
        return {
          success: true,
          message: 'Analysis completed (demo)',
          analysis: {
            summary: 'Based on the performance data, most students are doing well but there are some areas that need improvement.',
            strengths: [
              'Students show strong understanding of basic concepts',
              'Good performance on theoretical questions'
            ],
            weaknesses: [
              'Practical application questions have lower scores',
              'Complex topics need more attention'
            ],
            recommendations: [
              'Consider providing more practical exercises',
              'Review complex topics with additional materials',
              'Offer targeted help to struggling students'
            ]
          }
        }
      } catch (err) {
        console.error('Error analyzing performance:', err)
        this.error = 'Failed to analyze performance'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Clear conversation history for a course
     */
    clearConversation(courseId) {
      this.initializeConversation(courseId)
    },
    
    /**
     * Helper method to generate a demo response
     * In a real application, this would be replaced by the AI service
     */
    generateDemoResponse(question, courseId) {
      const lowerQuestion = question.toLowerCase()
      
      // Get course info if available
      const courseStore = useCourseStore()
      const course = courseStore.getCourseById(courseId)
      const courseName = course ? `${course.code}: ${course.title}` : 'this course'
      
      // Generate responses based on keywords in the question
      if (lowerQuestion.includes('quiz') || lowerQuestion.includes('test')) {
        return `I can help you create quizzes for ${courseName}. You can specify the topic, number of questions, and difficulty level.`
      } else if (lowerQuestion.includes('student') || lowerQuestion.includes('class')) {
        return `${courseName} currently has ${course ? course.students : 'several'} students enrolled. You can view detailed student performance in the Students tab.`
      } else if (lowerQuestion.includes('material') || lowerQuestion.includes('resource') || lowerQuestion.includes('document')) {
        return `You can find all course materials in the Materials tab. You can also ask me to generate new materials on specific topics where students are struggling.`
      } else if (lowerQuestion.includes('grade') || lowerQuestion.includes('score') || lowerQuestion.includes('performance')) {
        return `The current class average for ${courseName} is ${course ? '78%' : 'available in the Analytics tab'}. I can provide a detailed analysis of student performance if you'd like.`
      } else if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
        return `Hello! I'm your AI assistant for ${courseName}. I can help you manage your course, create quizzes, analyze student performance, and generate teaching materials.`
      } else if (lowerQuestion.includes('thank')) {
        return `You're welcome! Let me know if you need anything else for ${courseName}.`
      } else {
        return `Thank you for your question about ${courseName}. To better assist you, could you provide more specific details about what you'd like to know?`
      }
    }
  }
}) 