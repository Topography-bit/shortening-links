import { useEffect, useState } from 'react'

export default function Toast({ text, onDone }: { text: string, onDone?: () => void }) {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setOpen(false); onDone?.() }, 2000)
    return () => clearTimeout(t)
  }, [onDone])
  if (!open) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-lg text-sm">
      {text}
    </div>
  )
}



