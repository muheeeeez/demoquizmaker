<template>
  <div class="quiz-taking-container">
    <!-- Quiz Header -->
    <div class="quiz-header">
      <div class="quiz-info">
        <h2>{{ quiz.title }}</h2>
        <div class="quiz-meta">
          <span><i class="fas fa-question-circle"></i> {{ quiz.questions.length }} Questions</span>
          <span><i class="fas fa-clock"></i> {{ quiz.timeLimit === 0 ? 'No time limit' : quiz.timeLimit + ' minutes' }}</span>
        </div>
      </div>
      
      <div class="quiz-timer" v-if="quiz.timeLimit > 0 && !quizSubmitted">
        <div class="timer-display">
          <i class="fas fa-hourglass-half"></i>
          <span>{{ formatTime(remainingTime) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Quiz Content -->
    <div class="quiz-content" v-if="!quizSubmitted">
      <!-- Question Navigation -->
      <div class="question-navigation">
        <div 
          v-for="(q, index) in quiz.questions" 
          :key="index"
          class="question-nav-item"
          :class="{ 
            'active': currentQuestionIndex === index,
            'answered': userAnswers[index] !== undefined && userAnswers[index] !== null,
            'flagged': flaggedQuestions.includes(index)
          }"
          @click="navigateToQuestion(index)"
        >
          {{ index + 1 }}
        </div>
      </div>
      
      <!-- Current Question -->
      <div class="question-container">
        <div class="question-header">
          <div class="question-number">Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</div>
          <button 
            class="flag-button" 
            :class="{ 'flagged': flaggedQuestions.includes(currentQuestionIndex) }"
            @click="toggleFlagQuestion(currentQuestionIndex)"
          >
            <i class="fas fa-flag"></i>
            {{ flaggedQuestions.includes(currentQuestionIndex) ? 'Unflag' : 'Flag for review' }}
          </button>
        </div>
        
        <div class="question-content">
          <div class="question-text">{{ currentQuestion.text }}</div>
          
          <!-- Multiple Choice -->
          <div v-if="currentQuestion.type === 'multipleChoice'" class="answer-options">
            <div 
              v-for="(option, optIndex) in currentQuestion.options" 
              :key="optIndex"
              class="answer-option"
              :class="{ 'selected': userAnswers[currentQuestionIndex] === optIndex }"
              @click="selectAnswer(optIndex)"
            >
              <div class="option-marker">{{ ['A', 'B', 'C', 'D', 'E'][optIndex] }}</div>
              <div class="option-text">{{ option }}</div>
            </div>
          </div>
          
          <!-- True/False -->
          <div v-else-if="currentQuestion.type === 'trueFalse'" class="answer-options true-false">
            <div 
              class="answer-option"
              :class="{ 'selected': userAnswers[currentQuestionIndex] === true }"
              @click="selectAnswer(true)"
            >
              <div class="option-marker">T</div>
              <div class="option-text">True</div>
            </div>
            <div 
              class="answer-option"
              :class="{ 'selected': userAnswers[currentQuestionIndex] === false }"
              @click="selectAnswer(false)"
            >
              <div class="option-marker">F</div>
              <div class="option-text">False</div>
            </div>
          </div>
          
          <!-- Short Answer -->
          <div v-else-if="currentQuestion.type === 'shortAnswer'" class="short-answer">
            <textarea 
              v-model="userAnswers[currentQuestionIndex]"
              placeholder="Type your answer here..."
              rows="4"
            ></textarea>
          </div>
          
          <!-- Matching -->
          <div v-else-if="currentQuestion.type === 'matching'" class="matching-answer">
            <div v-for="(item, itemIndex) in currentQuestion.leftItems" :key="itemIndex" class="matching-pair">
              <div class="matching-item">{{ item }}</div>
              <div class="matching-dropdown">
                <select v-model="userAnswers[currentQuestionIndex][itemIndex]">
                  <option value="" disabled selected>Select a match</option>
                  <option 
                    v-for="(rightItem, rightIndex) in currentQuestion.rightItems" 
                    :key="rightIndex"
                    :value="rightIndex"
                  >
                    {{ rightItem }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div class="question-footer">
          <button 
            class="secondary-button" 
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
          >
            <i class="fas fa-arrow-left"></i> Previous
          </button>
          <button 
            class="primary-button" 
            @click="nextQuestion"
            v-if="currentQuestionIndex < quiz.questions.length - 1"
          >
            Next <i class="fas fa-arrow-right"></i>
          </button>
          <button 
            class="primary-button"
            @click="showSubmitConfirmation = true"
            v-else
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
    
    <!-- Quiz Results -->
    <div class="quiz-results" v-else>
      <div class="results-header">
        <h2>Quiz Results</h2>
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
                :stroke-dashoffset="339.292 * (1 - score / 100)"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div class="score-text">
              <div class="score-percentage">{{ score }}%</div>
              <div class="score-label">Score</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="results-details">
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">{{ correctAnswers }}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ quiz.questions.length - correctAnswers }}</div>
            <div class="stat-label">Incorrect</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatTime(quizDuration) }}</div>
            <div class="stat-label">Time Taken</div>
          </div>
        </div>
        
        <div class="results-message">
          <h3>
            <i class="fas" :class="score >= 70 ? 'fa-check-circle' : 'fa-info-circle'"></i>
            {{ score >= 70 ? 'Well done!' : 'Keep practicing!' }}
          </h3>
          <p>{{ getFeedbackMessage() }}</p>
        </div>
        
        <div class="results-actions">
          <button class="secondary-button" @click="reviewQuiz">
            <i class="fas fa-search"></i> Review Answers
          </button>
          <button class="primary-button" @click="$emit('close')">
            <i class="fas fa-check"></i> Done
          </button>
        </div>
      </div>
    </div>
    
    <!-- Submit Confirmation Modal -->
    <div class="modal-overlay" v-if="showSubmitConfirmation" @click.self="showSubmitConfirmation = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Submit Quiz?</h3>
          <button class="close-button" @click="showSubmitConfirmation = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="submission-stats">
            <div class="stat-item">
              <div class="stat-value">{{ quiz.questions.length }}</div>
              <div class="stat-label">Total Questions</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getAnsweredCount() }}</div>
              <div class="stat-label">Answered</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ quiz.questions.length - getAnsweredCount() }}</div>
              <div class="stat-label">Unanswered</div>
            </div>
          </div>
          
          <p v-if="getAnsweredCount() < quiz.questions.length">
            You have not answered all questions. Are you sure you want to submit?
          </p>
          <p v-else>
            You have answered all questions. Are you ready to submit your quiz?
          </p>
        </div>
        <div class="modal-footer">
          <button class="secondary-button" @click="showSubmitConfirmation = false">
            Return to Quiz
          </button>
          <button class="primary-button" @click="submitQuiz">
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  quiz: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: '',
      timeLimit: 0,
      questions: []
    })
  }
});

const emit = defineEmits(['close', 'submit']);

// State variables
const currentQuestionIndex = ref(0);
const userAnswers = ref({});
const flaggedQuestions = ref([]);
const remainingTime = ref(props.quiz.timeLimit * 60); // convert to seconds
const quizStartTime = ref(Date.now());
const quizEndTime = ref(null);
const quizDuration = ref(0);
const quizSubmitted = ref(false);
const showSubmitConfirmation = ref(false);
const score = ref(0);
const correctAnswers = ref(0);
const timer = ref(null);

// Initialize the matching answers as arrays
onMounted(() => {
  props.quiz.questions.forEach((question, index) => {
    if (question.type === 'matching') {
      userAnswers.value[index] = Array(question.leftItems.length).fill("");
    }
  });
  
  // Start timer if there is a time limit
  if (props.quiz.timeLimit > 0) {
    startTimer();
  }
});

// Clean up timer on component unmount
onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

// Computed properties
const currentQuestion = computed(() => {
  return props.quiz.questions[currentQuestionIndex.value] || {};
});

// Start the quiz timer
function startTimer() {
  timer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timer.value);
      submitQuiz(); // Auto-submit when time runs out
    }
  }, 1000);
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Navigation methods
function navigateToQuestion(index) {
  currentQuestionIndex.value = index;
}

function nextQuestion() {
  if (currentQuestionIndex.value < props.quiz.questions.length - 1) {
    currentQuestionIndex.value++;
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

// Answer handling
function selectAnswer(answer) {
  userAnswers.value[currentQuestionIndex.value] = answer;
}

function toggleFlagQuestion(index) {
  const flagIndex = flaggedQuestions.value.indexOf(index);
  if (flagIndex === -1) {
    flaggedQuestions.value.push(index);
  } else {
    flaggedQuestions.value.splice(flagIndex, 1);
  }
}

// Get count of answered questions
function getAnsweredCount() {
  let count = 0;
  
  Object.keys(userAnswers.value).forEach(index => {
    const answer = userAnswers.value[index];
    if (answer !== undefined && answer !== null) {
      if (Array.isArray(answer)) {
        // For matching questions, check if all pairs have been matched
        if (!answer.includes("")) {
          count++;
        }
      } else if (typeof answer === 'string') {
        // For short answer, check if not empty
        if (answer.trim() !== '') {
          count++;
        }
      } else {
        count++;
      }
    }
  });
  
  return count;
}

// Submit the quiz
function submitQuiz() {
  // Stop the timer
  if (timer.value) {
    clearInterval(timer.value);
  }
  
  // Calculate quiz duration
  quizEndTime.value = Date.now();
  quizDuration.value = Math.floor((quizEndTime.value - quizStartTime.value) / 1000);
  
  // Calculate score - simplified for demo
  let correct = 0;
  props.quiz.questions.forEach((question, index) => {
    if (userAnswers.value[index] === question.correctAnswer) {
      correct++;
    }
  });
  
  correctAnswers.value = correct;
  score.value = Math.round((correct / props.quiz.questions.length) * 100);
  
  // Mark as submitted
  quizSubmitted.value = true;
  showSubmitConfirmation.value = false;
  
  // Emit submit event with results
  emit('submit', {
    quizId: props.quiz.id,
    answers: userAnswers.value,
    score: score.value,
    timeTaken: quizDuration.value
  });
}

// Review quiz
function reviewQuiz() {
  // Implementation for reviewing the quiz
  // This would show the answers with correct/incorrect indicators
  console.log("Review quiz functionality to be implemented");
}

// Get feedback message based on score
function getFeedbackMessage() {
  if (score.value >= 90) {
    return "Excellent work! You've demonstrated a mastery of this material.";
  } else if (score.value >= 80) {
    return "Great job! You have a strong understanding of the concepts.";
  } else if (score.value >= 70) {
    return "Good work! You've shown a solid grasp of most of the material.";
  } else if (score.value >= 60) {
    return "You've passed, but consider reviewing some of the material to strengthen your understanding.";
  } else {
    return "You may need to spend more time studying this material. Consider reviewing the content before retaking the quiz.";
  }
}
</script>

<style scoped>
.quiz-taking-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.quiz-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quiz-info h2 {
  margin: 0 0 10px 0;
  color: #343a40;
  font-size: 24px;
}

.quiz-meta {
  display: flex;
  gap: 20px;
  color: #495057;
  font-size: 14px;
}

.quiz-meta span {
  display: flex;
  align-items: center;
}

.quiz-meta i {
  margin-right: 6px;
  color: #4361ee;
}

.quiz-timer {
  background-color: #e7f5ff;
  color: #4361ee;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
}

.timer-display {
  display: flex;
  align-items: center;
}

.timer-display i {
  margin-right: 8px;
}

.quiz-content {
  display: flex;
  flex-grow: 1;
  min-height: 0;
}

.question-navigation {
  width: 80px;
  background-color: #f8f9fa;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.question-nav-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto;
  font-weight: 500;
  transition: all 0.2s;
}

.question-nav-item:hover {
  border-color: #4361ee;
  color: #4361ee;
}

.question-nav-item.active {
  background-color: #4361ee;
  color: white;
  border-color: #4361ee;
}

.question-nav-item.answered {
  background-color: #e7f5ff;
  color: #4361ee;
  border-color: #4361ee;
}

.question-nav-item.flagged {
  position: relative;
}

.question-nav-item.flagged::after {
  content: '';
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  background-color: #ff6b6b;
  border-radius: 50%;
}

.question-container {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.question-number {
  font-weight: 500;
  color: #495057;
}

.flag-button {
  background: none;
  border: none;
  color: #868e96;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.flag-button i {
  margin-right: 6px;
}

.flag-button.flagged {
  color: #ff6b6b;
}

.question-content {
  flex-grow: 1;
}

.question-text {
  font-size: 18px;
  color: #343a40;
  margin-bottom: 20px;
  line-height: 1.5;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-option {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.answer-option:hover {
  border-color: #4361ee;
}

.answer-option.selected {
  background-color: #e7f5ff;
  border-color: #4361ee;
}

.option-marker {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
  color: #495057;
}

.answer-option.selected .option-marker {
  background-color: #4361ee;
  color: white;
}

.option-text {
  flex-grow: 1;
}

.true-false {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.short-answer textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
}

.matching-answer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.matching-pair {
  display: flex;
  align-items: center;
}

.matching-item {
  width: 50%;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.matching-dropdown {
  width: 50%;
  padding-left: 15px;
}

.matching-dropdown select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;
}

.question-footer {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

/* Quiz Results Styles */

.quiz-results {
  padding: 30px;
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
}

.results-header h2 {
  margin: 0 0 20px 0;
  color: #343a40;
}

.score-display {
  display: flex;
  justify-content: center;
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
  font-size: 32px;
  font-weight: bold;
  color: #343a40;
}

.score-label {
  font-size: 14px;
  color: #868e96;
}

.results-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
}

.stat-label {
  font-size: 14px;
  color: #868e96;
  margin-top: 5px;
}

.results-message {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.results-message h3 {
  color: #343a40;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-message h3 i {
  margin-right: 10px;
  color: #4361ee;
}

.results-message p {
  color: #495057;
  margin: 0;
  line-height: 1.5;
}

.results-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* Modal Styles */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #343a40;
  display: flex;
  align-items: center;
}

.modal-header h3 i {
  margin-right: 10px;
  color: #ff6b6b;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  color: #868e96;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.submission-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.modal-body p {
  text-align: center;
  margin: 20px 0 0 0;
  color: #495057;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  background-color: #f8f9fa;
}

/* Button Styles */

.primary-button, .secondary-button {
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.primary-button {
  background-color: #4361ee;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #3b4fd8;
}

.primary-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.secondary-button {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
}

.secondary-button:hover {
  background-color: #e9ecef;
}

.secondary-button:disabled {
  color: #adb5bd;
  cursor: not-allowed;
}

.primary-button i, .secondary-button i {
  margin-right: 8px;
}

.primary-button:last-child i, .secondary-button:last-child i {
  margin-right: 0;
  margin-left: 8px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .quiz-content {
    flex-direction: column;
  }
  
  .question-navigation {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 15px;
  }
  
  .question-nav-item {
    margin: 0;
  }
  
  .stats-row, .submission-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .stats-row .stat-item, .submission-stats .stat-item {
    margin-bottom: 10px;
  }
  
  .true-false {
    grid-template-columns: 1fr;
  }
  
  .matching-pair {
    flex-direction: column;
  }
  
  .matching-item, .matching-dropdown {
    width: 100%;
  }
  
  .matching-dropdown {
    padding-left: 0;
    margin-top: 10px;
  }
}
</style> 