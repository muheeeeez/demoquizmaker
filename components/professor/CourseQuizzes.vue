<template>
  <div class="quizzes-tab">
    <div class="detail-card">
      <div class="card-header-with-action">
        <h3><i class="fas fa-clipboard-list"></i> Active Quizzes</h3>
        <button class="primary-button" @click="showCreateQuizModal = true"><i class="fas fa-plus"></i> Create Quiz</button>
      </div>
      
      <!-- Quiz List Component -->
      <quiz-list 
        :quizzes="quizzes"
        @create-quiz="showCreateQuizModal = true"
        @edit-quiz="editQuiz"
        @view-results="viewResults"
        @duplicate-quiz="duplicateQuiz"
      />
    </div>

    <!-- Modal Overlay -->
    <div v-if="showCreateQuizModal || showEditQuizModal || showResultsModal || showGeneratedQuizModal" class="modal-overlay" @click.self="closeAllModals">
      <!-- Create Quiz Modal -->
      <quiz-creation-wizard 
        v-if="showCreateQuizModal"
        :course-materials="courseMaterials"
        :course-code="course.code"
        @close="showCreateQuizModal = false"
        @generate-quiz="generateQuiz"
      />
      
      <!-- Edit Quiz Modal -->
      <quiz-edit-modal
        v-if="showEditQuizModal"
        :quiz="selectedQuiz"
        @close="closeEditQuizModal"
        @save="saveQuizChanges"
      />
      
      <!-- Quiz Results Modal -->
      <quiz-results-modal
        v-if="showResultsModal"
        :quiz="selectedQuiz"
        @close="closeResultsModal"
      />
      
      <!-- Generated Quiz Modal -->
      <generated-quiz-modal
        v-if="showGeneratedQuizModal"
        :quiz="selectedQuiz"
        @close="closeGeneratedQuizModal"
        @edit-quiz="editGeneratedQuiz"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMaterialsStore } from '../../stores/professor/materialsStore'
import QuizList from './quiz/QuizList.vue'
import QuizCreationWizard from './quiz/QuizCreationWizard.vue'
import QuizEditModal from './quiz/QuizEditModal.vue'
import QuizResultsModal from './quiz/QuizResultsModal.vue'
import GeneratedQuizModal from './quiz/GeneratedQuizModal.vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  showGeneratedQuiz: {
    type: Boolean,
    default: false
  },
  generatedQuiz: {
    type: Object,
    default: null
  }
})

// Store instances
const materialsStore = useMaterialsStore()

// Modal control
const showCreateQuizModal = ref(false)
const showEditQuizModal = ref(false)
const showResultsModal = ref(false)
const showGeneratedQuizModal = ref(false)
const selectedQuiz = ref({})

// List of quizzes (changing from computed to ref so we can update it)
const quizzesList = ref([])

// Course materials
const courseMaterials = ref([])

// Initialize quizzes and materials on mount
onMounted(async () => {
  // Initialize with the computed quiz data
  quizzesList.value = generateInitialQuizzes()
  
  if (props.course?.id) {
    await loadCourseMaterials()
  }
})

// Watch for course changes
watch(() => props.course?.id, async (newId) => {
  if (newId) {
    quizzesList.value = generateInitialQuizzes()
    await loadCourseMaterials()
  }
}, { immediate: false })

// Watch for incoming generated quiz
watch(() => props.showGeneratedQuiz, (newVal) => {
  if (newVal && props.generatedQuiz) {
    selectedQuiz.value = props.generatedQuiz
    showGeneratedQuizModal.value = true
  }
}, { immediate: true })

// Generate initial quizzes based on course
function generateInitialQuizzes() {
  // Return empty array if course has no quizzes
  if (props.course.quizzes === 0) {
    return []
  }

  // Generate quiz data based on course
  const courseQuizzes = []
  for (let i = 1; i <= props.course.quizzes; i++) {
    const daysAgo = i * 3 + props.course.id
    const submissions = Math.floor(props.course.students * (0.7 + (i * 0.05)))
    
    courseQuizzes.push({
      id: i,
      title: `Quiz ${i}: ${getQuizTitle(props.course.code, i)}`,
      dueDate: `Due in ${15 - i * 2} days`,
      questions: 10 + i * 2,
      timeLimit: 15 + i * 5,
      submissions: Math.min(submissions, props.course.students),
      averageScore: 65 + (props.course.id * 2) + (i * 3) % 25
    })
  }
  
  return courseQuizzes
}

// Helper to generate relevant quiz titles based on course code
function getQuizTitle(courseCode, quizNumber) {
  const titles = {
    'CS101': ['Introduction to Programming', 'Variables & Data Types', 'Control Structures', 'Functions & Methods', 'Object-Oriented Concepts'],
    'MATH200': ['Limits & Continuity', 'Derivatives', 'Integration Techniques', 'Series & Sequences', 'Vector Calculus'],
    'PHYS150': ['Mechanics', 'Thermodynamics', 'Wave Mechanics', 'Optics', 'Quantum Physics'],
    'ENG210': ['Narrative Techniques', 'Character Development', 'Plot Structure', 'Setting & Atmosphere', 'Dialogue Writing']
  }
  
  // Get title array for course or use default titles
  const courseSpecificTitles = titles[courseCode] || ['Basic Concepts', 'Intermediate Topics', 'Advanced Principles', 'Practical Applications', 'Comprehensive Review']
  
  // Return appropriate title or fallback
  return courseSpecificTitles[quizNumber - 1] || `Topic ${quizNumber}`
}

// Replace the computed quizzes with the ref
const quizzes = computed(() => quizzesList.value)

// Load materials for current course
async function loadCourseMaterials() {
  try {
    await materialsStore.fetchMaterials(props.course.id)
    courseMaterials.value = materialsStore.getCourseMaterials(props.course.id)
  } catch (error) {
    console.error('Error loading course materials:', error)
  }
}

// Edit quiz function
function editQuiz(quiz) {
  selectedQuiz.value = JSON.parse(JSON.stringify(quiz))
  showEditQuizModal.value = true
}

// Close edit quiz modal
function closeEditQuizModal() {
  showEditQuizModal.value = false
  selectedQuiz.value = {}
}

// Save quiz changes
function saveQuizChanges(updatedQuiz) {
  // Find the index of the quiz we're editing
  const index = quizzesList.value.findIndex(q => q.id === updatedQuiz.id)
  
  // Update the quiz if found
  if (index !== -1) {
    quizzesList.value[index] = updatedQuiz
  }
  
  // Close the modal
  closeEditQuizModal()
}

// View quiz results
function viewResults(quiz) {
  selectedQuiz.value = quiz
  showResultsModal.value = true
}

// Close results modal
function closeResultsModal() {
  showResultsModal.value = false
  selectedQuiz.value = {}
}

// Duplicate quiz
function duplicateQuiz(quiz) {
  // Create a deep copy of the quiz
  const duplicatedQuiz = JSON.parse(JSON.stringify(quiz))
  
  // Update the ID, title and reset submission stats
  const newId = quizzesList.value.length > 0 
    ? Math.max(...quizzesList.value.map(q => q.id)) + 1 
    : 1
  
  duplicatedQuiz.id = newId
  duplicatedQuiz.title = `Copy of ${duplicatedQuiz.title}`
  duplicatedQuiz.submissions = 0
  duplicatedQuiz.averageScore = 0
  
  // Add the duplicated quiz to the list
  quizzesList.value.unshift(duplicatedQuiz)
}

// Generate quiz from wizard data
function generateQuiz(quizData) {
  // Create a new quiz object based on form data
  const newQuizId = quizzesList.value.length > 0 
    ? Math.max(...quizzesList.value.map(q => q.id)) + 1 
    : 1
  
  // Generate title based on user input or selected topics
  let title = quizData.title.trim()
  if (!title && quizData.selectedTopics.length > 0) {
    title = `Quiz on ${quizData.selectedTopics.slice(0, 2).join(' & ')}${quizData.selectedTopics.length > 2 ? ' & more' : ''}`
  } else if (!title) {
    title = "New Quiz"
  }
  
  // Format the dates for display
  const dateTimeDisplay = formatDateTimeDisplay(quizData.startDate, quizData.startTime, quizData.endDate, quizData.endTime)
  
  // Create the new quiz object
  const newQuiz = {
    id: newQuizId,
    title: title,
    dueDate: dateTimeDisplay, // Display text for the due date range
    startDate: quizData.startDate,
    startTime: quizData.startTime,
    endDate: quizData.endDate,
    endTime: quizData.endTime,
    questions: quizData.questionCount,
    timeLimit: quizData.timeLimit,
    submissions: 0,
    averageScore: 0,
    questionTypes: quizData.questionTypeLabels,
    // Generate mock questions for editing
    questionsList: generateMockQuestions(quizData.questionCount, quizData.questionTypes, quizData.selectedTopics)
  }
  
  // Add the new quiz to the list
  quizzesList.value.unshift(newQuiz)
  
  // Close the creation modal
  showCreateQuizModal.value = false
  
  // Show the generated quiz modal
  selectedQuiz.value = newQuiz
  showGeneratedQuizModal.value = true
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

// Generate mock questions for a new quiz
function generateMockQuestions(count, types, topics) {
  const questions = []
  
  // Default question types if none provided
  const questionTypes = types || ['multipleChoice', 'trueFalse']
  
  // Sample topics if none provided
  const questionTopics = topics && topics.length > 0 
    ? topics 
    : ['Topic 1', 'Topic 2', 'Topic 3']
  
  for (let i = 0; i < count; i++) {
    // Alternate between question types
    const type = Array.isArray(questionTypes)
      ? questionTypes[i % questionTypes.length]
      : 'multipleChoice'
    
    // Rotate through topics
    const topic = questionTopics[i % questionTopics.length]
    
    let question = {
      id: i + 1,
      text: `Question ${i + 1}: What is the primary concept of ${topic}?`,
      type: type,
      points: 5
    }
    
    // Add type-specific fields
    if (type === 'multipleChoice' || type === 'Multiple Choice') {
      question.options = [
        `The main principle of ${topic}`,
        `A secondary aspect of ${topic}`,
        `An unrelated concept`,
        `None of the above`
      ]
      question.correctAnswer = 0
    } else if (type === 'trueFalse' || type === 'True/False') {
      question.text = `Question ${i + 1}: The main principle of ${topic} is related to its implementation.`
      question.correctAnswer = true
    } else if (type === 'shortAnswer' || type === 'Short Answer') {
      question.expectedAnswer = `The main concept of ${topic} involves...`
      question.wordLimit = 100
    }
    
    questions.push(question)
  }
  
  return questions
}

// Close generated quiz modal
function closeGeneratedQuizModal() {
  showGeneratedQuizModal.value = false
  selectedQuiz.value = {}
  emit('clear-generated-quiz')
}

// Edit generated quiz
function editGeneratedQuiz(quiz) {
  showGeneratedQuizModal.value = false
  editQuiz(quiz)
}

// Close all modals
function closeAllModals() {
  showCreateQuizModal.value = false
  showEditQuizModal.value = false
  showResultsModal.value = false
  
  // Clear generated quiz state if needed
  if (showGeneratedQuizModal.value) {
    showGeneratedQuizModal.value = false
    emit('clear-generated-quiz')
  }
  
  selectedQuiz.value = {}
}

// Emit for clearing generated quiz state
const emit = defineEmits(['clear-generated-quiz'])
</script>

<style scoped>
.detail-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 25px;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.card-header-with-action h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
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
</style> 