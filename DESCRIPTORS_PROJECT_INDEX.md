# TaxonPages Descriptors Project Documentation

## Project Overview
This project explores implementing OTU Descriptors from TaxonWorks as a richer alternative to tags for filtering the Purdue Entomological Research Collection. The goal is to serve multiple user populations (farmers, researchers, extension workers) with tailored views of the same collection data.

## Documentation Index

### 1. [OTU Descriptors Research](./OTU_DESCRIPTORS_RESEARCH.md)
**Purpose**: Understanding the current state and potential of descriptors

**Key Topics**:
- What are OTU Descriptors in TaxonWorks?
- Current implementation using tags
- Advantages of descriptors over tags
- Technical architecture analysis

**Read this if**: You need background on why we're considering descriptors

---

### 2. [Descriptor API Implementation](./DESCRIPTOR_API_IMPLEMENTATION.md)
**Purpose**: Technical guide for adding descriptor endpoints to TaxonWorks

**Key Topics**:
- Required API endpoints design
- Rails controller implementation
- JSON response formats
- Step-by-step PR guide

**Read this if**: You're implementing the backend API changes

---

### 3. [Descriptor UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md)
**Purpose**: Making descriptors accessible to semi-technical users

**Key Topics**:
- User personas and needs
- Progressive disclosure interface
- Mobile-responsive designs
- Natural language search
- Visual component mockups

**Read this if**: You're designing or implementing the frontend interface

---

### 4. [Interactive Keys Analysis](./INTERACTIVE_KEYS_ANALYSIS.md)
**Purpose**: Understanding and implementing identification keys

**Key Topics**:
- Current state of keys in TaxonPages & PERC
- Multi-entry vs dichotomous keys
- UI/UX improvements for non-experts
- Data requirements and creation process
- Recommendations for PERC implementation

**Read this if**: You're working on identification tools or creating keys

---

## Quick Start Guide

### For Project Managers
1. Start with [OTU Descriptors Research](./OTU_DESCRIPTORS_RESEARCH.md) for project rationale
2. Review [UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md) for user experience vision
3. Check [API Implementation](./DESCRIPTOR_API_IMPLEMENTATION.md) for technical scope

### For Backend Developers
1. Read [API Implementation](./DESCRIPTOR_API_IMPLEMENTATION.md) for code examples
2. Reference [Research](./OTU_DESCRIPTORS_RESEARCH.md) for data model understanding
3. Consider [UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md) for API response needs

### For Frontend Developers
1. Start with [UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md) for interface specifications
2. Check [API Implementation](./DESCRIPTOR_API_IMPLEMENTATION.md) for available endpoints
3. Review [Research](./OTU_DESCRIPTORS_RESEARCH.md) for descriptor types

### For UX Designers
1. Review [UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md) for current proposals
2. Understand context in [Research](./OTU_DESCRIPTORS_RESEARCH.md)
3. See technical constraints in [API Implementation](./DESCRIPTOR_API_IMPLEMENTATION.md)

## Key Use Cases

### Corn Pest Identification
- **User**: Ag extension worker
- **Need**: Quick field identification
- **Solution**: Preset filter + visual size guide + damage type

### Protected Species Check
- **User**: Researcher
- **Need**: Conservation status verification
- **Solution**: Status descriptors + location filters

### Collection Browsing
- **User**: Student/Hobbyist
- **Need**: Educational exploration
- **Solution**: Progressive disclosure + tooltips + comparisons

## Implementation Phases

### Phase 1: API Development
- Add descriptor endpoints to TaxonWorks
- Test with PERC data
- Document API usage

### Phase 2: Basic UI
- Implement core filter components
- Add preset searches
- Mobile optimization

### Phase 3: Enhanced Features
- Natural language search
- Visual aids and guides
- Export functionality

## Project Contacts

- **TaxonWorks Team**: Accepting PRs, provides technical guidance
- **Purdue Team**: Defining use cases, testing with users
- **TaxonPages Development**: Frontend implementation

## Testing Resources

### API Testing
```bash
# Test descriptor endpoint (once implemented)
curl "https://sfg.taxonworks.org/api/v1/descriptors?project_token=ekMTicbZWijqmdpHKqs_TA"

# Test observation filtering
curl "https://sfg.taxonworks.org/api/v1/otus/1054087/observations?project_token=ekMTicbZWijqmdpHKqs_TA"
```

### Sample Descriptors for PERC
- Body length (Quantitative): 0-50mm
- Host plant (Qualitative): Corn, Soybean, Wheat, etc.
- Pest status (Qualitative): Economic, Beneficial, Neutral
- Federal status (Qualitative): Endangered, Threatened, None
- Active months (Sample): January-December range

## Next Actions

1. **Immediate**: Review and refine descriptor categories with Purdue team
2. **Short-term**: Create TaxonWorks PR for API endpoints
3. **Medium-term**: Build Vue.js filter components
4. **Long-term**: User testing and iteration

---

*Last updated: 2025-01-10*
*Project: TaxonPages Descriptor Implementation for PERC*