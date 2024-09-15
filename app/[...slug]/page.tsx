import { getUrls } from './utils'
import { redirect } from 'next/navigation'

export default function Page({ params }: { params: { slug: string[] } }) {
  const urls = getUrls()

  const path = '/' + params.slug.join('/')
  const urlPair = urls.find(u => u.shortPath === path)

  if (urlPair) {
    redirect(`https://${urlPair.longDomain}${urlPair.longPath}`)
  } else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-6">URL Not Found</h1>
        <p>The URL you are looking for does not exist.</p>
      </div>
    )
  }
}