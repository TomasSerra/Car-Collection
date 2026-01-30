import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from './config'
import type { Car, CarFormData, CarFilters } from '@/types'

const PAGE_SIZE = 20

function getCarsCollection(userId: string) {
  return collection(db, 'users', userId, 'cars')
}

function getCarDoc(userId: string, carId: string) {
  return doc(db, 'users', userId, 'cars', carId)
}

export async function getCars(
  userId: string,
  filters: CarFilters = {},
  lastDoc?: DocumentSnapshot
): Promise<{ cars: Car[]; lastDoc: DocumentSnapshot | null }> {
  const carsRef = getCarsCollection(userId)
  const hasFilters = filters.search || filters.brand || filters.owner

  // When filters are active, fetch all cars (no pagination)
  // When no filters, use pagination
  let q = hasFilters
    ? query(carsRef, orderBy('brandLower'))
    : query(carsRef, orderBy('brandLower'), limit(PAGE_SIZE))

  if (filters.brand) {
    q = query(
      carsRef,
      where('brandLower', '==', filters.brand.toLowerCase())
    )
  }

  if (filters.owner) {
    q = query(
      carsRef,
      where('owner', '==', filters.owner)
    )
  }

  // Only use pagination when no filters
  if (lastDoc && !hasFilters) {
    q = query(q, startAfter(lastDoc))
  }

  const snapshot = await getDocs(q)
  const cars: Car[] = []

  snapshot.forEach((doc) => {
    const data = doc.data()
    cars.push({
      id: doc.id,
      title: data.title,
      brand: data.brand,
      brandLower: data.brandLower,
      collection: data.collection,
      collectionColor: data.collectionColor,
      collectionNumber: data.collectionNumber,
      seriesNumber: data.seriesNumber,
      year: data.year,
      date: data.date,
      owner: data.owner,
      imageUrl: data.imageUrl,
      userId,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    })
  })

  // Client-side search filter (after fetching all)
  let filteredCars = cars
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredCars = cars.filter(
      (car) =>
        car.title.toLowerCase().includes(searchLower) ||
        car.brand.toLowerCase().includes(searchLower) ||
        car.collection.toLowerCase().includes(searchLower)
    )
  }

  // Sort by brand for consistent ordering
  filteredCars.sort((a, b) => a.brandLower.localeCompare(b.brandLower))

  // When filters active, no more pages
  const newLastDoc = hasFilters ? null : (snapshot.docs[snapshot.docs.length - 1] || null)

  return { cars: filteredCars, lastDoc: newLastDoc }
}

export async function getCarById(userId: string, carId: string): Promise<Car | null> {
  const docRef = getCarDoc(userId, carId)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) return null

  const data = snapshot.data()
  return {
    id: snapshot.id,
    title: data.title,
    brand: data.brand,
    brandLower: data.brandLower,
    collection: data.collection,
    collectionColor: data.collectionColor,
    collectionNumber: data.collectionNumber,
    seriesNumber: data.seriesNumber,
    year: data.year,
    date: data.date,
    owner: data.owner,
    imageUrl: data.imageUrl,
    userId,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  }
}

export async function uploadCarImage(
  userId: string,
  carId: string,
  file: File
): Promise<string> {
  const timestamp = Date.now()
  const path = `users/${userId}/cars/${carId}/${timestamp}.webp`
  const storageRef = ref(storage, path)

  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function deleteCarImage(imageUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, imageUrl)
    await deleteObject(storageRef)
  } catch {
    // Image may not exist
  }
}

export async function createCar(
  userId: string,
  data: CarFormData,
  imageFile: File
): Promise<Car> {
  const now = Timestamp.now()
  const carsRef = getCarsCollection(userId)

  // Create a temporary doc to get an ID
  const docRef = await addDoc(carsRef, {
    title: data.title,
    brand: data.brand,
    brandLower: data.brand.toLowerCase(),
    collection: data.collection,
    collectionColor: data.collectionColor || null,
    collectionNumber: data.collectionNumber || null,
    seriesNumber: data.seriesNumber || null,
    year: data.year || null,
    date: data.date || null,
    owner: data.owner || null,
    imageUrl: '', // Temporary
    createdAt: now,
    updatedAt: now,
  })

  // Upload image with the car ID
  const imageUrl = await uploadCarImage(userId, docRef.id, imageFile)

  // Update the document with the image URL
  await updateDoc(docRef, { imageUrl })

  return {
    id: docRef.id,
    title: data.title,
    brand: data.brand,
    brandLower: data.brand.toLowerCase(),
    collection: data.collection,
    collectionColor: data.collectionColor,
    collectionNumber: data.collectionNumber,
    seriesNumber: data.seriesNumber,
    year: data.year,
    date: data.date,
    owner: data.owner,
    imageUrl,
    userId,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  }
}

export async function updateCar(
  userId: string,
  carId: string,
  data: Partial<CarFormData>,
  imageFile?: File
): Promise<void> {
  const docRef = getCarDoc(userId, carId)
  const now = Timestamp.now()

  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: now,
  }

  if (data.brand) {
    updateData.brandLower = data.brand.toLowerCase()
  }

  if (imageFile) {
    // Get current car to delete old image
    const currentCar = await getCarById(userId, carId)
    if (currentCar?.imageUrl) {
      await deleteCarImage(currentCar.imageUrl)
    }
    updateData.imageUrl = await uploadCarImage(userId, carId, imageFile)
  }

  // Remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key]
    }
  })

  await updateDoc(docRef, updateData)
}

export async function deleteCar(userId: string, carId: string): Promise<void> {
  const car = await getCarById(userId, carId)
  if (car?.imageUrl) {
    await deleteCarImage(car.imageUrl)
  }
  await deleteDoc(getCarDoc(userId, carId))
}

export async function getBrands(userId: string): Promise<string[]> {
  const carsRef = getCarsCollection(userId)
  const snapshot = await getDocs(carsRef)
  const brandsSet = new Set<string>()

  snapshot.forEach((doc) => {
    const data = doc.data()
    if (data.brand) {
      brandsSet.add(data.brand)
    }
  })

  return Array.from(brandsSet).sort()
}

export async function getOwners(userId: string): Promise<string[]> {
  const carsRef = getCarsCollection(userId)
  const snapshot = await getDocs(carsRef)
  const ownersSet = new Set<string>()

  snapshot.forEach((doc) => {
    const data = doc.data()
    if (data.owner) {
      ownersSet.add(data.owner)
    }
  })

  return Array.from(ownersSet).sort()
}

export async function getCarCount(userId: string): Promise<number> {
  const carsRef = getCarsCollection(userId)
  const snapshot = await getDocs(carsRef)
  return snapshot.size
}
