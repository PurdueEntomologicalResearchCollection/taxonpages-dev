function humanize(text) {
  return text
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/^[a-z]/, (m) => m.toUpperCase())
}

function uncapitalize(text) {
  return text.replace(/^[A-Z]/, (m) => m.toLowerCase())
}

function linkify(text) {
  if (!text) return ''
  const urlPattern = /(https?:\/\/[^\s<]+)/g
  return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener">$1</a>')
}

export { humanize, uncapitalize, linkify }
