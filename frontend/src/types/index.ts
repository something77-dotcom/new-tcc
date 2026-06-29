export type Season = 'PRIMAVERA' | 'VERAO' | 'OUTONO' | 'INVERNO' | 'ANO_TODO'
export type PlantCategory = 'LEGUME' | 'FRUTA' | 'ERVA' | 'FLOR' | 'ARVORE'
export type PlantStatus = 'PLANTADA' | 'CRESCENDO' | 'PRONTA_COLHER' | 'COLHIDA' | 'MORTA'

export interface Plant {
  id: string
  name: string
  scientificName?: string
  emoji: string
  description: string
  category: PlantCategory
  seasons: Season[]
  harvestDays?: number
  wateringFreq: string
  sunlight: string
  tips?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email?: string
}

export interface GardenPlant {
  id: string
  gardenId: string
  plantId: string
  plant: Plant
  status: PlantStatus
  plantedAt: string
  harvestedAt?: string
  notes?: string
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface Garden {
  id: string
  name: string
  description?: string
  userId: string
  plants: GardenPlant[]
  createdAt: string
  updatedAt: string
}
