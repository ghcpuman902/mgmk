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
    // Normalize paths by removing leading and trailing slashes
    shortPath = shortPath.replace(/^\/|\/$/g, '');
    longPath = longPath.replace(/^\/|\/$/g, '');

    const worksPrefix = "works/";
    let hasWorksPrefix = false;

    // Check and handle "works/" prefix
    if (longPath.startsWith(worksPrefix)) {
        hasWorksPrefix = true;
        longPath = longPath.substring(worksPrefix.length);
    }

    // Split paths into sections for processing
    const shortSections = shortPath.split('/');
    const longSections = longPath.split('/');

    const maxLength = Math.max(shortSections.length, longSections.length);
    const sectionStepsArray: string[][] = [];

    for (let i = 0; i < maxLength; i++) {
        const shortSection = shortSections[i] || '';
        const longSection = longSections[i] || '';
        const sectionSteps = getSectionSteps(shortSection, longSection);
        sectionStepsArray.push(sectionSteps);
    }

    // Prepare the input for mergeSteps with joining character
    const mergeInput = sectionStepsArray.reduce((acc, steps, index) => {
        if (index > 0) acc.push('/');
        acc.push(steps);
        return acc;
    }, [] as (string[] | string)[]);

    // Merge all section steps into the overall path steps
    const mergedSteps = mergeSteps(mergeInput);

    // Reassemble the path with the "works/" prefix if it was present
    if (hasWorksPrefix) {
        // Add the "works/" prefix back to the last step
        const lastStepIndex = mergedSteps.length - 1;
        mergedSteps[lastStepIndex] = worksPrefix + mergedSteps[lastStepIndex];
    }

    // Ensure the final path does not start or end with a slash
    return mergedSteps.map(step => step.replace(/^\/|\/$/g, ''));
}

function splitAndMatchInitials(shortSec: string, longSec: string): [string, string][] {
    const delimitersPattern = /[-_\s%20]+/g;
    const longTokens = longSec.split(delimitersPattern);

    const matchedSegments: [string, string][] = [];
    let currentIndex = 0;
    let remainingLongSec = longSec;

    for (const token of longTokens) {
        if (currentIndex < shortSec.length && shortSec[currentIndex] === token[0]) {
            // Find the start of the token in the remaining string
            const start = remainingLongSec.indexOf(token);

            let nextDelimiterIndex: number;
            if (currentIndex === shortSec.length - 1) {
                nextDelimiterIndex = remainingLongSec.length;
            } else {
                nextDelimiterIndex = remainingLongSec.indexOf('-', start + token.length);
                if (nextDelimiterIndex === -1) {
                    nextDelimiterIndex = remainingLongSec.length;
                }
            }

            const matchedSegment = remainingLongSec.substring(0, nextDelimiterIndex).replace(/^[-_\s]+|[-_\s]+$/g, '');
            matchedSegments.push([shortSec[currentIndex], matchedSegment]);
            remainingLongSec = remainingLongSec.substring(nextDelimiterIndex).replace(/^[-_\s]+/, '');
            currentIndex += 1;
        }
    }

    if (currentIndex < shortSec.length) {
        if (currentIndex === 0) {
            // No matches were found initially, treat the entire shortSec as one token
            matchedSegments.push([shortSec, longSec]);
        } else {
            // Catch-all for remaining part of shortSec
            matchedSegments.push([shortSec.substring(currentIndex), remainingLongSec.replace(/^[-_\s]+|[-_\s]+$/g, '')]);
        }
    }

    // Handle cases similar to 'lu' -> 'luton'
    if (matchedSegments.length > 1 && matchedSegments[matchedSegments.length - 1][1] === '') {
        matchedSegments[matchedSegments.length - 2] = [
            matchedSegments[matchedSegments.length - 2][0] + matchedSegments[matchedSegments.length - 1][0],
            matchedSegments[matchedSegments.length - 2][1]
        ];
        matchedSegments.pop();
    }

    // Handle last segment for cases like 'lkx' -> 'kings-cross'
    if (matchedSegments.length > 1 && shortSec.length > currentIndex) {
        const lastInitials = shortSec.substring(currentIndex - 1);
        const remainingCombined = matchedSegments.slice(currentIndex - 1).map(seg => seg[1]).join('-');
        matchedSegments.splice(currentIndex - 1, matchedSegments.length - (currentIndex - 1), [lastInitials, remainingCombined]);
    }

    return matchedSegments;
}

const getSectionSteps = (shortSection: string, longSection: string): string[] => {
    const steps = [shortSection]; // Start with the initial state

    const matchedSegments = splitAndMatchInitials(shortSection, longSection);

    // Initialize progress for each segment
    interface SegmentProgress {
        current: string;
        target: string;
    }

    const segmentProgress: SegmentProgress[] = matchedSegments.map(([initial, segment]) => {
        if (segment.length > 0) {
            return { current: initial, target: segment };
        } else {
            return { current: initial, target: initial };
        }
    });

    let currentState = shortSection;
    const target = longSection;

    while (currentState !== target) {
        let updated = false;
        for (const seg of segmentProgress) {
            if (seg.current !== seg.target) {
                const nextIndex = seg.current.length;
                if (nextIndex < seg.target.length) {
                    // Add the next character from the target segment
                    const nextChar = seg.target[nextIndex];
                    seg.current += nextChar;
                    updated = true;
                } else {
                    // Fix mismatched characters when lengths are equal
                    for (let i = 0; i < seg.current.length; i++) {
                        if (seg.current[i] !== seg.target[i]) {
                            seg.current = seg.current.substring(0, i) + seg.target[i] + seg.current.substring(i + 1);
                            updated = true;
                            break;
                        }
                    }
                }
                if (updated) {
                    break; // Only update one segment per iteration
                }
            }
        }
        if (!updated) {
            // No updates were made; force the current state to the target to prevent infinite loop
            currentState = target;
            steps.push(currentState);
            break;
        } else {
            // Reconstruct the current state
            currentState = segmentProgress.map(seg => seg.current).join('-');
            steps.push(currentState);
        }
    }

    return steps;
}

function mergeSteps(steps_arrays: (string[] | string)[]): string[] {
    // Initialize variables
    const elements = steps_arrays;
    let maxLength = 0;
    const arrays: { index: number, array: string[] }[] = [];

    // Collect arrays and determine the maximum length
    for (let i = 0; i < elements.length; i++) {
        if (Array.isArray(elements[i])) {
            const arr = elements[i] as string[];
            arrays.push({ index: i, array: arr });
            if (arr.length > maxLength) {
                maxLength = arr.length;
            }
        }
    }

    // Stretch each array to match the maximum length
    const stretchedArrays: { [key: number]: string[] } = {};
    for (const item of arrays) {
        const origArray = item.array;
        const origLength = origArray.length;
        let stretchedArray: string[] = [];
        if (origLength === maxLength) {
            stretchedArray = origArray.slice();
        } else {
            for (let i = 0; i < maxLength; i++) {
                let orig_i = i * (origLength - 1) / (maxLength - 1);
                orig_i = Math.round(orig_i);
                if (orig_i >= origLength) {
                    orig_i = origLength - 1;
                }
                stretchedArray.push(origArray[orig_i]);
            }
        }
        stretchedArrays[item.index] = stretchedArray;
    }

    // Build the merged steps
    const merged_steps: string[] = [];
    for (let i = 0; i < maxLength; i++) {
        const step_components: string[] = [];
        for (let j = 0; j < elements.length; j++) {
            const element = elements[j];
            if (Array.isArray(element)) {
                // Use stretched array
                step_components.push(stretchedArrays[j][i]);
            } else {
                // It's a joining string
                step_components.push(element);
            }
        }
        merged_steps.push(step_components.join(''));
    }

    return merged_steps;
}


export default function UrlListItem({ shortDomain, longDomain, shortPath, longPath }: UrlListItemProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [steps, setSteps] = useState<string[]>([])

    useEffect(() => {
        const domainSteps = getDomainSteps(shortDomain, longDomain);
        const pathSteps = getPathSteps(shortPath, longPath);
        // Adjust to use mergeSteps with joining character
        const mergedSteps = mergeSteps([domainSteps, '/', pathSteps]);
        setSteps(mergedSteps);
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

    const displayUrl = steps[currentStep] || steps[0]

    return (
        <li
            className="group relative min-w-[300px] max-w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <a
                href={`https://${shortDomain}${shortPath}`}
                className="block w-full transition-colors duration-300 ease-in-out"
            >
                <span className="inline-block transition-colors duration-300 break-words whitespace-pre-wrap leading-normal max-h-24 overflow-hidden">
                    {displayUrl}
                </span>
            </a>
        </li>
    )
}