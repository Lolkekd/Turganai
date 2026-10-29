import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { FileVideo, Maximize, Play, X } from 'lucide-react'
import { C } from './brand'
import { play } from '../lib/sound'

/** Видео поверх слайда. Файл ищется рядом с index.html по пути `src` (например, videos/adal-1.mp4). */
export function VideoModal({ open, src, title, color = C.violet, onClose }: {
  open: boolean; src: string; title: string; color?: string; onClose: () => void
}) {
  const root = typeof document !== 'undefined' ? document.getElementById('stage-overlay-root') : null
  const node = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto absolute inset-0 grid place-items-center bg-navy/45 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, y: 60, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 18, stiffness: 160 }}
            className="relative rounded-[36px] p-[6px]" onClick={(e) => e.stopPropagation()}
            style={{ background: `linear-gradient(120deg, ${color}, ${C.violet}, ${C.blue})`, boxShadow: `0 40px 90px -30px ${color}` }}
          >
            <Player src={src} title={title} color={color} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
  return root ? createPortal(node, root) : node
}

function Player({ src, title, color, onClose }: { src: string; title: string; color: string; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const start = () => {
    play('click')
    setStarted(true)
    void ref.current?.play().catch(() => {})
  }

  return (
    <div className="relative w-[1400px] overflow-hidden rounded-[30px] bg-white">
      <div className="flex items-center gap-4 px-7 py-4">
        <span className="h-4 w-4 rounded-full" style={{ background: color }} />
        <span className="text-[28px] font-extrabold text-navy">{title}</span>
        <div className="ml-auto flex gap-2">
          {state === 'ready' && (
            <button type="button" className="btn btn-ghost h-12 px-4 text-[18px]" onClick={() => void ref.current?.requestFullscreen?.().catch(() => {})}>
              <Maximize size={19} /> Толық экран
            </button>
          )}
          <button type="button" className="btn btn-ghost h-12 w-12" onClick={onClose} aria-label="Жабу"><X /></button>
        </div>
      </div>
      <div className="relative h-[740px] bg-[#0f172a]">
        <video
          ref={ref} src={src} className="h-full w-full object-contain" controls={started} preload="metadata" playsInline
          onLoadedMetadata={() => setState('ready')} onError={() => setState('missing')}
        />
        {state === 'ready' && !started && (
          <button type="button" onClick={start} className="video-start absolute inset-0 grid place-items-center bg-black/25" aria-label="Ойнату">
            <motion.span whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              className="grid h-[150px] w-[150px] place-items-center rounded-full text-white shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.coral})` }}>
              <Play size={70} fill="white" className="ml-2" />
            </motion.span>
          </button>
        )}
        {state === 'missing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-[#fff7ed] via-white to-[#f5f3ff] text-center">
            <div className="grid h-28 w-28 place-items-center rounded-[30px] text-white shadow-lift" style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.coral})` }}>
              <FileVideo size={60} />
            </div>
            <div className="text-[34px] font-extrabold text-navy">Бейнеролик осында көрсетіледі</div>
            <div className="text-[22px] text-muted">
              Файлды мына жерге салыңыз: <code className="rounded-lg bg-paper px-3 py-1 font-mono text-violet">presentation/{src}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
