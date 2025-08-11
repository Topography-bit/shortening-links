import { useMemo, useState } from 'react'
// Using Vite proxy for same-origin
import Toast from '../components/Toast'
import QRModal from '../components/QRModal'

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState<string | null>(null)

  const historyKey = 'shortit_history'
  const initialHistory = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(historyKey) || '[]') as string[] } catch { return [] as string[] }
  }, [])
  const [items, setItems] = useState<string[]>(initialHistory)

  async function onShorten(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      // FastAPI expects simple str param as query by default
      const res = await fetch(`/short_links?long_url=${encodeURIComponent(url)}`, {
        method: 'POST',
        credentials: 'include'
      })
      if (!res.ok) {
        let msg = 'Request failed'
        try { msg = (await res.json()).detail } catch {}
        throw new Error(msg)
      }
      const ct = res.headers.get('content-type') || ''
      let out: string
      if (ct.includes('application/json')) {
        const data = await res.json()
        out = typeof data === 'string' ? data : String(data)
      } else {
        out = await res.text()
      }
      // sanitize potential JSON string quotes
      if (out.length >= 2 && out.startsWith('"') && out.endsWith('"')) {
        out = out.slice(1, -1)
      }
      setResult(out)
      const next = [out, ...items.filter(i => i !== out)].slice(0, 10)
      localStorage.setItem(historyKey, JSON.stringify(next))
      setItems(next)
    } catch (err: any) {
      setError(err.message ?? 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <section className="glass p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">Сократи ссылку</h1>
        <form onSubmit={onShorten} className="space-y-3">
          <input
            className="input"
            placeholder="Вставьте длинный URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            type="url"
          />
          <button className="btn-primary w-full" disabled={loading}>Сократить</button>
        </form>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
        {result && (
          <div className="mt-4">
            <p className="text-sm text-slate-300 mb-2">Ваша короткая ссылка:</p>
            <div className="flex items-center gap-2">
              <a className="text-brand-400 hover:underline truncate" href={result} target="_blank" rel="noreferrer">{result}</a>
              <button className="btn-primary" onClick={() => navigator.clipboard.writeText(result).then(() => setCopied(true))}>Копировать</button>
              <button className="btn-primary" onClick={() => setQr(result)}>QR</button>
            </div>
          </div>
        )}
        <p className="mt-4 text-xs text-slate-400">Подсказка: необходимо войти в аккаунт, чтобы сократить ссылку.</p>
      </section>

      <aside className="space-y-4">
        <div className="glass p-6 rounded-2xl">
          <h2 className="font-semibold mb-2">Почему ShortIt?</h2>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
            <li>Быстрое сокращение ссылок</li>
            <li>Простой и современный интерфейс</li>
            <li>Безопасная авторизация по куки</li>
          </ul>
        </div>
        <div className="glass p-6 rounded-2xl">
          <h2 className="font-semibold mb-3">История</h2>
          {items.length === 0 ? (
            <p className="text-sm text-slate-400">Нет ссылок</p>
          ) : (
            <ul className="space-y-2">
              {items.map((u) => (
                <li key={u} className="flex items-center justify-between gap-2">
                  <a className="truncate text-brand-400 hover:underline" href={u} target="_blank" rel="noreferrer">{u}</a>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded bg-slate-800" onClick={() => navigator.clipboard.writeText(u).then(() => setCopied(true))}>Копировать</button>
                    <button className="px-2 py-1 rounded bg-slate-800" onClick={() => setQr(u)}>QR</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
    {copied && <Toast text="Скопировано!" onDone={() => setCopied(false)} />}
    {qr && <QRModal url={qr} onClose={() => setQr(null)} />}
    </>
  )
}

