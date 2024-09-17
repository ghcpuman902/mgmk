import React from 'react';

interface CircleProps {
    row: number;
    col: number;
    colorIndex: number;
    zIndex: number;
}

interface CircleArrayProps {
    isVertical: boolean;
}

export const CircleArray: React.FC<CircleArrayProps> = ({ isVertical }) => {
    const baseL = 0.95;
    const baseC = 0.15;
    const breatheDuration = 4;
    const pulseAmount = 0.14;

    const colors = [
        { h: 100, name: 'yellow' },
        { h: 20, name: 'red' },
        { h: 230, name: 'blue' },
    ];

    const circleSize = 32;
    const horizontalDistance = 26;
    const verticalDistance = 20;
    const growFactor = 1 + pulseAmount;

    const horizontalCircles: CircleProps[] = [
        { row: 1, col: 1, colorIndex: 0, zIndex: 1 },
        { row: 1, col: 2, colorIndex: 2, zIndex: 2 },
        { row: 1, col: 4, colorIndex: 2, zIndex: 3 },
        { row: 1, col: 3, colorIndex: 1, zIndex: 4 },
        { row: 1, col: 5, colorIndex: 0, zIndex: 5 },
        { row: 2, col: 1, colorIndex: 1, zIndex: 6 },
        { row: 2, col: 2, colorIndex: 0, zIndex: 7 },
        { row: 2, col: 4, colorIndex: 0, zIndex: 8 },
        { row: 2, col: 3, colorIndex: 2, zIndex: 9 },
        { row: 2, col: 5, colorIndex: 1, zIndex: 10 },
    ];

    const verticalCircles: CircleProps[] = [
        { row: 1, col: 1, colorIndex: 0, zIndex: 1 },
        { row: 1, col: 2, colorIndex: 2, zIndex: 10 },
        { row: 2, col: 1, colorIndex: 1, zIndex: 2 },
        { row: 2, col: 2, colorIndex: 0, zIndex: 9 },
        { row: 3, col: 1, colorIndex: 2, zIndex: 3 },
        { row: 3, col: 2, colorIndex: 1, zIndex: 8 },
        { row: 4, col: 1, colorIndex: 0, zIndex: 4 },
        { row: 4, col: 2, colorIndex: 2, zIndex: 7 },
        { row: 5, col: 1, colorIndex: 1, zIndex: 5 },
        { row: 5, col: 2, colorIndex: 0, zIndex: 6 },
    ];

    const circles = isVertical ? verticalCircles : horizontalCircles;

    const viewBoxSize = 300; // Adjust this value to change the overall size of the circle arrangement
    const horizontalLayoutWidth = (horizontalCircles[horizontalCircles.length - 1].col - 1) * horizontalDistance + circleSize;
    const horizontalLayoutHeight = (horizontalCircles[horizontalCircles.length - 1].row - 1) * verticalDistance + circleSize;
    const verticalLayoutWidth = (verticalCircles[verticalCircles.length - 1].col - 1) * horizontalDistance + circleSize;
    const verticalLayoutHeight = (verticalCircles[verticalCircles.length - 1].row - 1) * verticalDistance + circleSize;

    const getCirclePosition = (circle: CircleProps) => {
        const layout = isVertical ? { width: verticalLayoutWidth, height: verticalLayoutHeight } : { width: horizontalLayoutWidth, height: horizontalLayoutHeight };
        const offsetX = (viewBoxSize - layout.width) / 2;
        const offsetY = (viewBoxSize - layout.height) / 2;

        const x = offsetX + (circle.col - 1) * horizontalDistance + circleSize / 2;
        const y = offsetY + (circle.row - 1) * verticalDistance + circleSize / 2;
        return { cx: x, cy: y };
    };

    return (
        <div className={`relative ${isVertical ? 'h-full aspect-square' : 'w-full aspect-square'}`}>
            <div className="absolute inset-0 blur-lg transition-all duration-500 ease-in-out">
                <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
                    {circles
                        .sort((a, b) => a.zIndex - b.zIndex)
                        .map((circle, index) => {
                            const { cx, cy } = getCirclePosition(circle);
                            return (
                                <circle
                                    key={`base-${index}`}
                                    cx={cx}
                                    cy={cy}
                                    r={circleSize / 2}
                                    fill={`oklch(${baseL} ${baseC} ${colors[circle.colorIndex].h})`}
                                    className="circle-animation transition-all duration-10 ease-in-out"
                                />
                            );
                        })}
                </svg>
            </div>
            <style jsx>{`
                @keyframes breathe {
                    0%, 100% { 
                        transform: scale(1); 
                        filter: brightness(1);
                    }
                    50% { 
                        transform: scale(${growFactor}); 
                        filter: brightness(${growFactor});
                    }
                }
                .circle-animation {
                    animation: breathe ${breatheDuration}s ease-in-out infinite;
                    transform-origin: center;
                }
            `}</style>
        </div>
    );
};