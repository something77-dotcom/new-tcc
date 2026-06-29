import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPlants } from '../api'
import type { Plant, PlantCategory, Season } from '../types'
import PlantCard from '../components/PlantCard'
import { categoryLabel, seasonLabel, seasonEmoji } from '../utils/labels'

const categories: { value: PlantCategory | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'LEGUME', label: 'Legumes' },
  { value: 'FRUTA', label: 'Frutas' },
  { value: 'ERVA', label: 'Ervas' },
  { value: 'FLOR', label: 'Flores' },
  { value: 'ARVORE', label: 'Árvores' },
]

const seasons: { value: Season | ''; label: string; emoji: string }[] = [
  { value: '', label: 'Todas', emoji: '🌍' },
  { value: 'PRIMAVERA', label: seasonLabel.PRIMAVERA, emoji: seasonEmoji.PRIMAVERA },
  { value: 'VERAO', label: seasonLabel.VERAO, emoji: seasonEmoji.VERAO },
  { value: 'OUTONO', label: seasonLabel.OUTONO, emoji: seasonEmoji.OUTONO },
  { value: 'INVERNO', label: seasonLabel.INVERNO, emoji: seasonEmoji.INVERNO },
  { value: 'ANO_TODO', label: seasonLabel.ANO_TODO, emoji: seasonEmoji.ANO_TODO },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState<PlantCategory | ''>('')
  const [season, setSeason] = useState<Season | ''>('')

  const fetchPlants = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (query) params.search = query
      if (category) params.category = category
      if (season) params.season = season
      const result = await getPlants(params)
      setPlants(result)
    } finally {
      setLoading(false)
    }
  }, [query, category, season])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [searchParams])

  useEffect(() => {
    const timeout = setTimeout(fetchPlants, 300)
    return () => clearTimeout(timeout)
  }, [fetchPlants])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(query ? { q: query } : {})
    fetchPlants()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Pesquisar Plantas</h1>
        <p className="text-gray-500 text-sm">Encontre a planta ideal para a sua horta</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou descrição..."
          className="input flex-1 text-base"
          autoFocus
        />
        <button type="submit" className="btn-primary px-6">
          Buscar
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categoria</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value as PlantCategory | '')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  category === c.value
                    ? 'bg-forest-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-forest-300 hover:text-forest-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estação</span>
          <div className="flex flex-wrap gap-2">
            {seasons.map((s) => (
              <button
                key={s.value}
                onClick={() => setSeason(s.value as Season | '')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  season === s.value
                    ? 'bg-forest-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-forest-300 hover:text-forest-700'
                }`}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-2 animate-spin inline-block">🌱</div>
          <p>Buscando plantas...</p>
        </div>
      ) : plants.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {plants.length} {plants.length === 1 ? 'planta encontrada' : 'plantas encontradas'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium">Nenhuma planta encontrada</p>
          <p className="text-sm mt-1">Tente outros termos ou remova os filtros</p>
        </div>
      )}
    </div>
  )
}
