import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Hash,
  Layers,
  Calendar,
  CalendarDays,
  User,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCar, useUpdateCar, useDeleteCar } from '@/hooks/useCars'
import { useBrands } from '@/hooks/useBrands'
import { useOwners } from '@/hooks/useOwners'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { CarForm } from '@/components/cars/CarForm'
import { FullPageLoader } from '@/components/shared/WheelLoader'
import type { CarFormData } from '@/types'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

interface CarDetailPageProps {
  publicMode?: boolean
}

export function CarDetailPage({ publicMode = false }: CarDetailPageProps) {
  const { id, userId: publicUserId } = useParams<{ id: string; userId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Use public userId if in public mode, otherwise use logged in user
  const targetUserId = publicMode ? publicUserId : user?.uid

  const { data: car, isLoading } = useCar(targetUserId, id)
  const { data: brands = [] } = useBrands(targetUserId)
  const { data: owners = [] } = useOwners(targetUserId)

  const updateCar = useUpdateCar()
  const deleteCar = useDeleteCar()

  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return <FullPageLoader />
  }

  const goBack = () => {
    if (publicMode && publicUserId) {
      navigate(`/shared/${publicUserId}`)
    } else {
      navigate('/')
    }
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-2">Car not found</h1>
        <p className="text-muted-foreground mb-4">This car doesn't exist or was deleted.</p>
        <Button onClick={goBack}>Go Back</Button>
      </div>
    )
  }

  const handleUpdate = async (data: CarFormData, imageFile?: File) => {
    if (!user) return

    await updateCar.mutateAsync({
      userId: user.uid,
      carId: car.id,
      data,
      imageFile,
    })

    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!user) return
    await deleteCar.mutateAsync({ userId: user.uid, carId: car.id })
    goBack()
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 bg-background border-b border-border pt-safe">
          <div className="flex items-center gap-3 p-4">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Edit Car</h1>
          </div>
        </header>

        <main className="p-4">
          <CarForm
            initialData={car}
            brands={brands}
            owners={owners}
            onSubmit={handleUpdate}
            isSubmitting={updateCar.isPending}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm pt-safe">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {!publicMode && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Image */}
      <div className="w-full">
        <img
          src={car.imageUrl}
          alt={car.title}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Details */}
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{car.title}</h1>
          <p className="text-lg text-hw-orange font-medium">{car.brand}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailItem
            icon={<Layers className="w-5 h-5" />}
            label="Collection"
            value={car.collection}
            color={car.collectionColor}
          />
          {car.collectionNumber && (
            <DetailItem
              icon={<Hash className="w-5 h-5" />}
              label="Collection #"
              value={car.collectionNumber}
            />
          )}
          {car.seriesNumber && (
            <DetailItem
              icon={<Layers className="w-5 h-5" />}
              label="Series #"
              value={car.seriesNumber}
            />
          )}
          {car.year && (
            <DetailItem
              icon={<Calendar className="w-5 h-5" />}
              label="Year"
              value={car.year}
            />
          )}
          {car.date && (
            <DetailItem
              icon={<CalendarDays className="w-5 h-5" />}
              label="Date Acquired"
              value={formatDate(car.date)}
            />
          )}
          {car.owner && (
            <DetailItem
              icon={<User className="w-5 h-5" />}
              label="Owner"
              value={car.owner}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent onClose={() => setDeleteDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{car.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCar.isPending}
            >
              {deleteCar.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface DetailItemProps {
  icon: React.ReactNode
  label: string
  value: string
  color?: string
}

function DetailItem({ icon, label, value, color }: DetailItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {color ? (
          <span
            className="text-sm font-medium px-2 py-0.5 rounded inline-block mt-0.5"
            style={{
              backgroundColor: color,
              color: getContrastColor(color),
            }}
          >
            {value}
          </span>
        ) : (
          <p className="font-medium truncate">{value}</p>
        )}
      </div>
    </div>
  )
}
