import { defineStore } from "pinia";

export const useOverviewStore = defineStore("overview", {
  state: () => ({
    loading: false,
    error: null,
    courseOverview: {},
    recentActivities: {},
    knowledgeGaps: {}
  }),

  getters: {
    getCourseStats: (state) => (courseId) => {
      if (!state.courseOverview[courseId]) return null;
      return state.courseOverview[courseId].stats;
    },
    
    getCourseActivities: (state) => (courseId) => {
      return state.recentActivities[courseId] || [];
    },
    
    getCourseKnowledgeGaps: (state) => (courseId) => {
      return state.knowledgeGaps[courseId] || [];
    }
  },

  actions: {
    /**
     * Fetch overview data for a specific course
     */
    async fetchCourseOverview(courseId) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${courseId}/overview`);
        // const data = await response.json();
        
        // Generate demo data instead
        this.courseOverview[courseId] = this.generateOverviewData(courseId);
        await this.fetchKnowledgeGaps(courseId);
        await this.fetchRecentActivities(courseId);
        
        return this.courseOverview[courseId];
      } catch (error) {
        console.error("Error fetching course overview:", error);
        this.error = "Failed to load course overview data";
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Fetch knowledge gaps for a specific course
     */
    async fetchKnowledgeGaps(courseId) {
      try {
        // Demo data for knowledge gaps
        this.knowledgeGaps[courseId] = [
          {
            topic: courseId % 2 === 0 ? "Advanced Algorithms" : "Data Structures",
            percentage: 60 + (courseId * 5) % 30,
            description: `${40 - (courseId * 5) % 30}% of students struggled with questions on this topic`
          },
          {
            topic: courseId % 2 === 0 ? "Data Structures" : "Object-Oriented Design",
            percentage: 55 + (courseId * 7) % 30,
            description: `${45 - (courseId * 7) % 30}% of students need additional help with this concept`
          },
          {
            topic: courseId % 3 === 0 ? "System Architecture" : "Database Design",
            percentage: 50 + (courseId * 6) % 30,
            description: `${50 - (courseId * 6) % 30}% of students would benefit from additional materials`
          }
        ];
        
        return this.knowledgeGaps[courseId];
      } catch (error) {
        console.error("Error fetching knowledge gaps:", error);
        return [];
      }
    },
    
    /**
     * Fetch recent activities for a specific course
     */
    async fetchRecentActivities(courseId) {
      try {
        const activities = [
          {
            type: 'quiz',
            title: `New Quiz Published`,
            description: `Quiz ${courseId + 2}: Advanced Concepts was published`,
            time: '2 hours ago'
          },
          {
            type: 'submission',
            title: 'Quiz Submissions',
            description: `${5 + courseId * 3} students submitted Quiz ${courseId + 1}`,
            time: '1 day ago'
          },
          {
            type: 'feedback',
            title: 'Feedback Provided',
            description: `You provided feedback on Quiz ${courseId} results`,
            time: '3 days ago'
          },
          {
            type: 'material',
            title: 'New Material Added',
            description: `Added "Chapter ${courseId + 3}: Key Concepts" to course materials`,
            time: '5 days ago'
          }
        ];
        
        // Use different subsets for different courses to add variety
        this.recentActivities[courseId] = activities.slice(0, 2 + (courseId % 3));
        return this.recentActivities[courseId];
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        return [];
      }
    },
    
    /**
     * Generate overview data for a specific course
     */
    generateOverviewData(courseId) {
      // Vary statistics based on course ID to make the demo data more realistic
      return {
        stats: {
          activeClassAverage: 65 + (courseId * 5) % 25,
          activeCompletionRate: 70 + (courseId * 7) % 25,
          activePassRate: 65 + (courseId * 8) % 20,
          previousClassAverage: 60 + (courseId * 3) % 25,
          previousCompletionRate: 65 + (courseId * 6) % 25,
          previousPassRate: 60 + (courseId * 7) % 20,
          totalStudents: 20 + (courseId * 5),
          quizzesCreated: 3 + (courseId % 3),
          quizzesCompleted: 2 + (courseId % 3),
          improvementRate: 5 + (courseId * 2) % 10
        }
      };
    },
    
    /**
     * Ask the AI assistant a quick question about the course
     */
    async askQuickQuestion(courseId, question) {
      this.loading = true;
      
      try {
        // In a real app, this would be an API call to an AI service
        // const response = await fetch(`/api/courses/${courseId}/ai-assistant`, {
        //   method: 'POST',
        //   body: JSON.stringify({ question })
        // });
        // const data = await response.json();
        
        // Generate a demo response
        const responses = [
          `Based on the current course progress, I'd recommend focusing on the knowledge gap in ${this.knowledgeGaps[courseId]?.[0]?.topic || "advanced topics"}.`,
          `The class average is ${this.courseOverview[courseId]?.stats?.classAverage || 75}%. This is ${this.courseOverview[courseId]?.stats?.classAverage > 75 ? "above" : "below"} the typical average for this course.`,
          `I notice that ${this.courseOverview[courseId]?.stats?.completionRate || 80}% of students have completed all assigned work. Consider reaching out to those who haven't.`,
          `Would you like me to generate some practice problems on ${this.knowledgeGaps[courseId]?.[0]?.topic || "this topic"} for your students?`
        ];
        
        // Return a response based on question content
        const responseIndex = Math.floor(question.length % responses.length);
        return {
          message: responses[responseIndex],
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error("Error with AI assistant:", error);
        return {
          message: "I'm sorry, I couldn't process your question at the moment. Please try again later.",
          timestamp: new Date().toISOString()
        };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Generate materials for problematic topics
     */
    async generateMaterials(courseId, topics) {
      this.loading = true;
      
      try {
        // In a real app, this would call an API to generate materials
        // const response = await fetch(`/api/courses/${courseId}/generate-materials`, {
        //   method: 'POST',
        //   body: JSON.stringify({ topics })
        // });
        // const data = await response.json();
        
        // Demo response
        const materialTypes = ["Practice Problems", "Study Guide", "Interactive Quiz", "Video Tutorial"];
        
        return topics.map(topic => ({
          topic,
          title: `${topic} - ${materialTypes[Math.floor(Math.random() * materialTypes.length)]}`,
          type: Math.random() > 0.5 ? 'document' : 'interactive',
          format: Math.random() > 0.5 ? 'pdf' : 'html',
          generatedAt: new Date().toISOString()
        }));
      } catch (error) {
        console.error("Error generating materials:", error);
        return [];
      } finally {
        this.loading = false;
      }
    }
  }
}); 