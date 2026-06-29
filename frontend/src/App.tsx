import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import PlantDetail from './pages/PlantDetail'
import MyGarden from './pages/MyGarden'
import { createOrFindUser } from './api'
import type { User } from './types'

function SetupScreen({ onDone }: { onDone: (user: User) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    setError('')
    try {
      const user = await createOrFindUser(name.trim(), email.trim().toLowerCase())
      localStorage.setItem('plantacare_user', JSON.stringify(user))
      onDone(user)
    } catch {
      setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1e5b34 0%, #389155 50%, #5eb275 100%)' }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🌿</div>
          <h1 className="text-3xl font-bold text-forest-900">PlantaCare</h1>
          <p className="text-gray-500 mt-2 text-sm">Seu guia completo de plantas e hortas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamado?"
              className="input text-base"
              autoFocus
              maxLength={60}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="input text-base"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || loading}
            className="btn-primary w-full justify-center text-base py-3"
          >
            {loading ? 'Entrando...' : 'Começar 🌱'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('plantacare_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('plantacare_user')
      }
    }
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50">
        <p className="text-forest-600 animate-pulse">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return <SetupScreen onDone={setUser} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={() => {
          localStorage.removeItem('plantacare_user')
          setUser(null)
        }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pesquisa" element={<Search />} />
          <Route path="/planta/:id" element={<PlantDetail user={user} />} />
          <Route path="/minha-horta" element={<MyGarden user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
