import { cn } from "@/lib/utils"

const createStripePattern = () => {
  const lineThickness = 23;
  const horizontalDistanceOffset = 74;
  const angle = 38.7;
  const cssAngle = 90 + angle; 
  const radians = (angle * Math.PI) / 180;
  const gapAlongNormal = Math.abs(Math.cos(radians) * horizontalDistanceOffset - lineThickness);
  const colors = ['var(--stripe-color-1)', 'var(--stripe-color-2)'];
  const offset = `calc(-1 * ${lineThickness}px / 2)`;
  const stripeCount = 15;

  return `repeating-linear-gradient(${cssAngle}deg, ${Array.from({ length: stripeCount }, (_, i) => {
    const color = colors[i % 2];
    return `${color}${i === 0 ? '' : ` calc(${i} * ${lineThickness}px + ${i} * ${gapAlongNormal}px + ${offset})`}, ` +
           `${color} calc(${i + 1} * ${lineThickness}px + ${i} * ${gapAlongNormal}px + ${offset}), ` +
           `white calc(${i + 1} * ${lineThickness}px + ${i} * ${gapAlongNormal}px + ${offset}), ` +
           `white calc(${i + 1} * ${lineThickness}px + ${i + 1} * ${gapAlongNormal}px + ${offset})`;
  }).join(', ')}, ${colors[stripeCount % 2]} calc(${stripeCount} * ${lineThickness}px + ${stripeCount} * ${gapAlongNormal}px + ${offset}), ${colors[stripeCount % 2]})`;
};

const stripePattern = createStripePattern();

const Letter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn("w-[626px] h-[417px] bg-white shadow-lg relative overflow-hidden", className)}
    style={{ '--stripe-color-1': '#0a3778', '--stripe-color-2': '#f04730' } as React.CSSProperties}
    {...props}
  >
    <div 
      className="w-full h-full bg-no-repeat"
      style={{ backgroundImage: stripePattern, backgroundSize: `626px 417px` }}
    ></div>
  </div>
);

export default async function LetterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-800">
      <Letter />
    </div>
  )
}
