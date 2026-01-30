import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

interface UserProfile {
  name: string
  email: string
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return null
}

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => {
      if (!userId) return null
      return getUserProfile(userId)
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
