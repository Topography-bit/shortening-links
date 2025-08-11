import { useState } from 'react'
// Using direct fetch with query param as FastAPI expects simple query param
import { useNavigate } from 'react-router-dom'

export default function VerifyPage() {
  const [code, setCode] = useState('')
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
      const res = await fetch(`/verify_email?verification_code=${encodeURIComponent(code)}`, {
        method: 'POST',
        credentials: 'include'
      })
      if (!res.ok) {
        let msg = 'Request failed'
        try { msg = (await res.json()).detail } catch {}
        throw new Error(msg)
      }
      const ct = res.headers.get('content-type') || ''
      const data = ct.includes('application/json') ? await res.json() : await res.text()
      const msg = typeof data === 'string' ? data : (data?.detail || data?.message || JSON.stringify(data))
      setMessage(msg)
      navigate('/login')
    } catch (err: any) {
      const emsg = typeof err === 'string' ? err : (err?.message ?? err?.detail ?? (typeof err === 'object' ? JSON.stringify(err) : String(err)) ?? 'Ошибка')
      setError(emsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto glass p-6 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Подтверждение почты</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Код из письма" value={code} onChange={e => setCode(e.target.value)} required />
        <button className="btn-primary w-full" disabled={loading}>Подтвердить</button>
      </form>
      {error && <p className="mt-3 text-red-400 text-sm">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
      {message && <p className="mt-3 text-emerald-400 text-sm">{typeof message === 'string' ? message : JSON.stringify(message)}</p>}
    </div>
  )
}



