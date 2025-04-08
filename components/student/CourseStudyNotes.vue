<template>
  <div class="dashboard-content">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="dashboard-title">
        <div class="dashboard-title-icon">
          <i class="fas fa-book-reader"></i>
        </div>
        <h2>Quiz Generator</h2>
      </div>
      <div class="dashboard-actions">
        <button class="dashboard-button primary" @click="triggerFileUpload">
          <i class="fas fa-cloud-upload-alt"></i>
          Upload Files
        </button>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <div class="status-info" v-if="filteredFiles.length > 0">
        {{ filteredFiles.length }} {{ filteredFiles.length === 1 ? 'file' : 'files' }} available
      </div>
      <div class="status-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search files..."
          />
          <i 
            class="fas fa-times-circle" 
            v-if="searchQuery" 
            @click="searchQuery = ''"
          ></i>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content-area">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner-container">
          <div class="spinner"></div>
        </div>
        <p>Loading your files...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="files.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-file-upload"></i>
        </div>
        <h3>No files uploaded yet</h3>
        <p>Upload your study materials to generate quizzes</p>
        <button class="dashboard-button primary" @click="triggerFileUpload">
          <i class="fas fa-cloud-upload-alt"></i>
          Upload Files
        </button>
      </div>

      <!-- No Search Results -->
      <div v-else-if="searchQuery && filteredFiles.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>No files match your search "{{ searchQuery }}"</p>
        <button class="dashboard-button secondary" @click="searchQuery = ''">
          Clear Search
        </button>
      </div>

      <!-- Files Grid -->
      <div v-else class="files-grid">
        <div 
          v-for="file in filteredFiles" 
          :key="file.id" 
          class="file-card"
        >
          <div class="file-card-header">
            <div class="file-type-icon">
              <i :class="getFileIcon(file.fileType)"></i>
            </div>
            <h3 class="file-title">{{ file.title }}</h3>
            
            <div class="file-actions">
              <button class="icon-button view-btn" @click="viewFile(file)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="icon-button delete-btn" @click="deleteFile(file)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="file-card-meta">
            <div class="file-meta-item">
              <i class="fas fa-calendar-alt"></i>
              {{ formatDate(file.uploadDate) }}
            </div>
            <div class="file-meta-item">
              <i class="fas fa-file"></i>
              {{ formatFileSize(file.fileSize) }}
            </div>
          </div>

          <div class="file-card-tags" v-if="file.tags && file.tags.length > 0">
            <span class="file-tag" v-for="(tag, index) in file.tags.slice(0, 3)" :key="index">
              {{ tag }}
            </span>
            <span class="file-tag more-tag" v-if="file.tags.length > 3">
              +{{ file.tags.length - 3 }} more
            </span>
          </div>

          <div class="file-card-content">
            <p>{{ file.excerpt || 'No preview available' }}</p>
          </div>

          <div class="file-card-footer">
            <button class="dashboard-button primary" @click="openConfigModal(file)">
              <i class="fas fa-cog"></i>
              Configure Quiz
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- File Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay" @click.self="closeUploadModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3><i class="fas fa-cloud-upload-alt"></i> Upload Study Materials</h3>
          <button class="close-button" @click="closeUploadModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div 
            class="upload-dropzone" 
            :class="{ active: isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
          >
            <div class="upload-placeholder" v-if="!selectedFile">
              <i class="fas fa-cloud-upload-alt"></i>
              <h4>Drag & drop your file here</h4>
              <p>Or click to browse files</p>
              <p class="help-text">Supported formats: PDF, DOCX, TXT, RTF, MD (max 10MB)</p>
            </div>

            <div class="selected-file-info" v-else>
              <div class="file-preview">
                <i :class="getFileIcon(selectedFile.type)"></i>
              </div>
              <div class="file-details">
                <h4>{{ selectedFile.name }}</h4>
                <p>{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <button class="icon-button delete-btn remove-file-btn" @click.stop="removeSelectedFile">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <form @submit.prevent="uploadFile">
            <div class="form-group">
              <label for="file-title">File Title <span class="optional-label">(Leave empty to use filename)</span></label>
              <input 
                type="text" 
                id="file-title" 
                v-model="fileData.title" 
                placeholder="Enter a title for your file"
              >
            </div>

            <div class="form-group">
              <label for="file-tags">Tags <span class="optional-label">(Optional, comma separated)</span></label>
              <input 
                type="text" 
                id="file-tags" 
                v-model="fileData.tags" 
                placeholder="e.g. lecture, chapter 1, midterm"
              >
              <p class="help-text">
                <i class="fas fa-info-circle"></i> Tags help organize your study materials
              </p>
            </div>

            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept=".pdf,.docx,.txt,.rtf,.md"
              style="display: none;"
            >
          </form>
        </div>
        <div class="modal-footer">
          <button class="dashboard-button secondary" @click="closeUploadModal">
            Cancel
          </button>
          <button 
            class="dashboard-button primary" 
            @click="uploadFile" 
            :disabled="!canUpload || uploading"
          >
            <i class="fas fa-spinner fa-spin" v-if="uploading"></i>
            <span v-else>Upload</span>
          </button>
        </div>
      </div>
    </div>

    <!-- File View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container modal-large">
        <div class="modal-header">
          <h3><i class="fas fa-file-alt"></i> {{ currentFile.title }}</h3>
          <button class="close-button" @click="closeViewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="file-viewer-header">
            <div class="file-info">
              <div class="file-info-item">
                <i class="fas fa-calendar-alt"></i> Uploaded: {{ formatDate(currentFile.uploadDate) }}
              </div>
              <div class="file-info-item">
                <i class="fas fa-file"></i> {{ formatFileSize(currentFile.fileSize) }}
              </div>
              <div class="file-info-item">
                <i class="fas fa-file-alt"></i> {{ currentFile.fileType?.toUpperCase() }}
              </div>
            </div>

            <div class="file-tags" v-if="currentFile.tags && currentFile.tags.length > 0">
              <span class="file-info-label">Tags:</span>
              <div class="tag-list">
                <span class="file-tag" v-for="(tag, index) in currentFile.tags" :key="index">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div class="file-content-viewer">
            <div class="file-content-container">
              <div v-for="(para, index) in currentFileParagraphs" :key="index" class="content-paragraph">
                {{ para }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="dashboard-button secondary" @click="closeViewModal">
            Close
          </button>
          <button class="dashboard-button primary" @click="openConfigModal(currentFile)">
            <i class="fas fa-cog"></i>
            Configure Quiz
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz Configuration Modal -->
    <div v-if="showConfigModal" class="modal-overlay" @click.self="closeConfigModal">
      <div class="modal-container modal-large">
        <div class="modal-header">
          <h3><i class="fas fa-cog"></i> Configure Quiz</h3>
          <button class="close-button" @click="closeConfigModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="source-indicator">
            <div class="source-file-icon">
              <i :class="getFileIcon(currentFile.fileType)"></i>
            </div>
            <div class="source-file-details">
              <p class="label">Source File</p>
              <p class="value">{{ currentFile.title }}</p>
            </div>
          </div>

          <h4 class="section-title">Quiz Options</h4>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="question-count">Number of Questions</label>
              <div class="range-control">
                <input 
                  type="range" 
                  id="question-count" 
                  v-model="quizConfig.questionCount" 
                  min="5" 
                  max="30" 
                  step="5"
                >
                <div class="range-value">{{ quizConfig.questionCount }}</div>
              </div>
            </div>
            <div class="form-group half">
              <label for="difficulty">Difficulty Level</label>
              <div class="select-container">
                <select id="difficulty" v-model="quizConfig.difficulty">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Question Types</label>
            <div class="question-types-grid" :class="{ error: quizConfigErrors.questionTypes }">
              <div 
                v-for="type in questionTypes" 
                :key="type.value"
                class="question-type-option"
                :class="{ active: quizConfig.questionTypes.includes(type.value) }"
                @click="toggleQuestionType(type.value)"
              >
                <div class="question-type-icon">
                  <i :class="type.icon"></i>
                </div>
                <div class="question-type-label">{{ type.label }}</div>
              </div>
            </div>
            <p class="error-message" v-if="quizConfigErrors.questionTypes">
              <i class="fas fa-exclamation-circle"></i> Please select at least one question type
            </p>
          </div>

          <div class="form-group">
            <label>Time Limit</label>
            <div class="time-limit-options">
              <div 
                v-for="option in timeOptions" 
                :key="option.value"
                class="time-option"
                :class="{ active: quizConfig.timeLimit === option.value }"
                @click="quizConfig.timeLimit = option.value"
              >
                {{ option.label }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="focus-areas">Focus Areas <span class="optional-label">(Optional)</span></label>
            <input 
              type="text" 
              id="focus-areas" 
              v-model="quizConfig.focusAreas" 
              placeholder="E.g. specific topics or concepts to focus on"
            >
            <p class="help-text">
              <i class="fas fa-info-circle"></i> Comma-separated list of concepts you want to focus on
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="dashboard-button secondary" @click="closeConfigModal">
            Cancel
          </button>
          <button 
            class="dashboard-button primary" 
            @click="generateQuiz" 
            :disabled="!canGenerateQuiz || generating"
          >
            <i class="fas fa-spinner fa-spin" v-if="generating"></i>
            <span v-else>Generate Quiz</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Props and emits
const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['start-quiz']);

// State - Loading/UI states
const loading = ref(true);
const generating = ref(false);
const uploading = ref(false);

// State - Modals
const showViewModal = ref(false);
const showUploadModal = ref(false);
const showConfigModal = ref(false);

// State - Errors
const quizConfigErrors = ref({
  questionTypes: false
});

// State - Search and filtering
const searchQuery = ref('');
const filteredFiles = ref([]);

// State - Files
const currentFile = ref({});
const files = ref([]);

// State - File Upload
const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);
const fileData = ref({
  title: '',
  tags: ''
});

// State - Quiz Configuration
const quizConfig = ref({
  questionCount: 10,
  difficulty: 'medium',
  questionTypes: ['mcq', 'trueFalse'],
  timeLimit: 15,  // in minutes
  focusAreas: ''
});

// Question types data
const questionTypes = [
  { value: 'mcq', label: 'Multiple Choice', icon: 'fas fa-list-ul' },
  { value: 'trueFalse', label: 'True/False', icon: 'fas fa-check-circle' },
  { value: 'fillBlank', label: 'Fill in Blank', icon: 'fas fa-pencil-alt' },
  { value: 'shortAnswer', label: 'Short Answer', icon: 'fas fa-pen' }
];

// Time limit options
const timeOptions = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' }
];

// Computed properties
const currentFileParagraphs = computed(() => {
  if (!currentFile.value.content) return [];
  return currentFile.value.content.split('\n\n').filter(p => p.trim() !== '');
});

const canUpload = computed(() => {
  return selectedFile.value && fileData.value.title.trim() !== '';
});

const canGenerateQuiz = computed(() => {
  quizConfigErrors.value.questionTypes = quizConfig.value.questionTypes.length === 0;
  return !quizConfigErrors.value.questionTypes;
});

// Watchers
watch(files, () => {
  filterFiles();
}, { deep: true });

watch(searchQuery, () => {
  filterFiles();
});

// Methods - Search and Filtering
const filterFiles = () => {
  if (!searchQuery.value.trim()) {
    filteredFiles.value = [...files.value];
    return;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  filteredFiles.value = files.value.filter(file => {
    return (
      file.title.toLowerCase().includes(query) ||
      (file.tags && file.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (file.content && file.content.toLowerCase().includes(query)) ||
      (file.fileType && file.fileType.toLowerCase().includes(query))
    );
  });
};

// Methods - File Management
const viewFile = (file) => {
  currentFile.value = file;
  showViewModal.value = true;
};

const deleteFile = (file) => {
  if (confirm(`Are you sure you want to delete "${file.title}"?`)) {
    files.value = files.value.filter(f => f.id !== file.id);
  }
};

// Methods - File Upload
const triggerFileUpload = () => {
  showUploadModal.value = true;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // Auto-populate title from filename (without extension)
    if (!fileData.value.title) {
      fileData.value.title = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    }
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    selectedFile.value = file;
    // Auto-populate title from filename (without extension)
    if (!fileData.value.title) {
      fileData.value.title = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    }
  }
};

const removeSelectedFile = () => {
  selectedFile.value = null;
  fileInput.value.value = '';
};

const uploadFile = () => {
  if (!canUpload.value) {
    return;
  }
  
  uploading.value = true;
  
  // Process tags
  const tags = fileData.value.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  
  // Create a new file entry
  const newFile = {
    id: files.value.length > 0 
      ? Math.max(...files.value.map(f => f.id)) + 1 
      : 1,
    title: fileData.value.title,
    content: `Content extracted from "${selectedFile.value.name}"

This is placeholder text that would be extracted from the uploaded file.

The actual implementation would involve parsing the file contents based on its format.

For a PDF file, this could involve converting the PDF to text using a library.

For a DOCX file, this could involve extracting the text and preserving some formatting.`,
    tags: tags,
    fileType: selectedFile.value.name.split('.').pop().toLowerCase(),
    fileSize: selectedFile.value.size,
    uploadDate: new Date(),
    excerpt: "This is a brief excerpt from the uploaded file content. In a real implementation, this would be automatically generated."
  };
  
  // Simulate processing delay
  setTimeout(() => {
    files.value.push(newFile);
    uploading.value = false;
    closeUploadModal();
  }, 1500);
};

// Methods - Quiz Configuration and Generation
const openConfigModal = (file) => {
  currentFile.value = file;
  
  // Reset quiz configuration
  quizConfig.value = {
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['mcq', 'trueFalse'],
    timeLimit: 15,
    focusAreas: ''
  };
  
  // Reset errors
  quizConfigErrors.value = {
    questionTypes: false
  };
  
  showConfigModal.value = true;
  
  // Close view modal if open
  if (showViewModal.value) {
    showViewModal.value = false;
  }
};

const toggleQuestionType = (type) => {
  const index = quizConfig.value.questionTypes.indexOf(type);
  if (index === -1) {
    quizConfig.value.questionTypes.push(type);
  } else {
    quizConfig.value.questionTypes.splice(index, 1);
  }
  
  // Reset error if we now have at least one type selected
  if (quizConfig.value.questionTypes.length > 0) {
    quizConfigErrors.value.questionTypes = false;
  }
};

const generateQuiz = () => {
  // Validate configuration
  if (quizConfig.value.questionTypes.length === 0) {
    quizConfigErrors.value.questionTypes = true;
    return;
  }
  
  generating.value = true;
  
  // Prepare quiz data
  const quizData = {
    sourceFile: currentFile.value.title,
    questionCount: quizConfig.value.questionCount,
    difficulty: quizConfig.value.difficulty,
    timeLimit: quizConfig.value.timeLimit,
    focusAreas: quizConfig.value.focusAreas,
    questionTypes: quizConfig.value.questionTypes
  };
  
  // Simulate quiz generation
  setTimeout(() => {
    generating.value = false;
    closeConfigModal();
    
    // In a real application, this would be where you receive the generated quiz from an AI service
    // For now, we'll just emit an event to start the quiz
    emit('start-quiz', quizData);
  }, 2000);
};

// Methods - Modal Management
const closeViewModal = () => {
  showViewModal.value = false;
};

const closeUploadModal = () => {
  showUploadModal.value = false;
  selectedFile.value = null;
  fileData.value = { title: '', tags: '' };
  isDragging.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const closeConfigModal = () => {
  showConfigModal.value = false;
};

// Helper Methods
const getFileIcon = (fileType) => {
  if (!fileType) return 'fas fa-file';
  
  const type = typeof fileType === 'string' ? fileType.toLowerCase() : '';
  
  switch (true) {
    case type.includes('pdf'):
      return 'fas fa-file-pdf';
    case type.includes('doc'):
      return 'fas fa-file-word';
    case type.includes('txt'):
      return 'fas fa-file-alt';
    case type.includes('md'):
      return 'fas fa-file-code';
    case type.includes('rtf'):
      return 'fas fa-file-alt';
    default:
      return 'fas fa-file';
  }
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

// Load demo data
onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    // Add some sample files for demonstration
    files.value = [
      {
        id: 1,
        title: "Introduction to Neural Networks",
        fileType: "pdf",
        fileSize: 1240000,
        tags: ["AI", "Machine Learning", "Neural Networks"],
        uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        excerpt: "Neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains. Such systems learn to perform tasks by considering examples...",
        content: "Neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains. Such systems learn to perform tasks by considering examples, generally without being programmed with task-specific rules.\n\nFor example, in image recognition, they might learn to identify images that contain cats by analyzing example images that have been manually labeled as 'cat' or 'no cat' and using the results to identify cats in other images.\n\nThey do this without any prior knowledge of cats, for example, that they have fur, tails, whiskers and cat-like faces. Instead, they automatically generate identifying characteristics from the examples that they process.\n\nThis is a key difference from traditional programming approaches where the rules for identifying a cat would need to be explicitly programmed."
      },
      {
        id: 2,
        title: "Thermodynamics Chapter 3 Notes",
        fileType: "docx",
        fileSize: 678000,
        tags: ["Physics", "Thermodynamics", "Chapter 3"],
        uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        excerpt: "The first law of thermodynamics, also known as Law of Conservation of Energy, states that energy can neither be created nor destroyed; energy can only be transferred or changed from one form to another...",
        content: "The first law of thermodynamics, also known as Law of Conservation of Energy, states that energy can neither be created nor destroyed; energy can only be transferred or changed from one form to another.\n\nFor a thermodynamic cycle, the net heat supplied to the system equals the net work done by the system.\n\nThe first law is often formulated by stating that the change in the internal energy of a closed system is equal to the amount of heat supplied to the system, minus the amount of work done by the system on its surroundings.\n\nThe law is generalized to state that the total energy of an isolated system is constant; it is conserved over time. Energy can be transformed from one form to another, but can neither be created nor destroyed.\n\nThe first law is a version of the law of conservation of energy, adapted for thermodynamic processes, distinguishing three kinds of energy transfer: heat, thermodynamic work, and matter transfer."
      },
      {
        id: 3,
        title: "Shakespeare's Macbeth Analysis",
        fileType: "txt",
        fileSize: 450000,
        tags: ["Literature", "Shakespeare", "Macbeth"],
        uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        excerpt: "Macbeth is a tragedy by William Shakespeare; it is thought to have been first performed in 1606. It dramatizes the damaging physical and psychological effects of political ambition on those who seek power...",
        content: "Macbeth is a tragedy by William Shakespeare; it is thought to have been first performed in 1606. It dramatizes the damaging physical and psychological effects of political ambition on those who seek power.\n\nOf all the plays that Shakespeare wrote during the reign of James I, Macbeth most clearly reflects the playwright's relationship with his sovereign. It was first published in the Folio of 1623, possibly from a prompt book, and is Shakespeare's shortest tragedy.\n\nA brave Scottish general named Macbeth receives a prophecy from a trio of witches that one day he will become King of Scotland. Consumed by ambition and spurred to action by his wife, Macbeth murders King Duncan and takes the Scottish throne for himself. He is then wracked with guilt and paranoia.\n\nForced to commit more and more murders to protect himself from enmity and suspicion, he soon becomes a tyrannical ruler. The bloodbath and consequent civil war swiftly take Macbeth and Lady Macbeth into the realms of madness and death."
      }
    ];
    
    // Initialize filtered files
    filterFiles();
    
    loading.value = false;
  }, 1500);
});
</script>

<style scoped>
/* Main Dashboard Layout */
.dashboard-content {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-title h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1d2b;
  margin: 0;
}

.dashboard-title-icon {
  font-size: 20px;
  color: #ff784b;
  background-color: #fff2ed;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-actions {
  display: flex;
  gap: 12px;
}

/* Status Bar */
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
}

.status-info {
  color: #6b7280;
  font-size: 14px;
}

.status-filters {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0 12px;
  width: 250px;
  transition: all 0.2s;
  position: relative;
}

.search-box:focus-within {
  border-color: #ff784b;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
}

.search-box input {
  border: none;
  outline: none;
  padding: 8px 8px;
  width: 100%;
  font-size: 14px;
}

.search-box i {
  color: #9ca3af;
  font-size: 14px;
}

.search-box i.fa-times-circle {
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s;
}

.search-box i.fa-times-circle:hover {
  color: #6b7280;
}

/* Content Area */
.dashboard-content-area {
  padding: 24px 32px;
  min-height: 500px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6b7280;
}

.spinner-container {
  margin-bottom: 16px;
}

.spinner {
  border: 3px solid rgba(203, 213, 224, 0.3);
  border-top: 3px solid #ff784b;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: #6b7280;
  text-align: center;
}

.empty-state-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1a1d2b;
}

.empty-state p {
  font-size: 14px;
  margin: 0 0 24px;
}

/* No Results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #6b7280;
  text-align: center;
}

.no-results i {
  font-size: 32px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.no-results p {
  font-size: 15px;
  margin: 0 0 20px;
}

/* Files Grid */
.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.file-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.file-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

.file-card-header {
  display: flex;
  align-items: flex-start;
  padding: 20px 20px 15px;
  position: relative;
}

.file-type-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: #fff2ed;
  color: #ff784b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
}

.file-card-header .file-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1d2b;
  flex: 1;
  padding-right: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.file-actions {
  position: absolute;
  top: 14px;
  right: 14px;
  display: none;
}

.file-card:hover .file-actions {
  display: flex;
  gap: 6px;
}

.icon-button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #6b7280;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-button:hover {
  background-color: #f1f5f9;
  color: #1a1d2b;
}

.icon-button.view-btn:hover {
  color: #ff784b;
}

.icon-button.delete-btn:hover {
  color: #ef4444;
}

.file-card-meta {
  display: flex;
  padding: 0 20px 12px;
  gap: 16px;
}

.file-meta-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
}

.file-meta-item i {
  margin-right: 6px;
  font-size: 12px;
}

.file-card-tags {
  padding: 0 20px 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.file-tag {
  background-color: #f1f5f9;
  color: #4b5563;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.file-tag.more-tag {
  background-color: #fff2ed;
  color: #ff784b;
}

.file-card-content {
  padding: 0 20px 16px;
  flex-grow: 1;
}

.file-card-content p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.file-card-footer {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-appear 0.2s ease-out;
}

.modal-large {
  max-width: 800px;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1d2b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h3 i {
  color: #ff784b;
}

.close-button {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f1f5f9;
  color: #4b5563;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Upload Dropzone */
.upload-dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  margin-bottom: 24px;
}

.upload-dropzone:hover {
  border-color: #9ca3af;
  background-color: #f8f9fa;
}

.upload-dropzone.active {
  border-color: #ff784b;
  background-color: #fff2ed;
}

.upload-placeholder {
  color: #6b7280;
}

.upload-placeholder i {
  font-size: 42px;
  margin-bottom: 16px;
  color: #9ca3af;
}

.upload-placeholder h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #4b5563;
}

.upload-placeholder p {
  margin: 0;
  font-size: 14px;
}

.selected-file-info {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.file-preview {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #fff2ed;
  color: #ff784b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
}

.file-details {
  flex: 1;
}

.file-details h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 500;
  color: #1a1d2b;
}

.file-details p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.remove-file-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #1a1d2b;
}

.optional-label {
  font-weight: normal;
  color: #9ca3af;
  font-size: 12px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 15px;
  color: #1a1d2b;
  transition: all 0.2s;
  background-color: #ffffff;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #ff784b;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 120, 75, 0.1);
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
  border-color: #ef4444;
}

.form-group .error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 6px;
}

.help-text {
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
}

.help-text i {
  margin-right: 4px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group.half {
  flex: 1;
}

.select-container {
  position: relative;
}

.select-container select {
  appearance: none;
  padding-right: 32px;
}

.select-container i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

/* Range control */
.range-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-control input[type="range"] {
  flex: 1;
  appearance: none;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
}

.range-control input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #ff784b;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.range-control input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range-value {
  background-color: #f1f5f9;
  color: #4b5563;
  font-weight: 500;
  min-width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* Question Types */
.question-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.question-types-grid.error {
  border: 1px solid #ef4444;
  border-radius: 6px;
  padding: 10px;
}

.question-type-option {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.question-type-option:hover {
  border-color: #9ca3af;
  background-color: #f8f9fa;
}

.question-type-option.active {
  border-color: #ff784b;
  background-color: #fff2ed;
}

.question-type-icon {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 8px;
}

.question-type-option.active .question-type-icon {
  color: #ff784b;
}

.question-type-label {
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
}

.question-type-option.active .question-type-label {
  color: #1a1d2b;
}

/* Time Options */
.time-limit-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-option {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.time-option:hover {
  border-color: #9ca3af;
  background-color: #f8f9fa;
}

.time-option.active {
  background-color: #ff784b;
  color: #ffffff;
  border-color: #ff784b;
}

/* Source Indicator */
.source-indicator {
  display: flex;
  align-items: center;
  padding: 14px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.source-file-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: #fff2ed;
  color: #ff784b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  font-size: 18px;
}

.source-file-details {
  flex: 1;
}

.source-file-details .label {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 2px;
}

.source-file-details .value {
  font-size: 15px;
  font-weight: 500;
  color: #1a1d2b;
  margin: 0;
}

/* Section Title */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1d2b;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

/* File Viewer */
.file-viewer-header {
  margin-bottom: 24px;
}

.file-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.file-info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
}

.file-info-item i {
  margin-right: 8px;
}

.file-tags {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-info-label {
  font-size: 14px;
  color: #6b7280;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.file-content-viewer {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.file-content-container {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  color: #1a1d2b;
  line-height: 1.6;
}

.content-paragraph {
  margin-bottom: 16px;
}

.content-paragraph:last-child {
  margin-bottom: 0;
}

/* Button Styles */
.dashboard-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.dashboard-button.primary {
  background-color: #ff784b;
  color: #ffffff;
}

.dashboard-button.primary:hover:not(:disabled) {
  background-color: #f06a3e;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard-button.secondary {
  background-color: #f1f5f9;
  color: #4b5563;
  border: 1px solid #e2e8f0;
}

.dashboard-button.secondary:hover {
  background-color: #e2e8f0;
  color: #1a1d2b;
}

.dashboard-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.dashboard-button i {
  font-size: 14px;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .dashboard-header {
    padding: 20px 24px;
  }
  
  .status-bar {
    padding: 12px 24px;
  }
  
  .dashboard-content-area {
    padding: 20px 24px;
  }
  
  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .status-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-box {
    width: 100%;
  }
  
  .files-grid {
    grid-template-columns: 1fr;
  }
  
  .file-actions {
    display: flex;
  }
  
  .question-types-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .time-limit-options {
    gap: 6px;
  }
  
  .time-option {
    flex: 1 0 calc(33.333% - 6px);
    text-align: center;
  }
  
  .file-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 16px 20px;
  }
  
  .dashboard-actions {
    width: 100%;
  }
  
  .dashboard-actions .dashboard-button {
    flex: 1;
  }
  
  .dashboard-content-area {
    padding: 16px 20px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .question-types-grid {
    grid-template-columns: 1fr;
  }
  
  .time-option {
    flex: 1 0 calc(50% - 6px);
  }
}
</style> 