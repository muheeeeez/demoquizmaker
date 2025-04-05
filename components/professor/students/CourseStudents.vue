<template>
  <div class="course-students-container">
    <div class="students-header">
      <h2 class="students-title">Course Students</h2>
      <div class="header-actions">
        <button class="invite-button" @click="showInviteDialog = true">
          <i class="fas fa-user-plus"></i> Invite Students
        </button>
      </div>
    </div>
    
    <div class="students-content">
      <StudentList 
        :courseId="courseId"
        @view-profile="openStudentProfile"
        @message="messageStudents"
        @message-selected="messageStudents"
        @view-submissions="viewStudentSubmissions"
        @export="exportStudentList"
      />
    </div>
    
    <!-- Student Profile Modal -->
    <StudentProfileModal
      v-if="selectedStudent"
      :student="selectedStudent"
      :isOpen="showProfileModal"
      @close="closeProfileModal"
      @message="messageStudents"
      @view-all-submissions="viewStudentSubmissions"
      @view-submission="viewSubmissionDetails"
    />
    
    <!-- Student Message Modal -->
    <StudentMessageModal
      v-if="messageRecipients.length > 0"
      :students="messageRecipients"
      :isOpen="showMessageModal"
      @close="closeMessageModal"
      @send="sendStudentMessage"
    />
    
    <!-- Invite Students Dialog -->
    <div v-if="showInviteDialog" class="modal-overlay" @click="showInviteDialog = false">
      <div class="invite-dialog" @click.stop>
        <div class="invite-header">
          <h3>Invite Students</h3>
          <button class="close-button" @click="showInviteDialog = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="invite-content">
          <div class="invite-options">
            <div 
              :class="['invite-option', { active: inviteMethod === 'email' }]"
              @click="inviteMethod = 'email'"
            >
              <i class="fas fa-envelope option-icon"></i>
              <span>Email Invitations</span>
            </div>
            
            <div 
              :class="['invite-option', { active: inviteMethod === 'link' }]"
              @click="inviteMethod = 'link'"
            >
              <i class="fas fa-link option-icon"></i>
              <span>Invitation Link</span>
            </div>
            
            <div 
              :class="['invite-option', { active: inviteMethod === 'code' }]"
              @click="inviteMethod = 'code'"
            >
              <i class="fas fa-key option-icon"></i>
              <span>Course Code</span>
            </div>
          </div>
          
          <div class="invite-form">
            <div v-if="inviteMethod === 'email'" class="email-invite-form">
              <p class="invite-description">
                Enter email addresses of students you want to invite to this course.
              </p>
              <div class="form-group">
                <label class="form-label">Email Addresses</label>
                <textarea 
                  v-model="emailAddresses" 
                  class="invite-textarea" 
                  placeholder="Enter email addresses separated by commas or line breaks"
                  rows="5"
                ></textarea>
                <p class="form-help">Enter one email per line or separate with commas</p>
              </div>
              <div class="form-group">
                <label class="form-label">Invitation Message (Optional)</label>
                <textarea 
                  v-model="inviteMessage" 
                  class="invite-textarea" 
                  placeholder="Add a personal message to your invitation"
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div v-if="inviteMethod === 'link'" class="link-invite-form">
              <p class="invite-description">
                Share this link with your students. Anyone with this link can join this course.
              </p>
              <div class="invite-link-container">
                <input 
                  type="text" 
                  :value="inviteLink" 
                  class="invite-link" 
                  readonly
                >
                <button class="copy-button" @click="copyInviteLink">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <div class="link-options">
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="linkExpiresCheck">
                    <span>Link expires after</span>
                  </label>
                  <div v-if="linkExpiresCheck" class="expiry-selector">
                    <select v-model="linkExpiryDays" class="expiry-select">
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                    <button 
                      class="reset-link" 
                      @click="regenerateInviteLink"
                      title="Generate new link"
                    >
                      <i class="fas fa-sync-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="inviteMethod === 'code'" class="code-invite-form">
              <p class="invite-description">
                Share this code with your students. They can enter this code to join your course.
              </p>
              <div class="course-code-display">
                <span class="course-code">{{ courseCode }}</span>
                <button class="copy-button" @click="copyCourseCode">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <div class="code-options">
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="codeExpiresCheck">
                    <span>Code expires after</span>
                  </label>
                  <div v-if="codeExpiresCheck" class="expiry-selector">
                    <select v-model="codeExpiryDays" class="expiry-select">
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                    <button 
                      class="reset-code" 
                      @click="regenerateCourseCode"
                      title="Generate new code"
                    >
                      <i class="fas fa-sync-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="invite-footer">
          <button class="cancel-button" @click="showInviteDialog = false">Cancel</button>
          <button v-if="inviteMethod === 'email'" class="send-button" @click="sendInvitations">
            <i class="fas fa-paper-plane"></i> Send Invitations
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentList from './StudentList.vue'
import StudentProfileModal from './StudentProfileModal.vue'
import StudentMessageModal from './StudentMessageModal.vue'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  }
})

// Component state
const selectedStudent = ref(null)
const showProfileModal = ref(false)
const messageRecipients = ref([])
const showMessageModal = ref(false)
const showInviteDialog = ref(false)
const inviteMethod = ref('email')
const emailAddresses = ref('')
const inviteMessage = ref('')
const inviteLink = ref('https://classroom.example.com/join/ABC123XYZ789')
const courseCode = ref('ABC123')
const linkExpiresCheck = ref(false)
const linkExpiryDays = ref(7)
const codeExpiresCheck = ref(false)
const codeExpiryDays = ref(7)
const linkCopied = ref(false)
const codeCopied = ref(false)

// Open student profile modal
function openStudentProfile(student) {
  selectedStudent.value = student
  showProfileModal.value = true
}

// Close student profile modal
function closeProfileModal() {
  showProfileModal.value = false
  setTimeout(() => {
    selectedStudent.value = null
  }, 300)
}

// Open message modal for student(s)
function messageStudents(students) {
  messageRecipients.value = Array.isArray(students) ? students : [students]
  showMessageModal.value = true
}

// Close student message modal
function closeMessageModal() {
  showMessageModal.value = false
  setTimeout(() => {
    messageRecipients.value = []
  }, 300)
}

// Send message to students
function sendStudentMessage(message) {
  console.log('Sending message:', message)
  // In a real application, this would send the message to the server
  
  // Show confirmation toast or notification
  alert(`Message sent to ${message.recipients.length} recipient(s)`)
}

// View student submissions
function viewStudentSubmissions(student) {
  console.log('Viewing submissions for:', student.name)
  // In a real application, this would navigate to submissions page or open submissions modal
}

// View submission details
function viewSubmissionDetails(submission) {
  console.log('Viewing submission details:', submission)
  // In a real application, this would open submission details
}

// Export student list
function exportStudentList(students) {
  console.log('Exporting student list:', students.length, 'students')
  // In a real application, this would generate a CSV or Excel file
  
  alert(`Exporting data for ${students.length} students`)
}

// Copy invite link to clipboard
function copyInviteLink() {
  navigator.clipboard.writeText(inviteLink.value)
    .then(() => {
      alert('Invite link copied to clipboard')
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}

// Copy course code to clipboard
function copyCourseCode() {
  navigator.clipboard.writeText(courseCode.value)
    .then(() => {
      alert('Course code copied to clipboard')
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}

// Regenerate invite link
function regenerateInviteLink() {
  // In a real application, this would call an API to generate a new link
  const randomString = Math.random().toString(36).substring(2, 10).toUpperCase()
  inviteLink.value = `https://classroom.example.com/join/${randomString}`
}

// Regenerate course code
function regenerateCourseCode() {
  // In a real application, this would call an API to generate a new code
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
  courseCode.value = randomString
}

// Send email invitations
function sendInvitations() {
  if (!emailAddresses.value.trim()) {
    alert('Please enter at least one email address')
    return
  }
  
  // Parse email addresses
  const emails = emailAddresses.value
    .split(/[,\n]/)
    .map(email => email.trim())
    .filter(email => email !== '')
  
  console.log('Sending invitations to:', emails)
  // In a real application, this would send invitations via API call
  
  alert(`Invitations sent to ${emails.length} email address(es)`)
  showInviteDialog.value = false
}
</script>

<style scoped>
.course-students-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 20px;
}

.students-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.students-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.invite-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.invite-button:hover {
  background-color: #4338ca;
}

.students-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

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

.invite-dialog {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.invite-header h3 {
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

.invite-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.invite-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.invite-option {
  flex: 1;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.invite-option:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.invite-option.active {
  background-color: #eff6ff;
  border-color: #93c5fd;
  color: #1d4ed8;
}

.option-icon {
  font-size: 24px;
  color: #4b5563;
}

.invite-option.active .option-icon {
  color: #1d4ed8;
}

.invite-option span {
  font-size: 14px;
  font-weight: 500;
}

.invite-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #4b5563;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.invite-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
}

.invite-textarea:focus {
  border-color: #4C6EF5;
  outline: none;
}

.form-help {
  margin: 6px 0 0 0;
  font-size: 12px;
  color: #6b7280;
}

.invite-link-container {
  display: flex;
  margin-bottom: 16px;
}

.invite-link {
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px 0 0 6px;
  font-size: 14px;
  background-color: #f9fafb;
}

.copy-button {
  padding: 0 16px;
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-button:hover {
  background-color: #4338ca;
}

.link-options, .code-options {
  margin-top: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.expiry-selector {
  display: flex;
  margin-top: 8px;
  gap: 8px;
}

.expiry-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #4b5563;
}

.reset-link, .reset-code {
  padding: 8px 12px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-link:hover, .reset-code:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.course-code-display {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.course-code {
  flex: 1;
  padding: 16px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px 0 0 6px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
  color: #1f2937;
}

.invite-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
}

.cancel-button, .send-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.cancel-button:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.send-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
}

.send-button:hover {
  background-color: #4338ca;
  border-color: #4338ca;
}

@media (max-width: 768px) {
  .students-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .invite-button {
    flex: 1;
    justify-content: center;
  }
  
  .invite-options {
    flex-direction: column;
  }
  
  .course-students-container {
    padding: 15px;
  }
}
</style> 