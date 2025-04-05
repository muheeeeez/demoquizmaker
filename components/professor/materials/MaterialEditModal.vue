<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Edit Material</h3>
        <button class="close-button" @click="closeModal" title="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-content">
        <form @submit.prevent="saveMaterial" class="edit-form">
          <div class="form-group">
            <label for="material-name" class="form-label">Name</label>
            <input 
              type="text" 
              id="material-name" 
              v-model="editedMaterial.name" 
              class="form-input" 
              placeholder="Enter material name"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="material-description" class="form-label">Description</label>
            <textarea 
              id="material-description" 
              v-model="editedMaterial.description" 
              class="form-textarea" 
              placeholder="Enter description (optional)"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Tags</label>
            <div class="tags-input-container">
              <div class="tags-list">
                <div 
                  v-for="(tag, index) in editedMaterial.tags" 
                  :key="index" 
                  class="tag-item"
                >
                  <span class="tag-text">{{ tag }}</span>
                  <button 
                    type="button" 
                    class="tag-remove" 
                    @click="removeTag(index)" 
                    title="Remove tag"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div class="tag-input-wrapper">
                <input 
                  type="text" 
                  v-model="newTag" 
                  @keydown.enter.prevent="addTag"
                  @keydown.tab.prevent="addTag"
                  @keydown="handleKeydown"
                  placeholder="Add a tag and press Enter"
                  class="tag-input"
                  ref="tagInput"
                >
                <button 
                  type="button" 
                  class="tag-add-button" 
                  @click="addTag" 
                  title="Add tag"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
            <p class="form-help">Press Enter, Tab or comma to add a tag</p>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="material-type" class="form-label">Type</label>
              <select id="material-type" v-model="editedMaterial.type" class="form-select">
                <option value="document">Document</option>
                <option value="presentation">Presentation</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
            </div>
            
            <div class="form-group half">
              <label for="material-visibility" class="form-label">Visibility</label>
              <select id="material-visibility" v-model="editedMaterial.visibility" class="form-select">
                <option value="public">Public</option>
                <option value="students">Students Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Available From</label>
            <div class="form-row">
              <div class="form-group date-group">
                <input 
                  type="date" 
                  v-model="editedMaterial.availableFrom" 
                  class="form-input date-input"
                >
              </div>
              
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="editedMaterial.isAlwaysAvailable"
                    @change="handleAlwaysAvailableChange"
                  >
                  <span>Always available</span>
                </label>
              </div>
            </div>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">Cancel</button>
        <button 
          class="btn-save" 
          @click="saveMaterial" 
          :disabled="isSaving"
        >
          <span v-if="isSaving">
            <i class="fas fa-spinner fa-spin"></i> Saving...
          </span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue'

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

const emit = defineEmits(['close', 'save'])

const editedMaterial = reactive({
  id: '',
  name: '',
  description: '',
  tags: [],
  type: 'document',
  visibility: 'public',
  availableFrom: '',
  isAlwaysAvailable: true
})

const newTag = ref('')
const errorMessage = ref('')
const isSaving = ref(false)
const tagInput = ref(null)

// Initialize form with material data when opened
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.material) {
    initializeForm()
  }
}, { immediate: true })

// Initialize the form with the material data
function initializeForm() {
  const material = props.material
  
  editedMaterial.id = material.id
  editedMaterial.name = material.name || ''
  editedMaterial.description = material.description || ''
  editedMaterial.tags = material.tags ? [...material.tags] : []
  editedMaterial.type = material.type || 'document'
  editedMaterial.visibility = material.visibility || 'public'
  
  // Set availability
  if (material.availableFrom) {
    editedMaterial.availableFrom = formatDateForInput(material.availableFrom)
    editedMaterial.isAlwaysAvailable = false
  } else {
    editedMaterial.availableFrom = formatDateForInput(new Date())
    editedMaterial.isAlwaysAvailable = true
  }
  
  errorMessage.value = ''
}

// Format date for input element
function formatDateForInput(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Handle always available change
function handleAlwaysAvailableChange() {
  if (editedMaterial.isAlwaysAvailable) {
    editedMaterial.availableFrom = ''
  } else if (!editedMaterial.availableFrom) {
    editedMaterial.availableFrom = formatDateForInput(new Date())
  }
}

// Add a tag
function addTag() {
  const tag = newTag.value.trim()
  
  if (!tag) return
  
  // Check if tag already exists
  if (!editedMaterial.tags.includes(tag)) {
    editedMaterial.tags.push(tag)
  }
  
  newTag.value = ''
  
  // Focus the input again
  nextTick(() => {
    if (tagInput.value) {
      tagInput.value.focus()
    }
  })
}

// Handle keydown events
function handleKeydown(event) {
  // Check if the key is a comma
  if (event.key === ',') {
    event.preventDefault()
    addTag()
  }
}

// Remove a tag
function removeTag(index) {
  editedMaterial.tags.splice(index, 1)
}

// Close the modal
function closeModal() {
  emit('close')
}

// Save material changes
function saveMaterial() {
  // Validate form
  if (!editedMaterial.name) {
    errorMessage.value = 'Material name is required'
    return
  }
  
  isSaving.value = true
  
  // Prepare final data for saving
  const materialToSave = {
    ...editedMaterial,
    availableFrom: editedMaterial.isAlwaysAvailable ? null : editedMaterial.availableFrom,
    modifiedDate: new Date().toISOString()
  }
  
  // Simulate API call
  setTimeout(() => {
    isSaving.value = false
    emit('save', materialToSave)
    closeModal()
  }, 1000)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.half {
  flex: 1;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.form-input, .form-select, .form-textarea {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #4C6EF5;
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-help {
  font-size: 12px;
  color: #6b7280;
  margin: 2px 0 0 0;
}

.tags-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px;
}

.tag-input-wrapper {
  display: flex;
  gap: 8px;
}

.tag-input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
}

.tag-input:focus {
  border-color: #4C6EF5;
  outline: none;
}

.tag-add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-add-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f3f4f6;
  border-radius: 16px;
  padding: 4px 8px 4px 12px;
  font-size: 12px;
  color: #4b5563;
}

.tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 10px;
}

.tag-remove:hover {
  background-color: #d1d5db;
  color: #1f2937;
}

.date-group {
  flex: 1;
}

.date-input {
  width: 100%;
}

.checkbox-group {
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.error-message {
  padding: 10px;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 6px;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel, .btn-save {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-save {
  background-color: #4C6EF5;
  color: white;
  border: 1px solid #4C6EF5;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-save:hover:not(:disabled) {
  background-color: #4338ca;
  border-color: #4338ca;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 