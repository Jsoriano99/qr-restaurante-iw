'use client';

import { useState, useCallback, KeyboardEvent } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  max?: number;
}

const SIZE_MAP: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
} as const;

// Heroicons star path
const STAR_PATH =
  'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z';

export default function StarRating({
  value,
  onChange,
  size = 'md',
  max = 5,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = onChange !== undefined;
  const displayValue = hoverValue ?? value;
  const sizeClass = SIZE_MAP[size];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isInteractive) return;

      let newValue = value;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          newValue = Math.min(value + 1, max);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          newValue = Math.max(value - 1, 1);
          break;
        case 'Home':
          e.preventDefault();
          newValue = 1;
          break;
        case 'End':
          e.preventDefault();
          newValue = max;
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (hoverValue !== null && hoverValue !== value) {
            onChange(hoverValue);
          }
          return;
        default:
          return;
      }

      onChange(newValue);
    },
    [isInteractive, value, max, onChange, hoverValue],
  );

  // --- READ-ONLY MODE ---
  if (!isInteractive) {
    return (
      <div
        className="flex gap-1"
        role="img"
        aria-label={`${value} de ${max} estrellas`}
      >
        {Array.from({ length: max }, (_, i) => {
          const starNumber = i + 1;
          const isFilled = starNumber <= value;

          return (
            <svg
              key={starNumber}
              className={`${sizeClass} ${
                isFilled ? 'text-orange-500' : 'text-gray-300'
              }`}
              viewBox="0 0 24 24"
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path d={STAR_PATH} />
            </svg>
          );
        })}
      </div>
    );
  }

  // --- INTERACTIVE MODE ---
  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Puntuación"
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starNumber = i + 1;
        const isFilled = starNumber <= displayValue;
        const isSelected = starNumber === displayValue;

        return (
          <svg
            key={starNumber}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${starNumber} estrellas`}
            tabIndex={isSelected ? 0 : -1}
            className={`${sizeClass} ${
              isFilled ? 'text-orange-500' : 'text-gray-300'
            } cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm`}
            viewBox="0 0 24 24"
            fill={isFilled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
            onMouseEnter={() => setHoverValue(starNumber)}
            onClick={() => onChange(starNumber)}
          >
            <path d={STAR_PATH} />
          </svg>
        );
      })}
    </div>
  );
}
