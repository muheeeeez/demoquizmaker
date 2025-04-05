<template>
  <div class="ai-feedback-panel">
    <div class="panel-header">
      <h3><i class="fas fa-lightbulb"></i> AI Content Suggestions</h3>
      <div class="refresh-button" @click="refreshSuggestions" :class="{ loading: isLoading }">
        <i class="fas fa-sync-alt"></i>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Analyzing course content...</p>
    </div>
    
    <div v-else-if="suggestions.length === 0" class="empty-state">
      <i class="fas fa-brain empty-icon"></i>
      <p>No suggestions available yet. AI will provide recommendations to improve your course content based on best teaching practices.</p>
      <button class="primary-button" @click="refreshSuggestions">
        <i class="fas fa-magic"></i> Generate Suggestions
      </button>
    </div>
    
    <div v-else class="suggestions-list">
      <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
        <div class="suggestion-header">
          <div class="suggestion-category" :class="suggestionCategoryClass(suggestion.category)">
            <i :class="suggestionCategoryIcon(suggestion.category)"></i>
            {{ suggestion.category }}
          </div>
          <div class="suggestion-actions">
            <button class="action-apply" @click="applySuggestion(suggestion)">
              <i class="fas fa-check"></i> Apply
            </button>
            <button class="action-dismiss" @click="dismissSuggestion(index)">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="suggestion-content">
          <h4>{{ suggestion.title }}</h4>
          <p>{{ suggestion.description }}</p>
          <div v-if="suggestion.examples && suggestion.examples.length > 0" class="suggestion-examples">
            <h5>Examples:</h5>
            <ul>
              <li v-for="(example, i) in suggestion.examples" :key="i">{{ example }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  },
  courseContent: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['apply-suggestion', 'refresh-suggestions'])

const isLoading = ref(false)
const suggestions = ref([])

// Generate mock suggestions for demo
function refreshSuggestions() {
  isLoading.value = true
  emit('refresh-suggestions')
  
  // Simulate API call delay
  setTimeout(() => {
    suggestions.value = generateMockSuggestions()
    isLoading.value = false
  }, 2000)
}

// Generate mock suggestions based on common teaching improvement areas
function generateMockSuggestions() {
  const mockSuggestions = [
    {
      id: 1,
      category: 'Accessibility',
      title: 'Add alt text to images',
      description: 'Several course materials contain images without alt text. Adding descriptive alt text improves accessibility for students using screen readers.',
      examples: [
        'Add "Graph showing the relationship between time complexity and input size" to algorithm complexity chart.',
        'Add "UML class diagram for the Observer pattern" to design patterns image.'
      ]
    },
    {
      id: 2,
      category: 'Engagement',
      title: 'Add interactive elements',
      description: 'Consider adding more interactive elements to increase student engagement. Sections with long text could benefit from exercises or knowledge checks.',
      examples: [
        'Add a short quiz after the "Memory Management" section.',
        'Include a coding challenge for the "Recursion" concept.'
      ]
    },
    {
      id: 3,
      category: 'Structure',
      title: 'Improve module organization',
      description: 'Some learning modules contain too many topics. Consider breaking down "Advanced Concepts" into smaller, more focused modules.',
      examples: [
        'Split "Advanced Concepts" into "Memory Management" and "Concurrency" modules.',
        'Create separate modules for "Design Patterns" and "Architecture".'
      ]
    },
    {
      id: 4,
      category: 'Content',
      title: 'Update outdated information',
      description: 'Some technical information appears to be outdated. Consider reviewing and updating these sections.',
      examples: [
        'The information about framework versions in Week 5 materials references outdated APIs.',
        'The deployment instructions in the project guide use deprecated methods.'
      ]
    },
    {
      id: 5,
      category: 'Assessment',
      title: 'Diversify assessment types',
      description: 'Course relies heavily on multiple-choice questions. Consider adding more diverse assessment types to measure different skills.',
      examples: [
        'Add a project-based assessment for Week 6.',
        'Include peer review activities for the team assignments.'
      ]
    }
  ]
  
  // Return a random subset of suggestions (3-5 items)
  const count = Math.floor(Math.random() * 3) + 3
  return mockSuggestions.sort(() => 0.5 - Math.random()).slice(0, count)
}

// Apply a suggestion (in real app, this would implement the suggestion)
function applySuggestion(suggestion) {
  emit('apply-suggestion', suggestion)
  
  // Remove the suggestion from the list
  const index = suggestions.value.findIndex(s => s.id === suggestion.id)
  if (index !== -1) {
    dismissSuggestion(index)
  }
}

// Dismiss a suggestion
function dismissSuggestion(index) {
  suggestions.value.splice(index, 1)
}

// Get icon class for suggestion category
function suggestionCategoryIcon(category) {
  const icons = {
    'Accessibility': 'fas fa-universal-access',
    'Engagement': 'fas fa-users',
    'Structure': 'fas fa-sitemap',
    'Content': 'fas fa-file-alt',
    'Assessment': 'fas fa-tasks'
  }
  
  return icons[category] || 'fas fa-lightbulb'
}

// Get CSS class for suggestion category
function suggestionCategoryClass(category) {
  const classes = {
    'Accessibility': 'category-accessibility',
    'Engagement': 'category-engagement',
    'Structure': 'category-structure',
    'Content': 'category-content',
    'Assessment': 'category-assessment'
  }
  
  return classes[category] || ''
}
</script>

<style scoped>
.ai-feedback-panel {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
  display: flex;
  align-items: center;
}

.panel-header h3 i {
  margin-right: 10px;
  color: #4C6EF5;
}

.refresh-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}

.refresh-button:hover {
  background-color: #e5e7eb;
}

.refresh-button.loading i {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
  flex: 1;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #4C6EF5;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
  margin-bottom: 15px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  flex: 1;
}

.empty-icon {
  font-size: 48px;
  color: #e5e7eb;
  margin-bottom: 20px;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 20px;
  max-width: 400px;
}

.primary-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #4C6EF5;
  color: white;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-button:hover {
  background-color: #4662d9;
}

.suggestions-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.suggestion-item {
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.suggestion-category {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.suggestion-category i {
  margin-right: 8px;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

.suggestion-actions button {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border-radius: 4px;
  padding: 4px 8px;
}

.action-apply {
  background-color: #dcfce7;
  color: #15803d;
}

.action-apply:hover {
  background-color: #bbf7d0;
}

.action-dismiss {
  background-color: #fecaca;
  color: #b91c1c;
}

.action-dismiss:hover {
  background-color: #fca5a5;
}

.suggestion-content {
  padding: 15px;
}

.suggestion-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1f2937;
}

.suggestion-content p {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #4b5563;
}

.suggestion-examples {
  background-color: #f3f4f6;
  padding: 10px;
  border-radius: 6px;
}

.suggestion-examples h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #1f2937;
}

.suggestion-examples ul {
  margin: 0;
  padding-left: 20px;
}

.suggestion-examples li {
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 5px;
}

.suggestion-examples li:last-child {
  margin-bottom: 0;
}

/* Category colors */
.category-accessibility {
  color: #8b5cf6;
}

.category-engagement {
  color: #3b82f6;
}

.category-structure {
  color: #0ea5e9;
}

.category-content {
  color: #10b981;
}

.category-assessment {
  color: #f97316;
}
</style> 