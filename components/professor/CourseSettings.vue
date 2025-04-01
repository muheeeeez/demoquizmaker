<template>
  <div class="settings-tab">
    <div class="detail-card">
      <div class="card-header-with-action">
        <h3><i class="fas fa-cog"></i> Course Settings</h3>
      </div>

      <div class="settings-content">
        <!-- Course Information Section -->
        <div class="settings-section">
          <h4 class="section-title">Course Information</h4>
          <form @submit.prevent="updateCourse">
            <div class="form-group">
              <label for="courseCode">Course Code</label>
              <input 
                type="text" 
                id="courseCode" 
                v-model="updatedCourse.code" 
                placeholder="e.g., CS101" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="courseTitle">Course Title</label>
              <input 
                type="text" 
                id="courseTitle" 
                v-model="updatedCourse.title" 
                placeholder="e.g., Introduction to Computer Science" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="courseDescription">Description</label>
              <textarea 
                id="courseDescription" 
                v-model="updatedCourse.description" 
                placeholder="Enter course description..." 
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Course Color</label>
              <div class="color-options">
                <div 
                  v-for="color in courseColors" 
                  :key="color"
                  class="color-option"
                  :class="{ active: updatedCourse.color === color }"
                  :style="{ backgroundColor: color }"
                  @click="updatedCourse.color = color"
                ></div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="primary-button" :disabled="isUpdating">
                <i class="fas fa-save"></i>
                {{ isUpdating ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
        
        <!-- Access Code Section -->
        <div class="settings-section">
          <h4 class="section-title">Student Access Code</h4>
          <div class="access-code-container">
            <div class="access-code-display">
              <p class="access-code-label">Current Access Code:</p>
              <div class="access-code">
                <span>{{ accessCode }}</span>
                <button 
                  class="copy-button" 
                  title="Copy to clipboard"
                  @click="copyAccessCode"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <p class="access-code-help">
                Students will need this code to join your course.
              </p>
            </div>
            
            <button 
              class="secondary-button regenerate-button" 
              @click="regenerateAccessCode"
              :disabled="isRegenerating"
            >
              <i class="fas fa-sync-alt"></i>
              {{ isRegenerating ? 'Regenerating...' : 'Regenerate Access Code' }}
            </button>
          </div>
        </div>
        
        <!-- Danger Zone Section -->
        <div class="settings-section danger-zone">
          <h4 class="section-title">Danger Zone</h4>
          <div class="danger-action">
            <div class="danger-info">
              <h5>Delete this course</h5>
              <p>
                Once you delete a course, there is no going back. Please be certain.
              </p>
            </div>
            <button 
              class="danger-button" 
              @click="confirmDeleteCourse"
            >
              Delete Course
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['regenerateAccessCode', 'updateCourse', 'deleteCourse']);

// Course data
const updatedCourse = ref({
  id: 0,
  code: '',
  title: '',
  description: '',
  color: '#4C6EF5'
});

// Access code
const accessCode = ref('');

// UI states
const isUpdating = ref(false);
const isRegenerating = ref(false);

// Colors for course customization
const courseColors = [
  '#4C6EF5', // Blue
  '#F03E3E', // Red
  '#40C057', // Green
  '#FAB005', // Yellow
  '#7950F2', // Purple
  '#12B886', // Teal
  '#FD7E14', // Orange
  '#1C7ED6', // Sky Blue
  '#7048E8', // Indigo
  '#F783AC'  // Pink
];

// Watch for course changes
watch(() => props.course, (newCourse) => {
  if (newCourse) {
    // Copy course data to avoid modifying the original
    updatedCourse.value = {
      id: newCourse.id,
      code: newCourse.code,
      title: newCourse.title,
      description: newCourse.description || '',
      color: newCourse.color
    };
    
    // Set access code
    accessCode.value = newCourse.accessCode || '';
  }
}, { immediate: true, deep: true });

// Methods
const updateCourse = async () => {
  isUpdating.value = true;
  
  try {
    // Emit update event to parent
    await emit('updateCourse', { ...updatedCourse.value });
    
    // Show success message
    alert('Course updated successfully!');
  } catch (error) {
    console.error('Error updating course:', error);
    alert('Failed to update course. Please try again.');
  } finally {
    isUpdating.value = false;
  }
};

const regenerateAccessCode = async () => {
  isRegenerating.value = true;
  
  try {
    // Emit regenerate event to parent
    const newCode = await emit('regenerateAccessCode', props.course.id);
    
    // Update local access code if a new one is returned
    if (newCode) {
      accessCode.value = newCode;
    }
  } catch (error) {
    console.error('Error regenerating access code:', error);
    alert('Failed to regenerate access code. Please try again.');
  } finally {
    isRegenerating.value = false;
  }
};

const copyAccessCode = () => {
  // Copy the access code to clipboard
  navigator.clipboard.writeText(accessCode.value)
    .then(() => {
      alert('Access code copied to clipboard!');
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
      alert('Failed to copy access code. Please try again.');
    });
};

const confirmDeleteCourse = () => {
  // Confirm deletion and emit delete event
  if (confirm(`Are you sure you want to delete ${props.course.code}: ${props.course.title}? This action cannot be undone.`)) {
    emit('deleteCourse', props.course.id);
  }
};
</script>

<style scoped>
.settings-tab {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.detail-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.card-header-with-action h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
  display: flex;
  align-items: center;
}

.card-header-with-action h3 i {
  margin-right: 12px;
  color: #4C6EF5;
  font-size: 20px;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-section {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-top: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4C6EF5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

/* Access Code Styles */
.access-code-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.access-code-display {
  margin-bottom: 20px;
}

.access-code-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.access-code {
  display: flex;
  align-items: center;
  background-color: #eef2ff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  font-family: monospace;
  font-size: 16px;
  color: #4C6EF5;
  font-weight: 600;
  border: 1px solid #dbeafe;
  letter-spacing: 1px;
}

.copy-button {
  background: none;
  border: none;
  color: #4C6EF5;
  cursor: pointer;
  margin-left: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: #4C6EF5;
  color: white;
}

.access-code-help {
  font-size: 13px;
  color: #6b7280;
  margin-top: 10px;
}

.regenerate-button {
  width: 100%;
  justify-content: center;
}

/* Danger Zone */
.danger-zone {
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
}

.danger-zone .section-title {
  color: #e53e3e;
  border-bottom-color: #fed7d7;
}

.danger-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #fed7d7;
}

.danger-info {
  flex: 1;
}

.danger-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #e53e3e;
}

.danger-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.danger-button {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fff5f5;
  color: #e53e3e;
  border: 1px solid #feb2b2;
  font-size: 14px;
  white-space: nowrap;
}

.danger-button:hover {
  background-color: #fed7d7;
}

/* Responsive */
@media (max-width: 768px) {
  .danger-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .danger-button {
    width: 100%;
  }
}

/* Buttons */
.primary-button {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #4C6EF5;
  color: white;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(76, 110, 245, 0.2);
}

.primary-button:hover {
  background-color: #4361ee;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 110, 245, 0.3);
}

.primary-button:active {
  transform: translateY(0);
}

.primary-button:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
  box-shadow: none;
}

.secondary-button {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.secondary-button:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.secondary-button:active {
  transform: translateY(0);
}

.secondary-button:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}
</style> 