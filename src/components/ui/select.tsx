import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down'
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  setOpen: (open: boolean) => void
} | null>(null)

const Select = ({ value, onValueChange, placeholder, children, className, direction = 'down' }: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedLabel = React.useMemo(() => {
    const items = React.Children.toArray(children)
    for (const child of items) {
      if (React.isValidElement<SelectItemProps>(child) && child.props.value === value) {
        return child.props.children
      }
    }
    return null
  }, [children, value])

  return (
    <SelectContext.Provider value={{ value, onValueChange, setOpen }}>
      <div ref={ref} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-full border border-border bg-input px-4 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            !selectedLabel && "text-muted-foreground"
          )}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className={cn(
            "absolute z-50 max-h-60 w-full overflow-auto rounded-2xl border border-border bg-card shadow-lg",
            direction === 'up' ? "bottom-full mb-1" : "top-full mt-1"
          )}>
            {children}
          </div>
        )}
      </div>
    </SelectContext.Provider>
  )
}

const SelectItem = ({ value, children }: SelectItemProps) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within Select')

  const isSelected = context.value === value

  return (
    <button
      type="button"
      onClick={() => {
        context.onValueChange(value)
        context.setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm outline-none",
        "hover:bg-muted",
        isSelected && "bg-muted/50 text-hw-blue"
      )}
    >
      {children}
    </button>
  )
}

export { Select, SelectItem }
