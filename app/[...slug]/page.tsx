import { getUrls } from './utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function Page({ params }: { params: { slug?: string[] } }) {
  const urls = getUrls()

  const path = params.slug ? '/' + params.slug.join('/') : '/'
  const urlPair = urls.find(u => u.shortPath === path)

  if (urlPair) {
    redirect(`https://${urlPair.longDomain}${urlPair.longPath}`)
  } else {
    return (
      <div className={`min-h-screen`}>
        <div className="max-w-3xl mx-auto mt-48 mb-12 px-8 py-16 text-neutral-200 text-center">
          <h1 className="text-4xl mb-8 font-bold">URL Not Found</h1>
          <p className="text-xl mb-6">The URL <code className="bg-neutral-800 text-neutral-100 px-1 py-0.5 rounded-md">{path}</code> does not exist.</p>
          <p className="text-lg">
            If you want to park any URL, please get in touch at{' '}
            <a className="underline hover:text-blue-400 transition-colors duration-300" href="mailto:hi@manglekuo.com">
              hi@manglekuo.com
            </a>
          </p>
        </div>
        <div className="text-center my-8 mb-12">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center px-8 py-3 rounded-full 
                                 transition-all duration-300 ease-in-out
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                                 text-lg font-semibold"
            aria-label="Go back to home page"
          >
            <span className="relative z-10 text-white drop-shadow-md">Go Back</span>
            <span className="absolute inset-0 rounded-full bg-blue-600 blur-lg opacity-70  
                                       group-hover:opacity-100 group-hover:blur-md 
                                       transition-all duration-300 ease-in-out">
            </span>
          </Link>
        </div>
      </div>
    )
  }
}