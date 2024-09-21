import { redirect } from 'next/navigation'
import { getUrls } from '../../[...slug]/utils'

export const metadata = {
    title: 'Free the JavaScript Trademark - An Open Request to Oracle',
    description: 'JavaScript is now a widely adopted, generic term. We kindly urge Oracle to release the JavaScript trademark to the public domain for the benefit of the developer community.',
    metadataBase: new URL('https://mg.mk'),
    openGraph: {
      title: 'Free the JavaScript Trademark - A Request to Oracle',
      description: 'It’s time for Oracle to release the JavaScript trademark. Explore this letter and join the cause for a freely available JavaScript.',
      url: 'https://mg.mk/lr',
      images: [
        {
          url: 'https://mg.mk/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: 'A polite request for Oracle to free the JavaScript trademark',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free the JavaScript Trademark - A Request to Oracle',
      description: 'JavaScript is a widely-used generic term. Explore this letter asking Oracle to release the trademark and join the cause.',
      images: ['https://mg.mk/twitter-image.jpg'],
    },
  }

export default function Page() {
  const urls = getUrls()
  const path = '/lr'
  const urlPair = urls.find(u => u.shortPath === path)

  if (urlPair) {
    redirect(`https://${urlPair.longDomain}${urlPair.longPath}`)
  }

  // If no redirect, render the content for /lr
  return (
    // Your existing content for the /lr page
    <div>
      {/* Add your content here */}
    </div>
  )
}

