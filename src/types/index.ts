export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Car {
  id: string
  title: string
  brand: string
  brandLower: string
  collection: string
  collectionColor?: string
  collectionNumber?: string
  seriesNumber?: string
  year?: string
  date?: string
  owner?: string
  imageUrl: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CarFormData {
  title: string
  brand: string
  collection: string
  collectionColor?: string
  collectionNumber?: string
  seriesNumber?: string
  year?: string
  date?: string
  owner?: string
  image?: File
}

export interface CarFilters {
  owner?: string
  brand?: string
  search?: string
}
