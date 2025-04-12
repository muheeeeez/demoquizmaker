// Export all stores from this file for easier imports
export { useStudentsStore } from './professor/studentsStore'
export { useMaterialsStore } from './professor/materialsStore'
export { useOverviewStore } from './professor/overviewStore'
export { useAnalyticsStore } from './professor/analyticsStore'

// Define a base API URL for application-wide use
export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Export auth store directly
export * from './auth' 