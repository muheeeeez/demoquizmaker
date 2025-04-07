<template>
  <div class="notes-tab">
    <div class="detail-card">
      <div class="card-header-with-action">
        <h3><i class="fas fa-sticky-note"></i> Study Notes</h3>
        <button class="primary-button" @click="showAddNoteModal = true">
          <i class="fas fa-plus"></i> Add Study Notes
        </button>
      </div>
      
      <!-- Notes List -->
      <div class="notes-list">
        <div v-if="isLoading" class="loading-message">
          <div class="spinner"></div>
          <p>Loading your study notes...</p>
        </div>

        <div v-else-if="notes.length === 0" class="empty-state">
          <i class="fas fa-sticky-note empty-icon"></i>
          <p>You haven't added any study notes yet.</p>
          <button class="primary-button" @click="showAddNoteModal = true">
            <i class="fas fa-plus"></i> Add Study Notes
          </button>
        </div>

        <div v-else class="notes-grid">
          <div 
            v-for="note in notes" 
            :key="note.id" 
            class="note-card"
          >
            <div class="note-header">
              <h4>{{ note.title }}</h4>
              <div class="note-actions">
                <button class="icon-button" @click="editNote(note)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="icon-button" @click="deleteNote(note)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="note-meta">
              <span class="note-date">
                <i class="fas fa-calendar-alt"></i> {{ formatDate(note.createdAt) }}
              </span>
              <span class="note-tags">
                <i class="fas fa-tag"></i> {{ note.tags.join(', ') }}
              </span>
            </div>
            
            <p class="note-excerpt">{{ truncateContent(note.content) }}</p>
            
            <div class="note-footer">
              <button class="secondary-button" @click="viewNote(note)">
                <i class="fas fa-eye"></i> View
              </button>
              <button 
                class="primary-button" 
                @click="generateQuiz(note)"
                :disabled="note.isGenerating"
              >
                <i class="fas fa-magic"></i> 
                {{ note.isGenerating ? 'Generating...' : 'Generate Quiz' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Note Modal -->
    <div v-if="showAddNoteModal || showEditNoteModal" class="modal-overlay" @click.self="closeNoteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <i class="fas fa-sticky-note"></i> 
            {{ showEditNoteModal ? 'Edit Study Notes' : 'Add Study Notes' }}
          </h3>
          <button class="close-btn" @click="closeNoteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveNote">
            <div class="form-group">
              <label for="note-title">Title</label>
              <input 
                type="text" 
                id="note-title" 
                v-model="currentNote.title" 
                placeholder="Enter a title for your notes"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="note-tags">Tags (comma separated)</label>
              <input 
                type="text" 
                id="note-tags" 
                v-model="tagsInput" 
                placeholder="e.g., functions, variables, loops"
              />
            </div>
            
            <div class="form-group">
              <label for="note-content">Notes Content</label>
              <textarea 
                id="note-content" 
                v-model="currentNote.content" 
                placeholder="Enter your study notes here..."
                rows="12"
                required
              ></textarea>
              <p class="help-text">
                <i class="fas fa-info-circle"></i> 
                Add detailed notes to generate better quizzes. The AI will analyze your notes to create targeted questions.
              </p>
            </div>
            
            <div class="form-options">
              <div class="form-check">
                <input 
                  type="checkbox" 
                  id="auto-generate" 
                  v-model="currentNote.autoGenerate"
                />
                <label for="auto-generate">Generate quiz immediately after saving</label>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="secondary-button" @click="closeNoteModal">
                Cancel
              </button>
              <button type="submit" class="primary-button" :disabled="isSaving">
                <i class="fas fa-save"></i>
                {{ isSaving ? 'Saving...' : 'Save Notes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Note Modal -->
    <div v-if="showViewNoteModal" class="modal-overlay" @click.self="closeViewNoteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <i class="fas fa-sticky-note"></i> 
            {{ selectedNote.title }}
          </h3>
          <button class="close-btn" @click="closeViewNoteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="note-meta view-meta">
            <span class="note-date">
              <i class="fas fa-calendar-alt"></i> Created: {{ formatDate(selectedNote.createdAt) }}
            </span>
            <span class="note-tags">
              <i class="fas fa-tag"></i> Tags: {{ selectedNote.tags.join(', ') }}
            </span>
          </div>
          
          <div class="note-content">
            <p v-for="(paragraph, index) in noteParagraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>
          
          <div class="note-actions-footer">
            <button class="secondary-button" @click="editNote(selectedNote)">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button 
              class="primary-button"
              @click="generateQuiz(selectedNote)"
              :disabled="isGenerating"
            >
              <i class="fas fa-magic"></i> 
              {{ isGenerating ? 'Generating...' : 'Generate Quiz' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['generate-quiz']);

// State
const isLoading = ref(false);
const showAddNoteModal = ref(false);
const showEditNoteModal = ref(false);
const showViewNoteModal = ref(false);
const isSaving = ref(false);
const isGenerating = ref(false);
const selectedNote = ref({});
const currentNote = ref({
  title: '',
  content: '',
  tags: [],
  autoGenerate: false
});
const tagsInput = ref('');

// Mock notes data
const notes = ref([
  {
    id: 1,
    title: 'Functions and Methods',
    content: `Functions are reusable blocks of code that perform a specific task. They can accept inputs (parameters) and return outputs.

In JavaScript, functions can be declared using the 'function' keyword:

function add(a, b) {
  return a + b;
}

Or using arrow function syntax:

const add = (a, b) => a + b;

Methods are functions that are associated with objects. In object-oriented programming, methods define the behavior of an object.

Key concepts about functions:
1. Function parameters can have default values
2. Functions can be passed as arguments to other functions (callbacks)
3. Functions can be returned from other functions (higher-order functions)
4. Functions create their own scope for variables

Best practices:
- Keep functions focused on a single responsibility
- Use descriptive names that indicate what the function does
- Document complex functions with comments
- Consider edge cases and error handling`,
    tags: ['Functions', 'Methods', 'JavaScript'],
    createdAt: new Date('2023-04-01'),
    isGenerating: false
  },
  {
    id: 2,
    title: 'Control Structures',
    content: `Control structures allow you to control the flow of execution in your code.

The main control structures are:

1. Conditionals:
- if/else statements
- switch/case statements
- ternary operators

2. Loops:
- for loops
- while loops
- do...while loops
- for...of loops (for iterables)
- for...in loops (for object properties)

3. Error handling:
- try/catch/finally blocks

Examples:

// If/else
if (condition) {
  // code to run if condition is true
} else {
  // code to run if condition is false
}

// For loop
for (let i = 0; i < 10; i++) {
  // code to repeat 10 times
}

// Try/catch
try {
  // code that might throw an error
} catch (error) {
  // handle the error
}`,
    tags: ['Conditionals', 'Loops', 'Error Handling'],
    createdAt: new Date('2023-04-05'),
    isGenerating: false
  }
]);

// Computed properties
const noteParagraphs = computed(() => {
  if (!selectedNote.value.content) return [];
  return selectedNote.value.content.split('\n\n').filter(p => p.trim() !== '');
});

// Methods
const addNote = () => {
  showAddNoteModal.value = true;
  currentNote.value = {
    title: '',
    content: '',
    tags: [],
    autoGenerate: false
  };
  tagsInput.value = '';
};

const editNote = (note) => {
  currentNote.value = JSON.parse(JSON.stringify(note));
  tagsInput.value = note.tags.join(', ');
  showViewNoteModal.value = false;
  showEditNoteModal.value = true;
};

const saveNote = () => {
  isSaving.value = true;
  
  // Process tags
  const tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  
  // Create new note object
  const noteToSave = {
    ...currentNote.value,
    tags
  };
  
  // If editing existing note
  if (noteToSave.id) {
    const index = notes.value.findIndex(n => n.id === noteToSave.id);
    if (index !== -1) {
      notes.value[index] = noteToSave;
    }
  } 
  // If adding new note
  else {
    noteToSave.id = notes.value.length > 0 
      ? Math.max(...notes.value.map(n => n.id)) + 1 
      : 1;
    noteToSave.createdAt = new Date();
    noteToSave.isGenerating = false;
    notes.value.push(noteToSave);
  }
  
  // Simulate saving delay
  setTimeout(() => {
    isSaving.value = false;
    closeNoteModal();
    
    // Generate quiz automatically if requested
    if (noteToSave.autoGenerate) {
      generateQuiz(noteToSave);
    }
  }, 500);
};

const viewNote = (note) => {
  selectedNote.value = note;
  showViewNoteModal.value = true;
};

const deleteNote = (note) => {
  if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
    notes.value = notes.value.filter(n => n.id !== note.id);
  }
};

const generateQuiz = (note) => {
  isGenerating.value = true;
  
  // Update the note's generating status
  const index = notes.value.findIndex(n => n.id === note.id);
  if (index !== -1) {
    notes.value[index].isGenerating = true;
  }
  
  // Close the view modal if open
  if (showViewNoteModal.value) {
    closeViewNoteModal();
  }
  
  // Emit event to parent component
  emit('generate-quiz', note);
  
  // Simulate quiz generation delay
  setTimeout(() => {
    isGenerating.value = false;
    
    // Update the note's generating status
    if (index !== -1) {
      notes.value[index].isGenerating = false;
    }
    
    // Show success message (in a real app, this would be integrated with the parent's toast system)
    alert(`Quiz successfully generated from "${note.title}"!`);
  }, 2000);
};

const closeNoteModal = () => {
  showAddNoteModal.value = false;
  showEditNoteModal.value = false;
  currentNote.value = {
    title: '',
    content: '',
    tags: [],
    autoGenerate: false
  };
  tagsInput.value = '';
};

const closeViewNoteModal = () => {
  showViewNoteModal.value = false;
  selectedNote.value = {};
};

// Helper functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const truncateContent = (content, length = 150) => {
  if (content.length <= length) return content;
  return content.substring(0, length) + '...';
};
</script>

<style scoped>
.notes-tab {
  margin-bottom: 30px;
}

.detail-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header-with-action {
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-with-action h3 {
  margin: 0;
  font-size: 18px;
  color: #343a40;
  display: flex;
  align-items: center;
}

.card-header-with-action h3 i {
  margin-right: 10px;
  color: #4361ee;
}

/* Loading State */
.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: #868e96;
}

.spinner {
  border: 3px solid #e9ecef;
  border-top: 3px solid #4361ee;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #868e96;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

/* Notes Grid */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.note-card {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 15px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  height: 100%;
}

.note-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.note-header h4 {
  margin: 0;
  color: #343a40;
  font-size: 18px;
  font-weight: 600;
}

.note-actions {
  display: flex;
  gap: 5px;
}

.icon-button {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background-color: transparent;
  color: #868e96;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-button:hover {
  background-color: #e9ecef;
  color: #495057;
}

.note-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #868e96;
}

.note-meta i {
  margin-right: 5px;
}

.note-excerpt {
  flex-grow: 1;
  margin: 0 0 15px;
  color: #495057;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  gap: 10px;
}

/* View Note Modal */
.view-meta {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.note-content {
  margin-bottom: 30px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.note-content p {
  margin: 0 0 15px;
  line-height: 1.6;
  color: #212529;
}

.note-actions-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

/* Modal */
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
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 20px;
}

.modal-header h3 i {
  margin-right: 10px;
  color: #4361ee;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #adb5bd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.close-btn:hover {
  background-color: #e9ecef;
  color: #495057;
}

.modal-body {
  padding: 20px;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #343a40;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4361ee;
  outline: none;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.help-text {
  margin-top: 5px;
  font-size: 12px;
  color: #868e96;
}

.help-text i {
  margin-right: 5px;
}

.form-options {
  margin-bottom: 20px;
}

.form-check {
  display: flex;
  align-items: center;
}

.form-check input {
  margin-right: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

/* Buttons */
.primary-button, .secondary-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.primary-button {
  background-color: #4361ee;
  color: white;
  border: none;
}

.primary-button:hover:not(:disabled) {
  background-color: #3b4fd8;
}

.secondary-button {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
}

.secondary-button:hover {
  background-color: #e9ecef;
}

.primary-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.7;
}

.primary-button i, .secondary-button i {
  margin-right: 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header-with-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .note-footer {
    flex-direction: column;
  }
  
  .note-footer button {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
  
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
}
</style> 