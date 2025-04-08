<template>
  <div>
    <!-- Empty state if no quizzes -->
    <div v-if="quizzes.length === 0" class="empty-state">
      <i class="fas fa-clipboard empty-icon"></i>
      <p>No quizzes have been created for this course yet.</p>
      <button class="primary-button" @click="$emit('create-quiz')"><i class="fas fa-plus"></i> Create Your First Quiz</button>
    </div>
    
    <!-- Quiz list -->
    <div v-else class="quiz-list">
      <div v-for="quiz in quizzes" :key="quiz.id" class="list-item">
        <div class="list-item-content">
          <h4><i class="fas fa-file-alt"></i> {{ quiz.title }}</h4>
          <p><i class="far fa-clock"></i> {{ quiz.dueDate }} • {{ quiz.questions }} questions • {{ quiz.timeLimit === 0 ? 'unlimited' : quiz.timeLimit + ' minutes' }}</p>
          <p v-if="quiz.questionTypes" class="question-types">
            <i class="fas fa-list-ul"></i> 
            {{ Array.isArray(quiz.questionTypes) ? quiz.questionTypes.join(', ') : 'Multiple Choice' }}
          </p>
        </div>
        <div class="list-item-stats">
          <div class="item-stat">
            <span class="stat-value">{{ quiz.submissions }}</span>
            <span class="stat-label">Submissions</span>
          </div>
          <div class="item-stat">
            <span class="stat-value">{{ quiz.averageScore }}%</span>
            <span class="stat-label">Avg. Score</span>
          </div>
        </div>
        <div class="list-item-actions">
          <button class="action-btn" @click="$emit('edit-quiz', quiz)"><i class="fas fa-edit"></i> Edit</button>
          <button class="action-btn" @click="$emit('view-results', quiz)"><i class="fas fa-poll"></i> Results</button>
          <button class="action-btn" @click="$emit('duplicate-quiz', quiz)"><i class="fas fa-copy"></i> Duplicate</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quizzes: {
    type: Array,
    required: true
  }
})

defineEmits(['create-quiz', 'edit-quiz', 'view-results', 'duplicate-quiz'])
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-state p {
  margin-bottom: 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  color: #e5e7eb;
  margin-bottom: 20px;
}

.quiz-list {
  margin-top: 20px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item-content {
  flex: 2;
}

.list-item-content h4 {
  margin-bottom: 5px;
  color: #1f2937;
  font-size: 16px;
}

.list-item-content p {
  margin-bottom: 0;
  font-size: 14px;
  color: #6b7280;
}

.list-item-stats {
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.item-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-weight: 600;
  color: #4C6EF5;
  font-size: 16px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.list-item-actions {
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}

.action-btn {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
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

.list-item-content h4 i, 
.list-item-content p i {
  margin-right: 5px;
  color: #6b7280;
}

.action-btn i {
  margin-right: 4px;
}

.question-types {
  margin-bottom: 0;
  font-size: 14px;
  color: #6b7280;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .list-item-stats {
    width: 100%;
    justify-content: flex-start;
  }
  
  .list-item-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style> 