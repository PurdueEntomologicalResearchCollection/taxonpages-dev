# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the Purdue Entomological Research Collection (PERC) instance of TaxonPages - a Vue.js web application for serving taxonomic data pages. It connects to TaxonWorks API and provides interactive taxon pages with maps, galleries, and nomenclature information.

## Key Architecture

### Technology Stack
- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom theme
- **State Management**: Pinia
- **Router**: Vue Router with file-based routing
- **SSR**: Server-side rendering with Express.js
- **API**: Integrates with TaxonWorks REST API

### Module System
The app uses a modular architecture with core modules:
- `otus`: Main taxon/OTU browsing functionality
- `keys`: Interactive identification keys
- `home`: Landing page
- `setup`: Initial configuration module
- `httpErrorPages`: Error handling pages

Each module contains:
- `router/`: Module-specific routes
- `views/`: Page components
- `components/`: Module-specific components
- `services/`: API services
- `store/`: Module state management
- `composables/`: Module-specific composables

### Data Flow Pattern
1. Route navigation → View component
2. View dispatches store actions
3. Store calls API services (e.g., `TaxonWorks.js`)
4. API responses update store state
5. Components reactively update via store state

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start SSR development server
npm run dev:ssr

# Build for production
npm run build

# Build for SSR production
npm run build:ssr

# Run linting
npm run lint

# Preview production build
npm run preview

# Run production server (SSR)
npm run serve
```

## Multi-Repository Git Setup

This project uses multiple remotes for different deployment targets:

```bash
# Remotes
origin: taxonpages (GitHub Pages)
dev: taxonpages-dev (GitHub Pages dev)
deploy: taxonpages-deploy (Cascade CMS production)
deploy-dev: taxonpages-deploy-dev (Cascade CMS test)
sfg: SpeciesFileGroup/taxonpages (upstream)

# Key branches
main: Production GitHub Pages
dev-main: Development GitHub Pages
deploy-main: Production Cascade CMS
deploy-dev-main: Test Cascade CMS
```

## Configuration Files

All configuration is in YAML files under `config/`:
- `api.yml`: TaxonWorks API connection (required: url, project_token)
- `router.yml`: Base URL configuration (differs per deployment)
- `project.yml`: Project metadata
- `taxa_page.yml`: Taxa page layout configuration
- `maps.yml`: Map configuration
- `metadata.yml`: SEO and meta tags
- `features.yml`: Feature flags for experimental/incomplete features

## Important Notes

1. **Base URL**: Each deployment target has a different `base_url` in `config/router.yml`
2. **API Configuration**: Must configure `config/api.yml` with TaxonWorks server URL and project token
3. **No Tests**: Project currently has no test suite configured
4. **Linting**: Use `npm run lint` before committing (ESLint with Vue recommended rules)
5. **Component Naming**: Global components must be suffixed with `.global.vue`
6. **Client-only Components**: Use `.client.vue` suffix for client-only components
7. **SSR Considerations**: Application supports full SSR - be mindful of browser-only APIs

## Common Development Tasks

### Adding a New Module
1. Create module directory under `src/modules/`
2. Add router configuration in `module/router/`
3. Create views in `module/views/`
4. Add API services in `module/services/`
5. Routes are automatically loaded via glob pattern

### Working with TaxonWorks API
- Main service: `src/modules/otus/services/TaxonWorks.js`
- Request utility: `src/utils/request.js`
- API configuration from environment: `__APP_ENV__.API_URL` and `__APP_ENV__.API_PROJECT_TOKEN`

### Customizing Layouts
- Panel configurations in `config/taxa_page.yml`
- Custom panels in module components
- Layout components in `src/components/layout/`

### Deployment to Cascade CMS
1. Build with appropriate base_url
2. Download artifacts from GitHub Actions
3. Upload assets (CSS + JS files) to Cascade
4. Update HTML references in Cascade
5. Publish changes
## Feature Flags

The `config/features.yml` file controls experimental/incomplete features:

```yaml
# Current flags:
enable_specimen_tags: false  # Specimen tag filtering - set to true for dev, false for prod
```

**Active feature flags:**
- `enable_specimen_tags`: Controls visibility of "Filter by tags" UI in specimen panel
  - Location: `src/modules/otus/components/Panel/PanelSpecimens/PanelSpecimens.vue`
  - Status: Incomplete - awaiting TaxonWorks API support for tag-based filtering
  - Default: `false` for production, can be `true` for local development

**Adding new feature flags:**
1. Add to `config/features.yml`
2. Access via `__APP_ENV__.your_feature_flag` in components
3. Provide fallback: `const enabled = __APP_ENV__.your_feature_flag || false`
4. Remember: config files are branch-specific (setup branches only)

**Important:** When deploying, ensure production branches have experimental features set to `false`.
