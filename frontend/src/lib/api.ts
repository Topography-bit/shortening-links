export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    let message = 'Request failed'
    try {
      const data = await res.json()
      const d = (data as any)
      if (d && typeof d === 'object') {
        const det = d.detail ?? d.message ?? d.error ?? d.msg
        message = typeof det === 'string' ? det : JSON.stringify(det ?? d)
      }
    } catch {}
    throw new Error(message)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    return (await res.json()) as T
  }
  // some endpoints return plain text
  return (await res.text()) as unknown as T
}

export async function apiPostForm<T>(path: string, formData: Record<string, string>): Promise<T> {
  const body = new URLSearchParams(formData)
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    body
  })
  if (!res.ok) {
    let message = 'Request failed'
    try {
      const data = await res.json()
      const d = (data as any)
      if (d && typeof d === 'object') {
        const det = d.detail ?? d.message ?? d.error ?? d.msg
        message = typeof det === 'string' ? det : JSON.stringify(det ?? d)
      }
    } catch {}
    throw new Error(message)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    return (await res.json()) as T
  }
  return (await res.text()) as unknown as T
}


