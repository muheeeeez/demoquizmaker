<template>
  <div class="uploader-container">
    <div v-if="!isUploading && !isProcessing" class="upload-dropzone" 
      @dragover.prevent="onDragOver" 
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      :class="{ 'dragging': isDragging }"
    >
      <input
        type="file"
        id="fileInput"
        ref="fileInput"
        multiple
        @change="onFileSelected"
        class="file-input"
      />
      
      <div class="upload-prompt">
        <div class="upload-icon">
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <h4>Upload Course Materials</h4>
        <p>Drag and drop files here, or click to browse</p>
        <button class="browse-button" @click="triggerFileInput">
          <i class="fas fa-folder-open"></i> Browse Files
        </button>
        <div class="file-types">
          <span>Accepted files: PDF, DOCX, PPTX, MP4, JPG, PNG</span>
        </div>
      </div>
    </div>
    
    <div v-if="isUploading" class="upload-progress">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <div class="progress-details">
        <div class="progress-text">
          <span>Uploading {{ selectedFiles.length }} file(s)</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div class="file-details">
          <span>{{ formatFileSize(uploadedBytes) }} of {{ formatFileSize(totalBytes) }}</span>
        </div>
      </div>
      <button class="cancel-button" @click="cancelUpload">
        <i class="fas fa-times"></i> Cancel
      </button>
    </div>
    
    <div v-if="isProcessing" class="processing-state">
      <div class="processing-animation">
        <i class="fas fa-cog fa-spin"></i>
      </div>
      <h4>Processing Files</h4>
      <p>Your files are being processed. This may take a few moments.</p>
    </div>
    
    <div v-if="selectedFiles.length > 0 && !isUploading && !isProcessing" class="selected-files">
      <h4>Selected Files ({{ selectedFiles.length }})</h4>
      
      <div class="file-list">
        <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
          <div class="file-icon">
            <i :class="getFileIcon(file.type)"></i>
          </div>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-meta">{{ formatFileSize(file.size) }}</div>
          </div>
          <button class="remove-file" @click="removeFile(index)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="file-actions">
        <button class="secondary-button" @click="clearFiles">
          <i class="fas fa-trash"></i> Clear All
        </button>
        <button class="primary-button" @click="uploadFiles">
          <i class="fas fa-upload"></i> Upload {{ selectedFiles.length }} Files
        </button>
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
  }
})

const emit = defineEmits(['upload-complete', 'upload-error'])

const fileInput = ref(null)
const selectedFiles = ref([])
const isDragging = ref(false)
const isUploading = ref(false)
const isProcessing = ref(false)
const uploadProgress = ref(0)
const uploadedBytes = ref(0)
const totalBytes = ref(0)

// Trigger file input click
function triggerFileInput() {
  fileInput.value.click()
}

// Handle drag over event
function onDragOver(e) {
  isDragging.value = true
}

// Handle file drop
function onDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

// Handle file selection
function onFileSelected(e) {
  const files = Array.from(e.target.files)
  addFiles(files)
}

// Add files to selected files array
function addFiles(files) {
  for (const file of files) {
    if (isValidFile(file)) {
      selectedFiles.value.push(file)
    } else {
      // Alert user about invalid file
      alert(`Invalid file type: ${file.name}. Please upload PDF, DOCX, PPTX, MP4, JPG, or PNG files.`)
    }
  }
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Check if file is valid
function isValidFile(file) {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4',
    'image/jpeg',
    'image/png'
  ]
  
  return validTypes.includes(file.type)
}

// Remove file from selected files
function removeFile(index) {
  selectedFiles.value.splice(index, 1)
}

// Clear all selected files
function clearFiles() {
  selectedFiles.value = []
}

// Upload files
function uploadFiles() {
  if (selectedFiles.value.length === 0) return
  
  isUploading.value = true
  uploadProgress.value = 0
  uploadedBytes.value = 0
  totalBytes.value = selectedFiles.value.reduce((total, file) => total + file.size, 0)
  
  // Simulate upload progress
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 100) {
      const increment = Math.floor(Math.random() * 10) + 1
      uploadProgress.value = Math.min(uploadProgress.value + increment, 100)
      uploadedBytes.value = Math.floor((uploadProgress.value / 100) * totalBytes.value)
      
      if (uploadProgress.value >= 100) {
        clearInterval(progressInterval)
        
        // Simulate processing
        isUploading.value = false
        isProcessing.value = true
        
        setTimeout(() => {
          isProcessing.value = false
          
          // Mock uploaded files data
          const uploadedFiles = selectedFiles.value.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            size: file.size,
            type: getFileType(file.type),
            url: '#',
            uploadDate: new Date().toISOString()
          }))
          
          // Emit upload complete event
          emit('upload-complete', uploadedFiles)
          
          // Clear selected files
          selectedFiles.value = []
        }, 2000)
      }
    }
  }, 300)
}

// Cancel upload
function cancelUpload() {
  isUploading.value = false
  uploadProgress.value = 0
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file icon based on file type
function getFileIcon(fileType) {
  const iconMap = {
    'application/pdf': 'fas fa-file-pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fas fa-file-word',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fas fa-file-powerpoint',
    'video/mp4': 'fas fa-file-video',
    'image/jpeg': 'fas fa-file-image',
    'image/png': 'fas fa-file-image'
  }
  
  return iconMap[fileType] || 'fas fa-file'
}

// Get file type for API
function getFileType(mimeType) {
  const typeMap = {
    'application/pdf': 'document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
    'video/mp4': 'video',
    'image/jpeg': 'image',
    'image/png': 'image'
  }
  
  return typeMap[mimeType] || 'document'
}
</script>

<style scoped>
.uploader-container {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  overflow: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.upload-dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  cursor: pointer;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-dropzone:hover {
  border-color: #9ca3af;
  background-color: #f3f4f6;
}

.upload-dropzone.dragging {
  border-color: #4C6EF5;
  background-color: rgba(76, 110, 245, 0.05);
  box-shadow: 0 0 0 2px rgba(76, 110, 245, 0.1);
  transform: scale(1.01);
}

.file-input {
  display: none;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
}

.upload-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(76, 110, 245, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #4C6EF5;
  font-size: 32px;
  position: relative;
  overflow: hidden;
}

.upload-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  transform: translateY(100%);
  transition: transform 0.5s ease;
}

.upload-dropzone:hover .upload-icon::after {
  transform: translateY(0);
}

.upload-prompt h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.upload-prompt p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.browse-button {
  padding: 12px 24px;
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(76, 110, 245, 0.2);
}

.browse-button:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 110, 245, 0.3);
}

.browse-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(76, 110, 245, 0.2);
}

.file-types {
  margin-top: 16px;
  font-size: 14px;
  color: #9ca3af;
}

.upload-progress {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease-out;
}

.progress-bar-container {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, #4C6EF5, #7C3AED);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.file-details {
  font-size: 13px;
  color: #6b7280;
}

.cancel-button {
  padding: 8px 16px;
  background-color: white;
  color: #ef4444;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
}

.cancel-button:hover {
  background-color: #fee2e2;
}

.processing-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  animation: fadeIn 0.3s ease-out;
}

.processing-animation {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(76, 110, 245, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #4C6EF5;
  font-size: 32px;
}

.processing-animation i {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.processing-state h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.processing-state p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  max-width: 400px;
}

.selected-files {
  animation: fadeIn 0.3s ease-out;
}

.selected-files h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-files h4::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
  margin-left: 8px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.file-list::-webkit-scrollbar {
  width: 6px;
}

.file-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.file-list::-webkit-scrollbar-thumb {
  background: #c5c7d0;
  border-radius: 10px;
}

.file-list::-webkit-scrollbar-thumb:hover {
  background: #a8aab8;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.file-item:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  background-color: #4C6EF5;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  font-size: 12px;
  color: #6b7280;
}

.remove-file {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  font-size: 12px;
}

.remove-file:hover {
  background-color: #fee2e2;
  color: #ef4444;
  border-color: #fca5a5;
}

.file-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary-button, .primary-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.secondary-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.primary-button {
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
  box-shadow: 0 2px 5px rgba(76, 110, 245, 0.2);
}

.primary-button:hover {
  background-color: #4338ca;
  border-color: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 110, 245, 0.3);
}

.primary-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(76, 110, 245, 0.2);
}

@media (max-width: 640px) {
  .uploader-container {
    padding: 16px;
  }
  
  .upload-dropzone {
    padding: 30px 15px;
  }
  
  .upload-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .upload-prompt h4 {
    font-size: 18px;
  }
  
  .upload-prompt p {
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .browse-button {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .file-actions {
    flex-direction: column;
  }
  
  .secondary-button, .primary-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 