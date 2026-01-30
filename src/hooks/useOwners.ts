import { useQuery } from '@tanstack/react-query'
import { getOwners } from '@/lib/firebase/cars'

export function useOwners(userId: string | undefined) {
  return useQuery({
    queryKey: ['owners', userId],
    queryFn: () => {
      if (!userId) return []
      return getOwners(userId)
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
