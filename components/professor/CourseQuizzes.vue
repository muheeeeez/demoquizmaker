<template>
  <div class="quizzes-tab">
    <div class="detail-card">
      <div class="card-header-with-action">
        <h3><i class="fas fa-clipboard-list"></i> Active Quizzes</h3>
        <button class="primary-button"><i class="fas fa-plus"></i> Create Quiz</button>
      </div>
      
      <!-- Empty state if no quizzes -->
      <div v-if="quizzes.length === 0" class="empty-state">
        <i class="fas fa-clipboard empty-icon"></i>
        <p>No quizzes have been created for this course yet.</p>
        <button class="primary-button"><i class="fas fa-plus"></i> Create Your First Quiz</button>
      </div>
      
      <!-- Quiz list -->
      <div v-else class="quiz-list">
        <div v-for="quiz in quizzes" :key="quiz.id" class="list-item">
          <div class="list-item-content">
            <h4><i class="fas fa-file-alt"></i> {{ quiz.title }}</h4>
            <p><i class="far fa-clock"></i> {{ quiz.dueDate }} • {{ quiz.questions }} questions • {{ quiz.timeLimit }} minutes</p>
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
            <button class="action-btn"><i class="fas fa-edit"></i> Edit</button>
            <button class="action-btn"><i class="fas fa-poll"></i> Results</button>
            <button class="action-btn"><i class="fas fa-copy"></i> Duplicate</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

// Generate quizzes based on course
const quizzes = computed(() => {
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
})

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

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-state p {
  margin-bottom: 20px;
  color: #6b7280;
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

.empty-icon {
  font-size: 48px;
  color: #e5e7eb;
  margin-bottom: 20px;
}

.list-item-content h4 i, 
.list-item-content p i {
  margin-right: 5px;
  color: #6b7280;
}

.action-btn i {
  margin-right: 4px;
}
</style> 