import { defineStore } from "pinia";

// Demo materials data organized by course ID
const demoMaterials = {
  1: [
    {
      id: 10001,
      title: 'Introduction to Programming Concepts',
      type: 'document',
      format: 'pdf',
      size: '2.4 MB',
      uploadedAt: '2023-03-10T09:30:00Z',
      url: '#'
    },
    {
      id: 10002,
      title: 'Variables and Data Types',
      type: 'presentation',
      format: 'pptx',
      size: '5.1 MB',
      uploadedAt: '2023-03-12T14:15:00Z',
      url: '#'
    },
    {
      id: 10003,
      title: 'Control Structures Tutorial',
      type: 'video',
      format: 'mp4',
      size: '45.7 MB',
      uploadedAt: '2023-03-15T11:45:00Z',
      url: '#',
      duration: '12:34'
    }
  ],
  2: [
    {
      id: 20001,
      title: 'Limits and Continuity',
      type: 'document',
      format: 'pdf',
      size: '3.2 MB',
      uploadedAt: '2023-03-08T10:20:00Z',
      url: '#'
    },
    {
      id: 20002,
      title: 'Derivatives Practice Problems',
      type: 'document',
      format: 'pdf',
      size: '1.8 MB',
      uploadedAt: '2023-03-14T15:30:00Z',
      url: '#'
    }
  ],
  3: [
    {
      id: 30001,
      title: 'Data Structures Overview',
      type: 'document',
      format: 'pdf',
      size: '4.5 MB',
      uploadedAt: '2023-03-05T08:30:00Z',
      url: '#'
    },
    {
      id: 30002,
      title: 'Algorithm Complexity',
      type: 'presentation',
      format: 'pptx',
      size: '8.2 MB',
      uploadedAt: '2023-03-10T13:45:00Z',
      url: '#'
    },
    {
      id: 30003,
      title: 'Tree Traversal Demo',
      type: 'video',
      format: 'mp4',
      size: '62.8 MB',
      uploadedAt: '2023-03-18T14:30:00Z',
      url: '#',
      duration: '18:22'
    }
  ],
  4: [
    {
      id: 40001,
      title: 'HTML Fundamentals',
      type: 'document',
      format: 'pdf',
      size: '2.1 MB',
      uploadedAt: '2023-03-07T09:15:00Z',
      url: '#'
    },
    {
      id: 40002,
      title: 'CSS Layouts and Flexbox',
      type: 'document',
      format: 'pdf',
      size: '3.4 MB',
      uploadedAt: '2023-03-12T11:30:00Z',
      url: '#'
    },
    {
      id: 40003,
      title: 'JavaScript Basics',
      type: 'presentation',
      format: 'pptx',
      size: '4.8 MB',
      uploadedAt: '2023-03-15T14:45:00Z',
      url: '#'
    },
    {
      id: 40004,
      title: 'Building Your First Web App',
      type: 'video',
      format: 'mp4',
      size: '78.5 MB',
      uploadedAt: '2023-03-20T10:00:00Z',
      url: '#',
      duration: '25:14'
    }
  ]
};

export const useMaterialsStore = defineStore("materials", {
  state: () => ({
    materials: {},
    loading: false,
    error: null,
    uploadProgress: 0,
    currentView: 'all' // all, documents, presentations, videos
  }),

  getters: {
    /**
     * Get all materials for a specific course
     */
    getCourseMaterials: (state) => (courseId) => {
      return state.materials[courseId] || [];
    },
    
    /**
     * Get documents for a specific course
     */
    getCourseDocuments: (state) => (courseId) => {
      const materials = state.materials[courseId] || [];
      return materials.filter(material => material.type === 'document');
    },
    
    /**
     * Get presentations for a specific course
     */
    getCoursePresentations: (state) => (courseId) => {
      const materials = state.materials[courseId] || [];
      return materials.filter(material => material.type === 'presentation');
    },
    
    /**
     * Get videos for a specific course
     */
    getCourseVideos: (state) => (courseId) => {
      const materials = state.materials[courseId] || [];
      return materials.filter(material => material.type === 'video');
    },
    
    /**
     * Get specific material by ID for a course
     */
    getMaterialById: (state) => (courseId, materialId) => {
      const materials = state.materials[courseId] || [];
      return materials.find(material => material.id === materialId) || null;
    }
  },

  actions: {
    /**
     * Fetch materials for a specific course
     */
    async fetchMaterials(courseId) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${courseId}/materials`);
        // const data = await response.json();
        
        // Demo data - simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use demo data or generate if not available
        this.materials[courseId] = demoMaterials[courseId] || this.generateDemoMaterials(courseId);
        
        return this.materials[courseId];
      } catch (error) {
        console.error('Error fetching materials:', error);
        this.error = 'Failed to load course materials';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Upload a new material to a course
     */
    async uploadMaterial(courseId, materialData) {
      this.loading = true;
      this.error = null;
      this.uploadProgress = 0;
      
      try {
        // In a real app, this would be a file upload
        // const formData = new FormData();
        // for (const key in materialData) {
        //   formData.append(key, materialData[key]);
        // }
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          this.uploadProgress += 10;
          if (this.uploadProgress >= 100) {
            clearInterval(progressInterval);
          }
        }, 300);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Clear interval if it's still running
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        
        // Generate a new material object
        const newMaterial = {
          id: Date.now(),
          title: materialData.title,
          type: materialData.type,
          format: materialData.format,
          size: materialData.size || '3.2 MB',
          uploadedAt: new Date().toISOString(),
          url: '#'
        };
        
        // Add duration if it's a video
        if (materialData.type === 'video' && materialData.duration) {
          newMaterial.duration = materialData.duration;
        }
        
        // Initialize materials array for this course if it doesn't exist
        if (!this.materials[courseId]) {
          this.materials[courseId] = [];
        }
        
        // Add the new material
        this.materials[courseId].push(newMaterial);
        
        return newMaterial;
      } catch (error) {
        console.error('Error uploading material:', error);
        this.error = 'Failed to upload material';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Delete a material
     */
    async deleteMaterial(courseId, materialId) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        // await fetch(`/api/courses/${courseId}/materials/${materialId}`, {
        //   method: 'DELETE'
        // });
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove the material from the store
        if (this.materials[courseId]) {
          this.materials[courseId] = this.materials[courseId].filter(
            material => material.id !== materialId
          );
        }
        
        return true;
      } catch (error) {
        console.error('Error deleting material:', error);
        this.error = 'Failed to delete material';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Generate AI materials for topics
     */
    async generateAIMaterials(courseId, topics) {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real app, this would call an AI service
        // const response = await fetch(`/api/courses/${courseId}/generate-materials`, {
        //   method: 'POST',
        //   body: JSON.stringify({ topics })
        // });
        // const data = await response.json();
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate materials for each topic
        const newMaterials = topics.map((topic, index) => {
          const materialTypes = [
            { type: 'document', format: 'pdf', size: '2.8 MB' },
            { type: 'presentation', format: 'pptx', size: '4.5 MB' },
            { type: 'video', format: 'mp4', size: '38.2 MB', duration: '10:45' }
          ];
          
          const materialType = materialTypes[index % materialTypes.length];
          
          return {
            id: Date.now() + index,
            title: `${topic} - AI Generated Material`,
            ...materialType,
            uploadedAt: new Date().toISOString(),
            url: '#',
            aiGenerated: true
          };
        });
        
        // Initialize materials array for this course if it doesn't exist
        if (!this.materials[courseId]) {
          this.materials[courseId] = [];
        }
        
        // Add the new materials
        this.materials[courseId] = [...this.materials[courseId], ...newMaterials];
        
        return newMaterials;
      } catch (error) {
        console.error('Error generating AI materials:', error);
        this.error = 'Failed to generate materials';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Change the current view filter
     */
    setCurrentView(view) {
      this.currentView = view;
    },
    
    /**
     * Generate demo materials for courses without predefined data
     */
    generateDemoMaterials(courseId) {
      const materialTypes = [
        {
          type: 'document',
          format: 'pdf',
          title: 'Course Introduction',
          size: '1.8 MB'
        },
        {
          type: 'document',
          format: 'pdf',
          title: 'Week 1 Notes',
          size: '2.4 MB'
        },
        {
          type: 'presentation',
          format: 'pptx',
          title: 'Key Concepts Overview',
          size: '5.6 MB'
        },
        {
          type: 'video',
          format: 'mp4',
          title: 'Getting Started Tutorial',
          size: '32.5 MB',
          duration: '8:45'
        }
      ];
      
      // Generate 3-5 materials based on courseId
      const count = 3 + (courseId % 3);
      
      return Array.from({ length: count }, (_, index) => {
        const templateIndex = index % materialTypes.length;
        const template = materialTypes[templateIndex];
        
        return {
          id: (courseId * 10000) + index + 1,
          title: `${template.title} - Course ${courseId}`,
          type: template.type,
          format: template.format,
          size: template.size,
          uploadedAt: new Date(Date.now() - (index * 86400000)).toISOString(), // Different days
          url: '#',
          ...(template.type === 'video' ? { duration: template.duration } : {})
        };
      });
    }
  }
}); 