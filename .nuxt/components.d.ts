
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'Loading': typeof import("../components/Loading.vue")['default']
    'ProfessorLogin': typeof import("../components/ProfessorLogin.vue")['default']
    'ProfessorRegister': typeof import("../components/ProfessorRegister.vue")['default']
    'StudentLogin': typeof import("../components/StudentLogin.vue")['default']
    'StudentRegister': typeof import("../components/StudentRegister.vue")['default']
    'ProfessorCourseAIAssistant': typeof import("../components/professor/CourseAIAssistant.vue")['default']
    'ProfessorCourseAnalytics': typeof import("../components/professor/CourseAnalytics.vue")['default']
    'ProfessorCourseMaterials': typeof import("../components/professor/CourseMaterials.vue")['default']
    'ProfessorCourseOverview': typeof import("../components/professor/CourseOverview.vue")['default']
    'ProfessorCourseQuizzes': typeof import("../components/professor/CourseQuizzes.vue")['default']
    'ProfessorCourseSettings': typeof import("../components/professor/CourseSettings.vue")['default']
    'ProfessorCourseStudents': typeof import("../components/professor/CourseStudents.vue")['default']
    'ProfessorQuizCreationWizard': typeof import("../components/professor/QuizCreationWizard.vue")['default']
    'ProfessorQuizEditModal': typeof import("../components/professor/QuizEditModal.vue")['default']
    'ProfessorQuizList': typeof import("../components/professor/QuizList.vue")['default']
    'ProfessorQuizResultsModal': typeof import("../components/professor/QuizResultsModal.vue")['default']
    'ProfessorAiassistantAIAssistantChat': typeof import("../components/professor/aiassistant/AIAssistantChat.vue")['default']
    'ProfessorAiassistantAIFeedbackPanel': typeof import("../components/professor/aiassistant/AIFeedbackPanel.vue")['default']
    'ProfessorAiassistantCourseAIAssistant': typeof import("../components/professor/aiassistant/CourseAIAssistant.vue")['default']
    'ProfessorAnalyticsCourseAnalytics': typeof import("../components/professor/analytics/CourseAnalytics.vue")['default']
    'ProfessorAnalyticsEngagementChart': typeof import("../components/professor/analytics/EngagementChart.vue")['default']
    'ProfessorAnalyticsPerformanceMetrics': typeof import("../components/professor/analytics/PerformanceMetrics.vue")['default']
    'ProfessorAnalyticsStudentProgress': typeof import("../components/professor/analytics/StudentProgress.vue")['default']
    'ProfessorMaterialsCourseMaterials': typeof import("../components/professor/materials/CourseMaterials.vue")['default']
    'ProfessorMaterialsMaterialDetailsModal': typeof import("../components/professor/materials/MaterialDetailsModal.vue")['default']
    'ProfessorMaterialsMaterialEditModal': typeof import("../components/professor/materials/MaterialEditModal.vue")['default']
    'ProfessorMaterialsMaterialList': typeof import("../components/professor/materials/MaterialList.vue")['default']
    'ProfessorMaterialsMaterialUploader': typeof import("../components/professor/materials/MaterialUploader.vue")['default']
    'ProfessorStudentsCourseStudents': typeof import("../components/professor/students/CourseStudents.vue")['default']
    'ProfessorStudentsStudentList': typeof import("../components/professor/students/StudentList.vue")['default']
    'ProfessorStudentsStudentMessageModal': typeof import("../components/professor/students/StudentMessageModal.vue")['default']
    'ProfessorStudentsStudentProfileModal': typeof import("../components/professor/students/StudentProfileModal.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyLoading': LazyComponent<typeof import("../components/Loading.vue")['default']>
    'LazyProfessorLogin': LazyComponent<typeof import("../components/ProfessorLogin.vue")['default']>
    'LazyProfessorRegister': LazyComponent<typeof import("../components/ProfessorRegister.vue")['default']>
    'LazyStudentLogin': LazyComponent<typeof import("../components/StudentLogin.vue")['default']>
    'LazyStudentRegister': LazyComponent<typeof import("../components/StudentRegister.vue")['default']>
    'LazyProfessorCourseAIAssistant': LazyComponent<typeof import("../components/professor/CourseAIAssistant.vue")['default']>
    'LazyProfessorCourseAnalytics': LazyComponent<typeof import("../components/professor/CourseAnalytics.vue")['default']>
    'LazyProfessorCourseMaterials': LazyComponent<typeof import("../components/professor/CourseMaterials.vue")['default']>
    'LazyProfessorCourseOverview': LazyComponent<typeof import("../components/professor/CourseOverview.vue")['default']>
    'LazyProfessorCourseQuizzes': LazyComponent<typeof import("../components/professor/CourseQuizzes.vue")['default']>
    'LazyProfessorCourseSettings': LazyComponent<typeof import("../components/professor/CourseSettings.vue")['default']>
    'LazyProfessorCourseStudents': LazyComponent<typeof import("../components/professor/CourseStudents.vue")['default']>
    'LazyProfessorQuizCreationWizard': LazyComponent<typeof import("../components/professor/QuizCreationWizard.vue")['default']>
    'LazyProfessorQuizEditModal': LazyComponent<typeof import("../components/professor/QuizEditModal.vue")['default']>
    'LazyProfessorQuizList': LazyComponent<typeof import("../components/professor/QuizList.vue")['default']>
    'LazyProfessorQuizResultsModal': LazyComponent<typeof import("../components/professor/QuizResultsModal.vue")['default']>
    'LazyProfessorAiassistantAIAssistantChat': LazyComponent<typeof import("../components/professor/aiassistant/AIAssistantChat.vue")['default']>
    'LazyProfessorAiassistantAIFeedbackPanel': LazyComponent<typeof import("../components/professor/aiassistant/AIFeedbackPanel.vue")['default']>
    'LazyProfessorAiassistantCourseAIAssistant': LazyComponent<typeof import("../components/professor/aiassistant/CourseAIAssistant.vue")['default']>
    'LazyProfessorAnalyticsCourseAnalytics': LazyComponent<typeof import("../components/professor/analytics/CourseAnalytics.vue")['default']>
    'LazyProfessorAnalyticsEngagementChart': LazyComponent<typeof import("../components/professor/analytics/EngagementChart.vue")['default']>
    'LazyProfessorAnalyticsPerformanceMetrics': LazyComponent<typeof import("../components/professor/analytics/PerformanceMetrics.vue")['default']>
    'LazyProfessorAnalyticsStudentProgress': LazyComponent<typeof import("../components/professor/analytics/StudentProgress.vue")['default']>
    'LazyProfessorMaterialsCourseMaterials': LazyComponent<typeof import("../components/professor/materials/CourseMaterials.vue")['default']>
    'LazyProfessorMaterialsMaterialDetailsModal': LazyComponent<typeof import("../components/professor/materials/MaterialDetailsModal.vue")['default']>
    'LazyProfessorMaterialsMaterialEditModal': LazyComponent<typeof import("../components/professor/materials/MaterialEditModal.vue")['default']>
    'LazyProfessorMaterialsMaterialList': LazyComponent<typeof import("../components/professor/materials/MaterialList.vue")['default']>
    'LazyProfessorMaterialsMaterialUploader': LazyComponent<typeof import("../components/professor/materials/MaterialUploader.vue")['default']>
    'LazyProfessorStudentsCourseStudents': LazyComponent<typeof import("../components/professor/students/CourseStudents.vue")['default']>
    'LazyProfessorStudentsStudentList': LazyComponent<typeof import("../components/professor/students/StudentList.vue")['default']>
    'LazyProfessorStudentsStudentMessageModal': LazyComponent<typeof import("../components/professor/students/StudentMessageModal.vue")['default']>
    'LazyProfessorStudentsStudentProfileModal': LazyComponent<typeof import("../components/professor/students/StudentProfileModal.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const Loading: typeof import("../components/Loading.vue")['default']
export const ProfessorLogin: typeof import("../components/ProfessorLogin.vue")['default']
export const ProfessorRegister: typeof import("../components/ProfessorRegister.vue")['default']
export const StudentLogin: typeof import("../components/StudentLogin.vue")['default']
export const StudentRegister: typeof import("../components/StudentRegister.vue")['default']
export const ProfessorCourseAIAssistant: typeof import("../components/professor/CourseAIAssistant.vue")['default']
export const ProfessorCourseAnalytics: typeof import("../components/professor/CourseAnalytics.vue")['default']
export const ProfessorCourseMaterials: typeof import("../components/professor/CourseMaterials.vue")['default']
export const ProfessorCourseOverview: typeof import("../components/professor/CourseOverview.vue")['default']
export const ProfessorCourseQuizzes: typeof import("../components/professor/CourseQuizzes.vue")['default']
export const ProfessorCourseSettings: typeof import("../components/professor/CourseSettings.vue")['default']
export const ProfessorCourseStudents: typeof import("../components/professor/CourseStudents.vue")['default']
export const ProfessorQuizCreationWizard: typeof import("../components/professor/QuizCreationWizard.vue")['default']
export const ProfessorQuizEditModal: typeof import("../components/professor/QuizEditModal.vue")['default']
export const ProfessorQuizList: typeof import("../components/professor/QuizList.vue")['default']
export const ProfessorQuizResultsModal: typeof import("../components/professor/QuizResultsModal.vue")['default']
export const ProfessorAiassistantAIAssistantChat: typeof import("../components/professor/aiassistant/AIAssistantChat.vue")['default']
export const ProfessorAiassistantAIFeedbackPanel: typeof import("../components/professor/aiassistant/AIFeedbackPanel.vue")['default']
export const ProfessorAiassistantCourseAIAssistant: typeof import("../components/professor/aiassistant/CourseAIAssistant.vue")['default']
export const ProfessorAnalyticsCourseAnalytics: typeof import("../components/professor/analytics/CourseAnalytics.vue")['default']
export const ProfessorAnalyticsEngagementChart: typeof import("../components/professor/analytics/EngagementChart.vue")['default']
export const ProfessorAnalyticsPerformanceMetrics: typeof import("../components/professor/analytics/PerformanceMetrics.vue")['default']
export const ProfessorAnalyticsStudentProgress: typeof import("../components/professor/analytics/StudentProgress.vue")['default']
export const ProfessorMaterialsCourseMaterials: typeof import("../components/professor/materials/CourseMaterials.vue")['default']
export const ProfessorMaterialsMaterialDetailsModal: typeof import("../components/professor/materials/MaterialDetailsModal.vue")['default']
export const ProfessorMaterialsMaterialEditModal: typeof import("../components/professor/materials/MaterialEditModal.vue")['default']
export const ProfessorMaterialsMaterialList: typeof import("../components/professor/materials/MaterialList.vue")['default']
export const ProfessorMaterialsMaterialUploader: typeof import("../components/professor/materials/MaterialUploader.vue")['default']
export const ProfessorStudentsCourseStudents: typeof import("../components/professor/students/CourseStudents.vue")['default']
export const ProfessorStudentsStudentList: typeof import("../components/professor/students/StudentList.vue")['default']
export const ProfessorStudentsStudentMessageModal: typeof import("../components/professor/students/StudentMessageModal.vue")['default']
export const ProfessorStudentsStudentProfileModal: typeof import("../components/professor/students/StudentProfileModal.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyLoading: LazyComponent<typeof import("../components/Loading.vue")['default']>
export const LazyProfessorLogin: LazyComponent<typeof import("../components/ProfessorLogin.vue")['default']>
export const LazyProfessorRegister: LazyComponent<typeof import("../components/ProfessorRegister.vue")['default']>
export const LazyStudentLogin: LazyComponent<typeof import("../components/StudentLogin.vue")['default']>
export const LazyStudentRegister: LazyComponent<typeof import("../components/StudentRegister.vue")['default']>
export const LazyProfessorCourseAIAssistant: LazyComponent<typeof import("../components/professor/CourseAIAssistant.vue")['default']>
export const LazyProfessorCourseAnalytics: LazyComponent<typeof import("../components/professor/CourseAnalytics.vue")['default']>
export const LazyProfessorCourseMaterials: LazyComponent<typeof import("../components/professor/CourseMaterials.vue")['default']>
export const LazyProfessorCourseOverview: LazyComponent<typeof import("../components/professor/CourseOverview.vue")['default']>
export const LazyProfessorCourseQuizzes: LazyComponent<typeof import("../components/professor/CourseQuizzes.vue")['default']>
export const LazyProfessorCourseSettings: LazyComponent<typeof import("../components/professor/CourseSettings.vue")['default']>
export const LazyProfessorCourseStudents: LazyComponent<typeof import("../components/professor/CourseStudents.vue")['default']>
export const LazyProfessorQuizCreationWizard: LazyComponent<typeof import("../components/professor/QuizCreationWizard.vue")['default']>
export const LazyProfessorQuizEditModal: LazyComponent<typeof import("../components/professor/QuizEditModal.vue")['default']>
export const LazyProfessorQuizList: LazyComponent<typeof import("../components/professor/QuizList.vue")['default']>
export const LazyProfessorQuizResultsModal: LazyComponent<typeof import("../components/professor/QuizResultsModal.vue")['default']>
export const LazyProfessorAiassistantAIAssistantChat: LazyComponent<typeof import("../components/professor/aiassistant/AIAssistantChat.vue")['default']>
export const LazyProfessorAiassistantAIFeedbackPanel: LazyComponent<typeof import("../components/professor/aiassistant/AIFeedbackPanel.vue")['default']>
export const LazyProfessorAiassistantCourseAIAssistant: LazyComponent<typeof import("../components/professor/aiassistant/CourseAIAssistant.vue")['default']>
export const LazyProfessorAnalyticsCourseAnalytics: LazyComponent<typeof import("../components/professor/analytics/CourseAnalytics.vue")['default']>
export const LazyProfessorAnalyticsEngagementChart: LazyComponent<typeof import("../components/professor/analytics/EngagementChart.vue")['default']>
export const LazyProfessorAnalyticsPerformanceMetrics: LazyComponent<typeof import("../components/professor/analytics/PerformanceMetrics.vue")['default']>
export const LazyProfessorAnalyticsStudentProgress: LazyComponent<typeof import("../components/professor/analytics/StudentProgress.vue")['default']>
export const LazyProfessorMaterialsCourseMaterials: LazyComponent<typeof import("../components/professor/materials/CourseMaterials.vue")['default']>
export const LazyProfessorMaterialsMaterialDetailsModal: LazyComponent<typeof import("../components/professor/materials/MaterialDetailsModal.vue")['default']>
export const LazyProfessorMaterialsMaterialEditModal: LazyComponent<typeof import("../components/professor/materials/MaterialEditModal.vue")['default']>
export const LazyProfessorMaterialsMaterialList: LazyComponent<typeof import("../components/professor/materials/MaterialList.vue")['default']>
export const LazyProfessorMaterialsMaterialUploader: LazyComponent<typeof import("../components/professor/materials/MaterialUploader.vue")['default']>
export const LazyProfessorStudentsCourseStudents: LazyComponent<typeof import("../components/professor/students/CourseStudents.vue")['default']>
export const LazyProfessorStudentsStudentList: LazyComponent<typeof import("../components/professor/students/StudentList.vue")['default']>
export const LazyProfessorStudentsStudentMessageModal: LazyComponent<typeof import("../components/professor/students/StudentMessageModal.vue")['default']>
export const LazyProfessorStudentsStudentProfileModal: LazyComponent<typeof import("../components/professor/students/StudentProfileModal.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
