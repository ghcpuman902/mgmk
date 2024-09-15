import { Fira_Code } from 'next/font/google'
import { getDomain, getUrls } from './utils'
import UrlListItem from './UrlListItem'
import { redirect } from 'next/navigation'

const firaCode = Fira_Code({ subsets: ['latin'] })

export default function Page({ params }: { params: { slug: string[] } }) {
  const domain = getDomain()
  const urls = getUrls()

  const path = '/' + params.slug.join('/')
  const urlPair = urls.find(u => u.shortPath === path)

  if (urlPair) {
    redirect(`https://${urlPair.longDomain}${urlPair.longPath}`)
  } else {
    // Improvement: Show a message if no URL is found
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-6">URL Not Found</h1>
        <p>The URL you are looking for does not exist.</p>
      </div>
    )
  }
}