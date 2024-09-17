'use client'

import React, { useState, ReactNode } from 'react';

interface LightCatcherLogoProps {
    className?: string;
    children: ReactNode;
}

export const LightCatcherLogo: React.FC<LightCatcherLogoProps> = ({ className, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg width="0" height="0">
                <defs>
                    <filter id="blur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
                    </filter>
                </defs>
            </svg>
            <div className="absolute inset-[-20%] light-catcher" />
            <div className="relative z-10">{children}</div>
            {isHovered && (
                <div className="absolute inset-[-20%] hover-effect" />
            )}
            <style jsx>{`
                .light-catcher {
                    filter: url(#blur);
                    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
                    transition: all 0.3s ease;
                }
                .hover-effect {
                    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
                    mix-blend-mode: soft-light;
                    filter: saturate(150%);
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};