// Export all stores from this file for easier imports
export { useStudentsStore } from './studentsStore'
export { useMaterialsStore } from './materialsStore'
export { useOverviewStore } from './overviewStore'
export { useAnalyticsStore } from './analyticsStore'

// Define a base API URL for application-wide use
export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Re-export auth store if it exists
export { useAuthStore } from './auth' 