import type { Season, PlantCategory, PlantStatus } from '../types'

export const seasonLabel: Record<Season, string> = {
  PRIMAVERA: 'Primavera',
  VERAO: 'Verão',
  OUTONO: 'Outono',
  INVERNO: 'Inverno',
  ANO_TODO: 'Ano todo',
}

export const seasonEmoji: Record<Season, string> = {
  PRIMAVERA: '🌸',
  VERAO: '☀️',
  OUTONO: '🍂',
  INVERNO: '❄️',
  ANO_TODO: '🌿',
}

export const categoryLabel: Record<PlantCategory, string> = {
  LEGUME: 'Legume',
  FRUTA: 'Fruta',
  ERVA: 'Erva',
  FLOR: 'Flor',
  ARVORE: 'Árvore',
}

export const statusLabel: Record<PlantStatus, string> = {
  PLANTADA: 'Plantada',
  CRESCENDO: 'Crescendo',
  PRONTA_COLHER: 'Pronta para colher',
  COLHIDA: 'Colhida',
  MORTA: 'Morta',
}

export const statusEmoji: Record<PlantStatus, string> = {
  PLANTADA: '🌱',
  CRESCENDO: '🪴',
  PRONTA_COLHER: '✨',
  COLHIDA: '🧺',
  MORTA: '🥀',
}

export const seasonBadgeClass: Record<Season, string> = {
  PRIMAVERA: 'bg-pink-50 text-pink-700',
  VERAO: 'bg-amber-50 text-amber-700',
  OUTONO: 'bg-orange-50 text-orange-700',
  INVERNO: 'bg-blue-50 text-blue-700',
  ANO_TODO: 'bg-forest-100 text-forest-700',
}

export const statusBadgeClass: Record<PlantStatus, string> = {
  PLANTADA: 'bg-gray-100 text-gray-600',
  CRESCENDO: 'bg-forest-100 text-forest-700',
  PRONTA_COLHER: 'bg-amber-100 text-amber-700',
  COLHIDA: 'bg-blue-100 text-blue-700',
  MORTA: 'bg-red-100 text-red-600',
}

export const categoryBadgeClass: Record<PlantCategory, string> = {
  LEGUME: 'bg-green-50 text-green-700',
  FRUTA: 'bg-rose-50 text-rose-700',
  ERVA: 'bg-teal-50 text-teal-700',
  FLOR: 'bg-purple-50 text-purple-700',
  ARVORE: 'bg-lime-50 text-lime-700',
}

export function daysUntilHarvest(plantedAt: string, harvestDays?: number): number | null {
  if (!harvestDays) return null
  const planted = new Date(plantedAt)
  const harvestDate = new Date(planted.getTime() + harvestDays * 24 * 60 * 60 * 1000)
  const diff = Math.ceil((harvestDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return diff
}

export function daysSincePlanting(plantedAt: string): number {
  const planted = new Date(plantedAt)
  return Math.floor((Date.now() - planted.getTime()) / (1000 * 60 * 60 * 24))
}
