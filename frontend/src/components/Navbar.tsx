import { Link, useLocation } from 'react-router-dom'
import type { User } from '../types'

interface NavbarProps {
  user: User
  onLogout: () => void
}

const links = [
  { to: '/', label: 'Início' },
  { to: '/pesquisa', label: 'Pesquisar' },
  { to: '/minha-horta', label: 'Minha Horta' },
]

export default function Navbar({ user, onLogout }: NavbarProps) {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 select-none">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-forest-800 tracking-tight">PlantaCare</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-forest-50 text-forest-700'
                      : 'text-gray-500 hover:text-forest-700 hover:bg-forest-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Olá, <span className="font-medium text-forest-700">{user.name}</span>
            </span>
            <button
              onClick={onLogout}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              title="Sair"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden gap-1 pb-2">
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex-1 text-center px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-forest-50 text-forest-700'
                    : 'text-gray-500 hover:text-forest-700'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
