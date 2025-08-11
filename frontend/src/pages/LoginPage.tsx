import { useState } from 'react'
import { apiPost } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await apiPost<any>('/log_in', { email, username, password })
      navigate('/')
    } catch (err: any) {
      setError(err.message ?? 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto glass p-6 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Войти</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="input" placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="input" placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn-primary w-full" disabled={loading}>Войти</button>
      </form>
      {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
    </div>
  )
}



