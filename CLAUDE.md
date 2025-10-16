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

# Start Cascade CMS development mode (see section below)
npm run dev:cascade

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

## Cascade CMS Development Mode

To facilitate local development with Cascade CMS styles, a special development mode is available that simulates the Cascade environment locally.

### What it does:
- Loads production Cascade CMS stylesheets (Bootstrap, Font Awesome, Purdue fonts, etc.)
- Wraps your app in Cascade's HTML structure (header, breadcrumbs, footer, container divs)
- Applies `config/style/purdue-cascade.css` to override Cascade styles
- Allows you to see exactly how the app will look when deployed to Cascade without manual deployment

### Usage:
```bash
npm run dev:cascade
```

Then navigate to `http://localhost:5175/taxonpages/index-cascade-dev.html` (or whichever port Vite chooses)

### Files involved:
- `index-cascade-dev.html`: HTML template with Cascade CMS wrapper structure
- `config/style/purdue-cascade.css`: Style overrides to counteract Cascade's CSS
- `vite.config.js`: Configured to support `CASCADE_DEV=true` environment variable

### Cascade stylesheets loaded:
- Bootstrap 4.5.2
- Font Awesome 6.4.2
- Purdue United Sans font
- Adobe Typekit fonts
- Swiper 5.4.5 (carousel library)
- nanogallery2 (gallery styles)
- hh-gallery (additional gallery styles)
- Purdue Agriculture custom styles (`_style.css`, `_style_ag_only.css`)
- Lightbox CSS

### HTML structure:
The app is wrapped in Cascade's typical structure:
```
<main id="main-content">
  <section class="page-section wysiwyg-full-width">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="wysiwyg">
            <div id="app"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
```

This matches the production Cascade deployment structure exactly.

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

## Contributing to Upstream

This is a downstream fork of SpeciesFileGroup/taxonpages. See [UPSTREAM-CONTRIBUTING.md](./UPSTREAM-CONTRIBUTING.md) for detailed guidance on:
- Which changes should be contributed upstream vs kept Purdue-specific
- How to manage config files across working and setup branches
- Workflows for contributing bug fixes and ADA improvements back to sfg
- How to sync upstream changes without losing Purdue customizations

**Quick rules:**
- ✅ **Contribute upstream:** Bug fixes, ADA improvements, features using CSS variables
- ❌ **Keep local:** Purdue branding files (`purdue-*.css`), config files, color values in `vars.css`
- 🔧 **Config edits:** Switch to `*-setup` branch, edit, commit, then `git checkout <setup-branch> -- config/`

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
