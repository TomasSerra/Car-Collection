import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Select, SelectItem } from '@/components/ui/select'
import type { CarFilters } from '@/types'

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: CarFilters
  onFiltersChange: (filters: CarFilters) => void
  brands: string[]
  owners: string[]
}

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  brands,
  owners,
}: FilterSheetProps) {
  const handleClear = () => {
    onFiltersChange({})
    onOpenChange(false)
  }

  const handleApply = () => {
    onOpenChange(false)
  }

  const hasFilters = filters.brand || filters.owner

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" onClose={() => onOpenChange(false)} className="max-h-[80vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Filter Cars</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Select
              value={filters.brand || ''}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, brand: value || undefined })
              }
              placeholder="All brands"
              direction="up"
            >
              <SelectItem value="">All brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Owner</label>
            <Select
              value={filters.owner || ''}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, owner: value || undefined })
              }
              placeholder="All owners"
              direction="up"
            >
              <SelectItem value="">All owners</SelectItem>
              {owners.map((owner) => (
                <SelectItem key={owner} value={owner}>
                  {owner}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClear}
            disabled={!hasFilters}
          >
            Clear
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
