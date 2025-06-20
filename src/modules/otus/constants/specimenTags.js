// Configuration for specimen tags
// This table provides UI enhancements for tags defined in TaxonWorks
// The keys should match the tag names from the API

export const SPECIMEN_TAG_CONFIG = {
  // Current tags in the system
  'Lot': {
    name: 'Lot',
    description: 'Lot of specimens not georeferenced',
    category: 'collection',
    visible: true
  },
  'Sex': {
    name: 'Sex',
    description: 'Sex determination tag',
    category: 'biological',
    visible: true
  },
  
  // Future tags for educational use
  'education-suitable': {
    name: 'Education Suitable',
    description: 'Secondary specimens suitable for classroom use',
    category: 'loan',
    visible: true
  },
  'education-loan': {
    name: 'Education Loan',
    description: 'Available for educational borrowing',
    category: 'loan',
    visible: true
  },
  
  // Future tags for identification status
  'needs-identification': {
    name: 'Needs Identification',
    description: 'Specimens requiring expert identification',
    category: 'identification',
    visible: true
  },
  'family-only': {
    name: 'Family Only',
    description: 'Identified to family level only',
    category: 'identification',
    visible: true
  },
  'order-only': {
    name: 'Order Only',
    description: 'Identified to order level only',
    category: 'identification',
    visible: true
  },
  'genus-only': {
    name: 'Genus Only',
    description: 'Identified to genus level only',
    category: 'identification',
    visible: true
  },
  
  // Future condition tags
  'good-condition': {
    name: 'Good Condition',
    description: 'Specimen in good physical condition',
    category: 'condition',
    visible: true
  },
  'damaged': {
    name: 'Damaged',
    description: 'Specimen has some damage',
    category: 'condition',
    visible: true
  },
  'fragile': {
    name: 'Fragile',
    description: 'Requires careful handling',
    category: 'condition',
    visible: true
  },
  
  // Future research tags
  'type-specimen': {
    name: 'Type Specimen',
    description: 'Type material - restricted access',
    category: 'research',
    visible: true
  },
  'research-priority': {
    name: 'Research Priority',
    description: 'High priority for research',
    category: 'research',
    visible: true
  },
  'dna-suitable': {
    name: 'DNA Suitable',
    description: 'Suitable for molecular work',
    category: 'research',
    visible: true
  },
  
  // Administrative tags (hidden from public)
  'internal-review': {
    name: 'Internal Review',
    description: 'Needs internal review',
    category: 'admin',
    visible: false
  },
  'restricted': {
    name: 'Restricted',
    description: 'Restricted access',
    category: 'admin',
    visible: false
  }
}

// Helper function to get only visible tags
export function getVisibleTags() {
  return Object.entries(SPECIMEN_TAG_CONFIG)
    .filter(([_, config]) => config.visible)
    .map(([key, config]) => ({
      id: key,
      name: config.name,
      description: config.description,
      category: config.category
    }))
}

// Helper function to get tags by category
export function getTagsByCategory(category) {
  return Object.entries(SPECIMEN_TAG_CONFIG)
    .filter(([_, config]) => config.category === category && config.visible)
    .map(([key, config]) => ({
      id: key,
      name: config.name,
      description: config.description,
      category: config.category
    }))
}

// Helper function to format tag for display
export function formatTag(tagKey) {
  const config = SPECIMEN_TAG_CONFIG[tagKey]
  return config ? config.name : tagKey
}