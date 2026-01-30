import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import type { Car } from '@/types'

interface CarCardProps {
  car: Car
  basePath?: string
}

export function CarCard({ car, basePath = '' }: CarCardProps) {
  const linkPath = basePath ? `${basePath}/car/${car.id}` : `/car/${car.id}`

  return (
    <Link
      to={linkPath}
      className="block group focus:outline-none focus:ring-2 focus:ring-hw-blue focus:ring-offset-2 focus:ring-offset-background rounded-lg h-full"
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border h-full flex flex-col">
        <div className="aspect-car-card relative overflow-hidden">
          <img
            src={car.imageUrl}
            alt={car.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-2 flex flex-col flex-1">
          <h3 className="text-sm font-medium truncate">{car.title}</h3>
          <p
            className="text-xs px-1.5 py-0.5 rounded mt-1 text-center line-clamp-2 flex-1 flex items-center justify-center"
            style={{
              backgroundColor: car.collectionColor || 'transparent',
              color: car.collectionColor ? getContrastColor(car.collectionColor) : 'var(--color-muted-foreground)',
            }}
          >
            {car.collection}
          </p>
        </div>
      </div>
    </Link>
  )
}

// Helper to determine if text should be white or black based on background color
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')

  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function CarCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <Skeleton className="aspect-car-card" />
      <div className="p-2 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
