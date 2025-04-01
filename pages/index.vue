<script setup lang="ts">
import { useHead, ref, onMounted } from "#imports";

// Set the page title
useHead({
  title: "Genertiaa - AI-Powered Academic & Corporate Solutions",
  meta: [
    {
      name: "description",
      content:
        "Genertiaa provides AI-powered solutions for academia and corporate training, optimizing learning experiences through intelligent automation and assessment tools.",
    },
  ],
});

// Tab functionality
const activeTab = ref("academic");

onMounted(() => {
  // Initialize tab functionality
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      if (tabId) {
        // Update active tab button
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Update active tab content
        tabContents.forEach((content) => {
          content.classList.remove("active");
          if (content.id === tabId) {
            content.classList.add("active");
          }
        });

        activeTab.value = tabId;
      }
    });
  });

  // Animation for floating elements
  const floatingElements = document.querySelectorAll(".floating-element");
  floatingElements.forEach((el, index) => {
    const element = el as HTMLElement;
    if (element && element.style) {
      element.style.animationDelay = `${index * 0.5}s`;
    }
  });
});
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <header class="header">
      <div class="logo-container">
        <h1 class="logo">Genertiaa</h1>
      </div>
      <nav class="navigation">
        <a href="#solutions">Solutions</a>
        <a href="#use-cases">Use Cases</a>
        <a href="#about">About Us</a>
        <div class="auth-links">
          <NuxtLink to="/authentication/student-auth" class="auth-link"
            >Students</NuxtLink
          >
          <NuxtLink
            to="/authentication/professor-auth"
            class="auth-link primary"
            >Educators</NuxtLink
          >
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">AI-Powered Academic & Corporate Solutions</h1>
        <h2 class="hero-subtitle">
          Redefining Assessment, Learning, and Knowledge Retention
        </h2>
        <p class="hero-text">
          Leverage AI to bring value to academia and corporate learning through
          intelligent automation and interactive assessment tools that optimize
          learning experiences.
        </p>
        <!-- <div class="hero-cta">
          <button class="cta-button primary">
            Get Started <i class="fas fa-arrow-right"></i>
          </button>
          <button class="cta-button secondary">Request Demo</button>
        </div> -->
      </div>
      <div class="hero-image">
        <div class="image-container">
          <div class="floating-element el-1">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <div class="floating-element el-2">
            <i class="fas fa-robot"></i>
          </div>
          <div class="floating-element el-3">
            <i class="fas fa-chart-bar"></i>
          </div>
          <div class="floating-element el-4">
            <i class="fas fa-user-graduate"></i>
          </div>
          <div class="main-image"></div>
        </div>
      </div>
    </section>

    <!-- Our Mission Section -->
    <section class="mission" id="about">
      <div class="section-header">
        <h2>Our Mission & Vision</h2>
        <div class="divider"></div>
      </div>
      <div class="mission-content">
        <p>
          At Genertiaa, we believe that education and professional development
          should be dynamic, intelligent, and deeply personalized. Our mission
          is to bridge the gap between knowledge dissemination and retention
          using AI-powered tools that optimize learning experiences.
        </p>
        <div class="mission-values">
          <div class="value-card">
            <i class="fas fa-brain"></i>
            <h3>Dynamic</h3>
            <p>
              Creating responsive learning environments that adapt to individual
              needs
            </p>
          </div>
          <div class="value-card">
            <i class="fas fa-lightbulb"></i>
            <h3>Intelligent</h3>
            <p>
              Leveraging AI to provide deeper insights into learning patterns
            </p>
          </div>
          <div class="value-card">
            <i class="fas fa-user-cog"></i>
            <h3>Personalized</h3>
            <p>Crafting unique educational experiences tailored to each user</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solutions Section -->
    <section class="solutions" id="solutions">
      <div class="section-header">
        <h2>Core Offerings</h2>
        <div class="divider"></div>
      </div>
      <div class="solutions-grid">
        <div class="solution-card">
          <div class="card-icon">
            <i class="fas fa-clipboard-check"></i>
          </div>
          <h3>QuizMakerAI</h3>
          <p>
            AI-powered assessment and study tool designed to support educators
            and institutions by automating quiz creation, grading, and
            personalized learning insights.
          </p>
        </div>
        <div class="solution-card">
          <div class="card-icon">
            <i class="fas fa-briefcase"></i>
          </div>
          <h3>Corporate Training</h3>
          <p>
            AI solutions for corporate hiring and training processes, ensuring
            effective knowledge retention and competency assessment.
          </p>
        </div>
        <div class="solution-card">
          <div class="card-icon">
            <i class="fas fa-comments"></i>
          </div>
          <h3>AI Chatbot</h3>
          <p>
            Dedicated AI chatbots trained on course materials and recordings to
            provide 24/7 support for students when instructors are unavailable.
          </p>
        </div>
        <div class="solution-card">
          <div class="card-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3>Performance Analytics</h3>
          <p>
            Comprehensive analytics and performance tracking to identify
            knowledge gaps and optimize learning outcomes.
          </p>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section class="use-cases" id="use-cases">
      <div class="section-header">
        <h2>Use Cases</h2>
        <div class="divider"></div>
      </div>

      <div class="tabs">
        <div class="tab-headers">
          <button class="tab-btn active" data-tab="academic">
            Academic Solutions
          </button>
          <button class="tab-btn" data-tab="corporate">
            Corporate Solutions
          </button>
        </div>

        <div class="tab-content active" id="academic">
          <div class="tab-image">
            <img
              src="/images/academic-illustration.svg"
              alt="Academic Solutions"
            />
          </div>
          <div class="tab-details">
            <h3>QuizMakerAI for Education</h3>
            <ul class="feature-list">
              <li>
                <i class="fas fa-check-circle"></i> AI-generated unique quizzes
                for each student
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Multiple quiz formats
                support
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Automated grading with
                similarity scoring
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Knowledge gap analysis for
                targeted learning
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Personalized study mode with
                gamification
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Professor-based AI chatbots
                for 24/7 support
              </li>
            </ul>
            <button class="tab-cta">Learn More</button>
          </div>
        </div>

        <div class="tab-content" id="corporate">
          <div class="tab-image">
            <img
              src="/images/corporate-illustration.svg"
              alt="Corporate Solutions"
            />
          </div>
          <div class="tab-details">
            <h3>Corporate Training & Hiring</h3>
            <ul class="feature-list">
              <li>
                <i class="fas fa-check-circle"></i> Role-specific training
                assessments
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Competency-based hiring
                evaluations
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Comprehensive performance
                metrics
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Efficient upskilling for
                employees
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Integration with existing
                LMS systems
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Customizable assessment
                parameters
              </li>
            </ul>
            <button class="tab-cta">Learn More</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <div class="section-header">
        <h2>What Our Clients Say</h2>
        <div class="divider"></div>
      </div>
      <div class="testimonial-slider">
        <div class="testimonial">
          <div class="testimonial-content">
            <p>
              "Genertiaa has revolutionized how we assess student learning. The
              AI-powered insights have been invaluable for identifying knowledge
              gaps."
            </p>
          </div>
          <div class="testimonial-author">
            <div class="author-avatar"></div>
            <div class="author-info">
              <h4>Dr. Emily Johnson</h4>
              <p>Professor of Computer Science, Tech University</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Transform Learning?</h2>
        <p>Join the AI-powered education revolution today!</p>
        <!-- <div class="cta-buttons">
          <button class="cta-primary">Get Started <i class="fas fa-arrow-right"></i></button>
          <button class="cta-secondary">Request Demo</button>
        </div> -->
      </div>
      <div class="cta-tagline">
        <p>If the shoe fits, AI will transform it.</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <h2>Genertiaa</h2>
          <p>AI-Powered Academic & Corporate Solutions</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>Solutions</h4>
            <a href="#">QuizMakerAI</a>
            <a href="#">Corporate Training</a>
            <a href="#">AI Chatbots</a>
            <a href="#">Analytics</a>
          </div>
          <div class="link-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div class="link-group">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Genertiaa. All rights reserved.</p>
        <div class="social-links">
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Global Styles */
.landing-page {
  font-family: "Inter", sans-serif;
  color: #000000;
  line-height: 1.6;
  overflow-x: hidden;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #252641;
  margin-bottom: 1rem;
}

.divider {
  height: 4px;
  width: 60px;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  margin: 0 auto;
  border-radius: 2px;
}

/* Text color improvements for standard text */
p {
  color: #000000;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navigation a {
  color: #252641;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.navigation a:hover {
  color: #4a6cf7;
}

.auth-links {
  display: flex;
  gap: 1rem;
  margin-left: 1rem;
}

.auth-link {
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.auth-link.primary {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  color: white !important;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.35);
}

.auth-link:not(.primary) {
  border: 2px solid #4a6cf7;
  color: #4a6cf7 !important;
}

.auth-link:hover {
  transform: translateY(-3px);
}

/* Hero Section */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rem 5%;
  min-height: 80vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f9f9ff 0%, #f0f3ff 100%);
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.8rem;
  color: #252641;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.hero-text {
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  color: #000000;
  line-height: 1.8;
}

.hero-cta {
  display: flex;
  gap: 1rem;
}

.cta-button {
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-button.primary {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  color: white !important;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.35);
}

.cta-button.secondary {
  background: white;
  color: #4a6cf7 !important;
  border: 2px solid #4a6cf7;
  font-weight: 700;
}

.cta-button:hover {
  transform: translateY(-3px);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.image-container {
  width: 100%;
  height: 500px;
  position: relative;
  margin-left: 2rem;
}

.main-image {
  width: 100%;
  height: 100%;
  background-image: url("/images/hero-image.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: relative;
  z-index: 1;
}

.floating-element {
  position: absolute;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  animation: float 3s ease-in-out infinite;
  z-index: 2;
}

.floating-element i {
  font-size: 1.5rem;
  color: #4a6cf7;
}

.el-1 {
  width: 60px;
  height: 60px;
  top: 10%;
  left: 10%;
}

.el-2 {
  width: 70px;
  height: 70px;
  top: 20%;
  right: 15%;
}

.el-3 {
  width: 50px;
  height: 50px;
  bottom: 25%;
  left: 15%;
}

.el-4 {
  width: 65px;
  height: 65px;
  bottom: 15%;
  right: 10%;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Mission Section */
.mission {
  padding: 5rem 5%;
  background-color: white;
}

.mission-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.mission-content > p {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #000000;
}

.mission-values {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  flex: 1;
  min-width: 220px;
  text-align: center;
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-10px);
}

.value-card i {
  font-size: 2.5rem;
  color: #4a6cf7;
  margin-bottom: 1rem;
}

.value-card h3 {
  margin-bottom: 1rem;
  font-weight: 600;
  color: #252641;
}

.value-card p {
  color: #000000;
}

/* Solutions Section */
.solutions {
  padding: 5rem 5%;
  background-color: #f5f5f7;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.solution-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.solution-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #f5f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-icon i {
  font-size: 1.8rem;
  color: #4a6cf7;
}

.solution-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #252641;
}

.solution-card p {
  color: #000000;
  line-height: 1.7;
}

/* Use Cases Section */
.use-cases {
  padding: 5rem 5%;
  background-color: white;
}

.tabs {
  max-width: 1000px;
  margin: 0 auto;
}

.tab-headers {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.tab-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  background: #f5f5f7;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #000000;
}

.tab-btn.active {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
}

.tab-content {
  display: none;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.tab-content.active {
  display: grid;
}

.tab-image {
  text-align: center;
}

.tab-image img {
  max-width: 100%;
  height: auto;
}

.tab-details h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #252641;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.feature-list li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #000000;
}

.feature-list i {
  color: #4a6cf7;
  font-size: 1.2rem;
}

.tab-cta {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  color: white !important;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
}

/* Testimonials */
.testimonials {
  padding: 5rem 5%;
  background-color: #f5f5f7;
}

.testimonial-slider {
  max-width: 800px;
  margin: 0 auto;
}

.testimonial {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.testimonial-content {
  font-style: italic;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding: 0 1.5rem;
  color: #000000;
}

.testimonial-content::before,
.testimonial-content::after {
  content: '"';
  font-family: Georgia, serif;
  font-size: 3rem;
  color: #4a6cf7;
  opacity: 0.3;
  position: absolute;
}

.testimonial-content::before {
  top: -20px;
  left: 0;
}

.testimonial-content::after {
  bottom: -40px;
  right: 0;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f5f5f7;
  background-image: url("/images/avatar-placeholder.jpg");
  background-size: cover;
  background-position: center;
}

.author-info h4 {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #252641;
}

.author-info p {
  color: #555555;
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  padding: 5rem 5%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a30e0 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  color: white;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.cta-primary {
  padding: 0.8rem 2rem;
  background: white;
  color: #4a6cf7 !important;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-secondary {
  padding: 0.8rem 2rem;
  background: transparent;
  color: white !important;
  border: 2px solid white;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-primary:hover,
.cta-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.cta-tagline {
  font-style: italic;
  opacity: 0.8;
  font-size: 1.1rem;
  color: white;
}

/* Footer */
.footer {
  background-color: #252641;
  color: white;
  padding: 4rem 5% 2rem;
  width: 100%;
  /* margin-top: 2rem; */
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.footer-logo p {
  opacity: 0.85;
  max-width: 300px;
  color: white;
}

.footer-links {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.link-group h4 {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: white;
}

.link-group a {
  display: block;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0.8rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.link-group a:hover {
  color: white;
  transform: translateX(5px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  opacity: 0.85;
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-links a:hover {
  background: #4a6cf7;
  transform: translateY(-3px);
}

.social-links i {
  color: white !important;
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 992px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 3rem 5%;
  }

  .hero-content {
    max-width: 100%;
    margin-bottom: 3rem;
  }

  .hero-cta {
    justify-content: center;
  }

  .image-container {
    margin-left: 0;
    height: 400px;
  }

  .tab-content {
    grid-template-columns: 1fr;
  }

  .tab-image {
    order: 2;
  }

  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .navigation {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .mission-values {
    flex-direction: column;
  }

  .solutions-grid {
    grid-template-columns: 1fr;
  }

  .tab-headers {
    flex-direction: column;
    align-items: center;
  }

  .tab-btn {
    width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
