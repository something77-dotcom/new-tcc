import { Link } from 'react-router-dom'
import type { Plant } from '../types'
import SeasonBadge from './SeasonBadge'
import { categoryLabel, categoryBadgeClass } from '../utils/labels'

interface PlantCardProps {
  plant: Plant
  onAddToGarden?: (plant: Plant) => void
}

export default function PlantCard({ plant, onAddToGarden }: PlantCardProps) {
  return (
    <div className="card p-5 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <Link to={`/planta/${plant.id}`} className="flex-1">
        <div className="text-5xl text-center mb-3">{plant.emoji}</div>
        <h3 className="font-semibold text-gray-800 text-base leading-snug">{plant.name}</h3>
        {plant.scientificName && (
          <p className="text-xs text-gray-400 italic mt-0.5 mb-2">{plant.scientificName}</p>
        )}
        <span className={`badge ${categoryBadgeClass[plant.category]} mb-3`}>
          {categoryLabel[plant.category]}
        </span>
        <div className="flex flex-wrap gap-1 mb-3">
          {plant.seasons.map((s) => (
            <SeasonBadge key={s} season={s} />
          ))}
        </div>
        {plant.harvestDays && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span>⏱</span>
            <span>Colheita em ~{plant.harvestDays} dias</span>
          </p>
        )}
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <span>💧</span>
          <span>{plant.wateringFreq}</span>
        </p>
      </Link>

      {onAddToGarden && (
        <button
          onClick={() => onAddToGarden(plant)}
          className="mt-4 w-full py-2 text-sm font-medium text-forest-700 bg-forest-50
                     hover:bg-forest-100 rounded-xl transition-colors"
        >
          + Adicionar à horta
        </button>
      )}
    </div>
  )
}
