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
  }

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col items-center justify-center ${firaCode.className}`}>
      <div className="text-gray-800 p-8">
        <h1 className="text-2xl mb-6">{domain} URL Shortener</h1>
        <ul className="space-y-2">
          {urls.map((url, index) => (
            <UrlListItem
              key={index}
              shortDomain={domain}
              shortPath={url.shortPath}
              longDomain={url.longDomain}
              longPath={url.longPath}
            />
          ))}
        </ul>
      </div>
      <div className="text-gray-500 text-xs mt-8">
        If you want to park any URL, please get in touch at hi@manglekuo.com
      </div>
    </div>
  )
}