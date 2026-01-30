import { useState, useEffect } from 'react'
import { Camera, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { WheelLoader } from '@/components/shared/WheelLoader'
import { useImageUpload } from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'
import type { Car, CarFormData } from '@/types'

interface CarFormProps {
  initialData?: Car
  brands: string[]
  owners: string[]
  onSubmit: (data: CarFormData, imageFile?: File) => Promise<void>
  isSubmitting: boolean
}

export function CarForm({ initialData, brands, owners, onSubmit, isSubmitting }: CarFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [brand, setBrand] = useState(initialData?.brand || '')
  const [collection, setCollection] = useState(initialData?.collection || '')
  const [collectionColor, setCollectionColor] = useState(initialData?.collectionColor || '#3b82f6')
  const [collectionNumber, setCollectionNumber] = useState(initialData?.collectionNumber || '')
  const [seriesNumber, setSeriesNumber] = useState(initialData?.seriesNumber || '')
  const [year, setYear] = useState(initialData?.year || '')
  const [date, setDate] = useState(initialData?.date || '')
  const [owner, setOwner] = useState(initialData?.owner || '')

  const [newBrandDialogOpen, setNewBrandDialogOpen] = useState(false)
  const [newBrand, setNewBrand] = useState('')
  const [newOwnerDialogOpen, setNewOwnerDialogOpen] = useState(false)
  const [newOwner, setNewOwner] = useState('')

  const [allBrands, setAllBrands] = useState(brands)
  const [allOwners, setAllOwners] = useState(owners)

  const { file, preview, error: imageError, isCompressing, handleFileSelect, clearFile } = useImageUpload()

  useEffect(() => {
    setAllBrands(brands)
  }, [brands])

  useEffect(() => {
    setAllOwners(owners)
  }, [owners])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleAddBrand = () => {
    if (newBrand.trim() && !allBrands.includes(newBrand.trim())) {
      const trimmed = newBrand.trim()
      setAllBrands((prev) => [...prev, trimmed].sort())
      setBrand(trimmed)
    }
    setNewBrand('')
    setNewBrandDialogOpen(false)
  }

  const handleAddOwner = () => {
    if (newOwner.trim() && !allOwners.includes(newOwner.trim())) {
      const trimmed = newOwner.trim()
      setAllOwners((prev) => [...prev, trimmed].sort())
      setOwner(trimmed)
    }
    setNewOwner('')
    setNewOwnerDialogOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data: CarFormData = {
      title,
      brand,
      collection,
      collectionColor: collectionColor || undefined,
      collectionNumber: collectionNumber || undefined,
      seriesNumber: seriesNumber || undefined,
      year: year || undefined,
      date: date || undefined,
      owner: owner || undefined,
    }

    await onSubmit(data, file || undefined)
  }

  const isValid = title && brand && collection && (initialData || file)
  const imagePreview = preview || initialData?.imageUrl

  // Helper to get contrast color for text
  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload - Card Preview Style */}
      <div className="space-y-2">
        <Label>Image {!initialData && '*'}</Label>
        <div className="flex gap-4 items-start">
          {/* Card-like preview */}
          <div className="w-28 flex-shrink-0">
            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <div className="aspect-car-card relative overflow-hidden bg-muted">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                    {isCompressing ? (
                      <WheelLoader size={24} />
                    ) : (
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="p-1.5">
                <p className="text-xs font-medium truncate">{title || 'Car name'}</p>
                <p
                  className="text-[10px] truncate px-1 py-0.5 rounded mt-0.5 inline-block"
                  style={{
                    backgroundColor: collectionColor || 'transparent',
                    color: collectionColor ? getContrastColor(collectionColor) : 'var(--color-muted-foreground)',
                  }}
                >
                  {collection || 'Collection'}
                </p>
              </div>
            </div>
          </div>

          {/* Upload button if no image */}
          {!imagePreview && (
            <div className="flex-1">
              <label className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border cursor-pointer",
                "hover:border-hw-blue transition-colors"
              )}>
                {isCompressing ? (
                  <WheelLoader size={20} />
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Select photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
        {imageError && (
          <p className="text-sm text-destructive">{imageError}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Name *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Car name"
          required
        />
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label>Brand *</Label>
        <div className="flex gap-2">
          <Select
            value={brand}
            onValueChange={setBrand}
            placeholder="Select brand"
            className="flex-1"
          >
            {allBrands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setNewBrandDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collection with Color */}
      <div className="space-y-2">
        <Label htmlFor="collection">Collection *</Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="collectionColor"
            value={collectionColor}
            onChange={(e) => setCollectionColor(e.target.value)}
            className="w-12 h-10 rounded-full border border-border cursor-pointer bg-transparent flex-shrink-0"
          />
          <Input
            id="collection"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            placeholder="e.g., Mainline, Premium"
            required
            className="flex-1"
          />
        </div>
      </div>

      {/* Collection Number */}
      <div className="space-y-2">
        <Label htmlFor="collectionNumber">Collection Number</Label>
        <Input
          id="collectionNumber"
          value={collectionNumber}
          onChange={(e) => setCollectionNumber(e.target.value)}
          placeholder="e.g., 123/250"
        />
      </div>

      {/* Series Number */}
      <div className="space-y-2">
        <Label htmlFor="seriesNumber">Series Number</Label>
        <Input
          id="seriesNumber"
          value={seriesNumber}
          onChange={(e) => setSeriesNumber(e.target.value)}
          placeholder="e.g., 5/10"
        />
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g., 2024"
        />
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date Acquired</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Owner */}
      <div className="space-y-2">
        <Label>Owner</Label>
        <div className="flex gap-2">
          <Select
            value={owner}
            onValueChange={setOwner}
            placeholder="Select owner"
            className="flex-1"
          >
            <SelectItem value="">No owner</SelectItem>
            {allOwners.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setNewOwnerDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!isValid || isSubmitting || isCompressing}
      >
        {isSubmitting ? <WheelLoader size={20} /> : initialData ? 'Update Car' : 'Add Car'}
      </Button>

      {/* New Brand Dialog */}
      <Dialog open={newBrandDialogOpen} onOpenChange={setNewBrandDialogOpen}>
        <DialogContent onClose={() => setNewBrandDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <Input
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Brand name"
            onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewBrandDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand} disabled={!newBrand.trim()}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Owner Dialog */}
      <Dialog open={newOwnerDialogOpen} onOpenChange={setNewOwnerDialogOpen}>
        <DialogContent onClose={() => setNewOwnerDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Owner</DialogTitle>
          </DialogHeader>
          <Input
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="Owner name"
            onKeyDown={(e) => e.key === 'Enter' && handleAddOwner()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOwnerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOwner} disabled={!newOwner.trim()}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
