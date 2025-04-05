<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Student Profile</h3>
        <button class="close-button" @click="closeModal" title="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-content">
        <div class="profile-header">
          <div class="student-avatar" :style="getAvatarStyle(student)">
            {{ getInitials(student.name) }}
          </div>
          <div class="student-basic-info">
            <h2 class="student-name">{{ student.name }}</h2>
            <p class="student-email">{{ student.email }}</p>
            <div class="student-badges">
              <span :class="['status-badge', `status-${student.status.toLowerCase()}`]">
                {{ student.status }}
              </span>
              <span v-if="student.specialRole" class="role-badge">
                {{ student.specialRole }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="profile-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
          </button>
        </div>
        
        <!-- Performance Tab -->
        <div v-if="activeTab === 'performance'" class="tab-content">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-card-header">
                <h4>Grade</h4>
              </div>
              <div class="info-card-content grade-display">
                <span :class="getGradeClass(student.grade)">{{ student.grade }}</span>
                <span class="grade-trend" v-if="student.gradeTrend">
                  <i :class="getTrendIcon(student.gradeTrend)"></i>
                  {{ getTrendText(student.gradeTrend) }}
                </span>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-card-header">
                <h4>Progress</h4>
              </div>
              <div class="info-card-content progress-display">
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: `${student.progress}%` }"></div>
                </div>
                <span class="progress-text">{{ student.progress }}% Complete</span>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-card-header">
                <h4>Activity</h4>
              </div>
              <div class="info-card-content activity-display">
                <p>Last active: {{ formatLastActive(student.lastActive) }}</p>
                <p>Sessions this week: {{ student.activityStats?.sessionsThisWeek || 0 }}</p>
                <p>Avg. session time: {{ formatTimeSpent(student.activityStats?.avgSessionTime) }}</p>
              </div>
            </div>
          </div>
          
          <div class="performance-details">
            <h4>Assignment Completion</h4>
            <div class="assignments-list">
              <div 
                v-for="assignment in studentAssignments" 
                :key="assignment.id" 
                class="assignment-item"
              >
                <div class="assignment-info">
                  <span class="assignment-name">{{ assignment.name }}</span>
                  <span class="assignment-date">Due: {{ formatDate(assignment.dueDate) }}</span>
                </div>
                <div class="assignment-status">
                  <span 
                    :class="['status-indicator', getAssignmentStatusClass(assignment.status)]" 
                    :title="assignment.status"
                  ></span>
                  <span class="assignment-grade" v-if="assignment.grade">
                    {{ assignment.grade }}
                  </span>
                  <span class="assignment-status-label" v-else>
                    {{ assignment.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions'" class="tab-content">
          <div class="submissions-chart">
            <h4>Submission Activity</h4>
            <div class="chart-placeholder">
              <i class="fas fa-chart-bar chart-icon"></i>
              <p>Submission activity chart will be displayed here</p>
            </div>
          </div>
          
          <div class="recent-submissions">
            <div class="section-header">
              <h4>Recent Submissions</h4>
            </div>
            <div class="submissions-list">
              <div 
                v-for="submission in studentSubmissions" 
                :key="submission.id" 
                class="submission-item"
              >
                <div class="submission-icon">
                  <i :class="getSubmissionIcon(submission.type)"></i>
                </div>
                <div class="submission-content">
                  <div class="submission-header">
                    <h5>{{ submission.title }}</h5>
                    <span class="submission-date">
                      {{ formatDate(submission.date) }}
                    </span>
                  </div>
                  <div class="submission-details">
                    <span class="submission-type">
                      {{ submission.type }}
                    </span>
                    <span class="dot-separator" v-if="submission.grade">•</span>
                    <span 
                      v-if="submission.grade" 
                      :class="['submission-grade', getGradeClass(submission.grade)]"
                    >
                      {{ submission.grade }}
                    </span>
                  </div>
                </div>
                <div class="submission-actions">
                  <button class="action-button" @click="viewSubmission(submission)">
                    <i class="fas fa-eye"></i> View
                  </button>
                </div>
              </div>
              
              <div v-if="!studentSubmissions.length" class="empty-submissions">
                <p>No recent submissions found</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notes Tab -->
        <div v-if="activeTab === 'notes'" class="tab-content">
          <div class="notes-section">
            <div class="section-header notes-header">
              <h4>Instructor Notes</h4>
              <button class="add-note-button" @click="addNewNote">
                <i class="fas fa-plus"></i> Add Note
              </button>
            </div>
            
            <div v-if="isAddingNote" class="new-note-form">
              <textarea 
                v-model="newNoteText" 
                class="note-textarea" 
                placeholder="Enter your note here..."
                rows="3"
              ></textarea>
              <div class="note-form-actions">
                <button class="cancel-button" @click="cancelAddNote">Cancel</button>
                <button 
                  class="save-button" 
                  @click="saveNote" 
                  :disabled="!newNoteText.trim()"
                >
                  Save Note
                </button>
              </div>
            </div>
            
            <div class="notes-list">
              <div 
                v-for="note in studentNotes" 
                :key="note.id" 
                class="note-item"
              >
                <div class="note-header">
                  <span class="note-date">{{ formatDate(note.date) }}</span>
                  <div class="note-actions">
                    <button class="note-action" @click="editNote(note)" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="note-action" @click="deleteNote(note)" title="Delete">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <div class="note-content">
                  <p>{{ note.text }}</p>
                </div>
              </div>
              
              <div v-if="!studentNotes.length && !isAddingNote" class="empty-notes">
                <p>No notes have been added for this student</p>
                <button class="add-first-note" @click="addNewNote">
                  <i class="fas fa-plus"></i> Add First Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="action-button secondary" @click="messageStudent">
          <i class="fas fa-envelope"></i> Message Student
        </button>
        <button class="action-button primary" @click="viewAllSubmissions">
          <i class="fas fa-file-alt"></i> All Submissions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  student: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'message', 'view-all-submissions', 'view-submission'])

// Tabs configuration
const tabs = [
  { id: 'performance', label: 'Performance', icon: 'fas fa-chart-line' },
  { id: 'submissions', label: 'Submissions', icon: 'fas fa-file-alt' },
  { id: 'notes', label: 'Notes', icon: 'fas fa-sticky-note' }
]

// State variables
const activeTab = ref('performance')
const studentAssignments = ref([])
const studentSubmissions = ref([])
const studentNotes = ref([])
const isAddingNote = ref(false)
const newNoteText = ref('')

// Load student data when opened
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadStudentData()
  }
}, { immediate: true })

// Load student related data
function loadStudentData() {
  // In a real app, these would be API calls
  loadAssignments()
  loadSubmissions()
  loadNotes()
}

// Load student assignments (mock data)
function loadAssignments() {
  studentAssignments.value = [
    {
      id: 1,
      name: 'Week 1 Assignment',
      dueDate: '2023-09-05T23:59:59Z',
      status: 'Submitted',
      grade: 'A'
    },
    {
      id: 2,
      name: 'Week 2 Quiz',
      dueDate: '2023-09-12T23:59:59Z',
      status: 'Submitted',
      grade: 'B+'
    },
    {
      id: 3,
      name: 'Midterm Project',
      dueDate: '2023-09-19T23:59:59Z',
      status: 'In Progress',
      grade: null
    },
    {
      id: 4,
      name: 'Week 3 Discussion',
      dueDate: '2023-09-15T23:59:59Z',
      status: 'Late',
      grade: null
    },
    {
      id: 5,
      name: 'Final Exam',
      dueDate: '2023-10-10T23:59:59Z',
      status: 'Upcoming',
      grade: null
    }
  ]
}

// Load student submissions (mock data)
function loadSubmissions() {
  studentSubmissions.value = [
    {
      id: 1,
      title: 'Week 2 Quiz',
      type: 'Quiz',
      date: '2023-09-11T14:35:00Z',
      grade: 'B+',
      url: '#'
    },
    {
      id: 2,
      title: 'Week 1 Assignment',
      type: 'Assignment',
      date: '2023-09-05T10:20:00Z',
      grade: 'A',
      url: '#'
    },
    {
      id: 3,
      title: 'Course Introduction Survey',
      type: 'Survey',
      date: '2023-09-01T09:15:00Z',
      grade: null,
      url: '#'
    }
  ]
}

// Load student notes (mock data)
function loadNotes() {
  studentNotes.value = [
    {
      id: 1,
      text: 'Student requested extra time for the midterm project due to family circumstances. Approved extension until 9/22.',
      date: '2023-09-14T11:20:00Z'
    },
    {
      id: 2,
      text: 'Excellent participation in class discussions. Shows great understanding of the material.',
      date: '2023-09-07T15:45:00Z'
    }
  ]
}

// Get avatar style
function getAvatarStyle(student) {
  return {
    backgroundColor: student?.avatarColor || '#4b5563'
  }
}

// Get initials from name
function getInitials(name) {
  if (!name) return ''
  
  const words = name.split(' ')
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

// Get CSS class for grade display
function getGradeClass(grade) {
  if (!grade) return ''
  
  const gradeValue = grade.charAt(0).toUpperCase()
  
  if (gradeValue === 'A') return 'grade-a'
  if (gradeValue === 'B') return 'grade-b'
  if (gradeValue === 'C') return 'grade-c'
  if (gradeValue === 'D') return 'grade-d'
  if (gradeValue === 'F') return 'grade-f'
  
  return ''
}

// Get assignment status class
function getAssignmentStatusClass(status) {
  if (!status) return ''
  
  const statusLower = status.toLowerCase()
  
  if (statusLower === 'submitted') return 'status-submitted'
  if (statusLower === 'in progress') return 'status-inprogress'
  if (statusLower === 'late') return 'status-late'
  if (statusLower === 'upcoming') return 'status-upcoming'
  if (statusLower === 'missing') return 'status-missing'
  
  return ''
}

// Get icon for trend
function getTrendIcon(trend) {
  if (trend > 0) return 'fas fa-arrow-up trend-up'
  if (trend < 0) return 'fas fa-arrow-down trend-down'
  return 'fas fa-minus trend-neutral'
}

// Get text for trend
function getTrendText(trend) {
  if (trend > 0) return `+${trend} from last`
  if (trend < 0) return `${trend} from last`
  return 'No change'
}

// Get icon for submission type
function getSubmissionIcon(type) {
  const typeLower = type.toLowerCase()
  
  if (typeLower === 'quiz') return 'fas fa-question-circle'
  if (typeLower === 'assignment') return 'fas fa-file-alt'
  if (typeLower === 'discussion') return 'fas fa-comments'
  if (typeLower === 'survey') return 'fas fa-poll'
  if (typeLower === 'exam') return 'fas fa-file-signature'
  
  return 'fas fa-file'
}

// Format last active date
function formatLastActive(dateString) {
  if (!dateString) return 'Never'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  
  return date.toLocaleDateString()
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Format time spent
function formatTimeSpent(minutes) {
  if (!minutes) return 'N/A'
  
  if (minutes < 60) {
    return `${minutes} min`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }
}

// Close the modal
function closeModal() {
  emit('close')
}

// Message the student
function messageStudent() {
  emit('message', props.student)
}

// View all student submissions
function viewAllSubmissions() {
  emit('view-all-submissions', props.student)
}

// View a specific submission
function viewSubmission(submission) {
  emit('view-submission', submission)
}

// Add a new note
function addNewNote() {
  isAddingNote.value = true
  newNoteText.value = ''
}

// Cancel adding a note
function cancelAddNote() {
  isAddingNote.value = false
  newNoteText.value = ''
}

// Save a new note
function saveNote() {
  if (!newNoteText.value.trim()) return
  
  const newNote = {
    id: Date.now(),
    text: newNoteText.value.trim(),
    date: new Date().toISOString()
  }
  
  studentNotes.value = [newNote, ...studentNotes.value]
  isAddingNote.value = false
  newNoteText.value = ''
}

// Edit a note (in a real app, this would open an edit form)
function editNote(note) {
  // For now, we'll just simulate editing by allowing to edit the last note
  if (note.id === studentNotes.value[0].id) {
    isAddingNote.value = true
    newNoteText.value = note.text
    studentNotes.value = studentNotes.value.filter(n => n.id !== note.id)
  }
}

// Delete a note
function deleteNote(note) {
  if (confirm('Are you sure you want to delete this note?')) {
    studentNotes.value = studentNotes.value.filter(n => n.id !== note.id)
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
  max-width: 800px;
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
  padding: 0;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.student-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 32px;
  flex-shrink: 0;
}

.student-basic-info {
  flex: 1;
}

.student-name {
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.student-email {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #6b7280;
}

.student-badges {
  display: flex;
  gap: 10px;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #ecfdf5;
  color: #047857;
}

.status-at-risk {
  background-color: #fff7ed;
  color: #c2410c;
}

.status-inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}

.role-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: #eff6ff;
  color: #1d4ed8;
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 20px;
}

.tab-button {
  padding: 12px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.tab-button.active {
  color: #4C6EF5;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #4C6EF5;
}

.tab-button:hover {
  color: #4338ca;
}

.tab-content {
  padding: 20px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.info-card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f3f4f6;
}

.info-card-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.info-card-content {
  padding: 16px;
}

.grade-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 600;
}

.grade-trend {
  font-size: 12px;
  font-weight: normal;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.trend-neutral {
  color: #9ca3af;
}

.progress-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background-color: #e5e7eb;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4C6EF5;
  border-radius: 5px;
}

.progress-text {
  font-size: 14px;
  color: #4b5563;
  text-align: center;
}

.activity-display {
  font-size: 14px;
  color: #4b5563;
}

.activity-display p {
  margin: 5px 0;
}

.performance-details, 
.submissions-chart, 
.recent-submissions,
.notes-section {
  margin-bottom: 24px;
}

.performance-details h4,
.submissions-chart h4,
.section-header h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.assignment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.assignment-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.assignment-date {
  font-size: 12px;
  color: #6b7280;
}

.assignment-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-submitted {
  background-color: #10b981;
}

.status-inprogress {
  background-color: #3b82f6;
}

.status-late {
  background-color: #f59e0b;
}

.status-upcoming {
  background-color: #9ca3af;
}

.status-missing {
  background-color: #ef4444;
}

.assignment-grade {
  font-weight: 600;
  font-size: 14px;
}

.assignment-status-label {
  font-size: 12px;
  color: #6b7280;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  color: #9ca3af;
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.chart-placeholder p {
  margin: 0;
  font-size: 14px;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submission-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.submission-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #eff6ff;
  color: #1d4ed8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.submission-content {
  flex: 1;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.submission-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.submission-date {
  font-size: 12px;
  color: #6b7280;
}

.submission-details {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
}

.dot-separator {
  margin: 0 6px;
}

.submission-grade {
  font-weight: 600;
}

.submission-actions {
  flex-shrink: 0;
}

.empty-submissions, .empty-notes {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-note-button, .add-first-note {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-note-button:hover, .add-first-note:hover {
  background-color: #4338ca;
}

.new-note-form {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.note-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 12px;
}

.note-textarea:focus {
  outline: none;
  border-color: #4C6EF5;
}

.note-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-button, .save-button {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.cancel-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.save-button {
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
}

.save-button:hover:not(:disabled) {
  background-color: #4338ca;
  border-color: #4338ca;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.note-date {
  font-size: 12px;
  color: #6b7280;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.note-action {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.note-action:hover {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #d1d5db;
}

.note-content p {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.5;
  white-space: pre-line;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.action-button.secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.action-button.primary {
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
}

.action-button.primary:hover {
  background-color: #4338ca;
  border-color: #4338ca;
}

.empty-notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.grade-a {
  color: #047857;
}

.grade-b {
  color: #0284c7;
}

.grade-c {
  color: #b45309;
}

.grade-d {
  color: #b91c1c;
}

.grade-f {
  color: #7f1d1d;
}

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .student-badges {
    justify-content: center;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .submission-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .submission-actions {
    align-self: flex-end;
    margin-top: 8px;
  }
}
</style> 