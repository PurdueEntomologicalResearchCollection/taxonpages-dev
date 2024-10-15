export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

// Allow base_url to be different on Github Pages than when deployed elsewhere, for example to Cascade.
// GithubPages requires the base_url to be the repository name, while Cascade needs the page to
// fit into its own directory structure.
export const getBaseUrl = (configuration = __APP_ENV__) => {
  const baseUrl = configuration?.base_url || ''
  const githubPagesBaseUrl = configuration?.github_pages_base_url || ''
  const isGithubPages = window.location.origin.indexOf('.github.io/') > 0
  return isGithubPages ? githubPagesBaseUrl : baseUrl
}