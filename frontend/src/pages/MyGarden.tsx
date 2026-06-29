import { useState, useEffect, useCallback } from 'react'
import {
  getGardens,
  createGarden,
  deleteGarden,
  getPlants,
  addPlantToGarden,
  updateGardenPlant,
  removeGardenPlant,
} from '../api'
import type { Garden, GardenPlant, Plant, PlantStatus, User } from '../types'
import StatusBadge from '../components/StatusBadge'
import { statusLabel, statusEmoji, daysUntilHarvest, daysSincePlanting } from '../utils/labels'

interface MyGardenProps {
  user: User
}

const statusOptions: PlantStatus[] = ['PLANTADA', 'CRESCENDO', 'PRONTA_COLHER', 'COLHIDA', 'MORTA']

function HarvestIndicator({ gp }: { gp: GardenPlant }) {
  if (!gp.plant.harvestDays) return null
  const daysLeft = daysUntilHarvest(gp.plantedAt, gp.plant.harvestDays)
  const daysSince = daysSincePlanting(gp.plantedAt)

  if (daysLeft === null) return null

  if (daysLeft <= 0) {
    return (
      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
        ✨ Pronto para colher!
      </span>
    )
  }

  if (daysLeft <= 7) {
    return (
      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
        🕐 Faltam {daysLeft}d para colheita
      </span>
    )
  }

  return (
    <span className="text-xs text-gray-400">
      Dia {daysSince} de {gp.plant.harvestDays}
    </span>
  )
}

function GardenCard({
  garden,
  onDelete,
  onAddPlant,
  pendingStatuses,
  onStatusChange,
  onSaveStatuses,
  onRemovePlant,
  saving,
}: {
  garden: Garden
  onDelete: (id: string) => void
  onAddPlant: (gardenId: string) => void
  pendingStatuses: Record<string, PlantStatus>
  onStatusChange: (gardenId: string, gpId: string, status: PlantStatus) => void
  onSaveStatuses: (gardenId: string) => void
  onRemovePlant: (gardenId: string, gpId: string) => void
  saving: boolean
}) {
  const [expanded, setExpanded] = useState(true)

  const hasPending = Object.keys(pendingStatuses).length > 0

  const activePlants = garden.plants.filter((gp) => {
    const status = pendingStatuses[gp.id] ?? gp.status
    return status !== 'COLHIDA' && status !== 'MORTA'
  })
  const donePlants = garden.plants.filter((gp) => {
    const status = pendingStatuses[gp.id] ?? gp.status
    return status === 'COLHIDA' || status === 'MORTA'
  })

  return (
    <div className="card overflow-hidden">
      {/* Garden header */}
      <div className="p-4 bg-forest-50 border-b border-forest-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            <span className="text-2xl">🪴</span>
            <div>
              <h3 className="font-semibold text-forest-900">{garden.name}</h3>
              {garden.description && (
                <p className="text-xs text-forest-600 mt-0.5">{garden.description}</p>
              )}
              <p className="text-xs text-forest-500 mt-0.5">
                {garden.plants.length} {garden.plants.length === 1 ? 'planta' : 'plantas'}
              </p>
            </div>
            <span className="text-forest-400 ml-auto mr-2 text-sm">{expanded ? '▲' : '▼'}</span>
          </button>
          <div className="flex gap-1 items-center">
            {hasPending && (
              <button
                onClick={() => onSaveStatuses(garden.id)}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-forest-600
                           rounded-lg hover:bg-forest-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Salvando...' : `Salvar (${Object.keys(pendingStatuses).length})`}
              </button>
            )}
            <button
              onClick={() => onAddPlant(garden.id)}
              className="px-3 py-1.5 text-xs font-medium text-forest-700 bg-white
                         border border-forest-200 rounded-lg hover:bg-forest-50 transition-colors"
            >
              + Planta
            </button>
            <button
              onClick={() => onDelete(garden.id)}
              className="px-2 py-1.5 text-xs text-gray-400 hover:text-red-500
                         hover:bg-red-50 rounded-lg transition-colors"
              title="Deletar horta"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      {/* Plants list */}
      {expanded && (
        <div className="p-4">
          {garden.plants.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">🌱</div>
              <p className="text-sm">Nenhuma planta ainda</p>
              <button
                onClick={() => onAddPlant(garden.id)}
                className="mt-3 text-sm text-forest-600 hover:text-forest-800 font-medium"
              >
                + Adicionar primeira planta
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activePlants.map((gp) => (
                <GardenPlantRow
                  key={gp.id}
                  gp={gp}
                  gardenId={garden.id}
                  currentStatus={pendingStatuses[gp.id] ?? gp.status}
                  isDirty={gp.id in pendingStatuses}
                  onStatusChange={onStatusChange}
                  onRemove={onRemovePlant}
                />
              ))}
              {donePlants.length > 0 && (
                <>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide pt-2">
                    Concluídas
                  </div>
                  {donePlants.map((gp) => (
                    <GardenPlantRow
                      key={gp.id}
                      gp={gp}
                      gardenId={garden.id}
                      currentStatus={pendingStatuses[gp.id] ?? gp.status}
                      isDirty={gp.id in pendingStatuses}
                      onStatusChange={onStatusChange}
                      onRemove={onRemovePlant}
                      muted
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GardenPlantRow({
  gp,
  gardenId,
  currentStatus,
  isDirty,
  onStatusChange,
  onRemove,
  muted,
}: {
  gp: GardenPlant
  gardenId: string
  currentStatus: PlantStatus
  isDirty: boolean
  onStatusChange: (gardenId: string, gpId: string, status: PlantStatus) => void
  onRemove: (gardenId: string, gpId: string) => void
  muted?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
      isDirty
        ? 'border-forest-200 bg-forest-50/60'
        : muted
          ? 'border-gray-100 bg-gray-50/50'
          : 'border-gray-100 bg-gray-50 hover:bg-gray-100/50'
    }`}>
      <span className="text-2xl shrink-0">{gp.plant.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium text-sm ${muted && !isDirty ? 'text-gray-400' : 'text-gray-700'}`}>
            {gp.plant.name}
          </span>
          {gp.quantity > 1 && (
            <span className="text-xs text-gray-400">×{gp.quantity}</span>
          )}
          <StatusBadge status={currentStatus} />
          {isDirty && (
            <span className="text-xs text-forest-500 font-medium">● não salvo</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <HarvestIndicator gp={gp} />
          {gp.notes && (
            <span className="text-xs text-gray-400 truncate max-w-[150px]" title={gp.notes}>
              📝 {gp.notes}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(gardenId, gp.id, e.target.value as PlantStatus)}
          className={`text-xs border rounded-lg px-2 py-1 focus:outline-none
                      focus:ring-1 focus:ring-forest-400 bg-white transition-colors ${
            isDirty ? 'border-forest-300' : 'border-gray-200'
          }`}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusEmoji[s]} {statusLabel[s]}
            </option>
          ))}
        </select>
        <button
          onClick={() => onRemove(gardenId, gp.id)}
          className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
          title="Remover planta"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default function MyGarden({ user }: MyGardenProps) {
  const [gardens, setGardens] = useState<Garden[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGardenName, setNewGardenName] = useState('')
  const [newGardenDesc, setNewGardenDesc] = useState('')
  const [creating, setCreating] = useState(false)

  // pendingStatuses: { [gardenId]: { [gpId]: PlantStatus } }
  const [pendingStatuses, setPendingStatuses] = useState<Record<string, Record<string, PlantStatus>>>({})
  const [savingGardenId, setSavingGardenId] = useState<string | null>(null)

  // Add plant modal
  const [showAddPlantModal, setShowAddPlantModal] = useState(false)
  const [targetGardenId, setTargetGardenId] = useState('')
  const [allPlants, setAllPlants] = useState<Plant[]>([])
  const [plantSearch, setPlantSearch] = useState('')
  const [selectedPlantId, setSelectedPlantId] = useState('')
  const [addNotes, setAddNotes] = useState('')
  const [addQty, setAddQty] = useState(1)
  const [addingPlant, setAddingPlant] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const gs = await getGardens(user.id)
      setGardens(gs)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    load()
  }, [load])

  const handleCreateGarden = async () => {
    if (!newGardenName.trim()) return
    setCreating(true)
    try {
      const g = await createGarden({
        name: newGardenName.trim(),
        description: newGardenDesc.trim() || undefined,
        userId: user.id,
      })
      setGardens((prev) => [g, ...prev])
      setShowCreateModal(false)
      setNewGardenName('')
      setNewGardenDesc('')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteGarden = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta horta?')) return
    await deleteGarden(id)
    setGardens((prev) => prev.filter((g) => g.id !== id))
  }

  const openAddPlant = async (gardenId: string) => {
    setTargetGardenId(gardenId)
    setShowAddPlantModal(true)
    if (allPlants.length === 0) {
      const ps = await getPlants()
      setAllPlants(ps)
      if (ps.length > 0) setSelectedPlantId(ps[0].id)
    } else if (allPlants.length > 0 && !selectedPlantId) {
      setSelectedPlantId(allPlants[0].id)
    }
  }

  const handleAddPlant = async () => {
    if (!selectedPlantId || !targetGardenId) return
    setAddingPlant(true)
    try {
      const gp = await addPlantToGarden(targetGardenId, {
        plantId: selectedPlantId,
        quantity: addQty,
        notes: addNotes || undefined,
      })
      setGardens((prev) =>
        prev.map((g) =>
          g.id === targetGardenId ? { ...g, plants: [gp, ...g.plants] } : g,
        ),
      )
      setShowAddPlantModal(false)
      setAddNotes('')
      setAddQty(1)
    } finally {
      setAddingPlant(false)
    }
  }

  const handleStatusChange = (gardenId: string, gpId: string, status: PlantStatus) => {
    setPendingStatuses((prev) => ({
      ...prev,
      [gardenId]: { ...(prev[gardenId] ?? {}), [gpId]: status },
    }))
  }

  const handleSaveStatuses = async (gardenId: string) => {
    const pending = pendingStatuses[gardenId]
    if (!pending) return
    setSavingGardenId(gardenId)
    try {
      const updates = await Promise.all(
        Object.entries(pending).map(([gpId, status]) =>
          updateGardenPlant(gardenId, gpId, { status }),
        ),
      )
      setGardens((prev) =>
        prev.map((g) => {
          if (g.id !== gardenId) return g
          const updatedMap = Object.fromEntries(updates.map((u) => [u.id, u]))
          return { ...g, plants: g.plants.map((p) => updatedMap[p.id] ?? p) }
        }),
      )
      setPendingStatuses((prev) => {
        const next = { ...prev }
        delete next[gardenId]
        return next
      })
    } finally {
      setSavingGardenId(null)
    }
  }

  const handleRemovePlant = async (gardenId: string, gpId: string) => {
    if (!confirm('Remover esta planta da horta?')) return
    await removeGardenPlant(gardenId, gpId)
    setGardens((prev) =>
      prev.map((g) =>
        g.id === gardenId ? { ...g, plants: g.plants.filter((p) => p.id !== gpId) } : g,
      ),
    )
  }

  const filteredPlants = allPlants.filter(
    (p) =>
      plantSearch === '' ||
      p.name.toLowerCase().includes(plantSearch.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Minha Horta</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Olá, <span className="font-medium text-forest-700">{user.name}</span>! Gerencie suas plantações aqui.
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          + Nova Horta
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-2">🌱</div>
          <p>Carregando hortas...</p>
        </div>
      ) : gardens.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <div className="text-6xl mb-4">🪴</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma horta ainda</h2>
          <p className="text-sm mb-6">Crie sua primeira horta para começar a gerenciar suas plantas.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary mx-auto">
            🌿 Criar primeira horta
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {gardens.map((g) => (
            <GardenCard
              key={g.id}
              garden={g}
              onDelete={handleDeleteGarden}
              onAddPlant={openAddPlant}
              pendingStatuses={pendingStatuses[g.id] ?? {}}
              onStatusChange={handleStatusChange}
              onSaveStatuses={handleSaveStatuses}
              onRemovePlant={handleRemovePlant}
              saving={savingGardenId === g.id}
            />
          ))}
        </div>
      )}

      {/* Create Garden Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center
                     justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Nova Horta</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da horta *</label>
                <input
                  type="text"
                  value={newGardenName}
                  onChange={(e) => setNewGardenName(e.target.value)}
                  placeholder="Ex: Horta da varanda"
                  className="input"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                <input
                  type="text"
                  value={newGardenDesc}
                  onChange={(e) => setNewGardenDesc(e.target.value)}
                  placeholder="Ex: Canteiro no lado leste"
                  className="input"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1 justify-center">
                Cancelar
              </button>
              <button
                onClick={handleCreateGarden}
                disabled={!newGardenName.trim() || creating}
                className="btn-primary flex-1 justify-center"
              >
                {creating ? 'Criando...' : 'Criar Horta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Plant Modal */}
      {showAddPlantModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center
                     justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowAddPlantModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Adicionar Planta</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar planta</label>
                <input
                  type="text"
                  value={plantSearch}
                  onChange={(e) => setPlantSearch(e.target.value)}
                  placeholder="Filtrar..."
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecionar planta</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredPlants.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlantId(p.id)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm
                                  transition-colors hover:bg-gray-50 ${
                        selectedPlantId === p.id ? 'bg-forest-50 text-forest-700' : ''
                      }`}
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                  {filteredPlants.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-400">Nenhuma planta encontrada</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  value={addQty}
                  onChange={(e) => setAddQty(Number(e.target.value))}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                <textarea
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="Ex: Pé grande, plantado no canto..."
                  className="input resize-none h-16"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddPlantModal(false)} className="btn-secondary flex-1 justify-center">
                Cancelar
              </button>
              <button
                onClick={handleAddPlant}
                disabled={!selectedPlantId || addingPlant}
                className="btn-primary flex-1 justify-center"
              >
                {addingPlant ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
