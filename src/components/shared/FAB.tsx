import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABProps {
  onClick: () => void
  className?: string
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-16 h-16 rounded-full',
        'bg-hw-orange shadow-lg',
        'flex items-center justify-center',
        'transition-transform hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-hw-orange focus:ring-offset-2 focus:ring-offset-background',
        className
      )}
      aria-label="Add new car"
    >
      <Plus className="w-7 h-7 text-white" />
    </button>
  )
}
