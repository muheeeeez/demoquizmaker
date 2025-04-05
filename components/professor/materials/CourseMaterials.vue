<template>
  <div class="course-materials-container">
    <div class="materials-header">
      <h2 class="materials-title">Course Materials</h2>
      <div class="header-actions">
        <button class="upload-button" @click="showUploader = true">
          <i class="fas fa-upload"></i> Upload Materials
        </button>
      </div>
    </div>
    
    <div class="materials-content">
      <!-- Material Uploader -->
      <MaterialUploader 
        v-if="showUploader" 
        :courseId="courseId" 
        @close="showUploader = false"
        @upload-complete="handleUploadComplete"
      />
      
      <!-- Material List -->
      <MaterialList 
        :courseId="courseId"
        :materials="materials"
        @select="openMaterialDetails"
        @download="downloadMaterial"
        @edit="openMaterialEdit"
        @delete="deleteMaterial"
      />
    </div>
    
    <!-- Material Details Modal -->
    <MaterialDetailsModal
      v-if="selectedMaterial"
      :material="selectedMaterial"
      :isOpen="showDetailsModal"
      @close="closeDetailsModal"
      @download="downloadMaterial"
      @edit="openMaterialEdit"
    />
    
    <!-- Material Edit Modal -->
    <MaterialEditModal
      v-if="editingMaterial"
      :material="editingMaterial"
      :isOpen="showEditModal"
      @close="closeEditModal"
      @save="saveMaterial"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MaterialUploader from './MaterialUploader.vue'
import MaterialList from './MaterialList.vue'
import MaterialDetailsModal from './MaterialDetailsModal.vue'
import MaterialEditModal from './MaterialEditModal.vue'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  }
})

// State for materials and UI
const materials = ref([])
const isLoading = ref(true)
const showUploader = ref(false)
const selectedMaterial = ref(null)
const showDetailsModal = ref(false)
const editingMaterial = ref(null)
const showEditModal = ref(false)

// Fetch materials when component is mounted
onMounted(() => {
  fetchMaterials()
})

// Fetch course materials
async function fetchMaterials() {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    materials.value = [
      {
        id: 1,
        name: 'Course Syllabus.pdf',
        type: 'document',
        mimeType: 'application/pdf',
        size: 1248576,
        uploadDate: '2023-07-10T14:30:00Z',
        modifiedDate: '2023-07-15T09:15:00Z',
        tags: ['syllabus', 'overview', 'important'],
        description: 'Complete course syllabus including topics, schedule, and grading criteria.',
        visibility: 'public',
        url: '#',
        stats: {
          views: 124,
          downloads: 87,
          lastViewed: '2023-08-02T11:45:00Z'
        }
      },
      {
        id: 2,
        name: 'Week 1 Lecture Slides.pptx',
        type: 'presentation',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        size: 3542784,
        uploadDate: '2023-07-12T10:20:00Z',
        tags: ['lecture', 'week1', 'slides'],
        visibility: 'students',
        url: '#',
        stats: {
          views: 98,
          downloads: 76,
          lastViewed: '2023-08-01T14:25:00Z'
        }
      },
      {
        id: 3,
        name: 'Introduction Video.mp4',
        type: 'video',
        mimeType: 'video/mp4',
        size: 25786284,
        uploadDate: '2023-07-14T15:45:00Z',
        description: 'Course introduction video covering main concepts and learning objectives.',
        visibility: 'public',
        url: '#',
        stats: {
          views: 112,
          downloads: 42,
          lastViewed: '2023-08-03T09:10:00Z'
        }
      },
      {
        id: 4,
        name: 'Course Schedule.docx',
        type: 'document',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 852441,
        uploadDate: '2023-07-08T11:30:00Z',
        modifiedDate: '2023-07-20T13:25:00Z',
        tags: ['schedule', 'important'],
        visibility: 'public',
        url: '#',
        stats: {
          views: 143,
          downloads: 105,
          lastViewed: '2023-08-04T10:30:00Z'
        }
      }
    ]
  } catch (error) {
    console.error('Error fetching materials:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle upload completion
function handleUploadComplete(uploadedMaterials) {
  // In a real app, we might fetch the materials again from the server
  // or add the new materials to the existing array
  materials.value = [...uploadedMaterials, ...materials.value]
  showUploader.value = false
}

// Open material details modal
function openMaterialDetails(material) {
  selectedMaterial.value = material
  showDetailsModal.value = true
}

// Close material details modal
function closeDetailsModal() {
  showDetailsModal.value = false
  setTimeout(() => {
    selectedMaterial.value = null
  }, 300) // Small delay to allow for closing animation
}

// Download a material
function downloadMaterial(material) {
  // In a real app, this would trigger a download
  console.log(`Downloading material: ${material.name}`)
  
  // Simulate download
  const link = document.createElement('a')
  link.href = material.url || '#'
  link.download = material.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Update stats in our local data
  const materialIndex = materials.value.findIndex(m => m.id === material.id)
  if (materialIndex !== -1) {
    const updatedMaterial = { ...materials.value[materialIndex] }
    if (!updatedMaterial.stats) {
      updatedMaterial.stats = { views: 0, downloads: 0 }
    }
    updatedMaterial.stats.downloads = (updatedMaterial.stats.downloads || 0) + 1
    materials.value[materialIndex] = updatedMaterial
  }
}

// Open material edit modal
function openMaterialEdit(material) {
  editingMaterial.value = material
  showEditModal.value = true
}

// Close material edit modal
function closeEditModal() {
  showEditModal.value = false
  setTimeout(() => {
    editingMaterial.value = null
  }, 300) // Small delay to allow for closing animation
}

// Save material changes
function saveMaterial(updatedMaterial) {
  // In a real app, this would send data to the server
  console.log('Saving material:', updatedMaterial)
  
  // Update material in our local array
  const index = materials.value.findIndex(m => m.id === updatedMaterial.id)
  if (index !== -1) {
    materials.value[index] = updatedMaterial
  }
  
  // Close the edit modal
  closeEditModal()
}

// Delete a material
function deleteMaterial(material) {
  // In a real app, this would send a delete request to the server
  console.log(`Deleting material: ${material.name}`)
  
  // Remove material from our local array
  materials.value = materials.value.filter(m => m.id !== material.id)
  
  // If the material is currently being viewed or edited, close those modals
  if (selectedMaterial.value && selectedMaterial.value.id === material.id) {
    closeDetailsModal()
  }
  
  if (editingMaterial.value && editingMaterial.value.id === material.id) {
    closeEditModal()
  }
}
</script>

<style scoped>
.course-materials-container {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.materials-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.materials-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  position: relative;
  padding-left: 14px;
}

.materials-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background-color: #4C6EF5;
  border-radius: 4px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(76, 110, 245, 0.2);
}

.upload-button:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 110, 245, 0.3);
}

.upload-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(76, 110, 245, 0.2);
}

.upload-button i {
  font-size: 16px;
}

.materials-content {
  background-color: #f9fafb;
  border-radius: 16px;
  height: calc(100% - 60px);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

@media (max-width: 768px) {
  .materials-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .materials-title {
    font-size: 1.5rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .upload-button {
    flex: 1;
    justify-content: center;
  }
}
</style> 