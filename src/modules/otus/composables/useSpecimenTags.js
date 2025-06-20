import { ref, computed } from 'vue'
import TaxonWorks from '../services/TaxonWorks'
import { SPECIMEN_TAG_CONFIG } from '../constants/specimenTags'

export function useSpecimenTags() {
  const keywords = ref([])
  const selectedTagIds = ref([])
  const isLoadingTags = ref(false)
  const tagsError = ref(null)

  // Get filtered tags based on configuration
  const availableTags = computed(() => {
    return keywords.value
      .filter(keyword => {
        const config = SPECIMEN_TAG_CONFIG[keyword.name]
        // Show all keywords from API, use config for enhanced display if available
        return config ? config.visible : true
      })
      .map(keyword => ({
        id: keyword.id,
        name: SPECIMEN_TAG_CONFIG[keyword.name]?.name || keyword.name,
        description: SPECIMEN_TAG_CONFIG[keyword.name]?.description,
        definition: keyword.definition,
        category: SPECIMEN_TAG_CONFIG[keyword.name]?.category || 'general',
        originalName: keyword.name,
        cssColor: keyword.css_color
      }))
  })

  // Load all keywords from API
  const loadTags = async () => {
    isLoadingTags.value = true
    tagsError.value = null
    
    try {
      const response = await TaxonWorks.getKeywords()
      keywords.value = response.data || []
    } catch (error) {
      console.error('Error loading keywords:', error)
      tagsError.value = 'Failed to load tags'
      keywords.value = []
    } finally {
      isLoadingTags.value = false
    }
  }

  // Update selected tags
  const updateSelectedTags = (tagIds) => {
    selectedTagIds.value = tagIds
  }

  // Clear all selected tags
  const clearSelectedTags = () => {
    selectedTagIds.value = []
  }

  // Get specimens with tag filtering (client-side filtering)
  const getFilteredSpecimens = async (otuId, options = {}) => {
    // Always get all specimens first
    const response = await TaxonWorks.getDescendantsDarwinCore(otuId, options)
    const allSpecimens = response.data || []
    
    // If no tags are selected, return all specimens
    if (selectedTagIds.value.length === 0) {
      return response
    }
    
    // Get tags for all specimens to filter them
    if (allSpecimens.length === 0) {
      return response
    }
    
    const collectionObjectIds = allSpecimens.map(s => s.dwc_occurrence_object_id).filter(Boolean)
    if (collectionObjectIds.length === 0) {
      return response
    }
    
    try {
      const tagsResponse = await TaxonWorks.getCollectionObjectsTags(collectionObjectIds)
      const allTags = tagsResponse.data || []
      
      // Filter specimens based on selected keyword IDs
      const filteredSpecimens = allSpecimens.filter(specimen => {
        const specimenTags = allTags.filter(tag => 
          tag.tag_object_id === specimen.dwc_occurrence_object_id
        )
        
        // Check if any of the specimen's tags match selected keyword IDs
        return specimenTags.some(tag => 
          selectedTagIds.value.includes(tag.keyword_id)
        )
      })
      
      // Return response with filtered data
      return {
        ...response,
        data: filteredSpecimens
      }
    } catch (error) {
      console.error('Error filtering by tags:', error)
      return response // Return unfiltered on error
    }
  }

  return {
    availableTags,
    selectedTagIds,
    isLoadingTags,
    tagsError,
    loadTags,
    updateSelectedTags,
    clearSelectedTags,
    getFilteredSpecimens
  }
}