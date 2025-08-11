import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyPage from './pages/VerifyPage'
import DashboardPage from './pages/DashboardPage'
import { useEffect } from 'react'

function Nav() {
  const { pathname } = useLocation()
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-brand-500 grid place-content-center">
            <span className="text-white font-black">S</span>
          </div>
          <span className="font-bold">ShortIt</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className={pathname === '/' ? 'text-white' : 'text-slate-300 hover:text-white'} to="/">Главная</Link>
          <Link className={pathname === '/dashboard' ? 'text-white' : 'text-slate-300 hover:text-white'} to="/dashboard">Мои ссылки</Link>
          <Link className={pathname === '/login' ? 'text-white' : 'text-slate-300 hover:text-white'} to="/login">Войти</Link>
          <Link className={pathname === '/register' ? 'text-white' : 'text-slate-300 hover:text-white'} to="/register">Регистрация</Link>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  useEffect(() => {
    // Try to refresh access token silently on mount if backend supports it
    fetch('/refresh', { method: 'POST', credentials: 'include' }).catch(() => {})
  }, [])
  return (
    <div className="min-h-full">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} ShortIt</footer>
    </div>
  )
}


