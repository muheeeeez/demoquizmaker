<template>
  <div class="quiz-creation-modal">
    <div class="modal-header">
      <h3>Create New Quiz</h3>
      <button class="close-button" @click="$emit('close')"><i class="fas fa-times"></i></button>
    </div>

    <!-- Quiz Creation Wizard Steps Tabs -->
    <div class="wizard-steps">
      <button 
        v-for="(step, index) in wizardSteps" 
        :key="index" 
        :class="['step-tab', { active: currentStep === index }]"
        @click="currentStep = index"
      >
        <span class="step-number">{{ index + 1 }}</span>
        <span class="step-title">{{ step }}</span>
      </button>
    </div>

    <!-- Step Content Area -->
    <div class="modal-content">
      <!-- Step 1: Standard Pedagogical Framework -->
      <div v-if="currentStep === 0" class="step-content">
        <h4>Quiz Title</h4>
        <div class="form-group">
          <label for="quiz-title">Title:</label>
          <input 
            type="text" 
            id="quiz-title" 
            v-model="quizData.title" 
            placeholder="Enter quiz title..."
            class="quiz-title-input"
          >
        </div>

        <h4>Bloom's Taxonomy Distribution</h4>
        <p class="help-text">Set the cognitive level distribution for your quiz questions.</p>
        
        <!-- Distribution Presets Dropdown -->
        <div class="form-group">
          <label for="distribution-preset">Distribution Preset:</label>
          <select 
            id="distribution-preset" 
            v-model="selectedDistributionPreset"
            @change="applyDistributionPreset"
          >
            <option value="short">Short Quiz Distribution</option>
            <option value="midterm">Midterm Distribution</option>
            <option value="final">Final Exam Distribution</option>
            <option value="custom">Custom Distribution</option>
          </select>
        </div>
        
        <!-- Sliders for Bloom's Taxonomy Levels -->
        <div class="taxonomy-sliders">
          <div 
            v-for="(level, index) in quizData.bloomsLevels" 
            :key="index" 
            class="slider-group"
          >
            <div class="slider-label">
              <span>{{ level.name }}</span>
              <span class="tooltip-icon" @mouseover="showTooltip(level.name)" @mouseleave="hideTooltip">
                <i class="fas fa-info-circle"></i>
              </span>
              <span class="slider-value">{{ level.value }}%</span>
            </div>
            <input 
              type="range" 
              :min="0" 
              :max="100" 
              v-model="level.value" 
              @input="updateDistribution(level)"
              class="taxonomy-slider"
            >
            <div class="level-description">{{ level.description }}</div>
          </div>
        </div>

        <!-- Tooltip for levels -->
        <div v-if="activeTooltip" class="tooltip" :style="tooltipStyle">
          <h5>{{ activeTooltip }}</h5>
          <p>{{ getTooltipContent(activeTooltip) }}</p>
        </div>

        <!-- Total percentage indicator -->
        <div :class="['total-percentage', {'total-error': totalPercentage !== 100}]">
          Total: {{ totalPercentage }}% 
          <span v-if="totalPercentage !== 100">(Must equal 100%)</span>
        </div>
      </div>

      <!-- Step 2: Assessment Purpose Selection -->
      <div v-else-if="currentStep === 1" class="step-content">
        <h4>Assessment Type & Learning Objective</h4>
        
        <!-- Assessment Type Selection -->
        <div class="form-group">
          <label>Assessment Type:</label>
          <div class="radio-group">
            <label v-for="type in assessmentTypes" :key="type.value" class="radio-option">
              <input type="radio" v-model="quizData.assessmentType" :value="type.value">
              <div class="radio-content">
                <h5>{{ type.label }}</h5>
                <p>{{ type.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Question Types -->
        <div class="form-group">
          <label>Question Types:</label>
          <div class="checkbox-group">
            <label v-for="type in questionTypes" :key="type.value" class="checkbox-option">
              <input 
                type="checkbox" 
                v-model="quizData.questionTypes" 
                :value="type.value"
              >
              <div class="checkbox-content">
                <h5>{{ type.label }}</h5>
                <p>{{ type.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Number of Questions and Time Limit -->
        <div class="form-group form-row">
          <div class="form-column">
            <label for="question-count">Number of Questions:</label>
            <input 
              type="number" 
              id="question-count" 
              v-model="quizData.questionCount" 
              min="1" 
              max="100"
            >
            <span class="help-text">Total questions in the assessment</span>
          </div>
          <div class="form-column">
            <label for="time-limit">Time Limit (minutes):</label>
            <input 
              type="number" 
              id="time-limit" 
              v-model="quizData.timeLimit" 
              min="0" 
              max="300"
            >
            <span class="help-text">Set to 0 for unlimited time</span>
          </div>
        </div>

        <!-- Learning Objective -->
        <div class="form-group">
          <label for="learning-objective">Learning Objective:</label>
          <div class="objective-input-group">
            <textarea
              id="learning-objective"
              v-model="quizData.learningObjective"
              placeholder="Enter what students should learn or demonstrate through this assessment..."
              rows="3"
            ></textarea>
            <button @click="refineLearningObjective" class="refine-button">
              <i class="fas fa-magic"></i> Refine Objective
            </button>
          </div>
        </div>

        <!-- Objective Suggestions (shown after refinement) -->
        <div v-if="objectiveSuggestions.length > 0" class="objective-suggestions">
          <h5>Suggested Refinements:</h5>
          <div 
            v-for="(suggestion, index) in objectiveSuggestions" 
            :key="index"
            class="suggestion-item"
            @click="quizData.learningObjective = suggestion"
          >
            <p>{{ suggestion }}</p>
          </div>
        </div>
      </div>

      <!-- Step 3: Source Material Selection -->
      <div v-else-if="currentStep === 2" class="step-content">
        <h4>Source Materials & Topics</h4>
        
        <!-- Course Materials Selection -->
        <div class="form-group">
          <label>Course Materials:</label>
          <div class="materials-selection">
            <div 
              v-for="material in courseMaterials" 
              :key="material.id"
              :class="['material-item', { selected: quizData.selectedMaterials.includes(material.id) }]"
              @click="toggleMaterial(material.id)"
            >
              <i :class="getMaterialIcon(material.type)"></i>
              <div class="material-details">
                <h5>{{ material.title }}</h5>
                <p>{{ material.format.toUpperCase() }} • {{ material.size }}</p>
              </div>
              <div class="checkbox">
                <i v-if="quizData.selectedMaterials.includes(material.id)" class="fas fa-check-square"></i>
                <i v-else class="far fa-square"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Topics Selection -->
        <div class="form-group">
          <label>Topics:</label>
          <div v-if="availableTopics.length > 0" class="topics-selection">
            <div 
              v-for="topic in availableTopics" 
              :key="topic"
              :class="['topic-tag', { selected: quizData.selectedTopics.includes(topic) }]"
              @click="toggleTopic(topic)"
            >
              {{ topic }}
              <i v-if="quizData.selectedTopics.includes(topic)" class="fas fa-times"></i>
            </div>
            <div class="topic-tag add-custom" @click="showCustomTopicInput = true" v-if="!showCustomTopicInput">
              <i class="fas fa-plus"></i> Add Custom Topic
            </div>
            <div v-if="showCustomTopicInput" class="custom-topic-input">
              <input 
                type="text" 
                v-model="customTopic" 
                placeholder="Enter custom topic..."
                @keyup.enter="addCustomTopic"
              >
              <button @click="addCustomTopic"><i class="fas fa-plus"></i></button>
            </div>
          </div>
          <div v-else class="empty-topics">
            <p>No topics available. Please select course materials first or add custom topics.</p>
            <div class="topic-tag add-custom" @click="showCustomTopicInput = true" v-if="!showCustomTopicInput">
              <i class="fas fa-plus"></i> Add Custom Topic
            </div>
            <div v-if="showCustomTopicInput" class="custom-topic-input">
              <input 
                type="text" 
                v-model="customTopic" 
                placeholder="Enter custom topic..."
                @keyup.enter="addCustomTopic"
              >
              <button @click="addCustomTopic"><i class="fas fa-plus"></i></button>
            </div>
          </div>
        </div>

        <!-- Content Weighting -->
        <div class="form-group">
          <label for="content-weighting">Content Weighting:</label>
          <div class="weighting-slider-container">
            <span>Equal weighting</span>
            <input 
              type="range" 
              id="content-weighting" 
              v-model="quizData.contentWeighting" 
              min="0" 
              max="100"
              class="weighting-slider"
            >
            <span>Proportional to content length</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Footer With Navigation -->
    <div class="modal-footer">
      <button 
        v-if="currentStep > 0" 
        class="secondary-button" 
        @click="currentStep--"
      >
        <i class="fas fa-arrow-left"></i> Previous
      </button>
      <button 
        v-if="currentStep < wizardSteps.length - 1" 
        class="primary-button" 
        @click="currentStep++"
        :disabled="!canProceed"
      >
        Next <i class="fas fa-arrow-right"></i>
      </button>
      <button 
        v-else 
        class="primary-button"
        @click="generateQuiz"
        :disabled="!canProceed"
      >
        <i class="fas fa-magic"></i> Generate Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  courseMaterials: {
    type: Array,
    required: true
  },
  courseCode: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'generate-quiz'])

// Quiz Creation Wizard State
const currentStep = ref(0)
const wizardSteps = ['Pedagogical Framework', 'Assessment Purpose', 'Source Materials']

// Tooltip state
const activeTooltip = ref(null)
const tooltipStyle = ref({})
const customTopic = ref('')
const showCustomTopicInput = ref(false)
const objectiveSuggestions = ref([])

// Assessment types
const assessmentTypes = [
  {
    value: 'short',
    label: 'Short Test',
    description: 'Quick knowledge check (recommended: 15-20 min)'
  },
  {
    value: 'midterm',
    label: 'Midterm Exam',
    description: 'Sectional assessment (recommended: 50-90 min)'
  },
  {
    value: 'final',
    label: 'Final Exam',
    description: 'Comprehensive assessment (recommended: 90-180 min)'
  },
  {
    value: 'study',
    label: 'Study Mode',
    description: 'Practice and self-assessment (typically unlimited time)'
  }
]

// Question types
const questionTypes = [
  {
    value: 'multipleChoice',
    label: 'Multiple Choice',
    description: 'Students select the correct answer from several options'
  },
  {
    value: 'trueFalse',
    label: 'True/False',
    description: 'Students determine if a statement is true or false'
  },
  {
    value: 'shortAnswer',
    label: 'Short Answer',
    description: 'Students provide a brief text response (1-3 sentences)'
  },
  {
    value: 'essay',
    label: 'Essay',
    description: 'Students write extended responses to demonstrate deeper understanding'
  },
  {
    value: 'matching',
    label: 'Matching',
    description: 'Students match items from two different columns'
  },
  {
    value: 'fillInBlank',
    label: 'Fill in the Blank',
    description: 'Students complete sentences by filling in missing words'
  }
]

// Distribution presets
const selectedDistributionPreset = ref('short')
const distributionPresets = {
  short: [35, 40, 15, 10, 0, 0],
  midterm: [20, 30, 30, 15, 5, 0],
  final: [15, 25, 30, 20, 5, 5],
  custom: null
}

// Quiz data object
const quizData = ref({
  title: '',
  bloomsLevels: [
    { 
      name: 'Remember', 
      value: 35, 
      description: 'Recall facts, terms, basic concepts'
    },
    { 
      name: 'Understand', 
      value: 40, 
      description: 'Explain ideas or concepts in own words'
    },
    { 
      name: 'Apply', 
      value: 15, 
      description: 'Use information in new situations'
    },
    { 
      name: 'Analyze', 
      value: 10, 
      description: 'Draw connections among ideas'
    },
    { 
      name: 'Evaluate', 
      value: 0, 
      description: 'Justify a stand or decision'
    },
    { 
      name: 'Create', 
      value: 0, 
      description: 'Produce new or original work'
    }
  ],
  assessmentType: 'short',
  questionTypes: ['multipleChoice', 'trueFalse'],
  questionCount: 10,
  timeLimit: 15,
  learningObjective: '',
  selectedMaterials: [],
  selectedTopics: [],
  contentWeighting: 50
})

// Watch for assessment type changes to update defaults
watch(() => quizData.value.assessmentType, (newType) => {
  // Update defaults based on assessment type
  switch(newType) {
    case 'short':
      quizData.value.questionCount = 10
      quizData.value.timeLimit = 15
      break
    case 'midterm':
      quizData.value.questionCount = 25
      quizData.value.timeLimit = 60
      break
    case 'final':
      quizData.value.questionCount = 50
      quizData.value.timeLimit = 120
      break
    case 'study':
      quizData.value.questionCount = 20
      quizData.value.timeLimit = 0 // No time limit for study mode
      break
  }
})

// Apply selected preset
function applyDistributionPreset() {
  const preset = distributionPresets[selectedDistributionPreset.value]
  
  if (preset) {
    quizData.value.bloomsLevels.forEach((level, index) => {
      level.value = preset[index]
    })
  }
}

// Update distribution when slider changes
function updateDistribution(changedLevel) {
  // If we change any value, switch to custom
  selectedDistributionPreset.value = 'custom'
  
  // Optional: implement logic to adjust other values to ensure total = 100%
  // This is a simple implementation - you might want more sophisticated balancing
  const total = totalPercentage.value
  
  if (total !== 100) {
    // Find which levels can be adjusted (not the one being changed)
    const adjustableLevels = quizData.value.bloomsLevels.filter(l => l !== changedLevel && l.value > 0)
    
    if (adjustableLevels.length > 0) {
      const adjustment = (100 - total) / adjustableLevels.length
      
      adjustableLevels.forEach(level => {
        level.value = Math.max(0, Math.round(level.value + adjustment))
      })
    }
  }
}

// Calculate total percentage
const totalPercentage = computed(() => {
  return quizData.value.bloomsLevels.reduce((sum, level) => sum + level.value, 0)
})

// Tooltip methods
function showTooltip(levelName) {
  activeTooltip.value = levelName
}

function hideTooltip() {
  activeTooltip.value = null
}

function getTooltipContent(levelName) {
  const tooltipContent = {
    'Remember': 'Questions that test recall of facts, terms, concepts, definitions, and simple processes. Example: "List the components of a cell."',
    'Understand': 'Questions that demonstrate comprehension of ideas by explaining, summarizing, or giving examples. Example: "Explain how photosynthesis works in your own words."',
    'Apply': 'Questions that use learned material in new situations. Example: "Solve this equation using the quadratic formula."',
    'Analyze': 'Questions that break down concepts into parts to understand structure and relationships. Example: "Compare and contrast mitosis and meiosis."',
    'Evaluate': 'Questions that make judgments based on criteria. Example: "Critique this experimental design and suggest improvements."',
    'Create': 'Questions that combine elements to form coherent or functional wholes. Example: "Design an experiment to test the effect of temperature on enzyme activity."'
  }
  
  return tooltipContent[levelName] || 'No description available'
}

// Function to refine learning objective using AI
function refineLearningObjective() {
  // This would call an AI endpoint in a real implementation
  // For demo purposes, we'll simulate the response with suggestions
  
  if (quizData.value.learningObjective.trim()) {
    // Demo suggestions based on the course and learning objective
    objectiveSuggestions.value = [
      `Students will be able to ${getActionVerb()} key ${getCourseSpecificConcept()} concepts and apply them to solve basic problems.`,
      `Students will demonstrate the ability to analyze ${getCourseSpecificConcept()} and explain the relationships between different components.`,
      `Students will evaluate ${getCourseSpecificConcept()} approaches and develop solutions to complex problems in the domain.`
    ]
  } else {
    objectiveSuggestions.value = [
      `Students will be able to identify and describe key ${getCourseSpecificConcept()} principles.`,
      `Students will demonstrate understanding of ${getCourseSpecificConcept()} by solving related problems.`,
      `Students will analyze and compare different ${getCourseSpecificConcept()} techniques and their applications.`
    ]
  }
}

// Helper functions for generating learning objective suggestions
function getActionVerb() {
  const verbs = [
    'identify', 'describe', 'explain', 'apply', 'analyze', 
    'evaluate', 'create', 'compare', 'contrast', 'demonstrate'
  ]
  return verbs[Math.floor(Math.random() * verbs.length)]
}

function getCourseSpecificConcept() {
  const concepts = {
    'CS101': 'programming',
    'MATH200': 'calculus',
    'PHYS150': 'physics',
    'ENG210': 'narrative'
  }
  
  return concepts[props.courseCode] || 'course-related'
}

// Materials/Topics methods
// Get available topics from selected materials
const availableTopics = computed(() => {
  const topicsSet = new Set()
  
  // Get topics from selected materials
  quizData.value.selectedMaterials.forEach(materialId => {
    const material = props.courseMaterials.find(m => m.id === materialId)
    if (material && material.topics) {
      material.topics.forEach(topic => topicsSet.add(topic))
    }
  })
  
  return Array.from(topicsSet)
})

// Toggle selection of a material
function toggleMaterial(materialId) {
  const index = quizData.value.selectedMaterials.indexOf(materialId)
  if (index === -1) {
    quizData.value.selectedMaterials.push(materialId)
  } else {
    quizData.value.selectedMaterials.splice(index, 1)
  }
  
  // Update selected topics if needed
  updateSelectedTopics()
}

// Update selected topics when available topics change
function updateSelectedTopics() {
  // Remove any selected topics that are no longer available
  quizData.value.selectedTopics = quizData.value.selectedTopics.filter(topic => 
    availableTopics.value.includes(topic) || 
    !availableTopics.value.length // Keep custom topics when no materials selected
  )
}

// Toggle selection of a topic
function toggleTopic(topic) {
  const index = quizData.value.selectedTopics.indexOf(topic)
  if (index === -1) {
    quizData.value.selectedTopics.push(topic)
  } else {
    quizData.value.selectedTopics.splice(index, 1)
  }
}

// Add custom topic
function addCustomTopic() {
  if (customTopic.value.trim()) {
    if (!quizData.value.selectedTopics.includes(customTopic.value.trim())) {
      quizData.value.selectedTopics.push(customTopic.value.trim())
    }
    customTopic.value = ''
    showCustomTopicInput.value = false
  }
}

// Get icon for material type
function getMaterialIcon(type) {
  const icons = {
    'document': 'fas fa-file-alt',
    'presentation': 'fas fa-file-powerpoint',
    'video': 'fas fa-file-video'
  }
  
  return icons[type] || 'fas fa-file'
}

// Determine if user can proceed to next step
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return totalPercentage.value === 100
  } else if (currentStep.value === 1) {
    return quizData.value.assessmentType && quizData.value.learningObjective.trim().length > 0
  } else if (currentStep.value === 2) {
    return quizData.value.selectedTopics.length > 0
  }
  return true
})

// Generate quiz
function generateQuiz() {
  // Create an array of question type labels for display
  const questionTypeLabels = quizData.value.questionTypes.map(typeValue => {
    const type = questionTypes.find(t => t.value === typeValue)
    return type ? type.label : typeValue
  })
  
  // Prepare quiz data for submission
  const quizToGenerate = {
    ...quizData.value,
    questionTypeLabels
  }
  
  // Emit event to parent component
  emit('generate-quiz', quizToGenerate)
}
</script>

<style scoped>
.quiz-creation-modal {
  width: 90%;
  max-width: 900px;
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

.wizard-steps {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.step-tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
}

.step-tab.active {
  border-bottom-color: #ff784b;
  color: #1f2937;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 12px;
}

.step-tab.active .step-number {
  background-color: #ff784b;
  color: white;
}

.step-title {
  font-size: 14px;
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

.step-content {
  margin-bottom: 20px;
}

.step-content h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #1f2937;
}

.help-text {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 14px;
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

select, input[type="text"], input[type="number"], textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
}

select {
  background-color: white;
}

.taxonomy-sliders {
  margin-top: 15px;
}

.slider-group {
  margin-bottom: 15px;
}

.slider-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.taxonomy-slider {
  width: 100%;
  margin: 8px 0;
}

.slider-value {
  font-weight: 500;
  margin-left: auto;
}

.tooltip-icon {
  margin-left: 6px;
  color: #6b7280;
  cursor: help;
}

.level-description {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.tooltip {
  position: absolute;
  background-color: #374151;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  max-width: 300px;
  z-index: 100;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tooltip h5 {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 14px;
}

.tooltip p {
  margin: 0;
}

.total-percentage {
  text-align: right;
  font-weight: 500;
  margin-top: 15px;
  padding: 10px;
  background-color: #f3f4f6;
  border-radius: 6px;
}

.total-error {
  color: #dc2626;
  background-color: #fee2e2;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:hover {
  background-color: #f9fafb;
}

.radio-option input {
  margin-right: 12px;
  margin-top: 3px;
}

.radio-content h5 {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #1f2937;
}

.radio-content p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.checkbox-option {
  display: flex;
  width: calc(50% - 5px);
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-option:hover {
  background-color: #f9fafb;
}

.checkbox-option input {
  margin-right: 12px;
  margin-top: 3px;
}

.checkbox-content h5 {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #1f2937;
}

.checkbox-content p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-column {
  flex: 1;
}

.objective-input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.refine-button {
  align-self: flex-end;
  padding: 6px 12px;
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.refine-button:hover {
  background-color: #4662d9;
}

.objective-suggestions {
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
}

.objective-suggestions h5 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 14px;
  color: #374151;
}

.suggestion-item {
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.suggestion-item p {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
}

.materials-selection {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.material-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.material-item:last-child {
  border-bottom: none;
}

.material-item:hover {
  background-color: #f9fafb;
}

.material-item.selected {
  background-color: #f0f7ff;
}

.material-item i {
  font-size: 18px;
  color: #6b7280;
  margin-right: 15px;
}

.material-details {
  flex: 1;
}

.material-details h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1f2937;
}

.material-details p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.checkbox {
  font-size: 18px;
  color: #4C6EF5;
}

.topics-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.topic-tag {
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.topic-tag.selected {
  background-color: #4C6EF5;
  color: white;
}

.topic-tag i {
  margin-left: 6px;
}

.topic-tag.add-custom {
  border: 1px dashed #d1d5db;
  background-color: transparent;
  display: flex;
  align-items: center;
  gap: 6px;
}

.topic-tag.add-custom:hover {
  background-color: #f9fafb;
}

.custom-topic-input {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.custom-topic-input input {
  flex: 1;
  padding: 8px 12px;
}

.custom-topic-input button {
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 4px;
  width: 36px;
  cursor: pointer;
}

.empty-topics {
  color: #6b7280;
  font-size: 14px;
  padding: 15px 0;
}

.weighting-slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.weighting-slider-container span {
  font-size: 13px;
  color: #6b7280;
  min-width: 70px;
}

.weighting-slider {
  flex: 1;
}

.quiz-title-input {
  font-size: 16px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .checkbox-option {
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 