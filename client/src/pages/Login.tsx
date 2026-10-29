import { useState } from 'react'
import { useNavigate , useLocation, Link } from 'react-router-dom'
import { loginUser } from '../services/api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message

  async function handleLogin() {
    setLoading(true)
    setError('')

    try {
      const data = await loginUser(username, password)

      if (data.success) {
        navigate('/finances')
      } else {
        setError('Usuário ou senha incorretos!')
      }
    } catch {
      setError('Erro ao conectar com o servidor!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-200 flex items-center justify-center relative overflow-hidden">
      
      <div className="absolute w-56 h-56 rounded-full border-2 border-yellow-500 opacity-30 -top-20 -left-20"/>
      <div className="absolute w-36 h-36 rounded-full border-2 border-dashed border-yellow-500 opacity-30 -top-5 left-16"/>
      <div className="absolute w-64 h-64 rounded-full border-2 border-yellow-500 opacity-30 -bottom-24 -right-20"/>

      <div className="w-full max-w-sm px-5 flex flex-col items-center gap-5 z-10">
        
        <p className="text-sm italic text-pink-800 text-center tracking-wide">
          Inspire-se. Inove-se. Mostre seu Trabalho.
        </p>

        <div className="bg-white rounded-3xl p-7 w-full flex flex-col gap-4">
          
          <h1 className="text-2xl font-medium text-pink-800 text-center">
            Bem-Vinda!
          </h1>

        {/* Error message and Success  / Mensagem de erro e Sucesso */}
        
        {successMessage &&  (
            <p className="text-xs text-green-500 text-center">{successMessage}</p>
        )}

        {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-pink-600">Usuário</label>
            <input
              type="text"
              placeholder="Seu usuário"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-pink-100 border border-pink-200 rounded-xl px-3.5 py-3 text-sm text-pink-800 outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-pink-600">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-pink-100 border border-pink-200 rounded-xl px-3.5 py-3 text-sm text-pink-800 outline-none focus:border-pink-500"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!username || !password || loading}
            className="bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <Link to="/register" className="text-center text-xs text-pink-500 underline cursor-pointer">
            Criar conta
          </Link>

        </div>
      </div>
    </div>
  )
}

export default Login