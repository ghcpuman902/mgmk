'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CircleArray } from './circle-array';
import { MGMKLogo } from '../mgmkLogo';

interface BackgroundProps { }

export const Background: React.FC<BackgroundProps> = () => {
    const pathname = usePathname();
    const isNavBar = pathname !== '/';
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVertical, setIsVertical] = useState(false);

    useEffect(() => {
        const syncPointer = ({ clientX, clientY }: MouseEvent) => {
            setMousePosition({ x: clientX, y: clientY });
        };

        const handleTouchMove = (e: TouchEvent) => {
            // Remove this line to allow default touch behavior
            // e.preventDefault();
            const touch = e.touches[0];
            setMousePosition({ x: touch.clientX, y: touch.clientY });
        };

        const handleResize = () => {
            setIsVertical(!isNavBar && window.innerHeight > window.innerWidth);
        };


        document.addEventListener('mousemove', syncPointer);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        if (isNavBar === false) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        }
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check


        return () => {
            document.removeEventListener('mousemove', syncPointer);
            document.removeEventListener('touchmove', handleTouchMove);
            if (isNavBar === false) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.height = '';
            }

            window.removeEventListener('resize', handleResize);

        };
    }, [isNavBar]); // Add isNavBar to the dependency array

    return (
        <div className={`fixed inset-0 ${isNavBar ? 'h-44 bg-blend-lighten' : 'h-full'} bg-black overflow-hidden transition-all duration-300 pointer-events-none`}>
            <div className={`${isNavBar ? 'scale-80 md:scale-50' : (isVertical ? 'scale-150' : 'scale-100')} absolute inset-0 flex items-center justify-center transition-transform duration-300`}>

                <CircleArray isVertical={isVertical} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <MGMKLogo className="w-1/3 h-auto fill-neutral-100" />
                </div>
            </div>
            <div
                className="absolute inset-0 bg-black mix-blend-overlay transition-all duration-300"
                style={{
                    maskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent, black)`,
                    WebkitMaskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent, black)`
                }}
            />
        </div>
    );
};