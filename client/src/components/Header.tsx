import { useNavigate, Link } from 'react-router-dom'
import { logoutUser } from '../services/api'
import { useTheme } from '../hooks/useTheme'

// Props define what the component receives / Props define o que o componente recebe
interface HeaderProps {
  activePage: 'finances' | 'storage'
}

function Header({ activePage }: HeaderProps) {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  async function handleLogout() {
    await logoutUser()
    navigate('/login')
  }

  return (
    <header className="bg-pink-500 px-5 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-10">
      
      <h1 className="text-lg font-medium text-white">💅 Gestão Nails</h1>

      <nav className="flex gap-2">
          <Link
            to="/finances"
          className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
            activePage === 'finances'
              ? 'bg-white text-pink-500 font-medium'
              : 'text-pink-100 hover:bg-pink-600'
          }`}
        >
          Financeiro
        </Link>
        <Link
          to="/storage"
          className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
            activePage === 'storage'
              ? 'bg-white text-pink-500 font-medium'
              : 'text-pink-100 hover:bg-pink-600'
          }`}
        >
          Estoque
        </Link>
      </nav>
      
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="text-white text-xl hover:opacity-75 transition-opacity"
          title={isDark ? 'Modo Claro' : 'Modo Escuro'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      
        <button
        onClick={handleLogout}
        className="text-sm border border-pink-100 text-white rounded-full px-3.5 py-1.5 hover:bg-pink-600 transition-colors"
        >
        Sair
        </button>
      </div>
    </header>
  )
}

export default Header