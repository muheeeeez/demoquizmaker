<template>
  <div class="ai-assistant-container">
    <div class="assistant-header">
      <h3><i class="fas fa-robot"></i> AI Teaching Assistant</h3>
      <div class="tab-buttons">
        <button 
          :class="['tab-button', { active: activeTab === 'chat' }]" 
          @click="activeTab = 'chat'"
        >
          <i class="fas fa-comment-alt"></i> Chat
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'feedback' }]" 
          @click="activeTab = 'feedback'"
        >
          <i class="fas fa-lightbulb"></i> Course Feedback
        </button>
      </div>
    </div>

    <div class="assistant-content">
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'chat'" class="chat-tab">
          <ai-assistant-chat 
            :course-id="course.id"
            :course-title="course.title"
            @message-sent="onMessageSent"
            @ai-responded="onAIResponse"
          />
        </div>
        
        <div v-else-if="activeTab === 'feedback'" class="feedback-tab">
          <ai-feedback-panel 
            :course-id="course.id"
            :course-content="courseContent"
            @apply-suggestion="onApplySuggestion"
            @refresh-suggestions="onRefreshSuggestions"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AIAssistantChat from './AIAssistantChat.vue'
import AIFeedbackPanel from './AIFeedbackPanel.vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const activeTab = ref('chat')
const courseContent = ref({})

// This would retrieve real course content in a production app
function getCourseContent() {
  // Mock course content structure for demo purposes
  return {
    modules: [
      {
        id: 1,
        title: 'Introduction to the Course',
        materials: [
          { id: 101, type: 'document', title: 'Course Overview', hasImages: true },
          { id: 102, type: 'video', title: 'Welcome Message' }
        ]
      },
      {
        id: 2,
        title: 'Core Concepts',
        materials: [
          { id: 201, type: 'document', title: 'Fundamentals', hasImages: true },
          { id: 202, type: 'presentation', title: 'Key Principles', hasImages: true },
          { id: 203, type: 'exercise', title: 'Practice Problems' }
        ]
      },
      {
        id: 3,
        title: 'Advanced Topics',
        materials: [
          { id: 301, type: 'document', title: 'Advanced Concepts', hasImages: false },
          { id: 302, type: 'video', title: 'Detailed Walkthrough' },
          { id: 303, type: 'exercise', title: 'Challenge Problems' }
        ]
      }
    ],
    assessments: [
      { id: 1, type: 'quiz', title: 'Module 1 Quiz', questionCount: 10, questionTypes: ['multipleChoice'] },
      { id: 2, type: 'assignment', title: 'Midterm Project', dueDate: '2023-10-15' },
      { id: 3, type: 'quiz', title: 'Module 2 Quiz', questionCount: 15, questionTypes: ['multipleChoice', 'trueFalse'] },
      { id: 4, type: 'quiz', title: 'Final Assessment', questionCount: 30, questionTypes: ['multipleChoice', 'essay'] }
    ]
  }
}

// Initialize with mock course content
courseContent.value = getCourseContent()

// Event handlers
function onMessageSent(message) {
  console.log('Message sent:', message)
  // In a real app, you would send this to an API
}

function onAIResponse(response) {
  console.log('AI responded:', response)
  // In a real app, you might want to log or process this
}

function onApplySuggestion(suggestion) {
  console.log('Applying suggestion:', suggestion)
  // In a real app, this would modify course content based on the suggestion
}

function onRefreshSuggestions() {
  console.log('Refreshing suggestions for course:', props.course.id)
  // In a real app, this would call an API to analyze course content
}
</script>

<style scoped>
.ai-assistant-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  background-color: white;
}

.assistant-header {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 15px 20px;
}

.assistant-header h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #1f2937;
  display: flex;
  align-items: center;
}

.assistant-header h3 i {
  margin-right: 10px;
  color: #4C6EF5;
}

.tab-buttons {
  display: flex;
  gap: 10px;
}

.tab-button {
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button:hover {
  background-color: #f3f4f6;
}

.tab-button.active {
  background-color: #e5e7eb;
  color: #1f2937;
}

.assistant-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.chat-tab, .feedback-tab {
  height: 100%;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 