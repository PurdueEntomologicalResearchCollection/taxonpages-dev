# Implementing Descriptor API Endpoints for TaxonWorks

## Related Documents
- [OTU Descriptors Research](./OTU_DESCRIPTORS_RESEARCH.md) - Background and current state analysis
- [Descriptor UI/UX Design](./DESCRIPTOR_UI_UX_DESIGN.md) - User interface design for semi-technical users
- [Interactive Keys Analysis](./INTERACTIVE_KEYS_ANALYSIS.md) - Keys that use descriptor data

## Overview
This document outlines the API additions needed in TaxonWorks to support descriptor-based filtering in TaxonPages, along with implementation guidance for creating a pull request.

## Required API Endpoints

### 1. List Descriptors
**Endpoint:** `GET /api/v1/descriptors`

**Purpose:** Retrieve available descriptors for filtering/display

**Query Parameters:**
- `descriptor_type` - Filter by type (qualitative, quantitative, presence_absence, etc.)
- `target` - Filter by target type (Otu, CollectionObject)
- `per` - Items per page
- `page` - Page number

**Response Example:**
```json
[
  {
    "id": 3755,
    "name": "Body length",
    "short_name": "length",
    "type": "Descriptor::Quantitative",
    "description": "Total body length in millimeters",
    "position": 1
  },
  {
    "id": 3756,
    "name": "Host plant",
    "type": "Descriptor::Qualitative",
    "character_states": [
      {"id": 101, "label": "corn", "name": "Zea mays"},
      {"id": 102, "label": "soybean", "name": "Glycine max"}
    ]
  }
]
```

### 2. Get Observations for OTUs with Filtering
**Endpoint:** `GET /api/v1/otus/:id/observations`

**Purpose:** Get all observations for an OTU, with descriptor filtering

**Query Parameters:**
- `descriptor_ids[]` - Array of descriptor IDs to filter by
- `include_descendants` - Include observations from descendant OTUs

**Response Example:**
```json
[
  {
    "id": 809368,
    "descriptor_id": 3755,
    "descriptor_name": "Body length",
    "type": "Observation::Quantitative",
    "continuous_value": "12.5",
    "continuous_unit": "mm"
  }
]
```

### 3. Filter OTUs by Observations
**Endpoint:** `GET /api/v1/otus/filter_by_observations`

**Purpose:** Find OTUs matching specific observation criteria

**Query Parameters:**
- `filters[]` - Array of filter objects

**Request Body Example:**
```json
{
  "filters": [
    {
      "descriptor_id": 3755,
      "type": "range",
      "min": 10,
      "max": 15,
      "unit": "mm"
    },
    {
      "descriptor_id": 3756,
      "type": "qualitative",
      "character_state_ids": [101, 102]
    },
    {
      "descriptor_id": 3757,
      "type": "presence",
      "value": true
    }
  ]
}
```

### 4. Get Descriptor Statistics for Collection
**Endpoint:** `GET /api/v1/descriptors/:id/statistics`

**Purpose:** Get usage statistics for a descriptor

**Response Example:**
```json
{
  "descriptor_id": 3755,
  "total_observations": 245,
  "otus_observed": 89,
  "value_range": {"min": 5.2, "max": 45.8},
  "common_values": [12.5, 13.0, 14.2]
}
```

## Implementation Code

### Step 1: Add Routes
Add to `config/routes/api_v1.rb`:

```ruby
# After line 139 (observations endpoints)
get '/observations', to: '/observations#api_index'
get '/observations/:id', to: '/observations#api_show'

# Add new descriptor endpoints
get '/descriptors', to: '/descriptors#api_index'
get '/descriptors/:id', to: '/descriptors#api_show'
get '/descriptors/:id/statistics', to: '/descriptors#api_statistics'

# Add to OTU endpoints section (after line 60)
get '/otus/:id/observations', to: '/otus#api_observations'
post '/otus/filter_by_observations', to: '/otus#api_filter_by_observations'
```

### Step 2: Create Descriptors Controller
Create `app/controllers/descriptors_controller.rb` (modify existing):

```ruby
class DescriptorsController < ApplicationController
  # ... existing code ...

  # Add these API methods:
  
  def api_index
    @descriptors = Queries::Descriptor::Filter.new(params.merge(api: true))
      .all
      .where(project_id: sessions_current_project_id)
      .page(params[:page])
      .per(params[:per])
    
    render '/descriptors/api/v1/index'
  end
  
  def api_show
    @descriptor = Descriptor.where(project_id: sessions_current_project_id)
      .find(params[:id])
    
    # Include character states for qualitative descriptors
    if @descriptor.qualitative?
      @character_states = @descriptor.character_states
    end
    
    render '/descriptors/api/v1/show'
  end
  
  def api_statistics
    @descriptor = Descriptor.where(project_id: sessions_current_project_id)
      .find(params[:id])
    
    @statistics = {
      descriptor_id: @descriptor.id,
      total_observations: @descriptor.observations.count,
      otus_observed: @descriptor.observations
        .where(observation_object_type: 'Otu')
        .distinct.count(:observation_object_id)
    }
    
    # Add type-specific statistics
    if @descriptor.type == 'Descriptor::Quantitative'
      values = @descriptor.observations.pluck(:continuous_value).compact.map(&:to_f)
      @statistics[:value_range] = {
        min: values.min,
        max: values.max,
        mean: values.sum / values.size
      }
    end
    
    render json: @statistics
  end
end
```

### Step 3: Add OTU Observation Methods
Add to `app/controllers/otus_controller.rb`:

```ruby
class OtusController < ApplicationController
  # ... existing code ...
  
  def api_observations
    @otu = Otu.where(project_id: sessions_current_project_id).find(params[:id])
    
    @observations = @otu.observations
    
    # Filter by descriptor IDs if provided
    if params[:descriptor_ids].present?
      @observations = @observations.where(descriptor_id: params[:descriptor_ids])
    end
    
    # Include descendants if requested
    if params[:include_descendants] == 'true'
      descendant_ids = @otu.descendants.pluck(:id)
      @observations = Observation.where(
        observation_object_type: 'Otu',
        observation_object_id: [@otu.id] + descendant_ids
      )
    end
    
    @observations = @observations
      .includes(:descriptor)
      .page(params[:page])
      .per(params[:per])
    
    render '/otus/api/v1/observations'
  end
  
  def api_filter_by_observations
    filters = params[:filters] || []
    
    # Start with all OTUs in project
    otu_ids = Otu.where(project_id: sessions_current_project_id).pluck(:id)
    
    filters.each do |filter|
      case filter[:type]
      when 'range'
        # Quantitative range filter
        matching_observations = Observation
          .where(descriptor_id: filter[:descriptor_id])
          .where(observation_object_type: 'Otu')
          .where('continuous_value >= ? AND continuous_value <= ?', 
                 filter[:min], filter[:max])
        
        otu_ids &= matching_observations.pluck(:observation_object_id)
        
      when 'qualitative'
        # Character state filter
        matching_observations = Observation
          .where(descriptor_id: filter[:descriptor_id])
          .where(observation_object_type: 'Otu')
          .where(character_state_id: filter[:character_state_ids])
        
        otu_ids &= matching_observations.pluck(:observation_object_id)
        
      when 'presence'
        # Presence/absence filter
        matching_observations = Observation
          .where(descriptor_id: filter[:descriptor_id])
          .where(observation_object_type: 'Otu')
          .where(presence: filter[:value])
        
        otu_ids &= matching_observations.pluck(:observation_object_id)
      end
    end
    
    @otus = Otu.where(id: otu_ids)
      .page(params[:page])
      .per(params[:per])
    
    render '/otus/api/v1/index'
  end
end
```

### Step 4: Create JSON Views
Create view files for the API responses:

`app/views/descriptors/api/v1/index.json.jbuilder`:
```ruby
json.array! @descriptors do |descriptor|
  json.id descriptor.id
  json.name descriptor.name
  json.short_name descriptor.short_name
  json.type descriptor.type
  json.description descriptor.description
  json.position descriptor.position
  
  if descriptor.qualitative?
    json.character_states descriptor.character_states do |state|
      json.id state.id
      json.name state.name
      json.label state.label
    end
  end
end
```

`app/views/descriptors/api/v1/show.json.jbuilder`:
```ruby
json.id @descriptor.id
json.name @descriptor.name
json.short_name @descriptor.short_name
json.description @descriptor.description
json.type @descriptor.type
json.position @descriptor.position

if @descriptor.qualitative? && @character_states
  json.character_states @character_states do |state|
    json.id state.id
    json.name state.name
    json.label state.label
    json.description state.description
  end
end
```

`app/views/otus/api/v1/observations.json.jbuilder`:
```ruby
json.array! @observations do |observation|
  json.id observation.id
  json.descriptor_id observation.descriptor_id
  json.descriptor_name observation.descriptor.name
  json.type observation.type
  
  case observation.type
  when 'Observation::Quantitative'
    json.continuous_value observation.continuous_value
    json.continuous_unit observation.continuous_unit
  when 'Observation::Qualitative'
    json.character_state_id observation.character_state_id
    json.character_state_name observation.character_state&.name
  when 'Observation::PresenceAbsence'
    json.presence observation.presence
  when 'Observation::Sample'
    json.sample_n observation.sample_n
    json.sample_min observation.sample_min
    json.sample_max observation.sample_max
    json.sample_mean observation.sample_mean
    json.sample_units observation.sample_units
  end
end
```

## Implementation Steps for PR

1. **Fork and Clone TaxonWorks**
   ```bash
   git clone https://github.com/your-username/taxonworks.git
   cd taxonworks
   git checkout -b feature/descriptor-api-endpoints
   ```

2. **Implement Changes**
   - Add routes to `config/routes/api_v1.rb`
   - Update controllers with new API methods
   - Create JSON view templates
   - Add any necessary query filters in `app/queries/descriptor/filter.rb`

3. **Test the Endpoints**
   ```bash
   # Start Rails server
   bundle exec rails s
   
   # Test endpoints
   curl "http://localhost:3000/api/v1/descriptors?project_token=YOUR_TOKEN"
   curl "http://localhost:3000/api/v1/otus/1234/observations?project_token=YOUR_TOKEN"
   ```

4. **Write Tests**
   - Add request specs in `spec/requests/api/v1/descriptors_spec.rb`
   - Test filtering logic and response formats

5. **Create Pull Request**
   - Commit with clear message explaining the feature
   - Push to your fork
   - Create PR with description of use case and API documentation

## TaxonPages Integration

Once the API is available, you can update TaxonPages:

1. **Add API Methods** to `src/modules/otus/services/TaxonWorks.js`:
```javascript
static getDescriptors(params) {
  return makeAPIRequest.get('/descriptors', { params })
}

static getOtuObservations(otuId, params) {
  return makeAPIRequest.get(`/otus/${otuId}/observations`, { params })
}

static filterOtusByObservations(filters) {
  return makeAPIRequest.post('/otus/filter_by_observations', { filters })
}
```

2. **Create Filter Components** for different descriptor types
3. **Update Specimen Panel** to use descriptor-based filtering

## Benefits for Purdue Use Cases

1. **Corn Pests**: Create descriptors for:
   - Host plant (qualitative)
   - Damage type (qualitative)
   - Economic threshold (quantitative)
   - Active season (sample/range)

2. **Protected Species**: Create descriptors for:
   - Conservation status (qualitative)
   - Population trend (qualitative)
   - Habitat requirements (qualitative)
   - Last observation date (quantitative/date)

3. **Research Specimens**: Create descriptors for:
   - Collection method (qualitative)
   - Preservation type (qualitative)
   - DNA extracted (presence/absence)
   - Loan availability (presence/absence)

This approach provides structured, queryable data that's much richer than simple tags while maintaining flexibility for different user groups.

## Integration with Interactive Keys

### Shared API Infrastructure

The descriptor API endpoints support both filtering AND interactive keys:

1. **Observation Matrices as Keys**
   - The same matrices used for descriptors become interactive keys
   - Existing endpoint: `GET /api/v1/observation_matrices/:id/key`
   - Already returns descriptor data formatted for keys

2. **Unified Data Model**
   ```ruby
   # Same descriptor serves multiple purposes:
   descriptor = Descriptor.find(3755)
   
   # For filtering:
   observations = descriptor.observations.where(observation_object_type: 'Otu')
   
   # For keys:
   key_data = {
     descriptor_id: descriptor.id,
     states: descriptor.character_states,
     usefulness: descriptor.calculate_usefulness  # For ordering in keys
   }
   ```

3. **Enhanced Endpoints for Both Uses**

   Add to the descriptor API to support key generation:

   ```ruby
   # app/controllers/descriptors_controller.rb
   
   def api_key_usefulness
     # Calculate which descriptors are most useful for identification
     @descriptors = Descriptor
       .where(project_id: sessions_current_project_id)
       .includes(:observations)
       .map do |d|
         {
           id: d.id,
           name: d.name,
           usefulness: calculate_usefulness(d),  # Shannon entropy or similar
           coverage: d.observations.distinct.count(:observation_object_id)
         }
       end
       .sort_by { |d| -d[:usefulness] }
     
     render json: @descriptors
   end
   
   private
   
   def calculate_usefulness(descriptor)
     # Calculate how well this descriptor divides the remaining taxa
     # Higher score = better at splitting groups evenly
     observations = descriptor.observations
     return 0 if observations.empty?
     
     # Shannon entropy calculation
     total = observations.count.to_f
     groups = observations.group(:character_state_id).count
     
     entropy = groups.values.sum do |count|
       proportion = count / total
       -(proportion * Math.log2(proportion))
     end
     
     entropy * Math.sqrt(groups.size)  # Favor descriptors with more states
   end
   ```

### API Routes for Key Support

Add these routes to support key creation and management:

```ruby
# config/routes/api_v1.rb

# Descriptor endpoints that support both filtering and keys
get '/descriptors/key_candidates', to: '/descriptors#api_key_candidates'
get '/descriptors/:id/usefulness', to: '/descriptors#api_usefulness'

# Matrix endpoints for key generation
post '/observation_matrices/generate_from_descriptors', to: '/observation_matrices#api_generate'
get '/observation_matrices/:id/optimal_sequence', to: '/observation_matrices#api_optimal_sequence'
```

### Creating Keys from Descriptors

Allow automatic key generation from filtered descriptors:

```ruby
# app/controllers/observation_matrices_controller.rb

def api_generate
  # Generate a matrix/key from selected descriptors
  descriptor_ids = params[:descriptor_ids]
  otu_ids = params[:otu_ids] || Otu.where(project_id: sessions_current_project_id).pluck(:id)
  
  @matrix = ObservationMatrix.create!(
    name: params[:name],
    project_id: sessions_current_project_id
  )
  
  # Add descriptors as columns
  descriptor_ids.each_with_index do |d_id, index|
    ObservationMatrixColumn.create!(
      observation_matrix: @matrix,
      descriptor_id: d_id,
      position: index
    )
  end
  
  # Add OTUs as rows
  otu_ids.each_with_index do |otu_id, index|
    ObservationMatrixRow.create!(
      observation_matrix: @matrix,
      observation_object_type: 'Otu',
      observation_object_id: otu_id,
      position: index
    )
  end
  
  render json: { 
    matrix_id: @matrix.id,
    interactive_key_url: "/api/v1/observation_matrices/#{@matrix.id}/key"
  }
end
```

### Response Format for Dual Use

Structure responses to support both filtering and key interfaces:

```json
{
  "descriptor": {
    "id": 3755,
    "name": "Body length",
    "type": "Descriptor::Quantitative",
    
    // For filtering UI:
    "filter_config": {
      "input_type": "range",
      "min": 0,
      "max": 50,
      "unit": "mm",
      "step": 0.5
    },
    
    // For key UI:
    "key_config": {
      "usefulness": 3.2,
      "coverage": 0.85,
      "position": 1,
      "show_by_default": true
    },
    
    // Shared data:
    "observations_count": 145,
    "otus_scored": 89
  }
}
```

### Benefits of Integrated Implementation

1. **Single Data Entry**: Score once, use for both browsing and identification
2. **Consistent Vocabulary**: Same terms across all interfaces
3. **Automatic Key Updates**: As new observations are added, keys improve
4. **Progressive Identification**: Filter first, then use targeted keys
5. **Learning Pathway**: Browsing teaches vocabulary needed for keys

This integrated approach means implementing descriptors automatically provides the foundation for better identification keys, making both systems more valuable to users.