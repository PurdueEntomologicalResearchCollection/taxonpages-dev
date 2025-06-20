# Tag Filtering Implementation for PERC TaxonPages

## Overview

This document summarizes the implementation of multi-select tag filtering for the Purdue Entomological Research Collection (PERC) TaxonPages application. The system allows filtering of specimens by tags to support educational borrowing and identification workflows.

## Use Cases

PERC's 1.3 million specimen collection serves multiple audiences:

1. **Researchers** who can help identify unidentified specimens (e.g., specimens identified only to family level)
2. **Agricultural extension staff and educators** who want to borrow specimens suitable for classroom use
3. **Collection managers** who need to track specimen status and availability

## Implementation Components

### 1. Multi-Select Tag Component
**File:** `src/components/MultiSelect/MultiSelectTags.vue`
- Vue 3 dropdown interface with checkboxes
- Visual tag chips with color support (uses TaxonWorks CSS colors)
- Selected tags displayed as removable chips
- Supports tag descriptions and categories

### 2. Tag Configuration
**File:** `src/modules/otus/constants/specimenTags.js`
- Maps API tag names to user-friendly display names
- Provides descriptions and categorization
- Supports current tags ("Lot", "Sex") and future expansion
- Visibility control to hide administrative tags

### 3. API Integration
**File:** `src/modules/otus/services/TaxonWorks.js`
- `getKeywords()` - Fetches controlled vocabulary terms from `/controlled_vocabulary_terms`
- `getCollectionObjectsByTags()` - Filters specimens by `keyword_id[]` parameter
- `getCollectionObjectsTags()` - Gets tags for specific collection objects

### 4. Tag Management Composable
**File:** `src/modules/otus/composables/useSpecimenTags.js`
- Fetches keywords from TaxonWorks API
- Manages selected tag state
- **Client-side filtering** for Darwin Core specimens (API limitation workaround)
- Maps API tags to configured display names and descriptions

### 5. UI Integration
**Files:** 
- `src/modules/otus/components/Panel/PanelSpecimens/PanelSpecimens.vue` - Updated specimen panel
- `src/modules/otus/views/SpecimenSearch.vue` - Dedicated search page
- `config/header.yml` - Added navigation link

## Current Tags Available

Based on TaxonWorks API (`keyword_id: 5606`):
- **"Lot"** - Lot of specimens not georeferenced (100 specimens currently tagged)
  - Displayed with pink/red color (#ec8989)
  - Represents collection lots suitable for educational use

## API Limitations and Workarounds

### Darwin Core Endpoint Limitation
**Issue:** The `/otus/{id}/inventory/dwc.json` endpoint does not support `keyword_id[]` filtering.

**Solution:** Client-side filtering implementation:
1. Fetch all Darwin Core specimens for the OTU
2. Fetch tags for those specimens via `/tags` endpoint
3. Filter specimens based on selected keyword IDs
4. Return filtered results

### Autocomplete Limitation
**Issue:** The `/otus/autocomplete` endpoint cannot filter by specimen tags - it only searches by taxonomic names.

**Impact:** The dedicated specimen search page cannot effectively combine taxon search with tag filtering.

## Working Implementation

### ✅ Individual OTU Pages (Primary Use Case)
**URL Pattern:** `http://localhost:5173/taxonpages-dev/#/otus/{id}/overview`
**Example:** http://localhost:5173/taxonpages-dev/#/otus/1059869/overview

**Features:**
- Tag filtering works perfectly in specimen panels
- Users can filter specimens within a taxon by tags
- Matches real-world workflow: taxonomy first, then tag filtering

### ⚠️ Dedicated Search Page (Limited Functionality)
**URL:** http://localhost:5173/taxonpages-dev/#/specimens/search

**Limitations:**
- Cannot effectively combine taxon autocomplete with tag filtering
- Best used for tag-only searches across all specimens
- Autocomplete finds taxa by name, not by specimen tags

## Test Example: Lampyridae

To test the tag filtering functionality:

1. **Navigate to:** http://localhost:5173/taxonpages-dev/#/otus/1059869/overview
2. **OTU:** Family Lampyridae Rafinesque, 1815
3. **Specimens:** 4 total specimens, 1 tagged as "Lot"
4. **Test:** Select "Lot" in the tag filter - should show only specimen ID 8925965

## Recommended Workflow

The most effective workflow for PERC users:

1. **Search by taxonomy** using the main search (as normal)
2. **Navigate to taxon page** 
3. **Use tag filtering** in the specimen panel to find:
   - Specimens tagged as "Lot" (suitable for educational borrowing)
   - Specimens tagged as "needs-identification" (requiring expert help)
   - Specimens tagged as "education-suitable" (safe for classroom use)

## Future Expansion

The system is designed to accommodate additional tags as PERC continues tagging their collection:

### Educational Use Tags
- `education-suitable` - Secondary specimens suitable for classroom use
- `education-loan` - Available for educational borrowing

### Identification Status Tags  
- `needs-identification` - Specimens requiring expert identification
- `family-only` - Identified to family level only
- `order-only` - Identified to order level only
- `genus-only` - Identified to genus level only

### Condition Tags
- `good-condition` - Specimen in good physical condition
- `damaged` - Specimen has some damage  
- `fragile` - Requires careful handling

### Research Tags
- `type-specimen` - Type material (restricted access)
- `research-priority` - High priority for research
- `dna-suitable` - Suitable for molecular work

## Technical Notes

- **Client-side filtering** ensures compatibility with TaxonWorks API limitations
- **Vue 3 Composition API** used throughout for modern reactivity
- **Axios responses** use `.data` property (not `.body`)
- **Hash routing** used in application (`#` in URLs)
- **Color support** from TaxonWorks CSS color field displayed in UI
- **Error handling** gracefully falls back to unfiltered results

## Files Modified/Created

### New Files
- `src/components/MultiSelect/MultiSelectTags.vue`
- `src/modules/otus/constants/specimenTags.js`
- `src/modules/otus/composables/useSpecimenTags.js`
- `src/modules/otus/views/SpecimenSearch.vue`

### Modified Files
- `src/modules/otus/services/TaxonWorks.js`
- `src/modules/otus/components/Panel/PanelSpecimens/PanelSpecimens.vue`
- `src/modules/otus/router/index.js`
- `config/header.yml`

## Success Metrics

The implementation successfully provides:
- ✅ Multi-select tag filtering on individual OTU pages
- ✅ Real-time filtering of Darwin Core specimen data
- ✅ Visual tag representation with colors
- ✅ Integration with existing TaxonWorks API
- ✅ Future-ready tag configuration system
- ✅ Support for PERC's educational and research workflows