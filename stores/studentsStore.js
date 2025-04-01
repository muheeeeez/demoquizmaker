import { defineStore } from "pinia";

// Demo student data organized by course ID
const demoStudents = {
  1: [
    {
      id: 1001,
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      quizzesCompleted: 4,
      averageScore: 92,
      lastActive: '2023-04-05T14:30:00Z'
    },
    {
      id: 1002,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      quizzesCompleted: 3,
      averageScore: 88,
      lastActive: '2023-04-05T09:15:00Z'
    },
    {
      id: 1003,
      name: 'Sarah Martinez',
      email: 'sarah.martinez@example.com',
      quizzesCompleted: 4,
      averageScore: 95,
      lastActive: '2023-04-05T16:45:00Z'
    },
    {
      id: 1004,
      name: 'David Kim',
      email: 'david.kim@example.com',
      quizzesCompleted: 2,
      averageScore: 78,
      lastActive: '2023-04-04T10:20:00Z'
    },
    {
      id: 1005,
      name: 'Jessica Brown',
      email: 'jessica.brown@example.com',
      quizzesCompleted: 4,
      averageScore: 91,
      lastActive: '2023-04-05T11:30:00Z'
    }
  ],
  2: [
    {
      id: 2001,
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      quizzesCompleted: 2,
      averageScore: 84,
      lastActive: '2023-04-04T13:45:00Z'
    },
    {
      id: 2002,
      name: 'Olivia Wilson',
      email: 'olivia.wilson@example.com',
      quizzesCompleted: 2,
      averageScore: 91,
      lastActive: '2023-04-05T09:30:00Z'
    },
    {
      id: 2003,
      name: 'Ethan Rodriguez',
      email: 'ethan.rodriguez@example.com',
      quizzesCompleted: 1,
      averageScore: 75,
      lastActive: '2023-04-03T15:20:00Z'
    }
  ],
  3: [
    {
      id: 3001,
      name: 'Jason Lee',
      email: 'jason.lee@example.com',
      quizzesCompleted: 3,
      averageScore: 89,
      lastActive: '2023-04-05T08:45:00Z'
    },
    {
      id: 3002,
      name: 'Amanda Patel',
      email: 'amanda.patel@example.com',
      quizzesCompleted: 3,
      averageScore: 94,
      lastActive: '2023-04-05T10:15:00Z'
    },
    {
      id: 3003,
      name: 'Lucas Garcia',
      email: 'lucas.garcia@example.com',
      quizzesCompleted: 2,
      averageScore: 82,
      lastActive: '2023-04-04T14:30:00Z'
    },
    {
      id: 3004,
      name: 'Emma Nguyen',
      email: 'emma.nguyen@example.com',
      quizzesCompleted: 3,
      averageScore: 87,
      lastActive: '2023-04-05T11:45:00Z'
    }
  ],
  4: [
    {
      id: 4001,
      name: 'Tyler Scott',
      email: 'tyler.scott@example.com',
      quizzesCompleted: 4,
      averageScore: 91,
      lastActive: '2023-04-05T13:20:00Z'
    },
    {
      id: 4002,
      name: 'Maya Johnson',
      email: 'maya.johnson@example.com',
      quizzesCompleted: 4,
      averageScore: 94,
      lastActive: '2023-04-05T09:45:00Z'
    },
    {
      id: 4003,
      name: 'Daniel Kim',
      email: 'daniel.kim@example.com',
      quizzesCompleted: 3,
      averageScore: 86,
      lastActive: '2023-04-04T16:30:00Z'
    },
    {
      id: 4004,
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      quizzesCompleted: 4,
      averageScore: 92,
      lastActive: '2023-04-05T10:15:00Z'
    },
    {
      id: 4005,
      name: 'Aiden Wilson',
      email: 'aiden.wilson@example.com',
      quizzesCompleted: 2,
      averageScore: 78,
      lastActive: '2023-04-03T14:45:00Z'
    },
    {
      id: 4006,
      name: 'Isabella Thomas',
      email: 'isabella.thomas@example.com',
      quizzesCompleted: 4,
      averageScore: 90,
      lastActive: '2023-04-05T11:30:00Z'
    }
  ]
};

// Demo student performance data
const demoStudentPerformance = {
  // Format: studentId: performanceData
  1001: {
    strengths: ['Variables', 'Control Structures'],
    weaknesses: ['Object-Oriented Programming', 'Advanced Algorithms'],
    quizzes: [
      { name: 'Quiz 1', score: 90, date: '2023-03-10' },
      { name: 'Quiz 2', score: 95, date: '2023-03-17' },
      { name: 'Quiz 3', score: 88, date: '2023-03-24' },
      { name: 'Quiz 4', score: 94, date: '2023-03-31' }
    ],
    attendance: 92,
    notes: 'Emily shows consistent performance. Excels in problem-solving.'
  },
  2001: {
    strengths: ['Limits', 'Derivatives'],
    weaknesses: ['Integration', 'Series'],
    quizzes: [
      { name: 'Quiz 1', score: 85, date: '2023-03-12' },
      { name: 'Quiz 2', score: 82, date: '2023-03-19' }
    ],
    attendance: 78,
    notes: 'Alex has potential but needs to improve attendance.'
  }
  // More student performance data would be added here
};

export const useStudentsStore = defineStore("students", {
  state: () => ({
    students: {},
    studentDetails: {},
    activeStudent: null,
    loading: false,
    error: null,
    searchQuery: '',
    progressFilter: 'all', // all, high, medium, low
    activityFilter: 'all', // all, recent, inactive
    currentPage: 1,
    studentsPerPage: 10
  }),

  getters: {
    /**
     * Get all students for a specific course
     */
    getStudents: (state) => (courseId) => {
      return state.students[courseId] || [];
    },
    
    /**
     * Get a student by ID
     */
    getStudentById: (state) => (courseId, studentId) => {
      const students = state.students[courseId] || [];
      return students.find(student => student.id === studentId) || null;
    },
    
    /**
     * Get student performance details
     */
    getStudentPerformance: (state) => (studentId) => {
      return state.studentDetails[studentId] || null;
    },
    
    /**
     * Get filtered students based on search and filters
     */
    getFilteredStudents: (state) => (courseId) => {
      let students = state.students[courseId] || [];
      
      // Apply search filter
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim();
        students = students.filter(student => 
          student.name.toLowerCase().includes(query) || 
          student.email.toLowerCase().includes(query)
        );
      }
      
      // Apply progress filter
      if (state.progressFilter !== 'all') {
        students = students.filter(student => {
          const avgScore = student.averageScore;
          if (state.progressFilter === 'high') return avgScore >= 85;
          if (state.progressFilter === 'medium') return avgScore >= 70 && avgScore < 85;
          if (state.progressFilter === 'low') return avgScore < 70;
          return true;
        });
      }
      
      // Apply activity filter
      if (state.activityFilter !== 'all') {
        students = students.filter(student => {
          const lastActive = new Date(student.lastActive);
          const now = new Date();
          const diffDays = Math.ceil((now - lastActive) / (1000 * 60 * 60 * 24));
          
          if (state.activityFilter === 'recent') return diffDays <= 7;
          if (state.activityFilter === 'inactive') return diffDays > 7;
          return true;
        });
      }
      
      return students;
    },
    
    /**
     * Get paginated students
     */
    getPaginatedStudents: (state) => (courseId) => {
      const filtered = state.getFilteredStudents(courseId);
      const start = (state.currentPage - 1) * state.studentsPerPage;
      const end = start + state.studentsPerPage;
      
      return filtered.slice(start, end);
    },
    
    /**
     * Get total pages for pagination
     */
    getTotalPages: (state) => (courseId) => {
      const filtered = state.getFilteredStudents(courseId);
      return Math.ceil(filtered.length / state.studentsPerPage) || 1;
    }
  },

  actions: {
    /**
     * Fetch students for a specific course
     */
    async fetchStudents(courseId) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${courseId}/students`);
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use demo data or generate if not available
        this.students[courseId] = demoStudents[courseId] || this.generateDemoStudents(courseId);
        
        return this.students[courseId];
      } catch (error) {
        console.error('Error fetching students:', error);
        this.error = 'Failed to load students';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Fetch detailed performance data for a student
     */
    async fetchStudentDetails(courseId, studentId) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${courseId}/students/${studentId}/performance`);
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Use demo data or generate if not available
        if (demoStudentPerformance[studentId]) {
          this.studentDetails[studentId] = demoStudentPerformance[studentId];
        } else {
          this.studentDetails[studentId] = this.generateStudentPerformance(courseId, studentId);
        }
        
        return this.studentDetails[studentId];
      } catch (error) {
        console.error('Error fetching student details:', error);
        this.error = 'Failed to load student performance data';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Set the active student
     */
    setActiveStudent(student) {
      this.activeStudent = student;
    },
    
    /**
     * Update search query
     */
    updateSearchQuery(query) {
      this.searchQuery = query;
      this.currentPage = 1; // Reset to first page when searching
    },
    
    /**
     * Update progress filter
     */
    updateProgressFilter(filter) {
      this.progressFilter = filter;
      this.currentPage = 1;
    },
    
    /**
     * Update activity filter
     */
    updateActivityFilter(filter) {
      this.activityFilter = filter;
      this.currentPage = 1;
    },
    
    /**
     * Navigate to a specific page
     */
    setPage(page) {
      this.currentPage = page;
    },
    
    /**
     * Add a new student to a course
     */
    async addStudent(courseId, studentData) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${courseId}/students`, {
        //   method: 'POST',
        //   body: JSON.stringify(studentData)
        // });
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create a new student object
        const newStudent = {
          id: Date.now(),
          name: studentData.name,
          email: studentData.email,
          quizzesCompleted: 0,
          averageScore: 0,
          lastActive: new Date().toISOString()
        };
        
        // Initialize students array for this course if it doesn't exist
        if (!this.students[courseId]) {
          this.students[courseId] = [];
        }
        
        // Add the new student
        this.students[courseId].push(newStudent);
        
        return newStudent;
      } catch (error) {
        console.error('Error adding student:', error);
        this.error = 'Failed to add student';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Update student notes
     */
    async updateStudentNotes(courseId, studentId, notes) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${courseId}/students/${studentId}/notes`, {
        //   method: 'PUT',
        //   body: JSON.stringify({ notes })
        // });
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update notes in student details
        if (this.studentDetails[studentId]) {
          this.studentDetails[studentId].notes = notes;
        } else {
          await this.fetchStudentDetails(courseId, studentId);
          this.studentDetails[studentId].notes = notes;
        }
        
        return true;
      } catch (error) {
        console.error('Error updating student notes:', error);
        this.error = 'Failed to update notes';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Generate demo student data for courses without predefined data
     */
    generateDemoStudents(courseId) {
      const firstNames = ['John', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
      
      // Generate 3-8 students based on courseId
      const count = 3 + (courseId % 6);
      
      return Array.from({ length: count }, (_, index) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@example.com`;
        
        // Vary quizzes completed and scores based on courseId for more realistic data
        const quizzesCompleted = Math.floor(Math.random() * 4) + 1; // 1-4 quizzes
        const averageScore = 65 + Math.floor(Math.random() * 30); // Scores between 65-95
        
        // Generate last active date (between 1-14 days ago)
        const daysAgo = Math.floor(Math.random() * 14) + 1;
        const lastActive = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000)).toISOString();
        
        return {
          id: (courseId * 10000) + index + 1,
          name,
          email,
          quizzesCompleted,
          averageScore,
          lastActive
        };
      });
    },
    
    /**
     * Generate demo performance data for a student
     */
    generateStudentPerformance(courseId, studentId) {
      // Find student data
      const student = this.getStudentById(courseId, studentId);
      
      // Course-specific topics
      const courseTopics = {
        1: ['Variables', 'Control Structures', 'Functions', 'Object-Oriented Programming', 'Advanced Algorithms'],
        2: ['Limits', 'Derivatives', 'Integration', 'Series', 'Multivariable Calculus'],
        3: ['Data Structures', 'Algorithms', 'Complexity Analysis', 'Graph Theory', 'Dynamic Programming'],
        4: ['HTML/CSS', 'JavaScript', 'DOM Manipulation', 'API Integration', 'React Fundamentals']
      };
      
      // Get topics for this course or use defaults
      const topics = courseTopics[courseId] || ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5'];
      
      // Generate random strengths and weaknesses
      const shuffled = [...topics].sort(() => 0.5 - Math.random());
      const strengths = shuffled.slice(0, 2);
      const weaknesses = shuffled.slice(2, 4);
      
      // Generate quiz data
      const quizzes = [];
      for (let i = 0; i < (student?.quizzesCompleted || 3); i++) {
        const date = new Date();
        date.setDate(date.getDate() - (7 * (i + 1))); // Weekly quizzes
        
        quizzes.push({
          name: `Quiz ${i + 1}`,
          score: student?.averageScore ? student.averageScore + Math.floor(Math.random() * 10) - 5 : 75 + Math.floor(Math.random() * 20),
          date: date.toISOString().split('T')[0]
        });
      }
      
      // Generate attendance percentage
      const attendance = student?.averageScore ? student.averageScore - Math.floor(Math.random() * 10) : 70 + Math.floor(Math.random() * 25);
      
      return {
        strengths,
        weaknesses,
        quizzes,
        attendance,
        notes: ''
      };
    }
  }
}); 