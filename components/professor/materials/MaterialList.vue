<template>
  <div class="materials-list-container">
    <div class="list-header">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search materials..." 
            @input="filterMaterials"
          >
        </div>
        <div class="filter-dropdown">
          <select v-model="selectedType" @change="filterMaterials">
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="presentation">Presentations</option>
            <option value="video">Videos</option>
            <option value="image">Images</option>
          </select>
        </div>
      </div>
      <div class="view-options">
        <button 
          :class="['view-option', { active: viewMode === 'grid' }]" 
          @click="viewMode = 'grid'"
          title="Grid View"
        >
          <i class="fas fa-th-large"></i>
        </button>
        <button 
          :class="['view-option', { active: viewMode === 'list' }]" 
          @click="viewMode = 'list'"
          title="List View"
        >
          <i class="fas fa-list"></i>
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading materials...</p>
    </div>
    
    <div v-else-if="filteredMaterials.length === 0" class="empty-state">
      <i class="fas fa-file-alt empty-icon"></i>
      <p v-if="searchTerm || selectedType !== 'all'">No materials match your search criteria.</p>
      <p v-else>No materials have been uploaded for this course yet.</p>
    </div>
    
    <div v-else :class="['materials-grid', { 'list-view': viewMode === 'list' }]">
      <div 
        v-for="material in filteredMaterials" 
        :key="material.id" 
        class="material-card"
        @click="selectMaterial(material)"
      >
        <div class="material-icon" :class="getTypeClass(material.type)">
          <i :class="getTypeIcon(material.type)"></i>
        </div>
        <div class="material-info">
          <div class="material-name">{{ material.name }}</div>
          <div class="material-meta">
            <span>{{ formatFileSize(material.size) }}</span>
            <span class="dot-separator">•</span>
            <span>{{ formatDate(material.uploadDate) }}</span>
          </div>
          <div class="material-tags" v-if="material.tags && material.tags.length > 0">
            <span v-for="(tag, index) in material.tags" :key="index" class="material-tag">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="material-actions">
          <button class="action-button" title="Download" @click.stop="downloadMaterial(material)">
            <i class="fas fa-download"></i>
          </button>
          <button class="action-button" title="Edit" @click.stop="editMaterial(material)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-button delete" title="Delete" @click.stop="deleteMaterial(material)">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  },
  materials: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'download', 'edit', 'delete'])

const isLoading = ref(false)
const searchTerm = ref('')
const selectedType = ref('all')
const viewMode = ref('grid')
const filteredMaterials = ref([])

// Initialize with materials
onMounted(() => {
  if (props.materials.length > 0) {
    filterMaterials()
  } else {
    isLoading.value = true
    // Simulate API call delay
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }
})

// Watch for changes in materials
watch(() => props.materials, (newMaterials) => {
  if (newMaterials.length > 0) {
    filterMaterials()
  }
}, { deep: true })

// Filter materials based on search and type
function filterMaterials() {
  if (props.materials.length === 0) {
    filteredMaterials.value = []
    return
  }
  
  let filtered = [...props.materials]
  
  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(material => 
      material.name.toLowerCase().includes(term) || 
      (material.tags && material.tags.some(tag => tag.toLowerCase().includes(term)))
    )
  }
  
  // Filter by type
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(material => material.type === selectedType.value)
  }
  
  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
  
  filteredMaterials.value = filtered
}

// Select a material
function selectMaterial(material) {
  emit('select', material)
}

// Download a material
function downloadMaterial(material) {
  emit('download', material)
}

// Edit a material
function editMaterial(material) {
  emit('edit', material)
}

// Delete a material
function deleteMaterial(material) {
  if (confirm(`Are you sure you want to delete "${material.name}"?`)) {
    emit('delete', material)
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
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

// Get class for material type (for colors)
function getTypeClass(type) {
  return `type-${type}`
}
</script>

<style scoped>
.materials-list-container {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 15px;
  background-color: #f9fafb;
}

.search-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: white;
}

.search-box input:focus {
  outline: none;
  border-color: #4C6EF5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.filter-dropdown select {
  padding: 10px 32px 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background-color: white;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-dropdown select:focus {
  outline: none;
  border-color: #4C6EF5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.view-options {
  display: flex;
  gap: 6px;
}

.view-option {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.view-option:hover {
  background-color: #f3f4f6;
}

.view-option.active {
  background-color: #4C6EF5;
  color: white;
  border-color: #4C6EF5;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  flex: 1;
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

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state p {
  color: #6b7280;
  font-size: 16px;
  max-width: 300px;
  line-height: 1.5;
}

.materials-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  overflow-y: auto;
  flex: 1;
}

.materials-grid.list-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.material-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  position: relative;
  transform-origin: center;
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

.material-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  border-color: #e5e7eb;
}

.list-view .material-card {
  flex-direction: row;
  align-items: center;
  padding: 12px;
  gap: 16px;
}

.material-icon {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  background-color: #4C6EF5;
  position: relative;
  overflow: hidden;
}

.material-icon::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  top: -25%;
  left: -25%;
}

.list-view .material-icon {
  height: 60px;
  width: 60px;
  min-width: 60px;
  border-radius: 8px;
  font-size: 24px;
}

.type-document {
  background-color: #4C6EF5;
}

.type-presentation {
  background-color: #F59E0B;
}

.type-video {
  background-color: #EC4899;
}

.type-image {
  background-color: #10B981;
}

.material-info {
  padding: 16px;
  flex: 1;
  min-width: 0;
}

.list-view .material-info {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.material-name {
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.material-meta {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 12px;
}

.dot-separator {
  margin: 0 8px;
}

.material-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.material-tag {
  font-size: 12px;
  padding: 3px 8px;
  background-color: #EEF2FF;
  color: #4F46E5;
  border-radius: 16px;
  white-space: nowrap;
}

.material-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-top: 1px solid #f0f0f0;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.2s ease;
}

.material-card:hover .material-actions {
  opacity: 1;
  transform: translateY(0);
}

.list-view .material-actions {
  padding: 0;
  background-color: transparent;
  border-top: none;
  margin-left: auto;
}

.action-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.action-button.delete:hover {
  background-color: #FEE2E2;
  border-color: #FCA5A5;
  color: #DC2626;
}

/* For animation groups when filtering */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .materials-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    padding: 16px;
  }
  
  .list-header {
    padding: 16px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .materials-grid {
    grid-template-columns: 1fr;
  }
  
  .list-view .material-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .list-view .material-icon {
    width: 100%;
    height: 120px;
  }
  
  .list-view .material-info {
    padding: 16px;
    width: 100%;
  }
  
  .list-view .material-actions {
    padding: 12px 16px;
    background-color: #f9fafb;
    border-top: 1px solid #f0f0f0;
    width: 100%;
    justify-content: center;
  }
}
</style> 