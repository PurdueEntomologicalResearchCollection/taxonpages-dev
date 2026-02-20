# Purdue Entomology's [TaxonPages](https://github.com/SpeciesFileGroup/taxonpages)

**Purdue Entomological Research Collection** (PERC) homepage: https://ag.purdue.edu/department/entm/perc/

The PERC instance of TaxonPages has four repos, each with its own GitHub Pages site — because a repo [can only have a single GitHub Pages site](https://github.com/orgs/community/discussions/21582). They diverge only in their `base_url` in the file `config/router.yml`.

| Repo | Destination | `base_url` in `router.yml` |
|--|--|--|
| taxonpages | Github Pages:<br>https://purdueentomologicalresearchcollection.github.io/taxonpages/ | `/taxonpages/` |
| taxonpages-deploy | Cascade — see [action log](https://github.com/PurdueEntomologicalResearchCollection/taxonpages-deploy/actions) for deployment:<br>https://ag.purdue.edu/department/entm/perc/search-collection.html | `/department/entm/perc/search-collection.html` |
| taxonpages-dev | Github Pages:<br>https://purdueentomologicalresearchcollection.github.io/taxonpages-dev/ | `/taxonpages-dev/` |
| taxonpages-deploy-dev | Cascade — see [action log](https://github.com/PurdueEntomologicalResearchCollection/taxonpages-deploy-dev/actions) for deployment:<br>https://ag.purdue.edu/department/agit/test/perc/ | `/department/agit/test/perc/` |

Each uses GitHub Actions, following [these instructions](https://github.com/SpeciesFileGroup/taxonpages). Deployment is automatic for those hosted on Github Pages, but for Cascade it requires manual steps of copying files. For now. In the future, hopefully we can automate Cascade deployments using the [Cascade API](https://www.hannonhill.com/cascadecms/latest/developing-in-cascade/rest-api/operations.html).

### TODO: Explain how to deploy to Cascade

## Local Development

You'll need to [clone multiple repos into a _single local git repo_](https://jigarius.com/blog/multiple-git-remote-repositories). This may be a new experience — even for seasoned developers — but it works very well because it's a core feature of `git`.

1. Clone the production repo, like you would normally. This will become your `origin` remote.

```bash
git clone git@github.com:PurdueEntomologicalResearchCollection/taxonpages.git
cd taxonpages
```

2. Add the dev repo as a remote and configure dev branches.

```bash
git remote add dev git@github.com:PurdueEntomologicalResearchCollection/taxonpages-dev.git
git fetch dev
git checkout -b dev-setup dev/setup
git checkout -b dev-main dev/main
```

3. Run the `dev-main` branch locally. You can follow the usual dev cycle — make changes , edit code, commit, repeat.

```bash
git checkout dev-main
git checkout dev-setup .  # Yes, this is a funky thing to do, and you will have to clean up before committing
npm install
npm run dev
```

Open http://localhost:5173/taxonpages-dev/ to try it out, see changes hot reload, etc.

4. Commit and push changes. This push will seem a little weird, if you haven't worked with multiple repos before.

```bash
git commit -m "a good description of this commit"
git push dev HEAD:main  # push to repository taxonpages-dev's the main branch
```

This will [trigger a rebuild](https://github.com/PurdueEntomologicalResearchCollection/taxonpages-dev/actions) in Github Pages, and after a minute or so, the deployed version will be ready to test at https://purdueentomologicalresearchcollection.github.io/taxonpages-dev/

Congratulations, you have made changes locally and published them to Github Pages!

## Deploying Changes to Cascade CMS

After you make changes locally, you'll want to push them up the chain to the [Purdue test page](https://ag.purdue.edu/department/agit/test/perc/) and then to the [production PERC search page](https://ag.purdue.edu/department/entm/perc/search-collection.html).

1. Tidy up your local branch. Be _sure_ you have committed your changes before you do this, because this step will **_erase anything that is not committed_**.

   * The branch `deploy-dev` is the `taxonpages-deploy-dev` repository's `main` branch, if you followed the setup steps above.
   * Again, this will [trigger a rebuild, but in the `deploy-dev` repo](https://github.com/PurdueEntomologicalResearchCollection/taxonpages-deploy-dev/actions), but [that version will not work](https://purdueentomologicalresearchcollection.github.io/taxonpages-dev/) because it is configured to run inside Cascade CMS.

```bash
git reset --hard  # Warning: This will totally wipe out any changes you haven't committed.
```

2. If you haven't already, add two more `git` remotes:

```bash
git checkout -b deploy-setup deploy/setup
git checkout -b deploy-main deploy/main
git checkout -b deploy-dev-setup deploy-dev/setup
git checkout -b deploy-dev-main deploy-dev/main
```

3. Deploy to Cascade CMS testing page.

   * First, merge to `deploy-dev`. Github Actions will build a new version, that you can deploy.

```bash
git checkout deploy-dev
git merge dev  # follow prompts to pull your new changes into the deploy-dev branch
```

   * Download the zip file of artifacts by clicking on the latest Github **Actions** workflow run → **build** → **Upload artifact** → **Artifact download URL**
     * Dev start here: [actions for the **deploy-dev** branch](https://github.com/PurdueEntomologicalResearchCollection/taxonpages-deploy-dev/actions)
     * Prod start here: [actions for the **deploy** branch](https://github.com/PurdueEntomologicalResearchCollection/taxonpages-deploy/actions)
   * Upload the **assets** from that zip file to Cascade CMS, in the appropriate **assets** folder. It should be 4 files — one `.css` and three `.js`.
   * In Cascade CMS, edit the HTML to refer to the new files. You will need to edit two filenames: one `.css` and one `.js`.
   * Publish your changes. After 10-15 minutes, it will be live on the [PERC Search Test Page](https://ag.purdue.edu/department/agit/test/perc/).

4. Promote to production, once testing is complete.

    * Merge to the `main` and/or `deploy` branches, similar to above.
    * See your changes in Github Pages: https://purdueentomologicalresearchcollection.github.io/taxonpages/
    * Deploy to the [main PERC search page](https://ag.purdue.edu/department/entm/perc/search-collection.html).
    * **_Voila, site updated!_**

## Upstream changes

To keep up with upstream changes — and also to contribute back — you'll need to connect with the [Species File Group](https://speciesfilegroup.org/)'s github repo: https://github.com/SpeciesFileGroup/taxonpages.

### Catching up with upstream development

1. Add the remotes (this may be familiar by now)

```bash
git remote add sfg https://github.com/SpeciesFileGroup/taxonpages.git
git checkout -b sfg-main sfg/main
git checkout -b sfg-setup sfg/setup
```

2. Merge upstream changes to your `dev` branch.

```bash
git checkout dev-main
git merge sfg-main  # there will likely be conflicts, homework, npm install, testing, etc — plan for this to take a while
git checkout dev-setup
git merge sfg-setup  # probably straightforward? Let's hope.
```

3. Test and merge these changes into your other branches, and follow the steps as above for deployment.

### Contributing upstream

The pinnacle of open source development: _Contributing back to the community!_

This is an advanced topic, and you will need to be in touch with the Species File Group (SFG) developers. The Purdue Entomology faculty and staff can help you get connected. You will [create a pull request](https://github.com/SpeciesFileGroup/taxonpages/compare/main...PurdueEntomologicalResearchCollection:taxonpages:main?expand=1) and review it with SFG developers.

---

# TaxonPages

TaxonPages is a tool to serve taxon pages. At present it draws data from TaxonWorks' API, however we seek to keep the TaxonPages platform agnostic therefor facilitating the modular addition of functionality that may reference data from any biodiversity data-serving API.

## Status Warning

TaxonPages software is in active development and changes are expected that will cause the early first-adopters' instances to require rebuilding by refreshing one's forked branch using `git pull`. A first _stable version_ is expected by Spring 2023.

## Usage

1. Click on "Fork" button to create your own repository from this.
2. Uncheck `Copy the setup branch only` and press `Save`
3. After create your repo, go to `Settings > Pages`, on "Branch" select `gh-pages` and `/(root)`. Then press save
4. Open `router.yml` file and change `base_url` to the name of your repository.
5. After a couple of minutes, your public page should be available at `https://<your_user_name>.github.io/<your_repo_name>`

### Setup

1. Switch to `setup` branch in your TaxonPages repository.
2. We provide some settings by default to setup your public pages, but API parameters are required and must be configured to get the data from your TaxonWorks project.

```yaml
# config/api.yml
---
url: https://<your.taxonworks.server>/api/v1
project_token: yourprojecttoken
```

3. Push the changes after update the configuration files inside `setup` branch
4. GitHub actions will build TaxonPages with the current configuration in `setup` branch and publish it to the `gh-pages` branch

# Install

Follow this steps to run TaxonPages in your local machine.

1. Install [NodeJS](https://nodejs.org/en/download/)
2. We recommend you to fork this repository to keep getting updates. Use [GIT](https://git-scm.com/) to clone the repo.

```
git clone https://github.com/<your_username>/<your_repository_name>.git
```

But if you don't want to fork it, you can clone directly from this

```
git clone https://github.com/SpeciesFileGroup/taxonpages.git
```

3. Go to `taxonpages` folder and enter the following commands to copy the software to your `setup` branch

```
git checkout main
git checkout setup
git checkout main .
git reset
git checkout .
```

5. Setup `config/api.yml` with the API server configuration

6. Install node dependencies

```
npm install
```

## Start TaxonPages

```
npm run dev
```

TaxonPages will be running at http://localhost:5173/

# Customization

## Pages

TaxonPages out of the box support markdown and vue for content sites. Add your content pages inside `pages` folder. By default, TaxonPages use the file name to create the route.
For example, if the filename is "contributors.md" the route to access it will be http://yourtaxonpagessite/contributors

### Markdown pages

This software use [vite-plugin-md](https://github.com/antfu/vite-plugin-md) to render pages in Markdown format, the engine of this plugin is [markdown-it](https://github.com/markdown-it/markdown-it). For plugins and other configuration you can refer to this section https://github.com/antfu/vite-plugin-md#configuration--options

Example: `welcome.md` file

```
---
name: 'Charles Darwin'
---

# Welcome, {{ name }}!
```

To use TaxonPage internal variables in `config/*.yml`, you can either do so by adding the prefix {{ app:var_name }} or use the script tag in your markdown page and get them from the global object `__APP_ENV__`

#### Prefix

```markdown
# Welcome to {{ app:project_name }}!
```

#### Script tag

```javascript
# Welcome to {{ project_name }}!

<script setup>
const { project_name } = __APP_ENV__
</script>
```

#### Components

TaxonPages global components are enable in your markdown pages, by default we provide a set of global components that you don't need to import them to use it. You can see the list of this global components [here](#global-components)

### Style

If you want to change the color palette, you can edit `/config/style/theme.css` file, colors must be in RGB format.
TaxonPages use [TailwindCSS](https://tailwindcss.com/docs/configuration) framework for the style. We already provide default settings for colors and markdown. If you want to make any change to your configuration, you must do so in the `config/vendor/tailwind.config.js` file. This file uses the TaxonPages configuration as a default. It is possible to overwrite it as long as you use it as a preset.

## Analytics

TaxonPages has out-of-the-box support for the following list of analytics services:

```yaml
analytics_services:
  enableDev: false # Set true to work in development mode
  analytics:   # Google Analytics
    - id: 'G-XXXXX'
  gtm:         # Google Tag Manager
    - id: 'GTM-XXXXX'
  pixel:       # Facebook Pixel
    - id: 'XXXXXXX'
  retargeting: # VK Retargeting
    - id: 'VK-RTRG-XXXXXX-XXXXX',
  linkedin:    # Linkedin Insight
    - id: 'XXXXXXX'
  tongji:      # Baidu Tongji
    - id: 'XXXXXXX',
  metrica:     # Yendex Metrica
    - id: 'XXXXXXX',
  microsoft:   # Microsoft Analytics
    id: 'XXXXXXX'
  hotjar:      # Hotjar Analytics
    id: 'XXXXXXX',
  fullStory:   # Full story Analytics
    org: 'X-XXXXXX-XXX'
  tiktok:      # TikTok Pixel Analytics
    id: 'XXXXXXX'
```

# Deep dive into TaxonPages

## Access internal configuration vars

To access the configuration in \*.yml files, we provide a global object that contains all the configuration values. This variable can be used in either JavaScript, Vue, or Markdown files. To access these values you must use the `__APP_ENV__` variable:

```javascript
const { project_name } = __APP_ENV__
// or
const projectName = __APP_ENV__.project_name
```


## Taxa Page

### Layout

To modify the position of the panels in the layout of the Taxa page, edit the `taxa_page.yml` file. There you can add/move/remove panels from the layout, also you can add new tabs and include new panels there. If you want to make some tabs visible or not depending the rank group, you can include `rankGroup`

```yaml
taxa_page:
  overview:
    panels:
      - - - panel:gallery
          - panel:type
          - panel:type-specimen
          - panel:nomenclature
          - panel:nomenclature-references

        - - panel:map
          - panel:descendants
          - panel:content
          - panel:statistics
          - panel:keys
          - panel:sounds
#
# An example of a new tab:
#
# type_specimens:
#   rank_group: ['SpeciesGroup']
#   panels:
#     - - - panel:specimen-records
```

### Lifecycle hooks (Experimental feature)

The `onCreatePage` and `onSSRPageCreate` functions allow you to execute code at the time the taxa page is created. `onSSRPageCreate` will be executed only on the server side in SSR mode. To make use of them it is necessary to include them in a file object called `pages/otus.config.js`. Both functions accept `otu`, `taxon`, `route` and `router` objects as parameters. Since `onCreatePage` runs on Taxa page component, it is possible to use hooks like `onMounted` or `onBeforeMount` inside it

```javascript
export default {
  onSSRCreatePage: async ({ otu, taxon, route, router }) => {
    // Your code here
  },

  onCreatePage: ({ otu, taxon, route, router }) => {
    // Your code here
  }
}
```

### Customizing the Layout

The application comes with a default layout that includes a header and a footer. If you'd like to replace this layout with your own, you can do so by creating a custom layout file.

Steps to replace the default layout

1. In the root folder of your project, create a new folder called `layouts` (if it doesn't already exist).
2. Inside this folder, create a file named default.vue.
3. Define your custom layout structure inside this file as needed.

Example of layouts/default.vue

```vuejs
<template>
  <div>
    <slot />
  </div>
</template>
```

This custom layout will replace the default one and be applied throughout the application. You can include your own elements, such as a navigation bar or footer, as needed.

#### Using Multiple Layouts

In addition to replacing the default layout, you can create multiple layouts by adding more .vue files inside the layout folder. You can then specify which layout to use for a specific page by setting the layout name in the meta property of the `<route>` tag in your Single File Component (SFC).

JSON5:

```js
<route>
{
  meta: {
    layout: 'custom'
  }
}
</route>
```

YAML:

```yaml
<route lang="yaml">
meta:
  layout: custom
</route>
```

### External panels

To add panels in Taxa pages, create a folder called `panels` in your `setup` branch, and inside it create another folder for your panel. For example: `panels/PanelTest`

In `PanelTest` folder, create a `main.js` file, with the following structure:

```javascript
import MyPanelComponent from './MyPanelComponent.vue'

Export default {
   id: 'panel:test', // ID to identify this panel
   component: MyPanelComponent, // Vue component for your panel
   rankGroup: ['HigherClassificationGroup', 'FamilyGroup', 'GenusGroup', 'SpeciesGroup'] // <-- OPTIONAL: This will define for which rank group will be available, remove it if your panel will be available for all.
}
```

This file is used to load your panel component in taxa page. Use the `id` to include and define the position in the layout in `taxa_page.yml`

```yaml
taxa_page_overview:
  panels:
    - - - panel:gallery
        - panel:test # <--- Your new panel
        - panel:type
        - panel:type-specimen
        - panel:nomenclature
        - panel:nomenclature-references

      - - panel:map
        - panel:descendants
        - panel:content
        - panel:statistics
        - panel:keys
        - panel:sounds
```

## Defining global components

TaxonPages provides an auto-import component from `src/components` and `/components` folders using special extensions for it. Some objects and functions are only present in the browser and not in the NodeJs server environment. When you run code that is not supported by the server, it ends up crashing. Some JavaScript libraries like `Leaflet` use the `document` or `window` object, which do not exist in the node environment. To handle this problem, TaxonPages provides 2 ways to import the components.

### Client Side only (CSR):

This auto import method will only load the component on the client side, while on the server it will create a fake empty component, which will be used later on the client side to be replaced by the original one when the hydration process occurs. To define this type of import, the component name must contain the word `.client.` before `.vue` extension.

Example: `MyAmazingComponent.client.vue`

### Global (CSR & SSR)

This auto-import method will load the component both client and server side. To define this type of import, the component must contain the word `.client.` before the `.vue` extension.

Example: `MyAmazingComponent.global.vue`

### Global components

TaxonPages provides a set of global components that could be used to create your own panels or pages. Here is the complete list:

| Component             | Description                                    | Props                                                                                                                    |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `<AnimationOpacity/>` | Add an opacity animation for a child component |                                                                                                                          |
| `<Autocomplete/>`     | Used to perform searches in TaxonWorks         | [Link](https://github.com/SpeciesFileGroup/taxonpages/blob/main/src/components/Autocomplete/Autocomplete.global.vue#L42) |
| `<AutocompleteOtu/>`  | A specific autocomplete for OTU search         |                                                                                                                          |
| `<ClientOnly/>`       | Render child components only from client side  |                                                                                                                          |
| `<VButton/>`          | Button component                               |                                                                                                                          |
| `<VCard/>`            | Card component style                           |                                                                                                                          |
| `<VCardContent/>`     | Card content body                              |                                                                                                                          |
| `<VCardHeader/>`      | Card Header                                    |                                                                                                                          |
| `<VClipboard/>`       | Copy a text to clipboard                       |                                                                                                                          |
| `<Dropdown/>`         | Dropdown menu                                  |                                                                                                                          |
| `<GalleryImage/>`     |                                                | [Link](https://github.com/SpeciesFileGroup/taxonpages/blob/main/src/components/Gallery/GalleryImage.global.vue#L40)      |
| `<ImageViewer/>`      |                                                |                                                                                                                          |
| `<TrackerReport/>`    | Show trackers to report issues                 | [Link](https://github.com/SpeciesFileGroup/taxonpages/blob/main/src/components/TrackerReport.global.vue#L47)             |
| `<TabMenu/>`          |                                                |                                                                                                                          |
| `<TabItem/>`          |                                                |                                                                                                                          |
| `<VMap/>`             | Interactive map that use Leaflet library       |                                                                                                                          |
| `<VModal/>`           | Create lightboxes                              |                                                                                                                          |
| `<VSkeleton/>`        | Content loading placeholder                    |                                                                                                                          |
| `<VSpinner/>`         | Loading spinner                                |                                                                                                                          |
| `<VTable/>`           |                                                |                                                                                                                          |
| `<VTableBody/>`       |                                                |                                                                                                                          |
| `<VTableBodyCell/>`   |                                                |                                                                                                                          |
| `<VTableBodyRow/>`    |                                                |                                                                                                                          |
| `<VTableHeader/>`     |                                                |                                                                                                                          |
| `<VTableHeaderCell/>` |                                                |                                                                                                                          |
| `<VTableHeaderRow/>`  |                                                |                                                                                                                          |

| Icons                |
| -------------------- |
| `<IconArrowDown/>`   |
| `<IconArrowLeft/>`   |
| `<IconArrowRight/>`  |
| `<IconCheck/>`       |
| `<IconClipboard/>`   |
| `<IconClose/>`       |
| `<IconDocument/>`    |
| `<IconDownload/>`    |
| `<IconHamburger/>`   |
| `<IconJson/>`        |
| `<IconMinusCircle/>` |
| `<IconPlusCircle/>`  |
| `<IconSearch/>`      |
| `<IconTrash/>`       |
| `<IconWarning/>`     |
