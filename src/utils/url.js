export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

// Allow base_url to be different when deployed elsewhere than Github Pages — for example to a CMS.
// GithubPages requires the base_url to be the repository name, while a CMS may need the page to
// fit into its own directory structure.
export const getBaseUrl = (configuration = __APP_ENV__) => {
  const baseUrl = configuration?.base_url || ''
  const deployedBaseUrl = configuration?.deployed_base_url || ''
  const isGithubPages = window.location.origin.indexOf('.github.io/') > 0
  return isGithubPages ? baseUrl : deployedBaseUrl
}