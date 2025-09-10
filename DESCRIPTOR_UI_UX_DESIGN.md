# Descriptor-Based Filtering: UI/UX Design for Semi-Technical Users

## Related Documents
- [OTU Descriptors Research](./OTU_DESCRIPTORS_RESEARCH.md) - Technical background and current state
- [Descriptor API Implementation](./DESCRIPTOR_API_IMPLEMENTATION.md) - Backend implementation details
- [Interactive Keys Analysis](./INTERACTIVE_KEYS_ANALYSIS.md) - Identification keys using descriptors

## User Personas & Needs

### Primary Users
1. **Ag Extension Workers**: Need quick pest identification for farmer consultations
2. **Farmers**: Looking for practical pest management information
3. **Researchers**: Need precise specimen data for studies
4. **Grad Students**: Learning taxonomy, need educational scaffolding
5. **Entomology Hobbyists**: Want to explore and learn about local species
6. **Agronomists**: Need crop-pest relationship data

### Key Design Principles

1. **Progressive Disclosure**: Start simple, reveal complexity as needed
2. **Natural Language**: Use terms familiar to users, not database jargon
3. **Visual Feedback**: Show what's happening with filters in real-time
4. **Smart Defaults**: Pre-populate common searches for each user group
5. **Mobile-First**: Many ag extension workers use tablets/phones in the field

## UI Component Designs

### 1. Filter Panel Header
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Find Specimens By:                                       │
│                                                              │
│ [Quick Filters ▼] [Physical Traits ▼] [Habitat ▼] [Status ▼]│
│                                                              │
│ Currently showing: 245 of 1,847 specimens                   │
│ [Clear all filters]                                         │
└─────────────────────────────────────────────────────────────┘
```

### 2. Quick Filters (Presets for Common Searches)
```
┌─────────────────────────────────────────────────────────────┐
│ Quick Filters                                               │
├─────────────────────────────────────────────────────────────┤
│ Popular searches:                                           │
│                                                              │
│ 🌽 [Corn Pests]  🌱 [Soybean Pests]  🚨 [Protected Species] │
│ 📍 [Found in Indiana]  🏡 [Garden Pests]  🌾 [Field Crops]  │
│                                                              │
│ Or build your own filter below...                           │
└─────────────────────────────────────────────────────────────┘
```

### 3. Physical Traits (Quantitative Descriptors)
```
┌─────────────────────────────────────────────────────────────┐
│ Physical Traits                                             │
├─────────────────────────────────────────────────────────────┤
│ Size:                                                       │
│ [Tiny (<5mm)] [Small (5-10mm)] [Medium (10-20mm)] [Large]  │
│                                                              │
│ Or specify exact range:                                     │
│ [5  ] mm to [15 ] mm                                       │
│                                                              │
│ Wing type:                                                  │
│ ○ Any  ○ Winged  ○ Wingless  ○ Reduced wings              │
│                                                              │
│ Color (check all that apply):                              │
│ ☐ Black  ☐ Brown  ☐ Green  ☐ Red  ☐ Yellow               │
│ ☐ Metallic  ☐ Striped  ☐ Spotted                          │
└─────────────────────────────────────────────────────────────┘
```

### 4. Habitat/Host (Qualitative Descriptors)
```
┌─────────────────────────────────────────────────────────────┐
│ Habitat & Host Plants                                       │
├─────────────────────────────────────────────────────────────┤
│ Where to find:                                              │
│                                                              │
│ Common crops:                                               │
│ ☐ Corn  ☐ Soybean  ☐ Wheat  ☐ Alfalfa  ☐ Vegetables      │
│                                                              │
│ Habitat type:                                               │
│ ☐ Agricultural fields  ☐ Gardens  ☐ Forest                 │
│ ☐ Grassland  ☐ Wetland  ☐ Urban areas                     │
│                                                              │
│ Damage type:                                                │
│ ☐ Leaf feeding  ☐ Root damage  ☐ Fruit boring             │
│ ☐ Stem boring  ☐ Sap sucking  ☐ Seed feeding              │
│                                                              │
│ Active season:                                              │
│ [Spring][Summer][Fall][Winter]  or                         │
│ Months: [May ▼] to [September ▼]                           │
└─────────────────────────────────────────────────────────────┘
```

### 5. Conservation Status (Special Descriptors)
```
┌─────────────────────────────────────────────────────────────┐
│ Conservation & Management Status                            │
├─────────────────────────────────────────────────────────────┤
│ Protection status:                                          │
│ ☐ Federally endangered  ☐ Federally threatened            │
│ ☐ State protected  ☐ Species of concern                    │
│                                                              │
│ Pest status:                                                │
│ ☐ Economic pest  ☐ Quarantine pest  ☐ Invasive species    │
│ ☐ Beneficial insect  ☐ Pollinator                         │
└─────────────────────────────────────────────────────────────┘
```

### 6. Active Filter Display (Pills/Tags)
```
┌─────────────────────────────────────────────────────────────┐
│ Active filters:                                             │
│                                                              │
│ [Size: 5-15mm ×] [Host: Corn ×] [Active: May-Sept ×]      │
│ [Pest status: Economic ×]                                   │
│                                                              │
│ 47 specimens match your criteria                            │
└─────────────────────────────────────────────────────────────┘
```

## Smart Features for Accessibility

### 1. Natural Language Search Bar
Instead of just filters, offer a search box that understands phrases:
- "corn pests active in summer"
- "small beetles on soybeans"
- "protected species in Indiana"
- "insects larger than 20mm"

### 2. Visual Size Reference
```
Actual size reference:
[·] Rice grain  [●] Pea  [◉] Dime  [◎] Quarter
 3mm           7mm      17mm      24mm
```

### 3. Tooltips with Examples
Hover over any filter to see:
```
┌──────────────────────────────┐
│ Leaf feeding damage:         │
│ Insects that chew holes in   │
│ leaves or skeletonize them.  │
│                              │
│ Examples: Japanese beetles,  │
│ caterpillars, grasshoppers   │
│ [Show photos]                │
└──────────────────────────────┘
```

### 4. Seasonal Calendar Widget
```
When are they active? (click months)
Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
[  ][  ][  ][✓][✓][✓][✓][✓][✓][  ][  ][  ]
```

### 5. "Did You Mean?" Suggestions
When filters return few/no results:
```
No exact matches found for your criteria.

Did you mean to search for:
• Corn pests of ANY size? (127 results)
• Soybean pests 5-15mm? (84 results)
• All pests active in May-September? (342 results)
```

## Mobile-Responsive Design

### Phone View (Collapsed)
```
┌─────────────────┐
│ 🔍 Find: 3 active│
│ [Tap to modify] │
├─────────────────┤
│ 47 specimens    │
│                 │
│ [Specimen 1]    │
│ [Specimen 2]    │
│ [Specimen 3]    │
└─────────────────┘
```

### Phone View (Expanded Filters)
```
┌─────────────────┐
│ ← Back          │
│                 │
│ Quick Presets:  │
│ [Corn Pests]    │
│ [Protected]     │
│                 │
│ Size:           │
│ ● Small (5-10mm)│
│                 │
│ Host Plant:     │
│ ☑ Corn         │
│ ☐ Soybean      │
│                 │
│ [Apply Filters] │
└─────────────────┘
```

## User Flow Examples

### Farmer Looking for Pest ID
1. Clicks "Corn Pests" preset
2. Sees all corn pests
3. Narrows by size: "Medium (10-20mm)"
4. Narrows by damage: "Leaf feeding"
5. Gets 3-5 likely candidates with photos

### Extension Worker in Field
1. Opens mobile site
2. Taps "Quick ID"
3. Selects: Crop → Corn
4. Selects: Damage type → Root damage
5. Selects: Time of year → Current month auto-selected
6. Gets short list with management recommendations

### Researcher Finding Specimens
1. Starts with "Advanced Search"
2. Enters precise measurements: "12.5-13.5mm"
3. Selects multiple character states
4. Adds collection date range
5. Exports results as CSV with DOI citations

## Vue.js Component Structure

```vue
<!-- FilterPanel.vue -->
<template>
  <div class="filter-panel">
    <FilterPresets @select="applyPreset" />
    <FilterAccordion>
      <FilterSection title="Physical Traits">
        <SizeFilter v-model="filters.size" />
        <ColorFilter v-model="filters.colors" />
      </FilterSection>
      <FilterSection title="Habitat">
        <HostPlantFilter v-model="filters.hosts" />
        <DamageTypeFilter v-model="filters.damage" />
      </FilterSection>
    </FilterAccordion>
    <ActiveFilters :filters="activeFilters" @remove="removeFilter" />
  </div>
</template>
```

## Accessibility Features

1. **Keyboard Navigation**: All filters accessible via Tab
2. **Screen Reader Support**: Proper ARIA labels
3. **High Contrast Mode**: Clear boundaries and labels
4. **Text Scaling**: Responsive to browser zoom
5. **Color Blind Friendly**: Don't rely on color alone

## Performance Considerations

1. **Lazy Loading**: Load descriptors as sections expand
2. **Debounced Search**: Wait 300ms after typing stops
3. **Result Preview**: Show count before applying filters
4. **Cached Filters**: Remember user's last search
5. **Progressive Enhancement**: Work without JavaScript

## Educational Components

### Inline Learning
```
ℹ️ What's an "economic pest"?
An insect that causes enough crop damage to result in 
economic loss if not controlled. The threshold varies 
by crop value and control costs. [Learn more]
```

### Visual Comparison Tool
```
Compare similar species:
┌─────────┬─────────┬─────────┐
│ Bean    │ Mexican │ Spotted │
│ Leaf    │ Bean    │ Cucumber│
│ Beetle  │ Beetle  │ Beetle  │
├─────────┼─────────┼─────────┤
│ [Photo] │ [Photo] │ [Photo] │
├─────────┼─────────┼─────────┤
│ • 6mm   │ • 7mm   │ • 6mm   │
│ • Yellow│ • Orange│ • Yellow│
│ • 16spots│• 16spots│• 12spots│
└─────────┴─────────┴─────────┘
```

## Implementation Priority

### Phase 1: Core Filtering (MVP)
- Quick preset filters
- Basic size/color filters
- Host plant selection
- Simple results display

### Phase 2: Enhanced Usability
- Natural language search
- Visual size guides
- Mobile optimization
- Filter suggestions

### Phase 3: Advanced Features
- Comparison tools
- Seasonal calendars
- Export functionality
- Saved searches

## Testing with Users

### Usability Testing Protocol
1. Give users common scenarios:
   - "Find pests affecting your corn crop"
   - "Identify a 15mm beetle found on soybeans"
   - "Check if this insect is protected"

2. Measure:
   - Time to complete task
   - Number of clicks/taps
   - Error recovery
   - User satisfaction

3. A/B Test:
   - Preset filters vs. manual selection
   - Icon-based vs. text-based options
   - Collapsed vs. expanded initial state

## Success Metrics

1. **Efficiency**: Average time to find target specimen <30 seconds
2. **Accuracy**: Correct identification rate >80%
3. **Engagement**: Users apply 2-3 filters on average
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Mobile Usage**: 40%+ of searches from mobile devices

## Integration with Interactive Keys

### Synergy Between Descriptors and Keys

The descriptor system and interactive keys share the same underlying data model, creating powerful synergies:

1. **Shared Data Infrastructure**
   - Descriptors used for filtering ARE the characters in multi-entry keys
   - Same scoring/observation data serves both purposes
   - One data entry effort, multiple user interfaces

2. **Progressive Identification Flow**
   ```
   Browse Collection → Filter by Descriptors → Narrow to Group → Use Key for Species
   
   Example: 
   1. Filter: "Corn pests, 10-15mm" → 25 specimens
   2. Launch: "Corn Pest Identification Key" → Precise species ID
   ```

3. **Unified Visual Language**
   - Same icons, photos, and terminology across filters and keys
   - Users learn once, apply everywhere
   - Consistent size references, color swatches, etc.

### Key-Specific UI Components

#### Interactive Key Launcher
```
┌─────────────────────────────────────────────────────────────┐
│ Need help identifying this specimen?                        │
│                                                              │
│ Based on your filters, try these keys:                      │
│ [🔍 Corn Pest Visual Key] - Best for field use             │
│ [📋 Beetle Multi-Entry Key] - Most comprehensive           │
│ [🌳 Garden Pest Decision Tree] - Step-by-step              │
└─────────────────────────────────────────────────────────────┘
```

#### Embedded Mini-Key Widget
For quick identification without leaving the browse interface:
```
┌─────────────────────────────────────────────────────────────┐
│ Quick ID Helper                                    [Expand] │
├─────────────────────────────────────────────────────────────┤
│ Answer 2-3 questions to narrow your search:                │
│                                                              │
│ 1. Where did you find it?                                   │
│    [Field] [Garden] [Storage] [House]                       │
│                                                              │
│ 2. What damage do you see?                                  │
│    [Holes in leaves] [Wilting] [Root damage] [None]         │
│                                                              │
│ → Showing 3 likely matches...                               │
└─────────────────────────────────────────────────────────────┘
```

### Dichotomous Key Visualization
Transform traditional text-based keys into visual decision trees:

```
                     Insect on corn?
                    /               \
                  Yes               No → [Other crop keys]
                   |
            Damage to leaves?
            /              \
          Yes              No
           |                |
     Holes visible?    Check roots
     /          \           |
   Yes          No      [Root pest key]
    |            |
[Corn borer]  [Aphids]
```

### Multi-Entry Key Enhancement
Make character selection more intuitive:

```
┌─────────────────────────────────────────────────────────────┐
│ Select What You Can See:                                    │
├─────────────────────────────────────────────────────────────┤
│ ✓ Size: Medium (10-20mm)     [Why this matters]            │
│ ✓ Wings: Present              [Why this matters]            │
│ ? Color: [Not sure]           [Show color guide]            │
│                                                              │
│ Remaining possibilities: 8 of 45                            │
│ Most likely: Western Corn Rootworm (matches 2/2 traits)    │
│                                                              │
│ [Show me what to look for next]                            │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Key Interface
Optimized for field use:

```
┌─────────────────┐
│ Field ID Mode   │
├─────────────────┤
│ [Take Photo]    │
│                 │
│ Compare to:     │
│ ┌───┐ ┌───┐    │
│ │[A]│ │[B]│    │
│ └───┘ └───┘    │
│ ┌───┐ ┌───┐    │
│ │[C]│ │[D]│    │
│ └───┘ └───┘    │
│                 │
│ [More details]  │
└─────────────────┘
```

### Bridging Browsing and Identification

1. **Smart Handoffs**
   - "Can't find what you're looking for? Try our identification key"
   - "Found multiple matches? Use the key to distinguish between them"

2. **Contextual Key Suggestions**
   - Recommend keys based on active filters
   - Highlight most relevant key for current search results

3. **Learning Mode**
   - Keys teach descriptor vocabulary
   - Descriptors prepare users for key terminology

### Implementation Priority for Keys

#### Phase 1: Visual Keys (Highest Impact)
- Photo-based dichotomous keys for top 20 pests
- Simple language, no technical terms
- Mobile-optimized interface

#### Phase 2: Smart Multi-Entry Keys
- Auto-suggest most useful characters
- Show photo examples for each state
- Confidence scoring ("90% match")

#### Phase 3: Integrated Experience
- Seamless flow between browsing and keys
- Unified observation data
- Cross-training between interfaces

## Next Steps

1. Create interactive prototype in Figma/Adobe XD
2. Conduct user interviews with each persona group
3. Build Vue.js component library
4. Implement Phase 1 features
5. Iterate based on user feedback
6. **Develop pilot keys for testing with extension workers**
7. **Create visual assets library for keys and descriptors**

---

*This document is part of the TaxonPages descriptor implementation project. See related documents for technical implementation details.*