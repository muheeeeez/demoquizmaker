<template>
  <div class="ai-chat-container">
    <div class="chat-messages" ref="chatContainer">
      <div v-for="(message, index) in chatMessages" :key="index" 
        :class="['message', message.sender === 'ai' ? 'ai-message' : 'user-message']">
        <div class="message-avatar">
          <i :class="message.sender === 'ai' ? 'fas fa-robot' : 'fas fa-user'"></i>
        </div>
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(message.text)"></div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      <div v-if="isTyping" class="message ai-message">
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <textarea 
        v-model="userInput" 
        placeholder="Ask something about your course..."
        @keyup.enter.prevent="sendMessage"
        rows="2"
      ></textarea>
      <button @click="sendMessage" class="send-button" :disabled="!userInput.trim() || isTyping">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  },
  courseTitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['message-sent', 'ai-responded'])

const chatContainer = ref(null)
const chatMessages = ref([])
const userInput = ref('')
const isTyping = ref(false)

// Initial message from AI when component mounts
onMounted(() => {
  addAIMessage(`Hi there! I'm your AI teaching assistant for ${props.courseTitle || 'this course'}. How can I help you today?`)
  scrollToBottom()
})

// Watch for new messages and scroll to bottom
watch(chatMessages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// Scroll chat to bottom
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Send message
function sendMessage() {
  if (!userInput.value.trim() || isTyping.value) return
  
  // Add user message
  chatMessages.value.push({
    sender: 'user',
    text: userInput.value,
    timestamp: new Date()
  })
  
  emit('message-sent', userInput.value)
  
  // Save current message before clearing input
  const currentMessage = userInput.value
  
  // Clear input
  userInput.value = ''
  
  // Show typing indicator
  isTyping.value = true
  
  // Simulate AI response (in a real app, this would be an API call)
  setTimeout(() => {
    generateAIResponse(currentMessage)
  }, 1500)
}

// Generate AI response
function generateAIResponse(query) {
  // In a real application, this would call an API endpoint
  // For demo purposes, we'll use mock responses
  const responses = {
    'assignment': 'The next assignment is due on Friday at 11:59 PM. It covers topics from chapters 3-5, focusing on algorithm efficiency and data structures.',
    'deadline': 'The upcoming deadline is for Project 2, due next Tuesday by midnight. Make sure to submit both your code and documentation.',
    'exam': 'The midterm exam is scheduled for October 15th. It will cover all material from weeks 1-6, including lectures and assigned readings.',
    'office': 'My office hours are Mondays and Wednesdays from 2-4 PM in Room 302. You can also schedule a virtual appointment through the booking system.',
    'syllabus': 'You can find the course syllabus on the LMS under "Course Information". It contains all the details about grading, policies, and the schedule.'
  }
  
  // Simple keyword matching for demo purposes
  let response = `I don't have specific information about that for ${props.courseTitle}. In a real implementation, I would connect to course data and provide accurate answers. Could you try asking something else?`
  
  Object.keys(responses).forEach(key => {
    if (query.toLowerCase().includes(key)) {
      response = responses[key]
    }
  })
  
  // If query contains question about topics or content
  if (query.toLowerCase().includes('topic') || query.toLowerCase().includes('content') || query.toLowerCase().includes('learn')) {
    response = `This course covers key topics including data structures, algorithms, computational complexity, and problem-solving techniques. We'll explore both theoretical foundations and practical applications through programming assignments.`
  }
  
  // Add AI response after the typing delay
  isTyping.value = false
  addAIMessage(response)
  
  // Emit the AI response
  emit('ai-responded', response)
}

// Add AI message to chat
function addAIMessage(text) {
  chatMessages.value.push({
    sender: 'ai',
    text: text,
    timestamp: new Date()
  })
}

// Format timestamp
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}

// Format message - handle code blocks, links, etc.
function formatMessage(text) {
  // Replace URLs with clickable links
  let formattedText = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank">$1</a>'
  )
  
  // Replace simple code snippets (text between backticks)
  formattedText = formattedText.replace(
    /`([^`]+)`/g,
    '<code>$1</code>'
  )
  
  return formattedText
}
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 80%;
}

.ai-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  flex-shrink: 0;
}

.ai-message .message-avatar {
  background-color: #4C6EF5;
  color: white;
}

.user-message .message-avatar {
  background-color: #FF784B;
  color: white;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  max-width: calc(100% - 60px);
}

.ai-message .message-content {
  background-color: #f3f4f6;
  border-top-left-radius: 4px;
}

.user-message .message-content {
  background-color: #e8f4ff;
  border-top-right-radius: 4px;
  text-align: right;
}

.message-text {
  color: #1f2937;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

.chat-input {
  border-top: 1px solid #e5e7eb;
  padding: 15px;
  display: flex;
  align-items: center;
  background-color: white;
}

textarea {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 14px;
  resize: none;
  outline: none;
  max-height: 120px;
  color: #1f2937;
}

textarea:focus {
  border-color: #4C6EF5;
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FF784B;
  color: white;
  border: none;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #f96a3a;
}

.send-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 0;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: scale(0.7);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

code {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.06);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 13px;
}

a {
  color: #4C6EF5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style> 