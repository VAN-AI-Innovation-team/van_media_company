import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

const AUTO_DISMISS_MS = { ok: 3500, err: 6000 }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (type, text) => {
      const id = nextId.current++
      setToasts((prev) => [...prev, { id, type, text }])
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS[type])
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="outreach-toasts" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`outreach-toast outreach-toast--${toast.type}`}>
            <span>{toast.text}</span>
            <button type="button" aria-label="닫기" onClick={() => dismiss(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const push = useContext(ToastContext)
  if (!push) throw new Error('useToast는 ToastProvider 안에서만 사용할 수 있습니다.')
  return push
}
