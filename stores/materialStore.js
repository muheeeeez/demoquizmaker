import { defineStore } from 'pinia'
import axios from 'axios'
import { useCourseStore, BASE_API_URL } from './courseStore'

// Demo materials data
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
  ]
}

// Demo knowledge gaps data
const demoKnowledgeGaps = {
  1: [
    {
      topic: 'Advanced Algorithms',
      percentage: 68,
      description: '32% of students struggled with questions on this topic'
    },
    {
      topic: 'Data Structures',
      percentage: 72,
      description: '28% of students need additional help with this concept'
    },
    {
      topic: 'Object-Oriented Design',
      percentage: 60,
      description: '40% of students would benefit from additional materials'
    }
  ],
  2: [
    {
      topic: 'Limits and Continuity',
      percentage: 75,
      description: '25% of students struggled with questions on this topic'
    },
    {
      topic: 'Derivatives',
      percentage: 70,
      description: '30% of students need additional help with this concept'
    }
  ],
  3: [
    {
      topic: 'Newton\'s Laws',
      percentage: 80,
      description: '20% of students struggled with questions on this topic'
    },
    {
      topic: 'Electromagnetism',
      percentage: 65,
      description: '35% of students need additional help with this concept'
    },
    {
      topic: 'Quantum Mechanics',
      percentage: 55,
      description: '45% of students would benefit from additional materials'
    }
  ]
}

export const useMaterialStore = defineStore('material', {
  state: () => ({
    materials: {},
    knowledgeGaps: {},
    isLoading: false,
    error: null
  }),
  
  getters: {
    // Materials for active course
    courseMaterials: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return []
      
      return state.materials[courseStore.activeCourse.id] || []
    },
    
    // Knowledge gaps for active course
    courseKnowledgeGaps: (state) => {
      const courseStore = useCourseStore()
      if (!courseStore.activeCourse) return []
      
      return state.knowledgeGaps[courseStore.activeCourse.id] || []
    },
    
    // Group materials by type
    documentMaterials: (state) => {
      return state.courseMaterials.filter(material => material.type === 'document')
    },
    
    presentationMaterials: (state) => {
      return state.courseMaterials.filter(material => material.type === 'presentation')
    },
    
    videoMaterials: (state) => {
      return state.courseMaterials.filter(material => material.type === 'video')
    },
    
    // Sorted materials (newest first)
    sortedMaterials: (state) => {
      return [...state.courseMaterials].sort((a, b) => {
        return new Date(b.uploadedAt) - new Date(a.uploadedAt)
      })
    }
  },
  
  actions: {
    /**
     * Fetch materials for a course
     */
    async fetchMaterials(courseId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/courses/${courseId}/materials`)
        // this.materials[courseId] = response.data
        
        // Demo data for now
        this.materials[courseId] = demoMaterials[courseId] || []
      } catch (err) {
        console.error('Error fetching materials:', err)
        this.error = 'Failed to load materials'
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Fetch knowledge gaps for a course
     */
    async fetchKnowledgeGaps(courseId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Replace with API call once backend is ready
        // const response = await axios.get(`${BASE_API_URL}/courses/${courseId}/knowledge-gaps`)
        // this.knowledgeGaps[courseId] = response.data
        
        // Demo data for now
        this.knowledgeGaps[courseId] = demoKnowledgeGaps[courseId] || []
      } catch (err) {
        console.error('Error fetching knowledge gaps:', err)
        this.error = 'Failed to load knowledge gaps'
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Load materials and knowledge gaps for the active course
     */
    async loadActiveMaterials() {
      const courseStore = useCourseStore()
      if (courseStore.activeCourse) {
        await Promise.all([
          this.fetchMaterials(courseStore.activeCourse.id),
          this.fetchKnowledgeGaps(courseStore.activeCourse.id)
        ])
      }
    },
    
    /**
     * Upload a material
     */
    async uploadMaterial(courseId, materialData) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const formData = new FormData()
        // Object.keys(materialData).forEach(key => {
        //   formData.append(key, materialData[key])
        // })
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/materials`, formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // })
        // return response.data
        
        console.log('Uploading material:', materialData, 'for course:', courseId)
        
        // Generate a unique ID for the new material
        const newMaterialId = Date.now()
        
        // Create a new material object
        const newMaterial = {
          id: newMaterialId,
          ...materialData,
          uploadedAt: new Date().toISOString(),
          url: '#'
        }
        
        // Add to local store
        if (!this.materials[courseId]) {
          this.materials[courseId] = []
        }
        
        this.materials[courseId].push(newMaterial)
        
        return { success: true, message: 'Material uploaded (demo)', material: newMaterial }
      } catch (err) {
        console.error('Error uploading material:', err)
        this.error = 'Failed to upload material'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Delete a material
     */
    async deleteMaterial(courseId, materialId) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.delete(`${BASE_API_URL}/courses/${courseId}/materials/${materialId}`)
        // return response.data
        
        console.log('Deleting material:', materialId, 'from course:', courseId)
        
        // Remove from local store
        if (this.materials[courseId]) {
          this.materials[courseId] = this.materials[courseId].filter(m => m.id !== materialId)
        }
        
        return { success: true, message: 'Material deleted (demo)' }
      } catch (err) {
        console.error('Error deleting material:', err)
        this.error = 'Failed to delete material'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Generate materials for knowledge gaps
     */
    async generateMaterials(courseId, topics) {
      this.isLoading = true
      this.error = null
      
      try {
        // TODO: Implement API call
        // const response = await axios.post(`${BASE_API_URL}/courses/${courseId}/materials/generate`, { topics })
        // return response.data
        
        console.log('Generating materials for topics:', topics, 'in course:', courseId)
        
        // In a real application, this would trigger AI generation of materials
        // For demo, we'll just return a success message
        
        return { 
          success: true, 
          message: 'Materials generated (demo)',
          materials: topics.map((topic, index) => ({
            id: Date.now() + index,
            title: `AI Generated: ${topic}`,
            type: 'document',
            format: 'pdf',
            size: '1.2 MB',
            uploadedAt: new Date().toISOString(),
            url: '#',
            isGenerated: true
          }))
        }
      } catch (err) {
        console.error('Error generating materials:', err)
        this.error = 'Failed to generate materials'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 