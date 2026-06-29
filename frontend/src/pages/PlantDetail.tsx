import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPlant, getGardens, addPlantToGarden } from '../api'
import type { Plant, User, Garden } from '../types'
import SeasonBadge from '../components/SeasonBadge'
import { categoryLabel, categoryBadgeClass } from '../utils/labels'

interface PlantDetailProps {
  user: User
}

interface StatCardProps {
  emoji: string
  label: string
  value: string
}

function StatCard({ emoji, label, value }: StatCardProps) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="font-semibold text-gray-800 text-sm">{value}</div>
    </div>
  )
}

export default function PlantDetail({ user }: PlantDetailProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [gardens, setGardens] = useState<Garden[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedGarden, setSelectedGarden] = useState('')
  const [notes, setNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const [addedMsg, setAddedMsg] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([
      getPlant(id),
      getGardens(user.id),
    ]).then(([p, g]) => {
      setPlant(p)
      setGardens(g)
      if (g.length > 0) setSelectedGarden(g[0].id)
    }).finally(() => setLoading(false))
  }, [id, user.id])

  const handleAdd = async () => {
    if (!plant || !selectedGarden) return
    setAdding(true)
    try {
      await addPlantToGarden(selectedGarden, { plantId: plant.id, notes: notes || undefined })
      setAddedMsg('Planta adicionada com sucesso! 🎉')
      setShowModal(false)
      setNotes('')
      setTimeout(() => setAddedMsg(''), 3000)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-5xl mb-2">🌱</div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-5xl mb-2">🔍</div>
          <p>Planta não encontrada</p>
          <Link to="/pesquisa" className="btn-secondary mt-4">← Voltar</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost mb-6 -ml-2"
      >
        ← Voltar
      </button>

      {addedMsg && (
        <div className="mb-4 bg-forest-50 border border-forest-200 text-forest-700
                        px-4 py-3 rounded-xl text-sm font-medium">
          {addedMsg}
        </div>
      )}

      {/* Header */}
      <div className="card p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="text-7xl shrink-0">{plant.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{plant.name}</h1>
                {plant.scientificName && (
                  <p className="text-gray-400 italic text-sm mt-0.5">{plant.scientificName}</p>
                )}
              </div>
              <span className={`badge ${categoryBadgeClass[plant.category]} shrink-0`}>
                {categoryLabel[plant.category]}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {plant.seasons.map((s) => (
                <SeasonBadge key={s} season={s} size="md" />
              ))}
            </div>

            <p className="text-gray-600 leading-relaxed">{plant.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {plant.harvestDays && (
          <StatCard emoji="⏱" label="Dias para colheita" value={`~${plant.harvestDays} dias`} />
        )}
        <StatCard emoji="💧" label="Rega" value={plant.wateringFreq} />
        <StatCard emoji="☀️" label="Luz solar" value={plant.sunlight} />
      </div>

      {/* Tips */}
      {plant.tips && (
        <div className="card p-6 mb-6 border-l-4 border-forest-400">
          <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>💡</span> Dicas de cultivo
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">{plant.tips}</p>
        </div>
      )}

      {/* Add to garden */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-800 mb-3">Adicionar à minha horta</h2>

        {gardens.length === 0 ? (
          <div className="text-sm text-gray-500">
            <p>Você ainda não tem hortas criadas.</p>
            <Link to="/minha-horta" className="btn-primary mt-3 inline-flex">
              🌿 Criar horta
            </Link>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            🌱 Adicionar à horta
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center
                     justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              Adicionar {plant.emoji} {plant.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecionar horta
                </label>
                <select
                  value={selectedGarden}
                  onChange={(e) => setSelectedGarden(e.target.value)}
                  className="input"
                >
                  {gardens.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Plantado no canteiro da frente..."
                  className="input resize-none h-20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={adding}
                className="btn-primary flex-1 justify-center"
              >
                {adding ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
