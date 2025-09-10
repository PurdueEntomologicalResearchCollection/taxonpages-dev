# Interactive Keys Analysis for TaxonPages & PERC

## Related Documents
- [Descriptors Project Index](./DESCRIPTORS_PROJECT_INDEX.md) - Main project documentation hub
- [OTU Descriptors Research](./OTU_DESCRIPTORS_RESEARCH.md) - Background on descriptors which power multi-entry keys
- [Descriptor UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md) - UI considerations that apply to keys

## Executive Summary

TaxonPages **already supports** both types of TaxonWorks keys, but PERC has **minimal key data** currently:
- Only 2 observation matrices exist ("Cerotoma revision" and "Experimental matrix")
- Most OTUs have no associated keys
- The infrastructure works but needs content creation

## Current Implementation Status

### TaxonPages Support ✅

TaxonPages has full support for both key types:

1. **Multi-Entry Keys** (Interactive Keys)
   - Component: `src/modules/interactiveKeys/views/InteractiveKey.vue`
   - Uses `@sfgrp/distinguish` package
   - Route: `/interactive-keys/:id`
   - Powered by observation matrices with descriptors

2. **Dichotomous Keys** (Standard Keys)
   - Component: `src/modules/keys/views/keyId.vue`
   - Uses `@sfgrp/pinpoint` package
   - Route: `/keys/:id`
   - Traditional couplet-based navigation

3. **Keys Panel** on OTU Pages
   - Shows available keys for each taxon
   - Location: `src/modules/otus/components/Panel/PanelKeys/PanelKeys.vue`
   - Displays both "scoped" (specific to OTU) and "in" (includes OTU) keys

### TaxonWorks API Support ✅

Working endpoints found:
- `GET /api/v1/otus/:id/inventory/keys` - Lists keys for an OTU
- `GET /api/v1/observation_matrices/:id/key` - Gets multi-entry key data
- `GET /api/v1/observation_matrices` - Lists available matrices
- `GET /api/v1/leads/key/:id` - Gets dichotomous key data (needs valid lead ID)

### PERC Data Status ⚠️

Current state of PERC collection:
- **2 observation matrices total**:
  - "Cerotoma revision" (ID: 261) - Has descriptors and states
  - "Experimental matrix" (ID: 294) - Unknown content
- **Most OTUs have no keys** - Tested several, all returned empty
- **One working example**: Cerotoma sp 1 (OTU 1054087) is in matrix 261

## How Keys Work in TaxonWorks

### Multi-Entry Keys (Matrix-Based)
```
Observation Matrix
    ↓
Contains Descriptors (characters)
    ↓
Each Descriptor has States (character states)
    ↓
OTUs/Specimens scored for each Descriptor
    ↓
User selects states → System eliminates non-matching taxa
```

**Example from PERC's Cerotoma matrix**:
- Descriptor: "Armature" (head armature)
- States: None, Tubercles, 2 spines, etc.
- Usefulness: 2.41 (algorithmically calculated)

### Dichotomous Keys (Lead-Based)
```
Starting Lead (root)
    ↓
Couplet with 2+ choices
    ↓
Each choice leads to:
  - Another couplet (lead)
  - OR Terminal taxon (OTU)
    ↓
Linear path to identification
```

## UI/UX Considerations for Semi-Technical Users

### Current Interface Strengths
1. **Visual hierarchy** - Clear progression through choices
2. **Backtracking** - Can go back to previous decisions
3. **Progress tracking** - Shows eliminated vs remaining taxa
4. **Direct links** - Taxa link to their pages

### Needed Improvements for Target Users

#### For Multi-Entry Keys
1. **Plain language descriptors**
   - Current: "Sulcus in prothorax"
   - Better: "Groove in front body segment"

2. **Visual aids**
   - Add images for each character state
   - Size references and comparison tools
   - Hover tooltips with examples

3. **Smart ordering**
   - Most useful characters first (by usefulness score)
   - Group related characters
   - Hide advanced characters initially

4. **Progress feedback**
   ```
   You've eliminated 45 of 52 possibilities
   Remaining: 7 species
   Most likely: [Species A] (matches 5/5 selected traits)
   ```

#### For Dichotomous Keys
1. **Visual couplets**
   ```
   ┌─────────────────────────┐     ┌─────────────────────────┐
   │ Wings fully developed   │ OR  │ Wings reduced/absent    │
   │ [Photo of winged]       │     │ [Photo of wingless]     │
   │         → Go to 2       │     │         → Go to 8       │
   └─────────────────────────┘     └─────────────────────────┘
   ```

2. **Breadcrumb trail**
   ```
   Path taken: Start → Wings present → Size >10mm → Color metallic → Result
   [Click any step to go back]
   ```

3. **Confidence indicators**
   - "⚠️ This choice point is critical - look carefully"
   - "ℹ️ If unsure, this is the more common option"

## Recommendations for PERC

### Phase 1: Create Foundation Keys (Quick Wins)
Build simple keys for common user needs:

1. **"Common Garden Pests" Key**
   - 10-15 most common species
   - Simple visual characters (size, color, shape)
   - Photos for every choice

2. **"Corn Field Insects" Key**
   - Focus on economically important species
   - Include damage type as character
   - Link to management recommendations

3. **"Is This Protected?" Quick Key**
   - Yes/no dichotomous key
   - Federal and state protected species
   - Clear visual distinctions

### Phase 2: Build Comprehensive Matrix
Create observation matrix for major groups:

1. **Select initial target group** (e.g., beetles of agricultural importance)
2. **Define 15-20 simple descriptors**:
   - Size categories
   - Color patterns
   - Host plants
   - Habitat preferences
   - Seasonal activity
3. **Score all relevant OTUs**
4. **Add photographs** for each state

### Phase 3: Enhanced User Experience
1. **Create mobile-optimized version**
2. **Add "learning mode"** with explanations
3. **Implement confidence scoring**
4. **Build comparison tools**

## Technical Implementation Notes

### Creating Keys in TaxonWorks

#### For Multi-Entry Keys:
1. Create observation matrix
2. Add descriptors (these become the filterable characters)
3. Define character states for each descriptor
4. Score OTUs for each character
5. Matrix automatically becomes available as interactive key

#### For Dichotomous Keys:
1. Create root lead
2. Add couplets with descriptive text
3. Link each choice to either:
   - Another lead (continue key)
   - An OTU (terminal identification)
4. Add images and notes as needed

### Data Entry Efficiency Tips
- Use batch operations for scoring common characters
- Import existing keys from other formats
- Collaborate with experts for specific groups
- Start with most economically important species

## Example API Responses

### Key Inventory for an OTU
```json
{
  "observation_matrices": {
    "scoped": {},  // Keys specifically for this OTU
    "in": {        // Keys that include this OTU
      "261": "Cerotoma revision"
    }
  },
  "leads": {
    "scoped": {},  // Dichotomous keys for this OTU
    "in": {}       // Dichotomous keys including this OTU
  }
}
```

### Multi-Entry Key Structure
```json
{
  "descriptor": {
    "id": 3749,
    "name": "Armature",
    "usefulness": 2.41,  // Higher = more discriminating
    "states": [
      {
        "id": 10042,
        "name": "None",
        "number_of_objects": 2  // 2 OTUs have this state
      }
    ]
  }
}
```

## Success Metrics

1. **Coverage**: % of economically important species in keys
2. **Accuracy**: Correct identification rate by users
3. **Speed**: Average time to identification
4. **Accessibility**: Success rate for non-experts
5. **Mobile usage**: % of key uses on mobile devices

## Next Steps

1. **Audit existing species** to identify key gaps
2. **Prioritize groups** for key development
3. **Create descriptor vocabulary** appropriate for users
4. **Build pilot key** for testing with extension workers
5. **Gather feedback** and iterate

## Resources

- TaxonWorks Keys Documentation: https://docs.taxonworks.org/guide/Manual/Keys/
- Distinguish (multi-entry): https://github.com/SpeciesFileGroup/distinguish
- Pinpoint (dichotomous): https://github.com/SpeciesFileGroup/pinpoint
- Example working key: https://sfg.taxonworks.org/api/v1/observation_matrices/261/key

---

*This analysis is part of the TaxonPages enhancement project for PERC. The goal is to make taxonomic identification accessible to farmers, extension workers, and researchers.*