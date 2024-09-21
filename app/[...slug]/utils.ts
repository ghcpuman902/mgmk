import { headers } from 'next/headers'

export function getDomain(): string {
  const headersList = headers()
  const domain = headersList.get('host') || 'localhost:3000'
  return domain
}

export function getUrls() {
  return [
    { shortPath: '/lu/nl', longDomain: 'manglekuo.com', longPath: '/works/london-underground-name-analysis/name-lab' },
    { shortPath: '/as', longDomain: 'manglekuo.com', longPath: '/works/article-search' },
    { shortPath: '/c24', longDomain: 'manglekuo.com', longPath: '/works/cannes-2024' },
    { shortPath: '/lr', longDomain: 'manglekuo.com', longPath: '/works/letter' },
    { shortPath: '/me', longDomain: 'manglekuo.com', longPath: '/aboutme' },
  ]
}

export function splitUrl(url: string) {
  const [domain, ...pathParts] = url.split('/')
  return { domain, path: '/' + pathParts.join('/') }
}

export function assembleUrl(domain: string, path: string) {
  return `${domain}${path}`
}
