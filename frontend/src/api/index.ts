import axios from 'axios'
import type { Plant, Garden, GardenPlant, User } from '../types'

const api = axios.create({
  baseURL: '/api',
})

// Plants
export const getPlants = (params?: {
  search?: string
  category?: string
  season?: string
}): Promise<Plant[]> =>
  api.get('/plants', { params }).then((r) => r.data)

export const getPlant = (id: string): Promise<Plant> =>
  api.get(`/plants/${id}`).then((r) => r.data)

// Users
export const createOrFindUser = (name: string, email: string): Promise<User> =>
  api.post('/users', { name, email }).then((r) => r.data)

export const getUser = (id: string): Promise<User> =>
  api.get(`/users/${id}`).then((r) => r.data)

// Gardens
export const getGardens = (userId: string): Promise<Garden[]> =>
  api.get('/gardens', { params: { userId } }).then((r) => r.data)

export const getGarden = (id: string): Promise<Garden> =>
  api.get(`/gardens/${id}`).then((r) => r.data)

export const createGarden = (data: {
  name: string
  description?: string
  userId: string
}): Promise<Garden> =>
  api.post('/gardens', data).then((r) => r.data)

export const deleteGarden = (id: string): Promise<void> =>
  api.delete(`/gardens/${id}`).then((r) => r.data)

export const addPlantToGarden = (
  gardenId: string,
  data: { plantId: string; quantity?: number; notes?: string },
): Promise<GardenPlant> =>
  api.post(`/gardens/${gardenId}/plants`, data).then((r) => r.data)

export const updateGardenPlant = (
  gardenId: string,
  gardenPlantId: string,
  data: { status?: string; notes?: string },
): Promise<GardenPlant> =>
  api.patch(`/gardens/${gardenId}/plants/${gardenPlantId}`, data).then((r) => r.data)

export const removeGardenPlant = (
  gardenId: string,
  gardenPlantId: string,
): Promise<void> =>
  api.delete(`/gardens/${gardenId}/plants/${gardenPlantId}`).then((r) => r.data)
