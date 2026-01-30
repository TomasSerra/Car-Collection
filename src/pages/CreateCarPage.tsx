import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateCar } from '@/hooks/useCars'
import { useBrands } from '@/hooks/useBrands'
import { useOwners } from '@/hooks/useOwners'
import { Button } from '@/components/ui/button'
import { CarForm } from '@/components/cars/CarForm'
import type { CarFormData } from '@/types'

export function CreateCarPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: brands = [] } = useBrands(user?.uid)
  const { data: owners = [] } = useOwners(user?.uid)

  const createCar = useCreateCar()

  const handleSubmit = async (data: CarFormData, imageFile?: File) => {
    if (!user || !imageFile) return

    await createCar.mutateAsync({
      userId: user.uid,
      data,
      imageFile,
    })

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b border-border pt-safe">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Add New Car</h1>
        </div>
      </header>

      {/* Form */}
      <main className="p-4">
        <CarForm
          brands={brands}
          owners={owners}
          onSubmit={handleSubmit}
          isSubmitting={createCar.isPending}
        />
      </main>
    </div>
  )
}
