import { Fira_Code } from 'next/font/google'
import { getDomain, getUrls } from '../[...slug]/utils'
import UrlListItem from '../[...slug]/UrlListItem'
import { redirect } from 'next/navigation'
import { MGMKLogo } from '../mgmkLogo'

const firaCode = Fira_Code({ subsets: ['latin'] })

export default async function Page() {
    const domain = getDomain()
    const urls = getUrls()

    const path = ''
    const urlPair = urls.find(u => u.shortPath === path)

    if (urlPair) {
        redirect(`https://${urlPair.longDomain}${urlPair.longPath}`)
    }

    return (
        <div className={`min-h-screen ${firaCode.className}`}>
            <div className="max-w-3xl mx-auto p-8">
                <div className="">
                    <MGMKLogo className="w-1/3 h-auto fill-neutral-100" />
                </div>
                <h1 className="text-2xl mb-6 text-neutral-100">URL Shortener</h1>
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
            <div className="text-center text-neutral-400 text-xs mt-8 max-w-3xl mx-auto p-8">
                If you want to park any URL, please get in touch at hi@manglekuo.com
            </div>
        </div>
    )
}