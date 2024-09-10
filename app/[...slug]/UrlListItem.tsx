'use client'

import React, { useState, useEffect } from 'react'

interface UrlListItemProps {
  shortDomain: string
  longDomain: string
  shortPath: string
  longPath: string
}

const getDomainSteps = (shortDomain: string, longDomain: string): string[] => {
  const steps = [shortDomain] // Start with the initial state
  const shortList = shortDomain.split('')
  const longList = longDomain.split('')

  let i = 0
  while (i < longList.length) {
    // Check if we need to insert or replace a character
    if (i >= shortList.length || shortList[i] !== longList[i]) {
      // If the shortDomain is shorter, insert the correct character
      if (i >= shortList.length) {
        shortList.push(longList[i])
      } else {
        // Replace the unmatched character with the correct one
        shortList[i] = longList[i]
      }
      // Save the current state after transformation
      steps.push(shortList.join(''))
    }
    i += 1
  }

  // If the shortDomain is longer than the longDomain, truncate it
  if (shortList.length > longList.length) {
    shortList.length = longList.length
    steps.push(shortList.join(''))
  }

  return steps
}

const getPathSteps = (shortPath: string, longPath: string): string[] => {
  const shortSections = shortPath.split('/')
  const longSections = longPath.split('/')

  const maxLength = Math.max(shortSections.length, longSections.length)
  const sectionStepsArray: string[][] = []

  for (let i = 0; i < maxLength; i++) {
    const shortSection = shortSections[i] || ''
    const longSection = longSections[i] || ''
    const sectionSteps = getSectionSteps(shortSection, longSection)
    sectionStepsArray.push(sectionSteps)
  }

  // Merge all section steps into the overall path steps
  const mergedSteps = mergeStepsArray(sectionStepsArray)
  return mergedSteps
}

const getSectionSteps = (shortSection: string, longSection: string): string[] => {
  const steps = [shortSection] // Start with the initial state
  const shortTokens = shortSection.split(/[-_ ]/)
  const longTokens = longSection.split(/[-_ ]/)

  let i = 0
  while (i < longTokens.length) {
    // Check if we need to insert or replace a token
    if (i >= shortTokens.length || shortTokens[i] !== longTokens[i]) {
      // If the shortSection is shorter, insert the correct token
      if (i >= shortTokens.length) {
        shortTokens.push(longTokens[i])
      } else {
        // Replace the unmatched token with the correct one
        shortTokens[i] = longTokens[i]
      }
      // Save the current state after transformation
      steps.push(shortTokens.join('-')) // Use hyphen as the default separator
    }
    i += 1
  }

  // If the shortSection is longer than the longSection, truncate it
  if (shortTokens.length > longTokens.length) {
    shortTokens.length = longTokens.length
    steps.push(shortTokens.join('-'))
  }

  return steps
}

const mergeStepsArray = (sectionStepsArray: string[][]): string[] => {
  const result: string[] = []
  const maxLength = Math.max(...sectionStepsArray.map(steps => steps.length))

  for (let i = 0; i < maxLength; i++) {
    const currentStep = sectionStepsArray.map(steps => steps[Math.min(i, steps.length - 1)]).join('/')
    result.push(currentStep)
  }

  return result
}

const mergeSteps = (domainSteps: string[], pathSteps: string[]): string[] => {
  const result: string[] = []
  const maxLength = Math.max(domainSteps.length, pathSteps.length)

  for (let i = 0; i < maxLength; i++) {
    const currentDomain = domainSteps[Math.min(i, domainSteps.length - 1)]
    const currentPath = pathSteps[Math.min(i, pathSteps.length - 1)]
    result.push(currentDomain + '/' + currentPath)
  }

  return result
}

export default function UrlListItem({ shortDomain, longDomain, shortPath, longPath }: UrlListItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<string[]>([])

  useEffect(() => {
    const domainSteps = getDomainSteps(shortDomain, longDomain)
    const pathSteps = getPathSteps(shortPath, longPath)
    setSteps(mergeSteps(domainSteps, pathSteps))
  }, [shortDomain, longDomain, shortPath, longPath])

  useEffect(() => {
    const totalSteps = steps.length - 1
    const intervalDuration = isHovered ? 160 / totalSteps : 240 / totalSteps

    let interval: NodeJS.Timeout
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : prev))
      }, intervalDuration)
    } else {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
      }, intervalDuration)
    }
    return () => clearInterval(interval)
  }, [isHovered, steps])

  const displayUrl = steps[currentStep] 

  return (
    <li 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a 
        href={`https://${shortDomain}${shortPath}`} // Updated to use shortDomain + shortPath
        className="block w-full py-2 px-4 transition-colors duration-300 ease-in-out"
      >
        <span className="inline-block transition-colors duration-300 text-gray-800">
          {displayUrl}
          {/* {shortDomain}|{shortPath}||{longDomain}|{longPath}
          <pre>{JSON.stringify(steps, null, 2)}</pre>
          <pre>{JSON.stringify(getDomainSteps(shortDomain, longDomain), null, 2)}</pre>
          <pre>{JSON.stringify(getPathSteps(shortPath, longPath), null, 2)}</pre> */}
        </span>
      </a>
    </li>
  )
}