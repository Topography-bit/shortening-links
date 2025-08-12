import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LogoutPage({ onLoggedOut }: { onLoggedOut?: () => void }) {
  const [message, setMessage] = useState<string>('Выходим...')
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/logout', { method: 'POST', credentials: 'include' })
        if (!res.ok) throw new Error('Ошибка при выходе')
        localStorage.removeItem('shortit_auth')
        onLoggedOut?.()
        setMessage('Вы вышли из аккаунта')
      } catch (e: any) {
        setMessage(e?.message || 'Ошибка при выходе')
      } finally {
        setTimeout(() => navigate('/'), 800)
      }
    })()
  }, [navigate, onLoggedOut])

  return (
    <div className="max-w-md mx-auto glass p-6 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Выход</h1>
      <p className="text-sm text-slate-300">{message}</p>
    </div>
  )
}


