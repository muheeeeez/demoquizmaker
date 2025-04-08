<template>
  <div class="generated-quiz-modal">
    <div class="modal-header">
      <h3><i class="fas fa-check-circle"></i> Quiz Generated</h3>
      <button class="close-button" @click="$emit('close')"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-content">
      <div class="success-message">
        <div class="success-icon">
          <i class="fas fa-clipboard-check"></i>
        </div>
        <h4>Your quiz has been successfully generated!</h4>
        <p>The quiz is now available in your course quizzes list.</p>
      </div>
      
      <div class="quiz-summary">
        <h5>Quiz Details:</h5>
        <div class="detail-item">
          <span class="detail-label">Title:</span>
          <span class="detail-value">{{ quiz.title }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Questions:</span>
          <span class="detail-value">{{ quiz.questions }} questions</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time Limit:</span>
          <span class="detail-value">{{ quiz.timeLimit }} minutes</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Availability:</span>
          <span class="detail-value">{{ quiz.dueDate }}</span>
        </div>
        <div class="detail-item" v-if="quiz.startDate && quiz.startTime">
          <span class="detail-label">Starts:</span>
          <span class="detail-value">{{ formatDateTime(quiz.startDate, quiz.startTime) }}</span>
        </div>
        <div class="detail-item" v-if="quiz.endDate && quiz.endTime">
          <span class="detail-label">Ends:</span>
          <span class="detail-value">{{ formatDateTime(quiz.endDate, quiz.endTime) }}</span>
        </div>
        <div class="detail-item" v-if="quiz.questionTypes">
          <span class="detail-label">Question Types:</span>
          <span class="detail-value">{{ Array.isArray(quiz.questionTypes) ? quiz.questionTypes.join(', ') : quiz.questionTypes }}</span>
        </div>
      </div>
      
      <!-- Preview of first few questions -->
      <div v-if="quiz.questionsList && quiz.questionsList.length > 0" class="question-preview">
        <h5>Sample Questions:</h5>
        <div class="question-item" v-for="(question, index) in previewQuestions" :key="index">
          <div class="question-number">Q{{ question.id }}</div>
          <div class="question-text">{{ question.text }}</div>
          <div class="question-type-badge">{{ getQuestionTypeLabel(question.type) }}</div>
        </div>
        <div v-if="quiz.questionsList.length > 3" class="more-questions">
          <i class="fas fa-ellipsis-h"></i> 
          <span>{{ quiz.questionsList.length - 3 }} more questions</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="secondary-button" @click="$emit('close')">Close</button>
      <button class="primary-button" @click="$emit('edit-quiz', quiz)">
        <i class="fas fa-edit"></i> View & Edit Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatTimeString } from '@/utils/date'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit-quiz'])

// Only show first 3 questions in preview
const previewQuestions = computed(() => {
  if (props.quiz.questionsList && props.quiz.questionsList.length > 0) {
    return props.quiz.questionsList.slice(0, 3)
  }
  return []
})

// Convert question type identifier to readable label
function getQuestionTypeLabel(type) {
  const typeMap = {
    'multipleChoice': 'Multiple Choice',
    'trueFalse': 'True/False', 
    'shortAnswer': 'Short Answer',
    'matching': 'Matching',
    'essay': 'Essay',
    'fillInBlank': 'Fill in the Blank'
  }
  
  return typeMap[type] || type
}

function formatDateTime(date, time) {
  if (!date || !time) return ''
  
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  return `${formatDate(date, options)} at ${formatTimeString(time)}`
}
</script>

<style scoped>
.generated-quiz-modal {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h3 i {
  color: #22c55e;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
}

.close-button:hover {
  color: #1f2937;
}

.modal-content {
  padding: 25px;
  overflow-y: auto;
  flex: 1;
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 25px;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.success-icon i {
  font-size: 40px;
  color: #22c55e;
}

.success-message h4 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #1f2937;
}

.success-message p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.quiz-summary {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 20px;
}

.quiz-summary h5 {
  font-size: 16px;
  margin: 0 0 15px 0;
  color: #374151;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  width: 120px;
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  flex: 1;
  color: #1f2937;
}

.modal-footer {
  padding: 15px 25px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  background-color: #f9fafb;
}

.secondary-button {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.secondary-button:hover {
  background-color: #e5e7eb;
}

.primary-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #ff784b;
  color: white;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.primary-button:hover {
  background-color: #f96a3a;
}

.question-preview {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.question-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.question-number {
  width: 30px;
  font-weight: 500;
  color: #6b7280;
}

.question-text {
  flex: 1;
  color: #1f2937;
}

.question-type-badge {
  background-color: #f3f4f6;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.more-questions {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  color: #6b7280;
}

.more-questions i {
  margin-right: 5px;
}
</style> 