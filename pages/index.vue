<script setup lang="ts">
import type { NuxtLink } from "#components";
</script>

<template>
  <div>
    <div>
      <header>
        <div>
          <h1>QuizMakerAI</h1>
        </div>
        <div class="header-info">
          <NuxtLink to="/authentication/student-auth">Student</NuxtLink>
          <NuxtLink to="/authentication/professor-auth">Professor</NuxtLink>
        </div>
      </header>
      <div class="container">
        <h1>Transform Your Study Materials</h1>
        <h1 class="container-info">Into Interactive Quizzes</h1>
        <div>
          <p>
            Upload your study materials and let AI create personalized quizzes
            to test your knowledge.
          </p>
          <p>Perfect for students, teachers, and lifelong learners.</p>
        </div>
        <div>
          <button class="primary-btn">Get Started Free &rarr;</button>
        </div>
      </div>
      <div class="main-container">
        <h1>Everything You Need to Learn Effectively</h1>
        <p>
          Choose from multiple ways to create and interact with your study
          materials
        </p>
        <div class="container-flex">
          <div class="card">
            <!-- <img src="../../images/upload.png" alt="" /> -->
            <h3>Upload & Generate Quiz</h3>
            <p>
              Upload your study materials and let our AI generate personalized
              quizzes instantly.
            </p>
          </div>
          <div class="card">
            <!-- <img src="../../images/preloaded.png" alt="" /> -->
            <h3>Preloaded Class Notes</h3>
            <p>
              Access our collection of preloaded study materials and practice
              quizzes.
            </p>
          </div>
          <div class="card">
            <!-- <img src="../../images/audio.png" alt="" /> -->
            <h3>Audio Generation</h3>
            <p>
              Convert your study materials into audio format for on-the-go
              learning.
            </p>
          </div>
        </div>
      </div>
      <div class="why-container">
        <h1>Why Choose QuizMakerAI?</h1>
        <div class="why-flex">
          <div class="list-container">
            <div class="each-container">
              <!-- <img src="../../images/check.png" alt="" /> -->
              <p>AI-powered quiz generation</p>
            </div>
            <div class="each-container">
              <!-- <img src="../../images/check.png" alt="" /> -->
              <p>Easy to use interface</p>
            </div>
          </div>
          <div class="list-container">
            <div class="each-container">
              <!-- <img src="../../images/check.png" alt="" /> -->
              <p>Instant feedback and explanations</p>
            </div>
            <div class="each-container">
              <!-- <img src="../../images/check.png" alt="" /> -->
              <p>Personalized learning experience</p>
            </div>
          </div>
          <div class="list-container">
            <div class="each-container">
              <!-- <img src="../../images/check.png" alt="" /> -->
              <p>Multiple learning formats</p>
            </div>
            <div class="each-container">
              <!-- <img src="../../images/check.png" alt="" /> -->
              <p>Track your progress</p>
            </div>
          </div>
        </div>
      </div>

      <div class="ion-container">
        <h1>Ready to Transform Your Learning?</h1>
        <p>
          Join thousands of students who are already learning smarter with
          QuizMakerAI
        </p>
        <button>Get Started Free &rarr;</button>
      </div>

      <div class="footer-container">
        <p>&copy; 2024 QuizMakerAI. All rights reserved</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

header h1 {
  color: #2563eb;
  font-size: 1.9rem;
  font-weight: bolder;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-info a {
  text-decoration: none;
  color: #4b5563;
  font-size: 1rem;
}

.primary-btn {
  background-color: #2563eb;
  height: 2.5rem;
  min-width: 9rem;
  border-radius: 6px;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0 1rem;
}

.primary-btn a {
  color: #fff;
  font-size: 1rem;
  text-decoration: none;
}

.container {
  text-align: center;
  margin: 6rem 1rem 2rem;
}

.container h1 {
  margin: 0.5rem 0;
  font-size: 2.2rem;
  font-weight: bold;
}

.container-info {
  color: #2563eb;
}

.container p {
  font-size: 1.1rem;
  line-height: 1.6rem;
  color: #4b5563;
  margin: 0.5rem 0;
}

.container div button {
  font-size: 1rem;
  margin-top: 1.5rem;
}

.container div button a {
  text-decoration: none;
}

.main-container {
  background-color: #dbeafe;
  padding: 3rem 1rem 4rem;
}

.main-container h1 {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #111827;
}

.main-container p {
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #4b5563;
}

.container-flex {
  display: flex;

  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto 0;
}

.card {
  background-color: #fafaff;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1.2rem;
  width: 100%;
  max-width: 24rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card img {
  max-width: 2.5rem;
  height: auto;
}

.card h3 {
  margin: 0;
  font-weight: 700;
  font-size: 1rem;
  color: rgba(71, 71, 71, 1);
}

.card p {
  margin: 0;
  font-weight: 400;
  font-size: 0.9rem;
  color: rgba(71, 71, 71, 1);
}

.why-container {
  padding: 3rem 1rem 3rem;
}

.why-container h1 {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 2rem;
}

.why-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.each-container {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #374151;
  font-size: 1rem;
}

.each-container img {
  max-width: 1.2rem;
  height: auto;
}

.ion-container {
  background-color: #2563eb;
  padding: 3rem 1rem;
  text-align: center;
}

.ion-container h1 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 1rem;
}

.ion-container p {
  font-size: 1rem;
  line-height: 1.5rem;
  color: #dbeafe;
  margin-bottom: 2rem;
}

.ion-container button {
  cursor: pointer;
  color: #2563eb;
  border-radius: 6px;
  border: none;
  background-color: #fff;
  font-size: 1rem;
  height: 2.5rem;
  min-width: 10rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ion-container button a {
  text-decoration: none;
  color: #2563eb;
}

.footer-container {
  padding: 2rem 1rem;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-container p {
  color: #4b5563;
  font-size: 1rem;
}
@media screen and (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-info {
    gap: 1rem;
  }

  .container {
    margin: 3rem 1rem 2rem;
  }

  .container h1 {
    font-size: 1.8rem;
  }

  .main-container h1 {
    font-size: 1.4rem;
  }

  .main-container p {
    font-size: 0.95rem;
  }

  .why-container h1 {
    font-size: 1.4rem;
  }
  .container-flex {
    flex-wrap: wrap;
  }
  .p .ion-container h1 {
    font-size: 1.4rem;
  }

  .card {
    max-width: 100%;
  }
}

@media screen and (max-width: 480px) {
  .container h1 {
    font-size: 1.6rem;
  }

  .container p {
    font-size: 0.95rem;
  }
  .container-flex {
    flex-wrap: wrap;
  }
  .primary-btn,
  .ion-container button {
    font-size: 0.9rem;
  }
}
</style>
