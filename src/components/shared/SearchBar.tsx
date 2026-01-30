import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  variant?: 'default' | 'header'
}

export function SearchBar({ value, onChange, placeholder = 'Search cars...', className, variant = 'default' }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Debounce: update parent after 300ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  const isHeader = variant === 'header'

  return (
    <div className={cn('relative', className)}>
      <Search className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4",
        isHeader ? "text-white/70" : "text-muted-foreground"
      )} />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "pl-11 pr-10 border-0",
          isHeader && "bg-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/50"
        )}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2",
            isHeader ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
