import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPlants } from '../api'
import type { Plant } from '../types'
import PlantCard from '../components/PlantCard'

const stats = [
  { value: '50+', label: 'Plantas cadastradas', emoji: '🌿' },
  { value: '4', label: 'Estações cobertas', emoji: '🍂' },
  { value: '100%', label: 'Guia completo', emoji: '📖' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Pesquise',
    desc: 'Busque por nome, categoria ou estação. Encontre as plantas ideais para o seu espaço e clima.',
    emoji: '🔍',
  },
  {
    step: '02',
    title: 'Adicione à horta',
    desc: 'Crie sua horta virtual e adicione as plantas que deseja cultivar com quantidade e anotações.',
    emoji: '🌱',
  },
  {
    step: '03',
    title: 'Acompanhe',
    desc: 'Monitore o crescimento, atualizar o status e saiba quando está na hora da colheita.',
    emoji: '🧺',
  },
]

export default function Home() {
  const [featured, setFeatured] = useState<Plant[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getPlants().then((plants) => setFeatured(plants.slice(0, 8)))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/pesquisa?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #1e5b34 0%, #267341 40%, #389155 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #5eb275 0%, transparent 50%), radial-gradient(circle at 80% 20%, #95cfa4 0%, transparent 50%)' }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span>🌱</span> Seu guia completo de plantas e hortas
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Cultive com <span className="text-forest-200">conhecimento</span>
          </h1>
          <p className="text-forest-100 text-lg mb-10 max-w-xl mx-auto">
            Pesquise plantas, descubra as melhores épocas de plantio e gerencie sua horta em um só lugar.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar planta... ex: tomate, hortelã"
              className="flex-1 px-5 py-3 rounded-xl bg-white text-gray-800
                         placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-white/50 text-base shadow-md"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-forest-500 hover:bg-forest-400 text-white font-semibold rounded-xl shadow-md transition-colors"
            >
              Buscar
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['Alface', 'Tomate', 'Manjericão', 'Morango'].map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/pesquisa?q=${s}`)}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-2xl font-bold text-forest-700">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured plants */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Plantas em destaque</h2>
            <p className="text-gray-500 text-sm mt-0.5">Populares para hortas domésticas</p>
          </div>
          <Link
            to="/pesquisa"
            className="text-sm text-forest-600 hover:text-forest-800 font-medium transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🌱</div>
            <p>Carregando plantas...</p>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-forest-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Como funciona</h2>
            <p className="text-gray-500 mt-1">Simples do início à colheita</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="card p-6 text-center">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <div className="text-xs font-bold text-forest-400 tracking-wider uppercase mb-1">
                  Passo {item.step}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/minha-horta" className="btn-primary text-base px-8 py-3">
              🌿 Criar minha horta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-900 text-forest-300 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🌿</span>
          <span className="font-semibold text-white">PlantaCare</span>
        </div>
        <p className="text-sm">Trabalho de Conclusão de Curso — {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
