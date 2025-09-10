# OTU Descriptors Research for Collection Browsing

## Related Documents
- [Descriptor API Implementation](./DESCRIPTOR_API_IMPLEMENTATION.md) - Rails API endpoint specifications and code
- [Descriptor UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md) - User interface design for semi-technical users
- [Interactive Keys Analysis](./INTERACTIVE_KEYS_ANALYSIS.md) - How descriptors power identification keys

## Context
The Purdue Entomological Research Collection (PERC) is using TaxonPages to serve their collection data from TaxonWorks. While TaxonPages is primarily designed for taxonomy management, Purdue wants to use it for collection browsing to serve multiple user populations:

- **Ag Extension workers** helping farmers identify pests
- **Researchers** concerned with protected species
- **Taxonomists** interested in species identification
- **General users** browsing the collection

The challenge is serving different views of the same collection to different audiences. The team has been using tags (e.g., "corn pests", "federally protected species") but is exploring OTU Descriptors as a potentially richer solution.

## What are OTU Descriptors?

OTU (Operational Taxonomic Unit) Descriptors in TaxonWorks are a sophisticated system for recording structured observations about biological specimens and taxa.

### Key Concepts

**OTUs** (../taxonworks/app/models/otu.rb:1-24)
- Units of study in TaxonWorks, usually representing taxa
- Can be linked to a TaxonName or given arbitrary labels
- N:1 relationship with taxa (multiple OTUs can point to the same taxon)

**Descriptors** (../taxonworks/app/models/descriptor.rb:2-10)
- Define classes of observations that can be made about OTUs or Collection Objects
- Come in various types reflecting different data recording approaches
- Located in ../taxonworks/app/models/descriptor/ with subtypes:
  - `qualitative.rb` - Character/state expressions
  - `continuous.rb` / `sample.rb` - Quantitative measurements
  - `presence_absence.rb` - Binary traits
  - `working.rb` - Raw notes/observations
  - `media.rb` - Visual observations
  - `gene.rb` - Genetic data

**Observations** (../taxonworks/app/models/observation.rb:1-5)
- Record the actual data for a descriptor on a specific OTU or Collection Object
- Link descriptors to biological entities
- Stored individually, not as complete matrices

### Data Model Architecture

From TaxonWorks documentation (https://docs.taxonworks.org/guide/Manual/matrices.html):
- Matrices consist of Rows (OTUs/Collection Objects) and Columns (Descriptors)
- Same OTU or descriptor can be used across multiple matrices
- Observations are stored per cell, maintaining consistency across matrices

## Current Implementation Status

### TaxonPages (This Repository)

**Current Tag-based Filtering:**
- Implemented in `src/modules/otus/components/Panel/PanelSpecimens/PanelSpecimens.vue:67-72`
- Uses `MultiSelectTags` component for filtering specimens
- Tags fetched via `TaxonWorks.getAllTags()` and `TaxonWorks.getKeywords()` (src/modules/otus/services/TaxonWorks.js:142-168)
- Simple keyword-based filtering system

**No Descriptor Integration:**
- No API calls to descriptor endpoints
- No UI components for descriptor-based filtering
- No observation data consumption

### TaxonWorks API

**Available Endpoints:**
- `/api/v1/observations` - Working, returns observation data
- `/api/v1/otus/{id}` - Returns OTU information
- Various tag/keyword endpoints for current filtering

**Missing/Not Public:**
- `/api/v1/descriptors` - Returns "Invalid route"
- No public endpoints for creating/managing descriptors
- No endpoints for descriptor-based filtering of OTUs

**Example Observation Data** (from API):
```json
{
  "id": 809368,
  "descriptor_id": 3755,
  "observation_object_id": 1054087,
  "observation_object_type": "Otu",
  "type": "Observation::PresenceAbsence",
  "presence": true,
  "object_label": "Third and fourth antennomeres modified: present on Cerotoma sp 1 (maculata)"
}
```

## Potential Use Cases for Descriptors

### Advantages Over Tags

1. **Structured Data**: Instead of "corn pest" tag, could have:
   - Host plant: corn (qualitative descriptor)
   - Damage type: leaf feeding (qualitative)
   - Economic threshold: 5 per plant (quantitative)

2. **Multi-dimensional Filtering**: Complex queries like:
   - "Show specimens with body length 10-15mm AND found on corn AND active May-July"

3. **User-specific Views**: Different descriptor sets for different audiences:
   - **Ag Extension**: crop damage patterns, pesticide resistance, economic thresholds
   - **Conservation**: federal status, habitat requirements, population trends
   - **Taxonomists**: morphological measurements, type specimen data

4. **Quantitative Queries**: Range-based searches impossible with tags:
   - "Specimens 5-10mm in length"
   - "Species active above 20°C"

## Implementation Considerations

### Required Work

1. **TaxonWorks API Development**:
   - Expose descriptor endpoints publicly
   - Add descriptor-based filtering to OTU/specimen queries
   - Document descriptor API usage

2. **TaxonPages Frontend**:
   - New components for descriptor-based filtering UI
   - Handle different descriptor types (qualitative vs quantitative)
   - Integrate with existing specimen display

3. **Data Entry**:
   - Create relevant descriptors for use cases
   - Populate observations for existing specimens
   - Establish controlled vocabularies

### Current Workarounds

While waiting for full descriptor support:
- Continue using tag system for simple categorization
- Consider hierarchical tags to simulate structure
- Document desired descriptors for future implementation

## Technical References

### Key Files for Future Work

**TaxonPages:**
- `src/modules/otus/services/TaxonWorks.js` - API service layer
- `src/modules/otus/components/Panel/PanelSpecimens/PanelSpecimens.vue` - Specimen filtering UI
- `src/modules/otus/composables/useSpecimenTags.js` - Current tag handling

**TaxonWorks:**
- `app/models/descriptor.rb` - Descriptor model
- `app/models/observation.rb` - Observation model
- `app/models/otu.rb` - OTU model
- `app/controllers/descriptors_controller.rb` - Descriptor controller (not exposed to API)

### API Testing Commands

```bash
# Get observations for an OTU
curl "https://sfg.taxonworks.org/api/v1/observations?project_token=ekMTicbZWijqmdpHKqs_TA&observation_object_type=Otu&observation_object_id=1054087"

# Get OTU details
curl "https://sfg.taxonworks.org/api/v1/otus/1054087?project_token=ekMTicbZWijqmdpHKqs_TA"

# Test descriptor endpoint (currently returns "Invalid route")
curl "https://sfg.taxonworks.org/api/v1/descriptors?project_token=ekMTicbZWijqmdpHKqs_TA"
```

## Relationship to Interactive Keys

### Shared Data Model
Descriptors and interactive keys are deeply interconnected in TaxonWorks:

1. **Multi-Entry Keys ARE Descriptor Matrices**
   - The same observation matrix that stores descriptor data becomes an interactive key
   - Each descriptor becomes a filterable character in the key
   - Character states in descriptors become the selectable options in keys

2. **Data Entry Once, Use Everywhere**
   ```
   Create Descriptor → Score OTUs → Use for:
   - Collection browsing/filtering
   - Multi-entry identification keys
   - Data analysis and reporting
   - Specimen comparison
   ```

3. **Progressive Refinement**
   - Start with broad descriptor-based filtering to narrow to a group
   - Then use detailed keys for precise species identification
   - Example: Filter to "corn pests" → Launch corn pest key → Identify exact species

### Implementation Synergies

When implementing descriptors for Purdue's use cases, you're simultaneously building:

1. **Filter System**: Browse collection by traits
2. **Identification Keys**: Step users through identification
3. **Educational Content**: Teach morphology and terminology
4. **Data Foundation**: Enable future analyses and visualizations

### Key Creation Benefits from Descriptors

Creating descriptors for filtering automatically provides:
- Characters for multi-entry keys
- Standardized vocabulary across the system
- Scored observations ready for key generation
- Photo associations for visual keys

Example workflow:
1. Create "Host plant" descriptor with states: Corn, Soybean, Wheat
2. Score all pest OTUs for their host plants
3. This data now works for:
   - Filtering: "Show all corn pests"
   - Keys: "What crops does it attack?" → Corn → [narrowed list]

## Next Steps

1. **Collaborate with TaxonWorks team** on exposing descriptor API endpoints
2. **Document specific descriptors** needed for Purdue's use cases
3. **Design UI mockups** for descriptor-based filtering
4. **Create proof-of-concept** once API is available
5. **Build pilot keys** using the same descriptor data
6. **Test integrated browsing + identification workflow** with users

## Resources

- TaxonWorks Matrices Documentation: https://docs.taxonworks.org/guide/Manual/matrices.html
- TaxonWorks Keys Documentation: https://docs.taxonworks.org/guide/Manual/Keys/
- TaxonWorks API: https://api.taxonworks.org/
- TaxonWorks Glossary: https://docs.taxonworks.org/about/glossary.html
- Project tokens are not secrets in this system (data is open)