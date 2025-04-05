<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ material.name }}</h3>
        <button class="close-button" @click="closeModal" title="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-content">
        <div class="material-preview">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading preview...</p>
          </div>
          <div v-else-if="canPreview" class="preview-container">
            <!-- PDF Preview -->
            <iframe v-if="material.type === 'document' && material.mimeType === 'application/pdf'" 
                   :src="previewUrl" 
                   class="preview-frame"
                   title="PDF Preview">
            </iframe>
            
            <!-- Image Preview -->
            <img v-else-if="material.type === 'image'" 
                 :src="previewUrl" 
                 alt="Image Preview" 
                 class="preview-image">
            
            <!-- Video Preview -->
            <video v-else-if="material.type === 'video'" 
                   controls 
                   class="preview-video">
              <source :src="previewUrl" :type="material.mimeType">
              Your browser does not support video playback.
            </video>
            
            <!-- Default Preview (not supported) -->
            <div v-else class="no-preview">
              <i :class="getTypeIcon(material.type)"></i>
              <p>Preview not available for this file type</p>
            </div>
          </div>
          <div v-else class="no-preview">
            <i :class="getTypeIcon(material.type)"></i>
            <p>Preview not available</p>
          </div>
        </div>
        
        <div class="material-details">
          <div class="detail-section">
            <h4>File Information</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Type</span>
                <span class="detail-value">{{ material.mimeType || getTypeLabel(material.type) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Size</span>
                <span class="detail-value">{{ formatFileSize(material.size) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Uploaded</span>
                <span class="detail-value">{{ formatDate(material.uploadDate) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Last Modified</span>
                <span class="detail-value">{{ formatDate(material.modifiedDate || material.uploadDate) }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Metadata</h4>
            <div class="tags-section" v-if="material.tags && material.tags.length > 0">
              <span class="detail-label">Tags</span>
              <div class="tags-list">
                <span v-for="(tag, index) in material.tags" :key="index" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div class="description-section" v-if="material.description">
              <span class="detail-label">Description</span>
              <p class="description-text">{{ material.description }}</p>
            </div>
            
            <div class="empty-metadata" v-if="(!material.tags || material.tags.length === 0) && !material.description">
              <p>No metadata available</p>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Usage Statistics</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Views</span>
                <span class="detail-value">{{ material.stats?.views || 0 }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Downloads</span>
                <span class="detail-value">{{ material.stats?.downloads || 0 }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Last Viewed</span>
                <span class="detail-value">{{ material.stats?.lastViewed ? formatDate(material.stats.lastViewed) : 'Never' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <div class="button-group">
          <button class="action-button secondary" @click="downloadMaterial">
            <i class="fas fa-download"></i> Download
          </button>
          <button class="action-button primary" @click="editMaterial">
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  material: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'download', 'edit'])

const isLoading = ref(true)
const previewUrl = ref('')

// Determine if we can preview this file type
const canPreview = computed(() => {
  if (!props.material) return false
  
  const type = props.material.type
  const mimeType = props.material.mimeType
  
  return (
    type === 'image' || 
    type === 'video' || 
    (type === 'document' && mimeType === 'application/pdf')
  )
})

// Watch for changes in the material
watch(() => props.material, (newMaterial) => {
  if (newMaterial && props.isOpen) {
    loadPreview()
  }
}, { immediate: true })

// Watch for modal opening
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.material) {
    loadPreview()
  }
})

// Load the preview content
function loadPreview() {
  if (!canPreview.value) {
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  
  // In a real app, this would be a URL to the actual file
  // For now, we'll simulate a delay and then set a placeholder URL
  setTimeout(() => {
    if (props.material) {
      // This would be a real URL in production
      previewUrl.value = props.material.url || '#'
      isLoading.value = false
    }
  }, 1000)
}

// Close the modal
function closeModal() {
  emit('close')
}

// Download the material
function downloadMaterial() {
  emit('download', props.material)
}

// Edit the material
function editMaterial() {
  emit('edit', props.material)
}

// Get icon class for material type
function getTypeIcon(type) {
  const icons = {
    'document': 'fas fa-file-alt',
    'presentation': 'fas fa-file-powerpoint',
    'video': 'fas fa-file-video',
    'image': 'fas fa-file-image'
  }
  
  return icons[type] || 'fas fa-file'
}

// Get readable label for material type
function getTypeLabel(type) {
  const labels = {
    'document': 'Document',
    'presentation': 'Presentation',
    'video': 'Video',
    'image': 'Image'
  }
  
  return labels[type] || 'File'
}

// Format file size
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;
}

.close-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.modal-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
}

@media (min-width: 768px) {
  .modal-content {
    flex-direction: row;
  }
}

.material-preview {
  flex: 1.5;
  background-color: #f3f4f6;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  height: 100%;
  overflow: hidden;
  border-bottom: 1px solid #e5e7eb;
}

@media (min-width: 768px) {
  .material-preview {
    border-right: 1px solid #e5e7eb;
    border-bottom: none;
  }
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-frame {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: none;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.preview-video {
  width: 100%;
  max-height: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.no-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #9ca3af;
}

.no-preview i {
  font-size: 64px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.no-preview p {
  font-size: 16px;
  max-width: 240px;
  line-height: 1.5;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.spinner {
  border: 3px solid rgba(76, 110, 245, 0.1);
  border-radius: 50%;
  border-top: 3px solid #4C6EF5;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.material-details {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: white;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.detail-section h4::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background-color: #4C6EF5;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 13px;
  color: #6b7280;
}

.detail-value {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
}

.tags-section, .description-section {
  margin-bottom: 20px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  font-size: 12px;
  padding: 4px 10px;
  background-color: #EEF2FF;
  color: #4F46E5;
  border-radius: 16px;
  transition: all 0.2s;
}

.tag:hover {
  background-color: #E0E7FF;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  margin: 8px 0 0 0;
  white-space: pre-line;
}

.empty-metadata {
  padding: 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.modal-footer {
  padding: 16px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-button {
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

.action-button i {
  font-size: 16px;
}

.action-button.secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.action-button.secondary:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.action-button.primary {
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
}

.action-button.primary:hover {
  background-color: #4338ca;
  border-color: #4338ca;
}

@media (max-width: 640px) {
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-content {
    max-height: calc(95vh - 140px);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
}
</style> 