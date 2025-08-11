import { useState } from 'react'
import { apiPost } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const res = await apiPost<any>('/register', { email, username, password })
      const msg = typeof res === 'string' ? res : (res?.detail || res?.message || JSON.stringify(res))
      setMessage(msg)
      navigate('/verify')
    } catch (err: any) {
      setError(err.message ?? 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto glass p-6 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="input" placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="input" placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn-primary w-full" disabled={loading}>Создать аккаунт</button>
      </form>
      {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      {message && <p className="mt-3 text-emerald-400 text-sm">{message}</p>}
    </div>
  )
}



