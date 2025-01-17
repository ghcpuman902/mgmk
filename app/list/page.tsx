import { getDomain, getUrls } from '../[...slug]/utils'
import UrlListItem from '../[...slug]/UrlListItem'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Page() {
    const domain = getDomain()
    const urls = getUrls()

    const path = ''
    const urlPair = urls.find(u => u.shortPath === path)

    if (urlPair) {
        redirect(`https://${urlPair.longDomain}${urlPair.longPath}`)
    }

    return (
        <div className={``}>
            <div className="max-w-3xl mx-auto mt-44 mb-8 px-8">
                <ul className="space-y-4 text-neutral-100">
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
            <div className="text-center text-neutral-400 text-xs max-w-3xl mx-auto my-8 px-8">
                If you want to park any URL, please get in touch at hi@manglekuo.com
            </div>
            <div className="text-center my-8">
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