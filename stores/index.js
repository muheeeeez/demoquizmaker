// Export all stores from this file for easier imports
export { useCourseStore } from './courseStore'
export { useStatsStore } from './statsStore'
export { useQuizStore } from './quizStore'
export { useStudentStore } from './studentStore'
export { useMaterialStore } from './materialStore'
export { useAssistantStore } from './assistantStore'
export { BASE_API_URL } from './courseStore'

// Re-export auth store if it exists
export { useAuthStore } from './auth' 