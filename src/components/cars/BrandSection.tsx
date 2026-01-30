import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CarGrid } from './CarGrid'
import { cn } from '@/lib/utils'
import type { Car } from '@/types'

interface BrandSectionProps {
  brand: string
  cars: Car[]
  defaultExpanded?: boolean
  basePath?: string
}

export function BrandSection({ brand, cars, defaultExpanded = true, basePath }: BrandSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sticky top-0 z-10 w-full flex items-center justify-between py-2 px-3 bg-muted rounded-lg mb-2"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{brand}</span>
          <span className="text-sm text-muted-foreground">({cars.length})</span>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {isExpanded && <CarGrid cars={cars} basePath={basePath} />}
    </div>
  )
}
