<template>
  <div class="chatbot-tab">
    <div class="detail-card">
      <h3>AI Teaching Assistant</h3>
      
      <div class="chat-container">
        <div class="chat-messages">
          <div class="message ai-message">
            <div class="message-avatar">AI</div>
            <div class="message-content">
              <p>Hello! I'm your AI teaching assistant for {{ course.code }}. How can I help you today?</p>
            </div>
          </div>
          
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message', message.sender === 'user' ? 'user-message' : 'ai-message']">
            <template v-if="message.sender === 'ai'">
              <div class="message-avatar">AI</div>
              <div class="message-content">
                <p v-for="(text, i) in message.content" :key="i">{{ text }}</p>
              </div>
            </template>
            <template v-else>
              <div class="message-content">
                <p>{{ message.content }}</p>
              </div>
              <div class="message-avatar">You</div>
            </template>
          </div>
        </div>
        
        <div class="chat-input">
          <input 
            type="text" 
            placeholder="Type your message here..." 
            v-model="newMessage"
            @keyup.enter="sendMessage"
          />
          <button class="send-btn" @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const messages = ref([
  {
    sender: 'user',
    content: 'Can you help me create a quiz about the fundamentals?'
  },
  {
    sender: 'ai',
    content: [
      `Of course! I'd be happy to help you create a quiz on the fundamentals of ${props.course.title}.`,
      'Would you like me to suggest some questions based on the course material, or do you have specific topics in mind?'
    ]
  }
])

const newMessage = ref('')

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  // Add user message
  messages.value.push({
    sender: 'user',
    content: newMessage.value
  })
  
  // Simulate AI response (in a real app, this would call an API)
  setTimeout(() => {
    messages.value.push({
      sender: 'ai',
      content: [
        `Thanks for your message about "${newMessage.value}".`,
        `I can help you with that for your ${props.course.code} course. What specific aspects would you like to focus on?`
      ]
    })
  }, 1000)
  
  newMessage.value = ''
}
</script>

<style scoped>
.detail-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 25px;
}

.detail-card h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.chat-container {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  gap: 10px;
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
  width: 36px;
  height: 36px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4b5563;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #4C6EF5;
  color: white;
}

.message-content {
  background-color: white;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.user-message .message-content {
  background-color: #4C6EF5;
  color: white;
}

.message-content p {
  margin-bottom: 5px;
  color: inherit;
  font-size: 14px;
}

.message-content p:last-child {
  margin-bottom: 0;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

.send-btn {
  background-color: #4C6EF5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  cursor: pointer;
}

@media (max-width: 480px) {
  .chat-container {
    height: 350px;
  }
  
  .message {
    max-width: 90%;
  }
}
</style> 