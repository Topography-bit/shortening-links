import { useMemo, useState } from 'react'
import Toast from '../components/Toast'
import QRModal from '../components/QRModal'

export default function DashboardPage() {
  const historyKey = 'shortit_history'
  const initial = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(historyKey) || '[]') as string[] } catch { return [] as string[] }
  }, [])
  const [items, setItems] = useState<string[]>(initial)
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState<string | null>(null)

  function remove(url: string) {
    const next = items.filter(i => i !== url)
    setItems(next)
    localStorage.setItem(historyKey, JSON.stringify(next))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ваши ссылки</h1>
      <div className="glass rounded-2xl p-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">Пока пусто. Сократите первую ссылку на главной.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {items.map((u) => (
              <div key={u} className="py-3 flex items-center justify-between gap-4">
                <a className="truncate text-brand-400 hover:underline" href={u} target="_blank" rel="noreferrer">{u}</a>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 rounded bg-slate-800" onClick={() => navigator.clipboard.writeText(u.replace(/^\"|\"$/g, '')).then(() => setCopied(true))}>Копировать</button>
                  <button className="px-3 py-1.5 rounded bg-slate-800" onClick={() => setQr(u)}>QR</button>
                  <button className="px-3 py-1.5 rounded bg-red-700" onClick={() => remove(u)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {copied && <Toast text="Скопировано!" onDone={() => setCopied(false)} />}
      {qr && <QRModal url={qr} onClose={() => setQr(null)} />}
    </div>
  )
}



