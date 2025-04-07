<template>
  <div class="quizzes-tab">
    <div class="detail-card">
      <div class="card-header">
        <h3><i class="fas fa-clipboard-list"></i> Available Quizzes</h3>
      </div>
      
      <!-- Search and filter bar -->
      <div class="filters-bar" v-if="quizzes.length > 0">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search quizzes..." 
            v-model="searchQuery"
          >
        </div>
        
        <div class="filter-options">
          <div class="filter-select">
            <label for="status-filter">Status:</label>
            <select id="status-filter" v-model="statusFilter">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Empty state for no quizzes -->
      <div v-if="quizzes.length === 0" class="empty-state">
        <i class="fas fa-clipboard empty-icon"></i>
        <p>No quizzes have been assigned for this course yet.</p>
      </div>
      
      <!-- Quizzes List -->
      <div v-else>
        <!-- Pending Quizzes -->
        <div v-if="pendingQuizzes.length > 0 && (statusFilter === 'all' || statusFilter === 'pending')">
          <h4 class="section-title">Pending Quizzes</h4>
          <div class="quiz-list">
            <div 
              v-for="quiz in filteredPendingQuizzes" 
              :key="quiz.id" 
              class="quiz-card"
            >
              <div class="quiz-info">
                <h4 class="quiz-title">{{ quiz.title }}</h4>
                <div class="quiz-details">
                  <span><i class="far fa-clock"></i> {{ quiz.dueDate }}</span>
                  <span><i class="fas fa-question-circle"></i> {{ quiz.questions.length }} questions</span>
                  <span><i class="fas fa-hourglass-half"></i> {{ quiz.timeLimit === 0 ? 'No time limit' : quiz.timeLimit + ' minutes' }}</span>
                </div>
                <div class="quiz-types" v-if="quiz.questionTypes && quiz.questionTypes.length">
                  <span><i class="fas fa-list-ul"></i> {{ formatQuestionTypes(quiz.questionTypes) }}</span>
                </div>
              </div>
              <div class="quiz-actions">
                <button class="primary-button" @click="confirmStartQuiz(quiz)">
                  <i class="fas fa-play"></i> Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Completed Quizzes -->
        <div v-if="completedQuizzes.length > 0 && (statusFilter === 'all' || statusFilter === 'completed')">
          <h4 class="section-title">Completed Quizzes</h4>
          <div class="quiz-list">
            <div 
              v-for="quiz in filteredCompletedQuizzes" 
              :key="quiz.id" 
              class="quiz-card"
            >
              <div class="quiz-info">
                <h4 class="quiz-title">{{ quiz.title }}</h4>
                <div class="quiz-details">
                  <span><i class="fas fa-calendar-check"></i> Completed {{ formatDate(quiz.completedDate) }}</span>
                  <span><i class="fas fa-question-circle"></i> {{ quiz.questions.length }} questions</span>
                </div>
                <div class="quiz-score">
                  <div class="score-badge" :class="getScoreClass(quiz.score)">
                    {{ quiz.score }}%
                  </div>
                  <span class="score-label">Score</span>
                </div>
              </div>
              <div class="quiz-actions">
                <button class="secondary-button" @click="viewResults(quiz)">
                  <i class="fas fa-chart-bar"></i> View Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Taking Modal -->
    <div v-if="showQuizModal" class="modal-overlay" @click.self="confirmCloseQuiz">
      <div class="quiz-modal-content">
        <quiz-taking 
          :quiz="selectedQuiz" 
          @close="closeQuizModal" 
          @submit="handleQuizSubmit"
        />
      </div>
    </div>
    
    <!-- Results Modal -->
    <div v-if="showResultsModal" class="modal-overlay" @click.self="showResultsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Quiz Results: {{ selectedQuiz.title }}</h3>
          <button class="close-button" @click="showResultsModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body results-body">
          <div class="results-summary">
            <div class="score-display">
              <div class="score-circle">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e9ecef" stroke-width="12"/>
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="54" 
                    fill="none" 
                    stroke="#4361ee" 
                    stroke-width="12"
                    :stroke-dasharray="339.292"
                    :stroke-dashoffset="339.292 * (1 - selectedQuiz.score / 100)"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div class="score-text">
                  <div class="score-percentage">{{ selectedQuiz.score }}%</div>
                  <div class="score-label">Score</div>
                </div>
              </div>
            </div>
            
            <div class="results-stats">
              <div class="stat-item">
                <div class="stat-value">{{ Math.round(selectedQuiz.questions.length * selectedQuiz.score / 100) }}</div>
                <div class="stat-label">Correct</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ selectedQuiz.questions.length - Math.round(selectedQuiz.questions.length * selectedQuiz.score / 100) }}</div>
                <div class="stat-label">Incorrect</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ formatTime(selectedQuiz.timeTaken || 0) }}</div>
                <div class="stat-label">Time Taken</div>
              </div>
            </div>
          </div>
          
          <div class="feedback-section">
            <h4>Feedback</h4>
            <p>{{ getScoreFeedback(selectedQuiz.score) }}</p>
          </div>
          
          <!-- Question Performance Breakdown -->
          <div class="questions-performance">
            <h4>Question Performance</h4>
            <div class="performance-chart">
              <!-- Mock performance chart for now - in a real application this would show actual data -->
              <div v-for="i in 5" :key="i" class="performance-bar">
                <div class="bar-label">Topic {{ i }}</div>
                <div class="bar-container">
                  <div 
                    class="bar-fill" 
                    :style="{ width: `${Math.round(30 + Math.random() * 60)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" @click="showResultsModal = false">Close</button>
        </div>
      </div>
    </div>
    
    <!-- Start Quiz Confirmation Modal -->
    <div v-if="showStartConfirmation" class="modal-overlay" @click.self="showStartConfirmation = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-play-circle"></i> Start Quiz?</h3>
          <button class="close-button" @click="showStartConfirmation = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <h4>{{ pendingStartQuiz?.title }}</h4>
          <div class="quiz-details-summary">
            <p><i class="fas fa-question-circle"></i> {{ pendingStartQuiz?.questions?.length || 0 }} questions</p>
            <p><i class="fas fa-hourglass-half"></i> {{ pendingStartQuiz?.timeLimit === 0 ? 'No time limit' : pendingStartQuiz?.timeLimit + ' minutes' }}</p>
          </div>
          <div class="confirmation-message">
            <p>Are you ready to begin the quiz? Make sure you have enough time to complete it.</p>
            <p class="quiz-warning"><i class="fas fa-exclamation-triangle"></i> Note: If you exit the quiz before completion, it will be automatically submitted with your current answers.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" @click="showStartConfirmation = false">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="primary-button" @click="startQuizConfirmed">
            <i class="fas fa-play"></i> Begin Quiz
          </button>
        </div>
      </div>
    </div>
    
    <!-- Close Confirmation Modal -->
    <div v-if="showCloseConfirmation" class="modal-overlay" @click.self="showCloseConfirmation = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Exit Quiz?</h3>
          <button class="close-button" @click="showCloseConfirmation = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to exit? <strong>Your quiz will be automatically submitted with your current answers.</strong></p>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" @click="showCloseConfirmation = false">
            Return to Quiz
          </button>
          <button class="primary-button warning-button" @click="confirmExit">
            <i class="fas fa-paper-plane"></i> Submit & Exit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import QuizTaking from './QuizTaking.vue';

// Props
const props = defineProps({
  courseId: {
    type: String,
    required: true
  }
});

// State variables
const quizzes = ref([]);
const searchQuery = ref('');
const statusFilter = ref('all');
const selectedQuiz = ref(null);
const showQuizModal = ref(false);
const showResultsModal = ref(false);
const showCloseConfirmation = ref(false);
const pendingStartQuiz = ref(null);
const showStartConfirmation = ref(false);

// Fetch quizzes from the API or use mock data
onMounted(() => {
  // In a real app, this would be an API call
  fetchQuizzes();
});

// Mock API function to get quizzes
function fetchQuizzes() {
  // Simulate API delay
  setTimeout(() => {
    quizzes.value = generateMockQuizzes();
  }, 300);
}

// Generate mock quiz data for demonstration
function generateMockQuizzes() {
  const mockQuizzes = [];
  
  // Pending quizzes
  for (let i = 1; i <= 3; i++) {
    mockQuizzes.push({
      id: `pending-${i}`,
      title: `Quiz ${i}: ${getQuizTitle(i)}`,
      dueDate: `Due in ${14 - i*2} days`,
      timeLimit: 15 + (i * 5),
      questions: generateMockQuestions(8 + i*2),
      questionTypes: getRandomQuestionTypes(),
      status: 'pending'
    });
  }
  
  // Completed quizzes
  for (let i = 1; i <= 2; i++) {
    mockQuizzes.push({
      id: `completed-${i}`,
      title: `Quiz ${i+3}: ${getQuizTitle(i+3)}`,
      completedDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000), // i weeks ago
      timeLimit: 20,
      questions: generateMockQuestions(10),
      questionTypes: getRandomQuestionTypes(),
      status: 'completed',
      score: 75 + Math.floor(Math.random() * 20),
      timeTaken: (10 + Math.floor(Math.random() * 15)) * 60 // 10-25 minutes in seconds
    });
  }
  
  return mockQuizzes;
}

function getQuizTitle(index) {
  const titles = [
    'Introduction to Key Concepts',
    'Understanding Core Principles',
    'Applied Theory and Practice',
    'Advanced Techniques',
    'Comprehensive Review'
  ];
  
  return titles[index % titles.length];
}

function getRandomQuestionTypes() {
  const allTypes = ['multipleChoice', 'trueFalse', 'shortAnswer', 'matching'];
  const count = 1 + Math.floor(Math.random() * 3); // 1-3 question types
  
  const selectedTypes = [];
  for (let i = 0; i < count; i++) {
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
    if (!selectedTypes.includes(randomType)) {
      selectedTypes.push(randomType);
    }
  }
  
  return selectedTypes;
}

function generateMockQuestions(count) {
  const questions = [];
  const types = ['multipleChoice', 'trueFalse', 'shortAnswer', 'matching'];
  
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    
    let question = {
      id: `q-${i}`,
      text: `Question ${i+1}: This is a sample question about the course material?`,
      type: type
    };
    
    // Add type-specific fields
    if (type === 'multipleChoice') {
      question.options = [
        'Option A is a possible answer',
        'Option B could be correct',
        'Option C might be the answer',
        'Option D is another possibility'
      ];
      question.correctAnswer = Math.floor(Math.random() * 4);
    } else if (type === 'trueFalse') {
      question.correctAnswer = Math.random() > 0.5;
    } else if (type === 'matching') {
      question.leftItems = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
      question.rightItems = ['Definition A', 'Definition B', 'Definition C', 'Definition D'];
      question.correctAnswer = [0, 1, 2, 3]; // Indices that match up
    } else {
      // Short answer
      question.correctAnswer = 'Sample answer';
    }
    
    questions.push(question);
  }
  
  return questions;
}

// Computed properties
const pendingQuizzes = computed(() => {
  return quizzes.value.filter(quiz => quiz.status === 'pending');
});

const completedQuizzes = computed(() => {
  return quizzes.value.filter(quiz => quiz.status === 'completed');
});

const filteredPendingQuizzes = computed(() => {
  if (!searchQuery.value) return pendingQuizzes.value;
  
  return pendingQuizzes.value.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredCompletedQuizzes = computed(() => {
  if (!searchQuery.value) return completedQuizzes.value;
  
  return completedQuizzes.value.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Methods
function startQuiz(quiz) {
  selectedQuiz.value = quiz;
  showQuizModal.value = true;
}

function viewResults(quiz) {
  selectedQuiz.value = quiz;
  showResultsModal.value = true;
}

function closeQuizModal() {
  showQuizModal.value = false;
  selectedQuiz.value = null;
}

function confirmCloseQuiz() {
  showCloseConfirmation.value = true;
}

function confirmExit() {
  showCloseConfirmation.value = false;
  
  // Auto-submit the quiz with current answers
  if (selectedQuiz.value) {
    // In a real app, this would call the submit handler of the quiz
    // For demo purposes, we're just mocking a submission with a 50% score
    handleQuizSubmit({
      quizId: selectedQuiz.value.id,
      score: 50, // Mock score for auto-submit
      timeTaken: (selectedQuiz.value.timeLimit || 10) * 30, // Mock time taken
      autoSubmitted: true
    });
  }
  
  showQuizModal.value = false;
  selectedQuiz.value = null;
}

function handleQuizSubmit(results) {
  // In a real app, this would send results to the server
  console.log('Quiz submitted:', results);
  
  // Update the quiz with results
  const index = quizzes.value.findIndex(q => q.id === results.quizId);
  if (index !== -1) {
    quizzes.value[index] = {
      ...quizzes.value[index],
      status: 'completed',
      score: results.score,
      completedDate: new Date(),
      timeTaken: results.timeTaken
    };
    
    // Close the quiz modal after a short delay
    setTimeout(() => {
      showQuizModal.value = false;
      selectedQuiz.value = null;
    }, 500);
  }
}

function confirmStartQuiz(quiz) {
  pendingStartQuiz.value = quiz;
  showStartConfirmation.value = true;
}

function startQuizConfirmed() {
  if (pendingStartQuiz.value) {
    selectedQuiz.value = pendingStartQuiz.value;
    showQuizModal.value = true;
    showStartConfirmation.value = false;
    pendingStartQuiz.value = null;
  }
}

// Utility functions
function formatDate(date) {
  if (!date) return '';
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatQuestionTypes(types) {
  if (!types || !types.length) return 'Multiple Choice';
  
  const typeNames = {
    'multipleChoice': 'Multiple Choice',
    'trueFalse': 'True/False',
    'shortAnswer': 'Short Answer',
    'matching': 'Matching'
  };
  
  return types.map(type => typeNames[type] || type).join(', ');
}

function getScoreClass(score) {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'average';
  return 'poor';
}

function getScoreFeedback(score) {
  if (score >= 90) {
    return "Excellent work! You've demonstrated a mastery of this material.";
  } else if (score >= 80) {
    return "Great job! You have a strong understanding of the concepts.";
  } else if (score >= 70) {
    return "Good work! You've shown a solid grasp of most of the material.";
  } else if (score >= 60) {
    return "You've passed, but consider reviewing some of the material to strengthen your understanding.";
  } else {
    return "You may need to spend more time studying this material. Consider reviewing the content before retaking the quiz.";
  }
}
</script>

<style scoped>
.quizzes-tab {
  font-family: 'Inter', sans-serif;
}

.detail-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 2rem;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.card-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header h3 i {
  color: #ff784b;
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  flex-wrap: wrap;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.search-box input {
  width: 100%;
  padding: 0.7rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #ff784b;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
}

.filter-options {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-select label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.filter-select select {
  padding: 0.7rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #333;
  background-color: white;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  min-width: 140px;
}

.filter-select select:focus {
  outline: none;
  border-color: #ff784b;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #666;
  font-size: 0.95rem;
}

.empty-icon {
  font-size: 3.5rem;
  color: #dde1e6;
  margin-bottom: 1.25rem;
}

.section-title {
  padding: 1.25rem 1.5rem 0.75rem;
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.quiz-list {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.quiz-card:hover {
  background-color: #f0f2f5;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.quiz-info {
  flex: 1;
  min-width: 0;
}

.quiz-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.quiz-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.quiz-details span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.quiz-types {
  font-size: 0.85rem;
  color: #666;
}

.quiz-types span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.quiz-score {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.score-badge {
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.score-badge.excellent {
  background-color: #d4edda;
  color: #198754;
}

.score-badge.good {
  background-color: #d1ecf1;
  color: #0dcaf0;
}

.score-badge.average {
  background-color: #fff3cd;
  color: #ffc107;
}

.score-badge.poor {
  background-color: #f8d7da;
  color: #dc3545;
}

.score-label {
  font-size: 0.85rem;
  color: #666;
}

.quiz-actions {
  display: flex;
  gap: 0.75rem;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 2rem;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleIn 0.3s ease-in-out;
}

.quiz-modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleIn 0.3s ease-in-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #ff784b, #ff9b7b);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-button {
  background: none;
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.results-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.results-summary {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.score-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.score-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.score-percentage {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.score-label {
  font-size: 0.9rem;
  color: #666;
}

.results-stats {
  display: flex;
  flex: 1;
  gap: 2rem;
  align-items: center;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.feedback-section {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.feedback-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.feedback-section p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

.questions-performance {
  margin-top: 1rem;
}

.questions-performance h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.performance-chart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.performance-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bar-label {
  width: 80px;
  font-size: 0.9rem;
  color: #555;
}

.bar-container {
  flex: 1;
  height: 0.5rem;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff784b, #ff9b7b);
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: space-between;
  background-color: #f8f9fa;
}

/* Button Styles */
.primary-button {
  padding: 0.7rem 1.25rem;
  background: linear-gradient(135deg, #ff784b, #ff9b7b);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(255, 120, 75, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(255, 120, 75, 0.25);
}

.secondary-button {
  padding: 0.7rem 1.25rem;
  background-color: #f0f2f5;
  color: #555;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.secondary-button:hover {
  background-color: #e2e6eb;
  color: #333;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .quiz-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .quiz-actions {
    margin-top: 1rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  
  .quiz-details {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .results-summary {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .results-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
}

.quiz-details-summary {
  margin: 1rem 0;
  display: flex;
  gap: 1.5rem;
  font-size: 0.95rem;
}

.quiz-details-summary p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475467;
}

.quiz-details-summary i {
  color: #ff784b;
}

.confirmation-message {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid #ff784b;
}

.quiz-warning {
  color: #f59e0b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.warning-button {
  background: linear-gradient(135deg, #f97316, #ea580c);
  box-shadow: 0 6px 15px rgba(249, 115, 22, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3);
}

.warning-button:hover {
  box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);
}
</style> 