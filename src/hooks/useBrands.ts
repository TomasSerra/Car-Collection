import { useQuery } from '@tanstack/react-query'
import { getBrands } from '@/lib/firebase/cars'

export function useBrands(userId: string | undefined) {
  return useQuery({
    queryKey: ['brands', userId],
    queryFn: () => {
      if (!userId) return []
      return getBrands(userId)
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
