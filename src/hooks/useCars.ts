import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { DocumentSnapshot } from 'firebase/firestore'
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarCount,
} from '@/lib/firebase/cars'
import { compressImage } from '@/lib/compression'
import type { Car, CarFormData, CarFilters } from '@/types'

interface CarsPage {
  cars: Car[]
  lastDoc: DocumentSnapshot | null
}

export function useCarsInfinite(userId: string | undefined, filters: CarFilters = {}) {
  return useInfiniteQuery<CarsPage>({
    queryKey: ['cars', userId, filters],
    queryFn: async ({ pageParam }) => {
      if (!userId) return { cars: [], lastDoc: null }
      return getCars(userId, filters, pageParam as DocumentSnapshot | undefined)
    },
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    initialPageParam: undefined as DocumentSnapshot | undefined,
    enabled: !!userId,
  })
}

export function useCar(userId: string | undefined, carId: string | undefined) {
  return useQuery({
    queryKey: ['car', userId, carId],
    queryFn: () => {
      if (!userId || !carId) return null
      return getCarById(userId, carId)
    },
    enabled: !!userId && !!carId,
  })
}

export function useCarCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['carCount', userId],
    queryFn: () => {
      if (!userId) return 0
      return getCarCount(userId)
    },
    enabled: !!userId,
  })
}

export function useCreateCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      data,
      imageFile,
    }: {
      userId: string
      data: CarFormData
      imageFile: File
    }) => {
      const compressedImage = await compressImage(imageFile)
      return createCar(userId, data, compressedImage)
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['cars', userId] })
      queryClient.invalidateQueries({ queryKey: ['carCount', userId] })
      queryClient.invalidateQueries({ queryKey: ['brands', userId] })
      queryClient.invalidateQueries({ queryKey: ['owners', userId] })
    },
  })
}

export function useUpdateCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      carId,
      data,
      imageFile,
    }: {
      userId: string
      carId: string
      data: Partial<CarFormData>
      imageFile?: File
    }) => {
      let compressedImage: File | undefined
      if (imageFile) {
        compressedImage = await compressImage(imageFile)
      }
      return updateCar(userId, carId, data, compressedImage)
    },
    onSuccess: (_, { userId, carId }) => {
      queryClient.invalidateQueries({ queryKey: ['cars', userId] })
      queryClient.invalidateQueries({ queryKey: ['car', userId, carId] })
      queryClient.invalidateQueries({ queryKey: ['brands', userId] })
      queryClient.invalidateQueries({ queryKey: ['owners', userId] })
    },
  })
}

export function useDeleteCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, carId }: { userId: string; carId: string }) => {
      return deleteCar(userId, carId)
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['cars', userId] })
      queryClient.invalidateQueries({ queryKey: ['carCount', userId] })
    },
  })
}
