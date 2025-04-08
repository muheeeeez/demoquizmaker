import { defineStore } from "pinia";

export const useAnalyticsStore = defineStore("analytics", {
  state: () => ({
    loading: false,
    error: null,
    courseData: null,
    selectedTimeRange: "month",
  }),

  actions: {
    async fetchCourseAnalytics(courseId) {
      this.loading = true;
      this.error = null;

      try {
        console.log(`Fetching analytics for course ID: ${courseId}`);

        // Generate demo data for the specific course
        this.courseData = this.getDemoData(courseId);
        return this.courseData;
      } catch (error) {
        console.error("Error generating analytics data:", error);
        this.error = "Failed to load analytics data";
        return null;
      } finally {
        this.loading = false;
      }
    },

    updateTimeRange(timeRange) {
      this.selectedTimeRange = timeRange;

      // If we have a course loaded, update its data with the new time range
      if (this.courseData) {
        this.fetchCourseAnalytics(this.courseData.courseId);
      }
    },

    // Demo data for development and testing
    getDemoData(courseId) {
      // Generate a realistic course name based on the ID
      const courses = {
        1: {
          name: "Introduction to Computer Science",
          topics: [
            "Programming Basics",
            "Data Types",
            "Control Structures",
            "Functions",
            "Object-Oriented Programming",
          ],
          avgScore: 72,
          prevAvgScore: 68,
          passRate: 85,
          prevPassRate: 80,
          engagement: {
            completion: 20.5,
            avgCompletion: 18.2,
            participation: 88,
            prevParticipation: 82,
            active: 65,
            total: 75,
            prevActive: 63,
          },
        },
        2: {
          name: "Advanced Calculus",
          topics: [
            "Calculus II",
            "Linear Algebra",
            "Differential Equations",
            "Mathematical Proofs",
            "Complex Analysis",
          ],
          avgScore: 68,
          prevAvgScore: 65,
          passRate: 82,
          prevPassRate: 80,
          engagement: {
            completion: 25.3,
            avgCompletion: 22.0,
            participation: 78,
            prevParticipation: 75,
            active: 42,
            total: 50,
            prevActive: 42,
          },
        },
        3: {
          name: "Data Structures and Algorithms",
          topics: [
            "Arrays & Linked Lists",
            "Trees & Graphs",
            "Sorting Algorithms",
            "Search Algorithms",
            "Algorithm Analysis",
          ],
          avgScore: 76,
          prevAvgScore: 74,
          passRate: 89,
          prevPassRate: 87,
          engagement: {
            completion: 18.5,
            avgCompletion: 16.2,
            participation: 92,
            prevParticipation: 87,
            active: 78,
            total: 85,
            prevActive: 78,
          },
        },
        4: {
          name: "Web Development Fundamentals",
          topics: [
            "HTML/CSS",
            "JavaScript Basics",
            "DOM Manipulation",
            "API Integration",
            "Responsive Design",
          ],
          avgScore: 81,
          prevAvgScore: 76,
          passRate: 94,
          prevPassRate: 90,
          engagement: {
            completion: 15.2,
            avgCompletion: 16.5,
            participation: 96,
            prevParticipation: 90,
            active: 110,
            total: 115,
            prevActive: 105,
          },
        },
        5: {
          name: "Machine Learning Basics",
          topics: [
            "Statistical Learning",
            "Supervised Learning",
            "Unsupervised Learning",
            "Neural Networks",
            "Model Evaluation",
          ],
          avgScore: 74,
          prevAvgScore: 70,
          passRate: 86,
          prevPassRate: 82,
          engagement: {
            completion: 22.7,
            avgCompletion: 24.1,
            participation: 82,
            prevParticipation: 78,
            active: 35,
            total: 40,
            prevActive: 32,
          },
        },
        6: {
          name: "Database Systems",
          topics: [
            "Relational Model",
            "SQL",
            "Normalization",
            "Query Optimization",
            "Database Design",
          ],
          avgScore: 79,
          prevAvgScore: 75,
          passRate: 91,
          prevPassRate: 88,
          engagement: {
            completion: 16.8,
            avgCompletion: 17.5,
            participation: 90,
            prevParticipation: 85,
            active: 45,
            total: 50,
            prevActive: 43,
          },
        },
      };
      const course = courses[courseId] || {
        name: `Course ${courseId}`,
        topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
        avgScore: 76,
        prevAvgScore: 73.7,
        passRate: 89,
        prevPassRate: 87.7,
        engagement: {
          completion: 18.5,
          avgCompletion: 16.2,
          participation: 92,
          prevParticipation: 87,
          active: 78,
          total: 85,
          prevActive: 78,
        },
      };

      const knowledgeGaps = course.topics
        .map((topic) => {
          const difficultyScore = Math.floor(Math.random() * 31) + 50; // 50-80
          return {
            topic,
            difficultyScore,
            suggestion: this.getRandomSuggestion(topic, difficultyScore),
          };
        })
        .sort((a, b) => a.difficultyScore - b.difficultyScore)
        .slice(0, 3); 

     
      const performanceTrends = this.getPerformanceData(
        courseId,
        this.selectedTimeRange
      );

    
      const weeklyActivityBase = [65, 78, 52, 75, 85, 24, 30];
      const activityLevels = weeklyActivityBase.map((level) => {
        const variance = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return Math.max(10, Math.min(95, level + variance)); // Keep between 10-95%
      });

 
      const recommendations = this.generateRecommendations(
        course,
        knowledgeGaps,
        activityLevels
      );

   
      const demoData = {
        courseId,
        courseName: course.name,
        timeRange: this.selectedTimeRange,
        performanceTrends,
        metrics: {
          averageScore: course.avgScore,
          previousAverageScore: course.prevAvgScore,
          passRate: course.passRate,
          previousPassRate: course.prevPassRate,
        },
        knowledgeGaps,
        engagement: {
          quizCompletionTime: course.engagement.completion,
          avgQuizCompletionTime: course.engagement.avgCompletion,
          participationRate: course.engagement.participation,
          previousParticipationRate: course.engagement.prevParticipation,
          activeStudents: course.engagement.active,
          totalStudents: course.engagement.total,
          previousActiveStudents: course.engagement.prevActive,
        },
        weeklyActivity: {
          days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          activityLevels,
        },
        recommendations,
      };

      return demoData;
    },

    getPerformanceData(courseId, timeRange) {
      // Different patterns for different courses
      const patterns = {
        1: {
          // Steady improvement
          week: [62, 65, 68, 70, 72, 74, 76],
          month: [58, 65, 70, 75],
          semester: [55, 60, 65, 68, 72, 75],
        },
        2: {
          // Fluctuating, slight improvement
          week: [64, 62, 67, 65, 70, 68, 72],
          month: [60, 62, 66, 68],
          semester: [58, 62, 60, 65, 67, 70],
        },
        3: {
          // Strong improvement
          week: [65, 68, 72, 74, 78, 81, 84],
          month: [60, 70, 78, 82],
          semester: [55, 62, 70, 76, 80, 85],
        },
        4: {
          // Already high, small improvements
          week: [80, 81, 82, 81, 83, 84, 85],
          month: [78, 80, 82, 85],
          semester: [75, 78, 80, 82, 84, 86],
        },
        5: {
          // Difficult course, gradual improvement
          week: [60, 63, 65, 67, 69, 70, 73],
          month: [55, 62, 68, 73],
          semester: [50, 55, 60, 65, 70, 75],
        },
        6: {
          // Dip then recovery
          week: [75, 72, 70, 72, 75, 78, 80],
          month: [76, 70, 73, 78],
          semester: [74, 76, 72, 68, 74, 78],
        },
      };

      // Default pattern if course ID not found
      const defaultPattern = {
        week: [65, 68, 72, 74, 76, 76, 78],
        month: [62, 68, 73, 76],
        semester: [58, 65, 70, 72, 75, 76],
      };

      // Get pattern for this course or use default
      const pattern = patterns[courseId] || defaultPattern;

      // Labels for each time range
      const labels = {
        week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        month: ["Week 1", "Week 2", "Week 3", "Week 4"],
        semester: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"],
      };

      return {
        labels: labels[timeRange],
        data: pattern[timeRange],
      };
    },

    getRandomSuggestion(topic, difficultyScore) {
      const suggestions = [
        `Consider revisiting ${topic} fundamentals`,
        `More practice problems on ${topic} may help students`,
        `Students are struggling with ${topic} concepts`,
        `Additional visual aids for ${topic} might improve understanding`,
        `Interactive exercises for ${topic} could boost engagement`,
        `Consider dedicating more time to ${topic} in upcoming lectures`,
      ];

      return suggestions[Math.floor(Math.random() * suggestions.length)];
    },

    generateRecommendations(course, knowledgeGaps, activityLevels) {
      const recommendations = [];

      // High priority recommendation based on the most difficult topic
      if (knowledgeGaps.length > 0) {
        const hardestTopic = knowledgeGaps[knowledgeGaps.length - 1];
        recommendations.push({
          priority: "high",
          category: "Content",
          message: `Consider providing additional practice problems on ${hardestTopic.topic} as ${hardestTopic.difficultyScore}% of students struggled with this concept.`,
          action: "Create Materials",
        });
      }

      // Check for engagement issues
      const weekendActivity = (activityLevels[5] + activityLevels[6]) / 2; // Sat & Sun
      if (weekendActivity < 30) {
        recommendations.push({
          priority: "medium",
          category: "Engagement",
          message:
            "Weekend participation is low. Consider optional activities that students can complete on their own time.",
          action: "Plan Activities",
        });
      }

      // Check for inactive students
      const inactiveStudents =
        course.engagement.total - course.engagement.active;
      if (inactiveStudents > 0) {
        recommendations.push({
          priority: "medium",
          category: "Engagement",
          message: `${inactiveStudents} students haven't logged in for more than 2 weeks. Consider reaching out to check on their progress.`,
          action: "Send Message",
        });
      }

      // Low priority recommendation based on course progress
      recommendations.push({
        priority: "low",
        category: "Pacing",
        message:
          "Course is progressing 15% faster than typical. Consider adding enrichment content for advanced students.",
        action: "Explore Resources",
      });

      return recommendations;
    },
  },
});
