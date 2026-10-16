import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleRegister () {
        setLoading(true);
        setError('')

        try {
            if (password !== confirmPassword) {
                setError('As senhas não coincidem!')
                return
            }

            const data = await registerUser(username, password)

            if (data.success) {
                navigate('/login', { state: { message: 'Conta Criadad com sucesso! 🎉'} })
            } else {
                setError('Erro ao registrar usuário!')
            }
        } catch {
            setError('Erro ao conectar ao servidor!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-pink-200 flex items-center justify-center relative overflow-hidden">

            <div className="absolute w-56 h-56 rounded-full border-2 border-yellow-500 opacity-30 -top-20 -left-20"/>
            <div className="absolute w-36 h-36 rounded-full border-2 border-dashed border-yellow-500 opacity-30 -top-5 left-16"/>
            <div className="absolute w-64 h-64 rounded-full border-2 border-yellow-500 opacity-40 -bottom-24 right-20"/>

            <div className="w-full max-w-sm  px-5 flex flex-col items-center gap-5 z-10">
                {/* Tagline */}
                <p className="text-sm italic text-pink-800 text-center tracking-wide">
                    Inspire-se. Inove-se. Mostre seu Melhor.
                </p>

                <div className="bg-white rounded-3xl p-7 w-full flex flex-col gap-4">
                    <h1 className="text-2xl font-medium text-pink-800 text-center">
                        Registrar
                    </h1>

                    {error && (
                        <p className="text-xs text-red-500 text-center">{error}</p>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-pink-600">Usuário</label>
                        <input
                            type="text"
                            placeholder="Digite seu usuário"
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                            className="bg-pink-100 border border-pink-200 rounded-xl px-3.5 py-3 text-sm text-pink-800 outline-none focus:border-pink-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-pink-600">Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                            className="bg-pink-100 border border-pink-200 rounded-xl px-3.5 py-3 text-sm text-pink-800 outline-none focus:border-pink-500"
                        />
                    </div>
                        <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-pink-600">Confirmar Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            autoComplete="off"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                            className="bg-pink-100 border border-pink-200 rounded-xl px-3.5 py-3 text-sm text-pink-800 outline-none focus:border-pink-500"
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={!username || !password || !confirmPassword || loading}
                        className="bg-pink-500 text-white rounded-2x1 py-3 text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register