<template>
  <div class="edit-quiz-modal">
    <div class="modal-header">
      <h3>Edit Quiz</h3>
      <button class="close-button" @click="$emit('close')"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-content">
      <!-- Quiz Basic Info -->
      <div class="section-title">
        <h4>Quiz Details</h4>
      </div>

      <div class="form-group">
        <label for="edit-quiz-title">Quiz Title:</label>
        <input 
          type="text" 
          id="edit-quiz-title" 
          v-model="editingData.title" 
          placeholder="Enter quiz title"
        >
      </div>
      
      <div class="form-group">
        <label>Quiz Availability:</label>
        <div class="form-row">
          <div class="form-column">
            <label for="edit-quiz-start-date">Start Date:</label>
            <input 
              type="date" 
              id="edit-quiz-start-date" 
              v-model="editingData.startDate"
              :min="new Date().toISOString().split('T')[0]"
            >
          </div>
          <div class="form-column">
            <label for="edit-quiz-start-time">Start Time:</label>
            <input 
              type="time" 
              id="edit-quiz-start-time" 
              v-model="editingData.startTime"
            >
          </div>
        </div>
        <div class="form-row">
          <div class="form-column">
            <label for="edit-quiz-end-date">End Date:</label>
            <input 
              type="date" 
              id="edit-quiz-end-date" 
              v-model="editingData.endDate"
              :min="editingData.startDate"
            >
          </div>
          <div class="form-column">
            <label for="edit-quiz-end-time">End Time:</label>
        <input 
              type="time" 
              id="edit-quiz-end-time" 
              v-model="editingData.endTime"
            >
          </div>
        </div>
        <span class="help-text">Currently set: {{ editingData.dueDate }}</span>
      </div>
      
      <div class="form-row">
      <div class="form-group">
        <label for="edit-quiz-questions">Number of Questions:</label>
        <input 
          type="number" 
          id="edit-quiz-questions" 
          v-model="editingData.questions" 
          min="1"
        >
      </div>
      
      <div class="form-group">
        <label for="edit-quiz-time-limit">Time Limit (minutes):</label>
        <input 
          type="number" 
          id="edit-quiz-time-limit" 
          v-model="editingData.timeLimit" 
          min="0"
        >
        <span class="help-text">Set to 0 for no time limit</span>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="section-title questions-title">
        <h4>Quiz Questions</h4>
        <button class="small-button add-button" @click="addQuestion">
          <i class="fas fa-plus"></i> Add Question
        </button>
      </div>

      <div v-if="editingData.questionsList && editingData.questionsList.length > 0" class="questions-list">
        <div v-for="(question, index) in editingData.questionsList" :key="index" class="question-card">
          <div class="question-header">
            <div class="question-number">Question {{ question.id }}</div>
            <div class="question-actions">
              <button class="icon-button" @click="moveQuestion(index, -1)" :disabled="index === 0">
                <i class="fas fa-arrow-up"></i>
              </button>
              <button class="icon-button" @click="moveQuestion(index, 1)" :disabled="index === editingData.questionsList.length - 1">
                <i class="fas fa-arrow-down"></i>
              </button>
              <button class="icon-button delete-button" @click="removeQuestion(index)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label :for="`question-text-${index}`">Question:</label>
            <textarea 
              :id="`question-text-${index}`" 
              v-model="question.text"
              rows="2"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label :for="`question-type-${index}`">Question Type:</label>
              <select :id="`question-type-${index}`" v-model="question.type" @change="handleQuestionTypeChange(question)">
                <option value="multipleChoice">Multiple Choice</option>
                <option value="trueFalse">True/False</option>
                <option value="shortAnswer">Short Answer</option>
              </select>
            </div>
            
            <div class="form-group">
              <label :for="`question-points-${index}`">Points:</label>
              <input type="number" :id="`question-points-${index}`" v-model="question.points" min="1">
            </div>
          </div>
          
          <!-- Multiple Choice Options -->
          <div v-if="question.type === 'multipleChoice' || question.type === 'Multiple Choice'" class="options-list">
            <label>Answer Options:</label>
            <div v-for="(option, optIndex) in question.options" :key="`opt-${index}-${optIndex}`" class="option-item">
              <input 
                type="radio" 
                :name="`correct-${index}`" 
                :id="`option-${index}-${optIndex}`" 
                :checked="question.correctAnswer === optIndex"
                @change="question.correctAnswer = optIndex"
              >
              <input 
                type="text" 
                v-model="question.options[optIndex]" 
                class="option-text"
              >
              <button class="icon-button delete-button" @click="removeOption(question, optIndex)" :disabled="question.options.length <= 2">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button v-if="question.options.length < 6" class="small-button add-option-button" @click="addOption(question)">
              <i class="fas fa-plus"></i> Add Option
            </button>
          </div>
          
          <!-- True/False Options -->
          <div v-else-if="question.type === 'trueFalse' || question.type === 'True/False'" class="true-false-options">
            <label>Correct Answer:</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="question.correctAnswer" :name="`tf-${index}`" :value="true">
                True
              </label>
              <label class="radio-label">
                <input type="radio" v-model="question.correctAnswer" :name="`tf-${index}`" :value="false">
                False
              </label>
            </div>
          </div>
          
          <!-- Short Answer -->
          <div v-else-if="question.type === 'shortAnswer' || question.type === 'Short Answer'" class="short-answer-options">
            <div class="form-group">
              <label :for="`expected-answer-${index}`">Expected Answer:</label>
              <textarea :id="`expected-answer-${index}`" v-model="question.expectedAnswer" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label :for="`word-limit-${index}`">Word Limit:</label>
              <input type="number" :id="`word-limit-${index}`" v-model="question.wordLimit" min="1">
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-questions">
        <p>No questions added to this quiz yet. Click "Add Question" to create your first question.</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="secondary-button" @click="$emit('close')">Cancel</button>
      <button class="primary-button" @click="saveChanges">Save Changes</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Create a copy of the quiz data for editing
const editingData = ref({})

// Initialize with the quiz data
onMounted(() => {
  editingData.value = JSON.parse(JSON.stringify(props.quiz))
  
  // If there are no questions, initialize the questionsList array
  if (!editingData.value.questionsList) {
    editingData.value.questionsList = []
  }
  
  // If there are no start/end date/time fields, initialize them
  if (!editingData.value.startDate) {
    const now = new Date()
    editingData.value.startDate = now.toISOString().split('T')[0]
    editingData.value.startTime = '09:00'
    
    // Set end date two weeks from now
    const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    editingData.value.endDate = endDate.toISOString().split('T')[0]
    editingData.value.endTime = '23:59'
  }
})

// Watch for quiz changes if the component is reused
watch(() => props.quiz, (newQuiz) => {
  editingData.value = JSON.parse(JSON.stringify(newQuiz))
  
  // Ensure questionsList exists
  if (!editingData.value.questionsList) {
    editingData.value.questionsList = []
  }
  
  // Ensure startDate and endDate exist
  if (!editingData.value.startDate) {
    const now = new Date()
    editingData.value.startDate = now.toISOString().split('T')[0]
    editingData.value.startTime = '09:00'
    
    // Set end date two weeks from now
    const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    editingData.value.endDate = endDate.toISOString().split('T')[0]
    editingData.value.endTime = '23:59'
  }
})

// Add a new question to the quiz
function addQuestion() {
  const newQuestionId = editingData.value.questionsList && editingData.value.questionsList.length > 0
    ? Math.max(...editingData.value.questionsList.map(q => q.id)) + 1
    : 1
  
  const newQuestion = {
    id: newQuestionId,
    text: `New question ${newQuestionId}`,
    type: 'multipleChoice',
    points: 5,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0
  }
  
  if (!editingData.value.questionsList) {
    editingData.value.questionsList = []
  }
  
  editingData.value.questionsList.push(newQuestion)
  // Update the question count
  editingData.value.questions = editingData.value.questionsList.length
}

// Remove a question
function removeQuestion(index) {
  if (confirm('Are you sure you want to delete this question?')) {
    editingData.value.questionsList.splice(index, 1)
    // Reindex the remaining questions
    editingData.value.questionsList.forEach((q, i) => {
      q.id = i + 1
    })
    // Update the question count
    editingData.value.questions = editingData.value.questionsList.length
  }
}

// Move a question up or down
function moveQuestion(index, direction) {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < editingData.value.questionsList.length) {
    const question = editingData.value.questionsList[index]
    editingData.value.questionsList.splice(index, 1)
    editingData.value.questionsList.splice(newIndex, 0, question)
    // Reindex the questions
    editingData.value.questionsList.forEach((q, i) => {
      q.id = i + 1
    })
  }
}

// Add an option to a multiple choice question
function addOption(question) {
  if (question.options.length < 6) {
    question.options.push(`Option ${String.fromCharCode(65 + question.options.length)}`)
  }
}

// Remove an option from a multiple choice question
function removeOption(question, optIndex) {
  if (question.options.length > 2) {
    question.options.splice(optIndex, 1)
    // If the correct answer was removed or is after the removed option, adjust it
    if (question.correctAnswer === optIndex) {
      question.correctAnswer = 0 // Default to first option if the correct one was removed
    } else if (question.correctAnswer > optIndex) {
      question.correctAnswer--
    }
  }
}

// Handle question type change
function handleQuestionTypeChange(question) {
  if (question.type === 'multipleChoice' || question.type === 'Multiple Choice') {
    if (!question.options || !Array.isArray(question.options)) {
      question.options = ['Option A', 'Option B', 'Option C', 'Option D']
    }
    question.correctAnswer = 0
  } else if (question.type === 'trueFalse' || question.type === 'True/False') {
    question.correctAnswer = true
  } else if (question.type === 'shortAnswer' || question.type === 'Short Answer') {
    question.expectedAnswer = 'Sample expected answer'
    question.wordLimit = 100
  }
}

// Format date and time for display
function formatDateTimeDisplay(startDate, startTime, endDate, endTime) {
  // Format start date
  const start = new Date(`${startDate}T${startTime}`)
  const end = new Date(`${endDate}T${endTime}`)
  
  // If same day
  if (startDate === endDate) {
    return `Available on ${formatDate(startDate)} from ${formatTime(startTime)} to ${formatTime(endTime)}`
  }
  
  // Different days
  return `Available from ${formatDate(startDate)} ${formatTime(startTime)} to ${formatDate(endDate)} ${formatTime(endTime)}`
}

// Helper to format date
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Helper to format time
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const meridiem = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${meridiem}`
}

// Save the edited quiz
function saveChanges() {
  // Update the due date display based on the start/end dates
  editingData.value.dueDate = formatDateTimeDisplay(
    editingData.value.startDate,
    editingData.value.startTime,
    editingData.value.endDate,
    editingData.value.endTime
  )
  
  // Make sure the questions count matches the actual number of questions
  if (editingData.value.questionsList) {
    editingData.value.questions = editingData.value.questionsList.length
  }
  
  emit('save', editingData.value)
}
</script>

<style scoped>
.edit-quiz-modal {
  width: 95%;
  max-width: 800px;
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
  padding: 20px 25px;
  overflow-y: auto;
  flex: 1;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title h4 {
  font-size: 18px;
  color: #1f2937;
  margin: 0;
}

.questions-title {
  margin-top: 30px;
}

.modal-footer {
  padding: 15px 25px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  background-color: #f9fafb;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

input[type="text"], input[type="number"], input[type="date"], select, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

textarea {
  resize: vertical;
}

.help-text {
  color: #6b7280;
  font-size: 13px;
  display: block;
  margin-top: 4px;
}

.small-button {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.small-button:hover {
  background-color: #e5e7eb;
}

.add-button {
  background-color: #f0fdf4;
  color: #15803d;
}

.add-button:hover {
  background-color: #dcfce7;
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
}

.primary-button:hover {
  background-color: #f96a3a;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.question-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9fafb;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-number {
  font-weight: 600;
  color: #4b5563;
}

.question-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  border-radius: 4px;
  cursor: pointer;
}

.icon-button:hover {
  background-color: #e5e7eb;
}

.icon-button:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

.delete-button {
  color: #ef4444;
}

.delete-button:hover {
  background-color: #fee2e2;
}

.options-list {
  margin-top: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.option-text {
  flex: 1;
}

.add-option-button {
  margin-top: 10px;
}

.true-false-options {
  margin-top: 15px;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.short-answer-options {
  margin-top: 15px;
}

.empty-questions {
  text-align: center;
  padding: 30px;
  background-color: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
}
</style> 