export default function QRModal({ url, onClose }: { url: string, onClose: () => void }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-slate-900 font-semibold mb-3">QR для вашей ссылки</h3>
        <div className="grid place-items-center">
          <img src={src} alt="QR" className="rounded" width={240} height={240} />
        </div>
        <a className="mt-4 inline-block text-brand-600 hover:underline" href={url} target="_blank" rel="noreferrer">{url}</a>
        <div className="mt-6 flex justify-end">
          <button className="px-3 py-1.5 rounded-md bg-slate-900 text-white" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  )
}


