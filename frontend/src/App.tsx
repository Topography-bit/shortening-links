import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyPage from './pages/VerifyPage'
import DashboardPage from './pages/DashboardPage'
import LogoutPage from './pages/LogoutPage'
import { useEffect, useRef, useState } from 'react'

function Nav({ authed }: { authed: boolean }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-brand-500 grid place-content-center">
            <span className="text-white font-black">S</span>
          </div>
          <span className="font-bold">ShortIt</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm relative" ref={menuRef}>
          <Link className={pathname === '/' ? 'text-white' : 'text-slate-300 hover:text-white'} to="/">Главная</Link>
          <Link className={pathname === '/dashboard' ? 'text-white' : 'text-slate-300 hover:text-white'} to="/dashboard">Мои ссылки</Link>
          <button type="button" className="text-slate-300 hover:text-white" onClick={() => setOpen(v => !v)}>
            Мой аккаунт
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-slate-900/90 rounded-xl p-2 shadow-lg border border-white/10">
              <Link className="block px-3 py-2 rounded hover:bg-white/5" to="/" onClick={() => setOpen(false)}>Главная</Link>
              <Link className="block px-3 py-2 rounded hover:bg-white/5" to="/dashboard" onClick={() => setOpen(false)}>Мои ссылки</Link>
              {!authed ? (
                <>
                  <Link className="block px-3 py-2 rounded hover:bg-white/5" to="/login" onClick={() => setOpen(false)}>Войти</Link>
                  <Link className="block px-3 py-2 rounded hover:bg-white/5" to="/register" onClick={() => setOpen(false)}>Регистрация</Link>
                </>
              ) : (
                <Link className="block px-3 py-2 rounded hover:bg-white/5 text-red-300" to="/logout" onClick={() => setOpen(false)}>Выйти</Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  const [authed, setAuthed] = useState<boolean>(() => localStorage.getItem('shortit_auth') === '1')

  useEffect(() => {
    // Try to refresh access token silently on mount
    ;(async () => {
      try {
        const res = await fetch('/refresh', { method: 'POST', credentials: 'include' })
        const ok = res.ok
        setAuthed(ok)
        if (ok) {
          localStorage.setItem('shortit_auth', '1')
        } else {
          localStorage.removeItem('shortit_auth')
        }
      } catch {
        setAuthed(false)
        localStorage.removeItem('shortit_auth')
      }
    })()
  }, [])
  return (
    <div className="min-h-full">
      <Nav authed={authed} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage onLoggedIn={() => setAuthed(true)} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/logout" element={<LogoutPage onLoggedOut={() => setAuthed(false)} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} ShortIt</footer>
    </div>
  )
}


