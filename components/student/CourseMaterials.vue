<template>
  <div class="materials-tab">
    <div class="detail-card">
      <div class="card-header">
        <h3><i class="fas fa-book"></i> Course Notes</h3>
      </div>
      
      <!-- Materials Filter -->
      <div class="materials-filters">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search notes..." 
            v-model="searchQuery"
            @input="filterMaterials"
          />
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- Materials List -->
      <div class="materials-list">
        <div v-if="isLoading" class="loading-message">
          <div class="spinner"></div>
          <p>Loading course materials...</p>
        </div>

        <div v-else-if="filteredMaterials.length === 0" class="empty-state">
          <i class="fas fa-folder-open empty-icon"></i>
          <p>No notes available for this course yet.</p>
        </div>

        <div v-else>
          <!-- Categories -->
          <div
            v-for="category in materialCategories"
            :key="category.name"
            class="material-category"
          >
            <div class="category-header">
              <h4>
                <i :class="getCategoryIcon(category.name)"></i>
                {{ category.name }}
                <span class="category-count"
                  >({{ category.items.length }})</span
                >
              </h4>
            </div>

            <!-- Material Items -->
            <div class="material-items">
              <div
                v-for="material in category.items"
                :key="material.id"
                class="material-item"
                :class="{ 'ai-generated': material.isGenerated }"
              >
                <div class="material-icon">
                  <i :class="getFileIcon(material.format)"></i>
                </div>

                <div class="material-info">
                  <h5 class="material-title">{{ material.title }}</h5>
                  <div class="material-meta">
                    <span class="material-format">
                      <i class="fas fa-file"></i>
                      {{ material.format.toUpperCase() }}
                    </span>
                    <span class="material-size">
                      <i class="fas fa-weight"></i> {{ material.size }}
                    </span>
                    <span class="material-date">
                      <i class="fas fa-calendar-alt"></i>
                      {{ formatDate(material.uploadedAt) }}
                    </span>
                  </div>

                  <div class="material-topics">
                    <span
                      v-for="(topic, index) in material.topics"
                      :key="index"
                      class="topic-badge"
                    >
                      {{ topic }}
                    </span>
                  </div>
                </div>

                <div class="material-actions">
                  <button class="action-btn" @click="viewMaterial(material)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="action-btn"
                    @click="downloadMaterial(material)"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button v-if="material.canGenerateQuiz" class="action-btn" @click="generateQuiz(material)">
                    <i class="fas fa-clipboard-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Material Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click.self="closePreviewModal">
      <div class="modal-content preview-modal">
        <div class="modal-header">
          <h3><i class="fas fa-eye"></i> {{ selectedMaterial.title }}</h3>
          <button class="close-btn" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="preview-container" v-if="!isPreviewLoading">
            <!-- PDF Preview -->
            <div v-if="selectedMaterial.format === 'pdf'" class="pdf-preview">
              <div class="preview-placeholder">
                <i class="fas fa-file-pdf preview-icon"></i>
                <p>PDF preview available in browser</p>
                <div class="preview-actions">
                  <button class="secondary-button" @click="downloadMaterial(selectedMaterial)">
                    <i class="fas fa-download"></i> Download
                  </button>
                  <button class="primary-button" @click="openInBrowser(selectedMaterial)">
                    <i class="fas fa-external-link-alt"></i> Open in Browser
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Image Preview -->
            <div v-else-if="['jpg', 'jpeg', 'png', 'gif'].includes(selectedMaterial.format)" class="image-preview">
              <img :src="selectedMaterial.url" :alt="selectedMaterial.title" />
            </div>
            
            <!-- Video Preview -->
            <div v-else-if="selectedMaterial.format === 'mp4'" class="video-preview">
              <video controls>
                <source :src="selectedMaterial.url" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
            
            <!-- Audio Preview -->
            <div v-else-if="selectedMaterial.format === 'mp3'" class="audio-preview">
              <div class="audio-container">
                <i class="fas fa-music audio-icon"></i>
                <audio controls>
                  <source :src="selectedMaterial.url" type="audio/mp3">
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
            
            <!-- Generic Preview -->
            <div v-else class="generic-preview">
              <div class="preview-placeholder">
                <i :class="getFileIcon(selectedMaterial.format) + ' preview-icon'"></i>
                <p>Preview not available for {{ selectedMaterial.format.toUpperCase() }} files</p>
                <button class="primary-button" @click="downloadMaterial(selectedMaterial)">
                  <i class="fas fa-download"></i> Download
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="preview-loading">
            <div class="spinner"></div>
            <p>Loading preview...</p>
          </div>
          
          <div class="material-details">
            <h4>Material Details</h4>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Format:</span>
                <span class="detail-value">{{ selectedMaterial.format.toUpperCase() }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Size:</span>
                <span class="detail-value">{{ selectedMaterial.size }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Uploaded:</span>
                <span class="detail-value">{{ formatDate(selectedMaterial.uploadedAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Topics:</span>
                <div class="detail-topics">
                  <span v-for="(topic, index) in selectedMaterial.topics" :key="index" class="topic-badge">
                    {{ topic }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add the quiz generation modal after the Material Preview Modal -->
    <div v-if="showGenerateQuizModal" class="modal-overlay" @click.self="closeGenerateQuizModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <i class="fas fa-magic"></i> 
            Generate Quiz from Material
          </h3>
          <button class="close-btn" @click="closeGenerateQuizModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="quiz-source">
            <h4>Source Material:</h4>
            <div class="selected-material">
              <div class="material-badge">
                <i :class="getFileIcon(quizMaterial.format)"></i>
                {{ quizMaterial.title }}
              </div>
              <p class="material-description">{{ quizMaterial.description }}</p>
            </div>
          </div>
          
          <div class="quiz-options">
            <h4>Quiz Options:</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="question-count">Number of Questions</label>
                <div class="increment-control">
                  <button type="button" @click="decrementCount" class="control-btn">-</button>
                  <input 
                    type="number" 
                    id="question-count" 
                    v-model="quizOptions.questionCount" 
                    min="5" 
                    max="30"
                  />
                  <button type="button" @click="incrementCount" class="control-btn">+</button>
                </div>
              </div>
              
              <div class="form-group">
                <label for="difficulty">Difficulty Level</label>
                <select id="difficulty" v-model="quizOptions.difficulty">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="time-limit">Time Limit (minutes)</label>
                <div class="increment-control">
                  <button type="button" @click="decrementTime" class="control-btn">-</button>
                  <input 
                    type="number" 
                    id="time-limit" 
                    v-model="quizOptions.timeLimit" 
                    min="5" 
                    max="60"
                  />
                  <button type="button" @click="incrementTime" class="control-btn">+</button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>Question Types</label>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="multi-choice" 
                    v-model="quizOptions.types.multipleChoice"
                  />
                  <label for="multi-choice">Multiple Choice</label>
                </div>
                <div class="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="true-false" 
                    v-model="quizOptions.types.trueFalse"
                  />
                  <label for="true-false">True/False</label>
                </div>
                <div class="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="short-answer" 
                    v-model="quizOptions.types.shortAnswer"
                  />
                  <label for="short-answer">Short Answer</label>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="focus-areas">Focus Topics</label>
              <select id="focus-topics" v-model="quizOptions.focusTopic" class="full-width">
                <option value="">All topics in this material</option>
                <option v-for="topic in quizMaterial.topics" :key="topic" :value="topic">
                  {{ topic }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="quiz-preview">
            <h4>Preview:</h4>
            <div class="preview-container">
              <div class="preview-item">
                <span class="preview-label">Quiz Title:</span>
                <span class="preview-value">{{ generateQuizTitle() }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Questions:</span>
                <span class="preview-value">{{ quizOptions.questionCount }} questions</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Question Types:</span>
                <span class="preview-value">{{ getSelectedTypes() }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Difficulty:</span>
                <span class="preview-value">{{ quizOptions.difficulty.charAt(0).toUpperCase() + quizOptions.difficulty.slice(1) }}</span>
              </div>
              <div class="preview-item" v-if="quizOptions.focusTopic">
                <span class="preview-label">Focus Topic:</span>
                <span class="preview-value">{{ quizOptions.focusTopic }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Time Limit:</span>
                <span class="preview-value">{{ quizOptions.timeLimit }} minutes</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="secondary-button" @click="closeGenerateQuizModal">
            Cancel
          </button>
          <button 
            class="primary-button" 
            @click="generateMaterialQuiz()"
            :disabled="isGenerating || !isValidQuizOptions()"
          >
            <i class="fas" :class="isGenerating ? 'fa-spinner fa-spin' : 'fa-magic'"></i>
            {{ isGenerating ? 'Generating Quiz...' : 'Generate Quiz' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

// Emits for possible quiz generation
const emit = defineEmits(['generate-quiz', 'quiz-generated', 'start-quiz']);

// State
const isLoading = ref(false);
const searchQuery = ref('');
const showPreviewModal = ref(false);
const selectedMaterial = ref({});
const isPreviewLoading = ref(false);
const showGenerateQuizModal = ref(false);
const quizMaterial = ref({});
const quizOptions = ref({
  questionCount: 10,
  difficulty: 'medium',
  types: {
    multipleChoice: true,
    trueFalse: true,
    shortAnswer: true
  },
  focusTopic: '',
  timeLimit: 15
});
const isGenerating = ref(false);

// Mock materials data - update to focus only on notes
const materialsList = ref([
  {
    id: 1,
    title: 'Introduction to Programming Concepts',
    description: 'An overview of core programming principles and paradigms.',
    format: 'pdf',
    size: '2.4 MB',
    uploadedAt: new Date('2023-03-15'),
    url: '#',
    topics: ['Programming Basics', 'Algorithms'],
    category: 'Lecture Notes',
    isGenerated: false,
    canGenerateQuiz: true
  },
  {
    id: 2,
    title: 'Variables and Data Types',
    description: 'Detailed explanation of variables, primitive and reference types.',
    format: 'pdf',
    size: '2.1 MB',
    uploadedAt: new Date('2023-03-20'),
    url: '#',
    topics: ['Variables', 'Data Types', 'Memory Management'],
    category: 'Study Notes',
    isGenerated: false,
    canGenerateQuiz: true
  },
  {
    id: 3,
    title: 'Control Structures Cheat Sheet',
    description: 'Quick reference guide for if/else, loops, and switch statements.',
    format: 'pdf',
    size: '1.2 MB',
    uploadedAt: new Date('2023-03-25'),
    url: '#',
    topics: ['Control Structures', 'Loops', 'Conditionals'],
    category: 'Reference Materials',
    isGenerated: false,
    canGenerateQuiz: true
  },
  {
    id: 4,
    title: 'Functions and Methods Study Guide',
    description: 'Comprehensive notes on functions, methods and parameters.',
    format: 'docx',
    size: '1.8 MB',
    uploadedAt: new Date('2023-04-02'),
    url: '#',
    topics: ['Functions', 'Methods', 'Parameters'],
    category: 'Study Notes',
    isGenerated: false,
    canGenerateQuiz: true
  },
  {
    id: 5,
    title: 'Object-Oriented Programming',
    description: 'Detailed notes on OOP concepts including classes, inheritance, and polymorphism.',
    format: 'pdf',
    size: '3.2 MB',
    uploadedAt: new Date('2023-04-10'),
    url: '#',
    topics: ['OOP', 'Classes', 'Inheritance'],
    category: 'Lecture Notes',
    isGenerated: false,
    canGenerateQuiz: true
  }
]);

// Filtered materials
const filteredMaterials = ref([]);

// Group materials by category
const materialCategories = computed(() => {
  const categories = {};
  
  filteredMaterials.value.forEach(material => {
    if (!categories[material.category]) {
      categories[material.category] = {
        name: material.category,
        items: []
      };
    }
    categories[material.category].items.push(material);
  });
  
  return Object.values(categories).sort((a, b) => a.name.localeCompare(b.name));
});

// Initialize materials
onMounted(() => {
  filterMaterials();
});

// Filter materials based on search
const filterMaterials = () => {
  isLoading.value = true;
  
  // Apply search filter
  let filtered = materialsList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(material => 
      material.title.toLowerCase().includes(query) ||
      material.description.toLowerCase().includes(query)
    );
  }
  
  // Update the filtered list
  filteredMaterials.value = filtered;
  
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

// View material
const viewMaterial = (material) => {
  selectedMaterial.value = material;
  showPreviewModal.value = true;
  isPreviewLoading.value = true;
  
  // Simulate loading preview
  setTimeout(() => {
    isPreviewLoading.value = false;
  }, 800);
};

// Close preview modal
const closePreviewModal = () => {
  showPreviewModal.value = false;
  selectedMaterial.value = {};
};

// Download material
const downloadMaterial = (material) => {
  console.log('Downloading material:', material);
  // In a real app, this would trigger a download
  alert(`Downloading: ${material.title}`);
};

// Open in browser
const openInBrowser = (material) => {
  console.log('Opening in browser:', material);
  // In a real app, this would open the material in a new tab
  window.open(material.url, '_blank');
};

// Generate quiz from material
const generateQuiz = (material) => {
  console.log('Generating quiz from material:', material);
  quizMaterial.value = material;
  selectedMaterial.value = material;
  showGenerateQuizModal.value = true;
};

// Increment question count
const incrementCount = () => {
  if (quizOptions.value.questionCount < 30) {
    quizOptions.value.questionCount++;
  }
};

// Decrement question count
const decrementCount = () => {
  if (quizOptions.value.questionCount > 5) {
    quizOptions.value.questionCount--;
  }
};

// Check if quiz options are valid
const isValidQuizOptions = () => {
  return (
    quizOptions.value.questionCount >= 5 && 
    quizOptions.value.questionCount <= 30 &&
    quizOptions.value.timeLimit >= 5 &&
    quizOptions.value.timeLimit <= 60 &&
    (quizOptions.value.types.multipleChoice || 
     quizOptions.value.types.trueFalse || 
     quizOptions.value.types.shortAnswer)
  );
};

// Generate questions based on material
const generateQuestions = (count) => {
  const questions = [];
  const types = [];
  
  if (quizOptions.value.types.multipleChoice) types.push('multipleChoice');
  if (quizOptions.value.types.trueFalse) types.push('trueFalse');
  if (quizOptions.value.types.shortAnswer) types.push('shortAnswer');
  
  const material = selectedMaterial.value;
  const topics = quizOptions.value.focusTopic ? 
    [quizOptions.value.focusTopic] : 
    material.topics;
  
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const topic = topics[i % topics.length];
    
    let question = {
      id: i + 1,
      text: generateQuestionText(type, topic, material.title, i),
      type,
      selectedAnswer: null
    };
    
    if (type === 'multipleChoice') {
      question.options = [
        `Option A related to ${topic}`,
        `Option B about ${material.title}`,
        `Option C discussing ${topic}`,
        `Option D explaining a key concept`
      ];
    }
    
    questions.push(question);
  }
  
  return questions;
};

// Generate question text based on material topic
const generateQuestionText = (type, topic, title, index) => {
  const baseQuestions = [
    `What is the significance of ${topic} in ${title}?`,
    `Explain the concept of ${topic} as discussed in the material.`,
    `How does ${topic} relate to the main concepts in ${title}?`,
    `What are the key components of ${topic}?`,
    `Why is ${topic} important in the context of ${title}?`
  ];
  
  const trueFalseQuestions = [
    `${topic} is a fundamental concept in ${title}.`,
    `The material suggests that ${topic} is more important than other concepts.`,
    `According to the material, ${topic} has limitations in practical applications.`,
    `The correct approach to understanding ${topic} requires prior knowledge of other concepts.`,
    `${topic} is directly connected to the core learning objectives of this course.`
  ];
  
  if (type === 'trueFalse') {
    return trueFalseQuestions[index % trueFalseQuestions.length];
  } else {
    return baseQuestions[index % baseQuestions.length];
  }
};

// Helper function to format dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get icon for file type
const getFileIcon = (format) => {
  switch (format) {
    case 'pdf':
      return 'fas fa-file-pdf';
    case 'docx':
    case 'doc':
      return 'fas fa-file-word';
    case 'pptx':
    case 'ppt':
      return 'fas fa-file-powerpoint';
    case 'xlsx':
    case 'xls':
      return 'fas fa-file-excel';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'fas fa-file-image';
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'fas fa-file-video';
    case 'mp3':
    case 'wav':
      return 'fas fa-file-audio';
    case 'zip':
    case 'rar':
      return 'fas fa-file-archive';
    case 'txt':
      return 'fas fa-file-alt';
    default:
      return 'fas fa-file';
  }
};

// Get icon for category
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Lecture Notes':
      return 'fas fa-book';
    case 'Slide Decks':
      return 'fas fa-file-powerpoint';
    case 'Videos':
      return 'fas fa-video';
    case 'Recordings':
      return 'fas fa-microphone';
    case 'Reference Materials':
      return 'fas fa-bookmark';
    case 'Assignments':
      return 'fas fa-tasks';
    default:
      return 'fas fa-folder';
  }
};

// Generate quiz title
const generateQuizTitle = () => {
  return `Quiz on ${selectedMaterial.value.title}`;
};

// Get selected types
const getSelectedTypes = () => {
  const types = [];
  if (quizOptions.value.types.multipleChoice) types.push('Multiple Choice');
  if (quizOptions.value.types.trueFalse) types.push('True/False');
  if (quizOptions.value.types.shortAnswer) types.push('Short Answer');
  return types.join(', ');
};

// Increment time limit
const incrementTime = () => {
  if (quizOptions.value.timeLimit < 60) {
    quizOptions.value.timeLimit += 5;
  }
};

// Decrement time limit
const decrementTime = () => {
  if (quizOptions.value.timeLimit > 5) {
    quizOptions.value.timeLimit -= 5;
  }
};

// Update generateMaterialQuiz function to skip demo and immediately start the quiz
const generateMaterialQuiz = () => {
  isGenerating.value = true;
  
  // Generate quiz data
  const quizData = {
    id: Date.now(), // Generate a unique ID
    title: generateQuizTitle(),
    course: props.course?.name || 'Course Materials',
    createdAt: new Date(),
    status: 'active',
    timeLimit: quizOptions.value.timeLimit,
    questionCount: quizOptions.value.questionCount,
    difficulty: quizOptions.value.difficulty,
    materialId: selectedMaterial.value.id,
    materialTitle: selectedMaterial.value.title,
    questions: generateQuestions(quizOptions.value.questionCount),
    tags: selectedMaterial.value.topics || []
  };
  
  // Simulate API call
  setTimeout(() => {
    isGenerating.value = false;
    // Close the generation modal
    closeGenerateQuizModal();
    
    // Emit to parent component that a quiz was generated
    emit('quiz-generated', quizData);
    
    // Show the quiz taking modal
    startQuiz(quizData);
  }, 1500);
};

// Add a function to start the quiz
const startQuiz = (quiz) => {
  // In a real app, this would navigate to the quiz page or show a quiz modal
  // For now, we'll just emit an event to the parent component
  emit('start-quiz', quiz);
};

// Close quiz generation modal - updated
const closeGenerateQuizModal = () => {
  showGenerateQuizModal.value = false;
  quizOptions.value = {
    questionCount: 10,
    difficulty: 'medium',
    types: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: true
    },
    focusTopic: '',
    timeLimit: 15
  };
};
</script>

<style scoped>
.materials-tab {
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

.materials-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  flex-wrap: wrap;
  gap: 1rem;
}

.search-bar {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-bar input {
  width: 100%;
  padding: 0.7rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: #ff784b;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  color: #ff784b;
}

.materials-list {
  padding: 1.5rem;
}

.loading-message,
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #666;
  font-size: 0.95rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #ff784b;
  margin: 0 auto 1rem;
  animation: spinner 1s ease-in-out infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 3.5rem;
  color: #dde1e6;
  margin-bottom: 1.25rem;
}

.material-category {
  margin-bottom: 2rem;
}

.category-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.category-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-header h4 i {
  color: #3a86ff;
}

.category-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.material-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.material-item {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.material-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  background-color: #f0f2f5;
}

.material-item.ai-generated::before {
  content: 'AI Generated';
  position: absolute;
  top: 10px;
  right: -30px;
  background: linear-gradient(135deg, #3a86ff, #4c6ef5);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 2rem;
  transform: rotate(45deg);
  font-weight: 600;
  text-transform: uppercase;
  z-index: 1;
}

.material-icon {
  background-color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.material-icon i {
  color: #3a86ff;
}

.material-info {
  flex: 1;
  min-width: 0;
}

.material-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.material-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.material-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.material-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.topic-badge {
  background-color: #e7f2ff;
  color: #3a86ff;
  border-radius: 12px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.material-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: white;
  color: #ff784b;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
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

.close-btn {
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

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.preview-container {
  margin-bottom: 1.5rem;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  text-align: center;
}

.preview-icon {
  font-size: 4rem;
  color: #3a86ff;
  margin-bottom: 1.5rem;
}

.preview-placeholder p {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 1rem;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

.image-preview img {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
}

.video-preview video,
.audio-preview audio {
  width: 100%;
  border-radius: 8px;
}

.audio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.audio-icon {
  font-size: 3rem;
  color: #3a86ff;
  margin-bottom: 1.5rem;
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
}

.material-details {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
}

.material-details h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

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

@media (max-width: 768px) {
  .materials-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .material-items {
    grid-template-columns: 1fr;
  }
  
  .preview-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
    justify-content: center;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
}

/* Add Quiz Generation Modal Styles */
.selected-material {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  margin-bottom: 1.5rem;
}

.material-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  gap: 0.5rem;
}

.material-badge i {
  color: #ff784b;
}

.material-description {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.form-row .form-group {
  flex: 1;
}

.increment-control {
  display: flex;
  align-items: center;
}

.increment-control input {
  width: 60px;
  text-align: center;
  margin: 0;
  padding: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.increment-control input::-webkit-outer-spin-button,
.increment-control input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.control-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
}

.control-btn:first-child {
  border-radius: 8px 0 0 8px;
  border-right: none;
}

.control-btn:last-child {
  border-radius: 0 8px 8px 0;
  border-left: none;
}

.control-btn:hover {
  background-color: #e9ecef;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #ff784b;
}

.checkbox-item label {
  cursor: pointer;
  margin: 0;
  font-weight: normal;
}

.full-width {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.3s ease;
}

.full-width:focus {
  outline: none;
  border-color: #ff784b;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
}

.quiz-source, .quiz-options, .quiz-preview {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.quiz-source h4, .quiz-options h4, .quiz-preview h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.preview-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.preview-item {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.preview-label {
  font-weight: 600;
  width: 140px;
  color: #495057;
}

.preview-value {
  color: #333;
  flex: 1;
}

/* Quiz Demo Styling */
.quiz-demo-info {
  margin-bottom: 1.75rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
}

.quiz-demo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.meta-label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.meta-value {
  color: #666;
  font-size: 0.9rem;
}

.quiz-demo-questions {
  margin-bottom: 1.5rem;
}

.quiz-demo-questions h4 {
  margin: 0 0 1.25rem 0;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.75rem;
}

.demo-question {
  margin-bottom: 2rem;
  padding: 1.25rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.demo-question:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.question-number {
  font-weight: 700;
  color: #ff784b;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.4rem 0.75rem;
  background-color: rgba(255, 120, 75, 0.1);
  border-radius: 4px;
  display: inline-block;
}

.question-content {
  margin-left: 0;
}

.question-text {
  margin-bottom: 1rem;
  font-weight: 500;
  color: #333;
  line-height: 1.6;
  font-size: 1.05rem;
}

.question-options {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-item {
  margin-right: 0;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.option-item:hover {
  background-color: #e9ecef;
}

.option-item input[type="radio"] {
  margin-right: 0.75rem;
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #ff784b;
}

.option-item label {
  cursor: pointer;
  margin-right: 0;
  flex: 1;
  color: #495057;
}

.tf-options {
  display: flex;
  gap: 1rem;
  flex-direction: row;
}

.tf-options .option-item {
  flex: 1;
  justify-content: center;
}

.question-answer input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.question-answer input:focus {
  outline: none;
  border-color: #ff784b;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
}

.demo-note {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  background-color: #fff3cd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border-left: 4px solid #ffc107;
  flex: 1;
}

.footer-buttons {
  display: flex;
  gap: 0.75rem;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .meta-item {
    width: 100%;
  }
  
  .tf-options {
    flex-direction: column;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .footer-buttons {
    width: 100%;
  }
  
  .footer-buttons button {
    flex: 1;
  }
  
  .demo-note {
    width: 100%;
  }
}
</style> 