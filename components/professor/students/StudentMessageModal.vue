<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          Message {{ students.length === 1 ? students[0].name : `${students.length} Students` }}
        </h3>
        <button class="close-button" @click="closeModal" title="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-content">
        <form @submit.prevent="sendMessage" class="message-form">
          <div class="form-group">
            <label class="form-label">To:</label>
            <div class="recipients-container">
              <div class="recipients-list" v-if="students.length > 0">
                <div 
                  v-for="student in students" 
                  :key="student.id" 
                  class="recipient-chip"
                >
                  <span class="recipient-name">{{ student.name }}</span>
                  <button 
                    v-if="students.length > 1" 
                    type="button" 
                    class="recipient-remove" 
                    @click="removeRecipient(student.id)"
                    title="Remove recipient"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div v-else class="no-recipients">
                No recipients selected
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="message-subject" class="form-label">Subject:</label>
            <input 
              type="text" 
              id="message-subject" 
              v-model="messageSubject" 
              class="form-input" 
              placeholder="Enter message subject"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Message Templates:</label>
            <div class="templates-selector">
              <button 
                v-for="(template, index) in messageTemplates" 
                :key="index"
                type="button" 
                class="template-button" 
                @click="applyTemplate(template)"
              >
                {{ template.name }}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="message-body" class="form-label">Message:</label>
            <textarea 
              id="message-body" 
              v-model="messageBody" 
              class="form-textarea" 
              placeholder="Enter your message here..."
              rows="8"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="sendCopy">
                <span>Send me a copy</span>
              </label>
            </div>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button 
          class="btn-cancel" 
          @click="closeModal"
          :disabled="isSending"
        >
          Cancel
        </button>
        <button 
          class="btn-send" 
          @click="sendMessage" 
          :disabled="isSending || !isFormValid"
        >
          <span v-if="isSending">
            <i class="fas fa-spinner fa-spin"></i> Sending...
          </span>
          <span v-else>
            <i class="fas fa-paper-plane"></i> Send Message
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  students: {
    type: Array,
    required: true,
    default: () => []
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'send'])

// Form data
const messageSubject = ref('')
const messageBody = ref('')
const sendCopy = ref(false)
const selectedStudents = ref([])
const isSending = ref(false)
const errorMessage = ref('')

// Message templates
const messageTemplates = [
  {
    name: 'Reminder',
    subject: 'Reminder: Upcoming Assignment Deadline',
    body: `Dear {{name}},

I'm writing to remind you that the [Assignment Name] is due on [Due Date]. Please make sure to submit your work on time.

If you have any questions or need assistance, please don't hesitate to reach out.

Best regards,
[Your Name]`
  },
  {
    name: 'Feedback',
    subject: 'Feedback on Your Recent Assignment',
    body: `Dear {{name}},

I've reviewed your recent assignment and wanted to provide some specific feedback.

What you did well:
- [Specific positive feedback point]
- [Specific positive feedback point]

Areas for improvement:
- [Specific improvement suggestion]
- [Specific improvement suggestion]

Please review these comments for your future assignments. Feel free to schedule a meeting if you'd like to discuss further.

Best regards,
[Your Name]`
  },
  {
    name: 'Progress Check',
    subject: 'Checking in on Your Course Progress',
    body: `Dear {{name}},

I noticed that you [specific observation about student's progress or participation]. I wanted to check in with you to see if there's anything I can help with.

Would you be available for a brief meeting to discuss your progress in the course? Please let me know what times work best for you.

Best regards,
[Your Name]`
  }
]

// Initialize selected students when component opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedStudents.value = [...props.students]
    errorMessage.value = ''
  }
}, { immediate: true })

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return messageSubject.value.trim() !== '' && 
         messageBody.value.trim() !== '' && 
         selectedStudents.value.length > 0
})

// Remove a recipient
function removeRecipient(studentId) {
  selectedStudents.value = selectedStudents.value.filter(student => student.id !== studentId)
}

// Apply a message template
function applyTemplate(template) {
  messageSubject.value = template.subject
  
  if (selectedStudents.value.length === 1) {
    // Replace placeholder with actual student name for single recipient
    messageBody.value = template.body.replace('{{name}}', selectedStudents.value[0].name)
  } else {
    // Use generic greeting for multiple recipients
    messageBody.value = template.body.replace('Dear {{name}}', 'Dear Students')
  }
}

// Send the message
function sendMessage() {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }
  
  isSending.value = true
  errorMessage.value = ''
  
  // Create message object
  const message = {
    recipients: selectedStudents.value.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email
    })),
    subject: messageSubject.value,
    body: messageBody.value,
    sendCopy: sendCopy.value,
    sentAt: new Date().toISOString()
  }
  
  // Simulate sending the message
  setTimeout(() => {
    isSending.value = false
    emit('send', message)
    closeModal()
  }, 1500)
}

// Close the modal
function closeModal() {
  if (!isSending.value) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.form-input, .form-textarea {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  border-color: #4C6EF5;
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.recipients-container {
  padding: 10px;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-height: 40px;
}

.recipients-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recipient-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #eff6ff;
  color: #1d4ed8;
  border-radius: 16px;
  padding: 4px 8px 4px 12px;
  font-size: 12px;
}

.recipient-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #dbeafe;
  color: #1d4ed8;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 10px;
}

.recipient-remove:hover {
  background-color: #bfdbfe;
}

.no-recipients {
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
}

.templates-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-button {
  padding: 6px 12px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
  border-color: #9ca3af;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.error-message {
  padding: 10px;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 6px;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel, .btn-send {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-cancel {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-send {
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
  min-width: 120px;
  justify-content: center;
}

.btn-send:hover:not(:disabled) {
  background-color: #4338ca;
  border-color: #4338ca;
}

.btn-send:disabled, .btn-cancel:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 