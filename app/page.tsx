'use client'

import { useState } from 'react'
import { Fira_Code } from 'next/font/google'

const firaCode = Fira_Code({ subsets: ['latin'] })

const shortUrls = [
  { short: 'mg.mk/', long: 'manglekuo.com/' },
  { short: 'mg.mk/lu', long: 'manglekuo.com/works/london-underground-names' },
  { short: 'mg.mk/as', long: 'manglekuo.com/works/article-search' },
  { short: 'mg.mk/c24', long: 'manglekuo.com/works/cannes-2024' },
  { short: 'mg.mk/me', long: 'manglekuo.com/aboutme' },
]

export default function Page() {
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null)

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col items-center justify-center ${firaCode.className}`}>
      <div className="text-gray-800 p-8">
        <h1 className="text-2xl mb-6">mg.mk URL Shortener</h1>
        <ul className="space-y-2">
          {shortUrls.map((url, index) => (
            <li 
              key={index}
              className="transition-all duration-300 ease-in-out"
              onMouseEnter={() => setHoveredUrl(url.short)}
              onMouseLeave={() => setHoveredUrl(null)}
            >
              <a 
                href={`https://${url.long}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <span className={`inline-block w-32 ${hoveredUrl === url.short ? 'opacity-50' : 'opacity-100'}`}>
                  {url.short}
                </span>
                <span className={`inline-block transition-all duration-300 ease-in-out ${
                  hoveredUrl === url.short ? 'opacity-100 translate-x-2' : 'opacity-0 -translate-x-2'
                }`}>
                  {url.long}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-gray-500 text-xs mt-8">
        If you want to park any URL, please get in touch at hi@manglekuo.com
      </div>
    </div>
  )
}