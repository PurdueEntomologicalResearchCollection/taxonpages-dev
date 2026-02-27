# Purdue Entomological Research Collection (PERC) — TaxonPages

A Vue 3 web application for serving taxonomic data pages for the [Purdue Entomological Research Collection](https://ag.purdue.edu/department/entm/perc/). Built on [SpeciesFileGroup/taxonpages](https://github.com/SpeciesFileGroup/taxonpages), connecting to the [TaxonWorks API](https://sfg.taxonworks.org/api/v1).

## Repositories

| Repo | Purpose |
|------|---------|
| `github.itap.purdue.edu/ESD/PERC` | Primary (Purdue internal) |
| `github.com/PurdueEntomologicalResearchCollection/taxonpages-dev` | GitHub Pages preview — auto-deploys on push |

**Live sites:**
- GitHub Pages preview: https://purdueentomologicalresearchcollection.github.io/taxonpages-dev/
- Production (Cascade CMS): https://ag.purdue.edu/department/entm/perc/search-collection.html

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/taxonpages-dev/

For Cascade CMS simulation (matches production CSS environment):
```bash
npm run dev:cascade
```

## Commit and Push

```bash
git add <files>
git commit -m "description of changes"

# Push to Purdue internal repo
git push

# Push to GitHub Pages (triggers auto-deploy)
git push dev HEAD:main
```

## Deploy to Cascade CMS

1. Change `base_url` in `config/router.yml`:
   ```yaml
   base_url: /department/entm/perc/search-collection.html
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Upload the 4 asset files from `dist/assets/` (1 CSS + 3 JS) to the Cascade CMS assets folder.

4. Update the HTML references in Cascade to point to the new filenames.

5. Publish in Cascade. Changes go live in ~10-15 minutes.

6. Change `base_url` back for local dev:
   ```yaml
   base_url: /taxonpages-dev/
   ```

## Key Config Files

All configuration is in `config/`:

| File | Purpose |
|------|---------|
| `api.yml` | TaxonWorks API URL and project token |
| `router.yml` | Base URL (differs per deployment target) |
| `project.yml` | Project metadata |
| `taxa_page.yml` | Taxa page panel layout |
| `maps.yml` | Map configuration |
| `metadata.yml` | SEO and meta tags |
| `features.yml` | Feature flags for experimental features |
| `style/theme.css` | Color palette (RGB values) |
| `style/purdue-cascade.css` | CSS overrides for Cascade CMS environment |

## Upstream

This is a downstream fork of [SpeciesFileGroup/taxonpages](https://github.com/SpeciesFileGroup/taxonpages). To sync upstream changes:

```bash
git remote add sfg https://github.com/SpeciesFileGroup/taxonpages.git
git fetch sfg
git merge sfg/main
```

See [UPSTREAM-CONTRIBUTING.md](./UPSTREAM-CONTRIBUTING.md) for guidance on contributing changes back upstream.
