<template>
  <div class="materials-tab">
    <div class="detail-card">
      <div class="card-header-with-action">
        <h3><i class="fas fa-book"></i> Course Materials</h3>
        <div class="header-actions">
          <button class="secondary-button" @click="showAddMaterialModal = true">
            <i class="fas fa-upload"></i> Upload Material
          </button>
          <button class="primary-button" @click="showAIGenerateModal = true">
            <i class="fas fa-robot"></i> Generate Material
          </button>
        </div>
      </div>

      <!-- Materials Filter and Search -->
      <div class="materials-filters">
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search materials..."
            v-model="searchQuery"
            @input="filterMaterials"
          />
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <div class="filter-options">
          <select v-model="typeFilter" @change="filterMaterials">
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="presentation">Presentations</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="other">Other</option>
          </select>

          <select v-model="topicFilter" @change="filterMaterials">
            <option value="all">All Topics</option>
            <option v-for="topic in uniqueTopics" :key="topic" :value="topic">
              {{ topic }}
            </option>
          </select>
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
          <p>
            No materials found. Upload materials or use AI to generate content.
          </p>
          <div class="empty-actions">
            <button
              class="secondary-button"
              @click="showAddMaterialModal = true"
            >
              <i class="fas fa-upload"></i> Upload Material
            </button>
            <button class="primary-button" @click="showAIGenerateModal = true">
              <i class="fas fa-robot"></i> Generate Material
            </button>
          </div>
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
                  <button class="action-btn" @click="generateQuiz(material)">
                    <i class="fas fa-clipboard-list"></i>
                  </button>
                  <div class="dropdown">
                    <button class="action-btn dropdown-toggle">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a @click="editMaterial(material)">
                        <i class="fas fa-edit"></i> Edit
                      </a>
                      <a @click="shareMaterial(material)">
                        <i class="fas fa-share-alt"></i> Share
                      </a>
                      <a @click="copyLink(material)">
                        <i class="fas fa-link"></i> Copy Link
                      </a>
                      <a
                        @click="deleteMaterial(material)"
                        class="delete-action"
                      >
                        <i class="fas fa-trash"></i> Delete
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Material Modal -->
    <div
      v-if="showAddMaterialModal"
      class="modal-overlay"
      @click.self="closeAddMaterialModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-upload"></i> Upload Course Material</h3>
          <button class="close-btn" @click="closeAddMaterialModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="uploadMaterial">
            <div class="form-group">
              <label for="materialTitle">Title</label>
              <input
                type="text"
                id="materialTitle"
                v-model="newMaterial.title"
                placeholder="Enter material title"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="materialType">Type</label>
                <select id="materialType" v-model="newMaterial.type" required>
                  <option value="">Select type</option>
                  <option value="document">Document</option>
                  <option value="presentation">Presentation</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="materialFormat">Format</label>
                <select
                  id="materialFormat"
                  v-model="newMaterial.format"
                  required
                >
                  <option value="">Select format</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="pptx">PPTX</option>
                  <option value="xlsx">XLSX</option>
                  <option value="mp4">MP4</option>
                  <option value="mp3">MP3</option>
                  <option value="txt">TXT</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="materialTopics">Topics (comma separated)</label>
              <input
                type="text"
                id="materialTopics"
                v-model="newMaterial.topicsInput"
                placeholder="E.g., Programming, Variables, Loops"
              />
            </div>

            <div class="form-group">
              <label for="materialFile">File</label>
              <div class="file-upload-container">
                <input
                  type="file"
                  id="materialFile"
                  @change="handleFileChange"
                  class="file-input"
                  accept=".pdf,.docx,.pptx,.xlsx,.mp4,.mp3,.txt"
                />
                <div class="file-upload-box" @click="triggerFileInput">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Click to select file or drag and drop</p>
                  <p v-if="uploadedFile" class="file-name">
                    {{ uploadedFile.name }} ({{ formatFileSize(uploadedFile.size) }})
                  </p>
                </div>
              </div>
              <p class="file-formats-hint">
                Supported formats: PDF, DOCX, PPTX, XLSX, MP4, MP3, TXT
              </p>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="secondary-button"
                @click="closeAddMaterialModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="primary-button"
                :disabled="isUploading"
              >
                <i class="fas fa-upload"></i>
                {{ isUploading ? "Uploading..." : "Upload" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- AI Generate Material Modal -->
    <div
      v-if="showAIGenerateModal"
      class="modal-overlay"
      @click.self="closeAIGenerateModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-robot"></i> Generate Course Material</h3>
          <button class="close-btn" @click="closeAIGenerateModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="generateMaterial">
            <div class="form-group">
              <label for="aiMaterialTopic">Topic</label>
              <input
                type="text"
                id="aiMaterialTopic"
                v-model="aiGenerate.topic"
                placeholder="Enter the main topic (e.g., Introduction to Variables)"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="aiMaterialType">Material Type</label>
                <select id="aiMaterialType" v-model="aiGenerate.type" required>
                  <option value="">Select type</option>
                  <option value="lecture">Lecture Notes</option>
                  <option value="exercise">Practice Exercises</option>
                  <option value="summary">Topic Summary</option>
                  <option value="cheatsheet">Cheat Sheet</option>
                </select>
              </div>

              <div class="form-group">
                <label for="aiMaterialFormat">Output Format</label>
                <select
                  id="aiMaterialFormat"
                  v-model="aiGenerate.format"
                  required
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="pptx">PPTX</option>
                  <option value="txt">TXT</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="aiMaterialLevel">Difficulty Level</label>
              <div class="level-selector">
                <label class="level-option">
                  <input
                    type="radio"
                    v-model="aiGenerate.level"
                    value="beginner"
                  />
                  <span>Beginner</span>
                </label>
                <label class="level-option">
                  <input
                    type="radio"
                    v-model="aiGenerate.level"
                    value="intermediate"
                  />
                  <span>Intermediate</span>
                </label>
                <label class="level-option">
                  <input
                    type="radio"
                    v-model="aiGenerate.level"
                    value="advanced"
                  />
                  <span>Advanced</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="aiMaterialInstructions"
                >Additional Instructions (Optional)</label
              >
              <textarea
                id="aiMaterialInstructions"
                v-model="aiGenerate.instructions"
                placeholder="Add any specific instructions or requirements..."
                rows="3"
              ></textarea>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="secondary-button"
                @click="closeAIGenerateModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="primary-button"
                :disabled="isGenerating"
              >
                <i class="fas fa-robot"></i>
                {{ isGenerating ? "Generating..." : "Generate Material" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Generate Quiz Modal -->
    <div
      v-if="showGenerateQuizModal"
      class="modal-overlay"
      @click.self="closeGenerateQuizModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-clipboard-list"></i> Generate Quiz from Material
          </h3>
          <button class="close-btn" @click="closeGenerateQuizModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="selected-material">
            <div class="material-icon">
              <i :class="getFileIcon(selectedMaterial.format)"></i>
            </div>
            <div class="selected-material-info">
              <h4>{{ selectedMaterial.title }}</h4>
              <p>
                {{ selectedMaterial.format.toUpperCase() }} •
                {{ selectedMaterial.size }}
              </p>
            </div>
          </div>

          <form @submit.prevent="createQuizFromMaterial">
            <div class="form-row">
              <div class="form-group">
                <label for="quizTitle">Quiz Title</label>
                <input
                  type="text"
                  id="quizTitle"
                  v-model="quizGenerate.title"
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div class="form-group">
                <label for="questionCount">Number of Questions</label>
                <input
                  type="number"
                  id="questionCount"
                  v-model="quizGenerate.questionCount"
                  min="5"
                  max="50"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="quizDifficulty">Difficulty Level</label>
                <select
                  id="quizDifficulty"
                  v-model="quizGenerate.difficulty"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div class="form-group">
                <label for="timeLimit">Time Limit (minutes)</label>
                <input
                  type="number"
                  id="timeLimit"
                  v-model="quizGenerate.timeLimit"
                  min="5"
                  max="180"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Question Types</label>
              <div class="checkbox-group">
                <label class="checkbox-option">
                  <input
                    type="checkbox"
                    v-model="quizGenerate.questionTypes"
                    value="multipleChoice"
                  />
                  <span>Multiple Choice</span>
                </label>
                <label class="checkbox-option">
                  <input
                    type="checkbox"
                    v-model="quizGenerate.questionTypes"
                    value="trueFalse"
                  />
                  <span>True/False</span>
                </label>
                <label class="checkbox-option">
                  <input
                    type="checkbox"
                    v-model="quizGenerate.questionTypes"
                    value="shortAnswer"
                  />
                  <span>Short Answer</span>
                </label>
                <label class="checkbox-option">
                  <input
                    type="checkbox"
                    v-model="quizGenerate.questionTypes"
                    value="matching"
                  />
                  <span>Matching</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="specificTopics"
                >Focus on Specific Topics (Optional)</label
              >
              <select
                id="specificTopics"
                v-model="quizGenerate.topics"
                multiple
                class="multi-select"
              >
                <option
                  v-for="topic in selectedMaterial.topics"
                  :key="topic"
                  :value="topic"
                >
                  {{ topic }}
                </option>
              </select>
              <small
                >Hold Ctrl/Cmd to select multiple topics. Leave empty to cover
                all topics.</small
              >
            </div>

            <div class="preview-option">
              <label class="checkbox-option">
                <input
                  type="checkbox"
                  v-model="quizGenerate.previewBeforeSave"
                />
                <span>Preview quiz before saving</span>
              </label>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="secondary-button"
                @click="closeGenerateQuizModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="primary-button"
                :disabled="isGeneratingQuiz"
              >
                <i class="fas fa-magic"></i>
                {{ isGeneratingQuiz ? "Generating Quiz..." : "Generate Quiz" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Material Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="modal-overlay"
      @click.self="closePreviewModal"
    >
      <div class="modal-content preview-modal" @click.stop>
        <div class="modal-header">
          <h3>
            <i :class="getFileIcon(selectedMaterial.format)"></i>
            {{ selectedMaterial.title }}
          </h3>
          <button class="close-btn" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body preview-body">
          <div class="preview-container">
            <!-- PDF Viewer -->
            <div v-if="selectedMaterial.format === 'pdf'" class="pdf-preview">
              <div class="pdf-toolbar">
                <div class="page-navigation">
                  <button
                    class="page-btn"
                    :disabled="currentPage === 1"
                    @click="currentPage = Math.max(1, currentPage - 1)"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <span>Page {{ currentPage }} of {{ totalPages }}</span>
                  <button
                    class="page-btn"
                    :disabled="currentPage === totalPages"
                    @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
                <div class="zoom-controls">
                  <button
                    class="zoom-btn"
                    @click="zoomLevel = Math.max(50, zoomLevel - 10)"
                  >
                    <i class="fas fa-search-minus"></i>
                  </button>
                  <span>{{ zoomLevel }}%</span>
                  <button
                    class="zoom-btn"
                    @click="zoomLevel = Math.min(200, zoomLevel + 10)"
                  >
                    <i class="fas fa-search-plus"></i>
                  </button>
                </div>
              </div>

              <div class="pdf-content">
                <!-- Mock PDF Viewer -->
                <div
                  class="mock-pdf-page"
                  :style="{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                  }"
                >
                  <div class="mock-pdf-header">
                    <h4>{{ selectedMaterial.title }}</h4>
                    <div class="mock-page-number">Page {{ currentPage }}</div>
                  </div>
                  <div class="mock-pdf-content">
                    <p>
                      This is a demonstration of a PDF preview. In a real
                      implementation, this would display the actual PDF content
                      using a library like PDF.js.
                    </p>
                    <div class="mock-pdf-image"></div>
                    <p>
                      The document would contain content related to these
                      topics:
                    </p>
                    <ul>
                      <li v-for="topic in selectedMaterial.topics" :key="topic">
                        {{ topic }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Document/Presentation Preview -->
            <div
              v-else-if="
                ['docx', 'pptx', 'txt'].includes(selectedMaterial.format)
              "
              class="doc-preview"
            >
              <div class="doc-container">
                <div class="doc-content">
                  <h4>{{ selectedMaterial.title }}</h4>
                  <div class="doc-metadata">
                    <p>
                      <strong>File Type:</strong>
                      {{ selectedMaterial.format.toUpperCase() }}
                    </p>
                    <p><strong>Size:</strong> {{ selectedMaterial.size }}</p>
                    <p>
                      <strong>Uploaded:</strong>
                      {{ formatDate(selectedMaterial.uploadedAt) }}
                    </p>
                  </div>
                  <div class="doc-preview-content">
                    <p>This is a preview of the document content.</p>
                    <p>
                      The document contains information about the following
                      topics:
                    </p>
                    <ul>
                      <li v-for="topic in selectedMaterial.topics" :key="topic">
                        {{ topic }}
                      </li>
                    </ul>
                    <p>
                      To view or edit the full document, please download it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Video/Audio Preview -->
            <div
              v-else-if="['mp4', 'mp3'].includes(selectedMaterial.format)"
              class="media-preview"
            >
              <div class="media-container">
                <div
                  v-if="selectedMaterial.format === 'mp4'"
                  class="video-container"
                >
                  <!-- Mock Video Player -->
                  <div class="mock-video">
                    <div class="mock-video-screen">
                      <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="mock-video-controls">
                      <div class="mock-timeline"></div>
                      <div class="mock-buttons">
                        <button><i class="fas fa-play"></i></button>
                        <button><i class="fas fa-volume-up"></i></button>
                        <span
                          >0:00 /
                          {{
                            formatDuration(selectedMaterial.duration || "45:30")
                          }}</span
                        >
                        <button><i class="fas fa-expand"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="audio-container">
                  <!-- Mock Audio Player -->
                  <div class="mock-audio">
                    <div class="mock-audio-title">
                      <i class="fas fa-music"></i>
                      <span>{{ selectedMaterial.title }}</span>
                    </div>
                    <div class="mock-audio-controls">
                      <button><i class="fas fa-play"></i></button>
                      <div class="mock-timeline"></div>
                      <span
                        >0:00 /
                        {{
                          formatDuration(selectedMaterial.duration || "12:45")
                        }}</span
                      >
                      <button><i class="fas fa-volume-up"></i></button>
                    </div>
                  </div>
                </div>

                <div class="media-info">
                  <h4>{{ selectedMaterial.title }}</h4>
                  <p>
                    {{
                      selectedMaterial.format === "mp4" ? "Video" : "Audio"
                    }}
                    content related to:
                  </p>
                  <div class="topic-badges">
                    <span
                      class="topic-badge"
                      v-for="topic in selectedMaterial.topics"
                      :key="topic"
                    >
                      {{ topic }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Unsupported Format -->
            <div v-else class="unsupported-preview">
              <div class="unsupported-icon">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <p>
                Preview not available for
                {{ selectedMaterial.format.toUpperCase() }} files.
              </p>
              <p>Please download the file to view its contents.</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="secondary-button"
            @click="downloadMaterial(selectedMaterial)"
          >
            <i class="fas fa-download"></i> Download
          </button>
          <button
            class="secondary-button"
            @click="generateQuiz(selectedMaterial)"
          >
            <i class="fas fa-clipboard-list"></i> Generate Quiz
          </button>
          <button class="primary-button" @click="closePreviewModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMaterialsStore } from '../../stores'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

// Store
const materialsStore = useMaterialsStore()

// State
const searchQuery = ref('')
const typeFilter = ref('all')
const topicFilter = ref('all')
const sortBy = ref('date')
const sortOrder = ref('desc')
const isLoading = computed(() => materialsStore.loading)
const error = computed(() => materialsStore.error)

// Modals
const showAddMaterialModal = ref(false)
const showAIGenerateModal = ref(false)
const showMaterialDetailModal = ref(false)
const showDeleteConfirmation = ref(false)
const showGenerateQuizModal = ref(false)
const showPreviewModal = ref(false)
const selectedMaterial = ref({})
const currentPage = ref(1)
const totalPages = ref(5) // Mock value for the PDF preview
const zoomLevel = ref(100)

// Reference to the file input element
const fileInput = ref(null)
const uploadedFile = ref(null)
const isUploading = ref(false)
const isGenerating = ref(false)
const isGeneratingQuiz = ref(false)

// New material form with topics support
const newMaterial = ref({
  title: '',
  description: '',
  type: 'document',
  format: 'pdf',
  topicsInput: '',
  topics: []
})

// AI generation form
const aiGenerate = ref({
  topic: '',
  type: '',
  format: 'pdf',
  level: 'intermediate',
  instructions: ''
})

// Quiz generation form
const quizGenerate = ref({
  title: '',
  questionCount: 10,
  difficulty: 'intermediate',
  timeLimit: 30,
  questionTypes: ['multipleChoice'],
  topics: [],
  previewBeforeSave: false
})

// Initialize data when component is mounted
onMounted(async () => {
  await loadMaterials()
})

// Watch for course changes
watch(() => props.course?.id, async (newCourseId, oldCourseId) => {
  if (newCourseId && newCourseId !== oldCourseId) {
    await loadMaterials()
  }
}, { immediate: false })

// Load materials
async function loadMaterials() {
  try {
    await materialsStore.fetchMaterials(props.course.id)
  } catch (error) {
    console.error('Error loading materials:', error)
  }
}

// Get all materials
const allMaterials = computed(() => 
  materialsStore.getCourseMaterials(props.course.id)
)

// Filter and sort materials
const filteredMaterials = computed(() => {
  let materials = [...allMaterials.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    materials = materials.filter(material => 
      material.title.toLowerCase().includes(query)
    )
  }
  
  // Apply type filter
  if (typeFilter.value !== 'all') {
    materials = materials.filter(material => material.type === typeFilter.value)}
  
  // Apply topic filter
  if (topicFilter.value !== 'all' && topicFilter.value) {
    materials = materials.filter(material => 
      material.topics && material.topics.includes(topicFilter.value)
    )
  }
  
  // Sort materials
  materials.sort((a, b) => {
    if (sortBy.value === 'date') {
      return sortOrder.value === 'desc' 
        ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
        : new Date(a.uploadedAt) - new Date(b.uploadedAt)
    } else if (sortBy.value === 'title') {
      return sortOrder.value === 'desc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title)
    } else if (sortBy.value === 'type') {
      return sortOrder.value === 'desc'
        ? b.type.localeCompare(a.type)
        : a.type.localeCompare(b.type)
    }
    return 0
  })
  
  return materials
})

// Group materials by type for display
const materialCategories = computed(() => {
  const categories = []
  
  // Documents
  const documents = filteredMaterials.value.filter(m => m.type === 'document')
  if (documents.length > 0) {
    categories.push({ name: 'Documents', items: documents })
  }
  
  // Presentations
  const presentations = filteredMaterials.value.filter(m => m.type === 'presentation')
  if (presentations.length > 0) {
    categories.push({ name: 'Presentations', items: presentations })
  }
  
  // Videos
  const videos = filteredMaterials.value.filter(m => m.type === 'video')
  if (videos.length > 0) {
    categories.push({ name: 'Videos', items: videos })
  }
  
  // Other
  const others = filteredMaterials.value.filter(m => 
    !['document', 'presentation', 'video'].includes(m.type)
  )
  if (others.length > 0) {
    categories.push({ name: 'Other Materials', items: others })
  }
  
  return categories
})

// Extract unique topics for filter dropdown
const uniqueTopics = computed(() => {
  const topics = new Set()
  allMaterials.value.forEach(material => {
    if (material.topics) {
      material.topics.forEach(topic => topics.add(topic))
    }
  })
  return Array.from(topics)
})

// Filter and sort handlers
function filterMaterials() {
  // Filters are applied via computed properties
}

function changeSort(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatDuration(durationString) {
  return durationString;
}

function getFileIcon(format) {
  const icons = {
    pdf: 'fas fa-file-pdf',
    doc: 'fas fa-file-word',
    docx: 'fas fa-file-word',
    ppt: 'fas fa-file-powerpoint',
    pptx: 'fas fa-file-powerpoint',
    xls: 'fas fa-file-excel',
    xlsx: 'fas fa-file-excel',
    mp4: 'fas fa-file-video',
    mp3: 'fas fa-file-audio',
    jpg: 'fas fa-file-image',
    jpeg: 'fas fa-file-image',
    png: 'fas fa-file-image',
    zip: 'fas fa-file-archive'
  }
  
  return icons[format.toLowerCase()] || 'fas fa-file'
}

function getCategoryIcon(category) {
  const icons = {
    'Documents': 'fas fa-file-alt',
    'Presentations': 'fas fa-file-powerpoint',
    'Videos': 'fas fa-file-video',
    'Other Materials': 'fas fa-folder'
  }
  
  return icons[category] || 'fas fa-folder'
}

// Function to trigger the file input click
function triggerFileInput() {
  const fileInputElement = document.getElementById('materialFile')
  if (fileInputElement) {
    fileInputElement.click()
  }
}

// Handle file selection
function handleFileChange(event) {
  uploadedFile.value = event.target.files[0]
  
  if (uploadedFile.value) {
    // Auto-fill form fields based on file properties
    const fileName = uploadedFile.value.name
    const fileExt = fileName.split('.').pop().toLowerCase()
    
    // Suggest a title based on filename (if not already set)
    if (!newMaterial.value.title) {
      newMaterial.value.title = fileName.split('.')[0]
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    }
    
    // Set format based on file extension
    newMaterial.value.format = fileExt
    
    // Set material type based on file extension
    if (['pdf', 'doc', 'docx', 'txt'].includes(fileExt)) {
      newMaterial.value.type = 'document'
    } else if (['ppt', 'pptx'].includes(fileExt)) {
      newMaterial.value.type = 'presentation'
    } else if (['mp4', 'avi', 'mov'].includes(fileExt)) {
      newMaterial.value.type = 'video'
    } else if (['mp3', 'wav'].includes(fileExt)) {
      newMaterial.value.type = 'audio'
    }
  }
}

// Format file size for display
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

// Material actions
function viewMaterial(material) {
  selectedMaterial.value = material
  showPreviewModal.value = true
  // Reset preview state
  currentPage.value = 1
  zoomLevel.value = 100
}

function downloadMaterial(material) {
  // For files with blob URLs (from upload), we can trigger a download
  if (material.url && material.url !== '#') {
    const link = document.createElement('a')
    link.href = material.url
    link.download = material.title + '.' + material.format
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // In a real app, this would trigger a download from the server
    console.log('Downloading:', material.title)
    alert(`Downloading "${material.title}" (Demo - no actual download)`)
  }
}

function editMaterial(material) {
  selectedMaterial.value = material
  // Populate form with material data
  newMaterial.value = {
    title: material.title,
    description: material.description || '',
    type: material.type,
    format: material.format,
    // Handle topics for editing
    topicsInput: material.topics ? material.topics.join(', ') : '',
    topics: material.topics || []
  }
  showAddMaterialModal.value = true
}

function shareMaterial(material) {
  // In a real app, this would open a sharing dialog
  console.log('Sharing:', material.title)
  alert(`Share dialog for "${material.title}" (Demo)`)
}

function copyLink(material) {
  // In a real app, this would copy a link to the clipboard
  console.log('Copying link for:', material.title)
  alert(`Link copied for "${material.title}" (Demo - no actual copy)`)
}

function deleteMaterial(material) {
  if (confirm(`Are you sure you want to delete "${material.title}"? This action cannot be undone.`)) {
    materialsStore.deleteMaterial(props.course.id, material.id)
      .then(() => {
        alert(`Material "${material.title}" deleted successfully`)
      })
      .catch(error => {
        console.error('Error deleting material:', error)
        alert('Failed to delete material. Please try again.')
      })
  }
}

function generateQuiz(material) {
  selectedMaterial.value = material
  showGenerateQuizModal.value = true
  
  // Initialize the quiz form with material data
  quizGenerate.value = {
    title: `Quiz on ${material.title}`,
    questionCount: 10,
    difficulty: 'intermediate',
    timeLimit: 30,
    questionTypes: ['multipleChoice'],
    topics: material.topics || [],
    previewBeforeSave: false
  }
}

// Upload or update material
async function uploadMaterial() {
  if (!uploadedFile.value && !selectedMaterial.value) {
    alert('Please select a file to upload')
    return
  }
  
  try {
    isUploading.value = true
    
    // Prepare the material data including the file
    const materialData = {
      ...newMaterial.value,
      file: uploadedFile.value,
      size: uploadedFile.value ? formatFileSize(uploadedFile.value.size) : selectedMaterial.value?.size
    }
    
    // Process topics from the input field
    if (newMaterial.value.topicsInput) {
      materialData.topics = newMaterial.value.topicsInput
        .split(',')
        .map(topic => topic.trim())
        .filter(Boolean)
    }
    
    if (selectedMaterial.value) {
      // Update existing material
      await materialsStore.updateMaterial(props.course.id, selectedMaterial.value.id, materialData)
      alert('Material updated successfully')
    } else {
      // Upload new material
      await materialsStore.uploadMaterial(props.course.id, materialData)
      alert('Material uploaded successfully')
    }
    
    // Close the modal and reset form
    closeAddMaterialModal()
  } catch (error) {
    console.error('Error uploading material:', error)
    alert('Failed to upload material: ' + (error.message || 'Unknown error'))
  } finally {
    isUploading.value = false
  }
}

async function generateMaterial() {
  try {
    isGenerating.value = true
    
    // Call the store method to generate AI materials
    const topics = [aiGenerate.value.topic]
    const result = await materialsStore.generateAIMaterials(props.course.id, topics)
    
    if (result && result.length > 0) {
      alert('AI-generated material created successfully!')
    } else {
      alert('Failed to generate material. Please try again.')
    }
    
    closeAIGenerateModal()
  } catch (error) {
    console.error('Error generating material:', error)
    alert('Failed to generate material: ' + (error.message || 'Unknown error'))
  } finally {
    isGenerating.value = false
  }
}

async function createQuizFromMaterial() {
  try {
    isGeneratingQuiz.value = true
    
    // In a real app, this would call an API to generate a quiz
    // For now, just simulate the process
    await new Promise(r => setTimeout(r, 1500))
    
    alert(`Quiz "${quizGenerate.value.title}" has been generated successfully!`)
    closeGenerateQuizModal()
    
    // Navigate to the Quizzes tab
    emit('changeTab', 'quizzes')
  } catch (error) {
    console.error('Error generating quiz:', error)
    alert('Failed to generate quiz: ' + (error.message || 'Unknown error'))
  } finally {
    isGeneratingQuiz.value = false
  }
}

// Modal controls
function closeAddMaterialModal() {
  showAddMaterialModal.value = false
  selectedMaterial.value = null
  newMaterial.value = {
    title: '',
    description: '',
    type: 'document',
    format: 'pdf',
    topicsInput: '',
    topics: []
  }
  uploadedFile.value = null
  
  // Reset file input
  const fileInputElement = document.getElementById('materialFile')
  if (fileInputElement) {
    fileInputElement.value = ''
  }
}

function closeAIGenerateModal() {
  showAIGenerateModal.value = false
  aiGenerate.value = {
    topic: '',
    type: '',
    format: 'pdf',
    level: 'intermediate',
    instructions: ''
  }
}

function closeGenerateQuizModal() {
  showGenerateQuizModal.value = false
  selectedMaterial.value = null
}

function closePreviewModal() {
  showPreviewModal.value = false
  selectedMaterial.value = null
}
</script>
<style scoped>
/* Base card and layout styles */
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

.card-header-with-action h3 i {
  margin-right: 8px;
  color: #ff784b;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* Buttons */
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
  gap: 6px;
}

.primary-button:hover {
  background-color: #3b5bdb;
}

.primary-button:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}

.secondary-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.secondary-button:hover {
  background-color: #f3f4f6;
}

.secondary-button:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.action-btn {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
}

/* Search and filters */
.materials-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-bar {
  display: flex;
  width: 100%;
  max-width: 400px;
}

.search-bar input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 6px 0 0 6px;
  outline: none;
  font-size: 14px;
}

.search-bar input:focus {
  border-color: #4C6EF5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.search-btn {
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 0 15px;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-options select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.filter-options select:focus {
  border-color: #4C6EF5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

/* Material categories */
.material-category {
  margin-bottom: 30px;
}

.category-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f4f6;
}

.category-header h4 {
  font-size: 18px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.category-header h4 i {
  color: #4C6EF5;
}

.category-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: normal;
}

/* Material items */
.material-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.material-item {
  display: flex;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  border: 1px solid #f3f4f6;
}

.material-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: white;
}

.material-item.ai-generated::after {
  content: 'AI';
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #4C6EF5;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
}

.material-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  border-radius: 8px;
  margin-right: 15px;
  flex-shrink: 0;
}

.material-icon i {
  font-size: 20px;
  color: #4b5563;
}

.material-info {
  flex: 1;
  min-width: 0;
}

.material-title {
  font-size: 16px;
  color: #111827;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.material-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
}

.material-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.material-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.topic-badge {
  background-color: #eef2ff;
  color: #4C6EF5;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.material-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 10px;
}

/* Dropdown menu */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  width: 150px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px 0;
  z-index: 10;
  display: none;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-menu a:hover {
  background-color: #f3f4f6;
}

.dropdown-menu a.delete-action {
  color: #ef4444;
}

.dropdown-menu a.delete-action:hover {
  background-color: #fef2f2;
}

/* Loading and empty states */
.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4C6EF5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  color: #e5e7eb;
  margin-bottom: 15px;
}

.empty-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.preview-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-header h3 i {
  color: #4C6EF5;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.preview-body {
  padding: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
}

/* Form styles */
.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4C6EF5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.file-upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-upload-box {
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  padding: 30px 20px;
  text-align: center;
  color: #6b7280;
  cursor: pointer;
  transition: border-color 0.2s;
}

.file-upload-box:hover {
  border-color: #4C6EF5;
}

.file-upload-box i {
  font-size: 24px;
  margin-bottom: 10px;
  color: #4C6EF5;
}

.file-name {
  margin-top: 10px;
  font-weight: 500;
  color: #111827;
}

.file-formats-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.level-selector {
  display: flex;
  gap: 15px;
}

.level-option {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 8px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.multi-select {
  height: 100px;
}

.preview-option {
  margin-top: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Preview modal styles */
.selected-material {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.selected-material-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #111827;
}

.selected-material-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.preview-container {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

/* PDF Preview styles */
.pdf-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.page-navigation,
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn,
.zoom-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pdf-content {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.mock-pdf-page {
  width: 100%;
  max-width: 700px;
  min-height: 500px;
  padding: 40px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.mock-pdf-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.mock-pdf-header h4 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.mock-page-number {
  color: #6b7280;
  font-size: 14px;
}

.mock-pdf-content {
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.mock-pdf-image {
  width: 100%;
  height: 200px;
  background-color: #f3f4f6;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border-radius: 4px;
}

.mock-pdf-image::after {
  content: 'Example image';
}

/* Document Preview */
.doc-container {
  padding: 20px;
}

.doc-content {
  padding: 20px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.doc-content h4 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #111827;
}

.doc-metadata {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 4px;
  font-size: 14px;
}

.doc-metadata p {
  margin: 5px 0;
  color: #4b5563;
}

.doc-preview-content {
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

/* Media Preview */
.media-container {
  padding: 20px;
}

.video-container,
.audio-container {
  margin-bottom: 20px;
}

.mock-video {
  width: 100%;
  background-color: #000;
  border-radius: 6px;
  overflow: hidden;
}

.mock-video-screen {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-video-screen i {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.mock-video-controls {
  background-color: #111;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mock-timeline {
  height: 4px;
  background-color: #333;
  border-radius: 2px;
  position: relative;
}

.mock-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 30%;
  height: 100%;
  background-color: #4C6EF5;
  border-radius: 2px;
}

.mock-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
  font-size: 12px;
}

.mock-buttons button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.mock-audio {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.mock-audio-title {
  padding: 10px 15px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mock-audio-controls {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.media-info {
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.media-info h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #111827;
}

.media-info p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #4b5563;
}

.topic-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

/* Unsupported Preview */
.unsupported-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
}

.unsupported-icon {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 20px;
}

.unsupported-preview p {
  margin: 0 0 10px 0;
  color: #4b5563;
}

/* Responsive styles */
@media (max-width: 768px) {
  .materials-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
  }
  
  .filter-options {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-options select {
    flex: 1;
  }
  
  .material-items {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .level-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .card-header-with-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .material-item {
    flex-direction: column;
  }
  
  .material-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .material-actions {
    flex-direction: row;
    margin-left: 0;
    margin-top: 10px;
  }
  
  .selected-material {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>