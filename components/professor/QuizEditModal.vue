<template>
  <div class="edit-quiz-modal">
    <div class="modal-header">
      <h3>Edit Quiz</h3>
      <button class="close-button" @click="$emit('close')"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-content">
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
        <label for="edit-quiz-due-date">Due Date:</label>
        <input 
          type="text" 
          id="edit-quiz-due-date" 
          v-model="editingData.dueDate" 
          placeholder="e.g., Due in 7 days"
        >
      </div>
      
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
    <div class="modal-footer">
      <button class="secondary-button" @click="$emit('close')">Cancel</button>
      <button class="primary-button" @click="saveChanges">Save Changes</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
})

function saveChanges() {
  emit('save', editingData.value)
}
</script>

<style scoped>
.edit-quiz-modal {
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
}

.primary-button:hover {
  background-color: #f96a3a;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

input[type="text"], input[type="number"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
}

.help-text {
  color: #6b7280;
  font-size: 13px;
  display: block;
  margin-top: 4px;
}
</style> 