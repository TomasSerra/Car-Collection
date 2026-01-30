import { CarCard, CarCardSkeleton } from './CarCard'
import type { Car } from '@/types'

interface CarGridProps {
  cars: Car[]
  basePath?: string
}

export function CarGrid({ cars, basePath }: CarGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} basePath={basePath} />
      ))}
    </div>
  )
}

export function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  )
}
