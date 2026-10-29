import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { C, Decor, STAGE_THEME, type DecorKind } from './brand'
import { AnimatePresence, motion } from 'motion/react'
import { Image as ImageIcon, Lightbulb, Pause, Play, RotateCcw, Timer, X } from 'lucide-react'
import { highlightLine } from '../lib/csharp'
import { timerElapsed, useLesson } from '../store/useLesson'
import { play } from '../lib/sound'
import type { StageId } from '../config/lesson.config'
import { stages } from '../config/lesson.config'

/* ---------- Заголовок слайда ---------- */
export function SlideHeader({
  stage, title, subtitle, icon, right,
}: { stage?: string; title: string; subtitle?: string; icon?: ReactNode; right?: ReactNode }) {
  const [a, b] = useContext(ThemeCtx)
  return (
    <div className="flex items-start justify-between gap-8">
      <div className="flex items-center gap-6">
        {icon && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: -6 }}
            transition={{ type: 'spring', damping: 14 }}
            className="grid h-[88px] w-[88px] shrink-0 place-items-center rounded-[26px] text-white"
            style={{ background: `linear-gradient(140deg, ${a}, ${b})`, boxShadow: `0 16px 34px -14px ${a}` }}
          >
            <span className="rotate-6">{icon}</span>
          </motion.div>
        )}
        <div>
          {stage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-2 inline-flex items-center gap-2 rounded-full px-4 py-1 text-[18px] font-bold uppercase tracking-[0.12em]"
              style={{ background: `${a}1a`, color: a }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: a }} />
              {stage}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[54px] font-extrabold leading-[1.06] tracking-tight text-navy"
          >
            {title}
          </motion.h1>
          <motion.div
            className="mt-2 h-[6px] rounded-full"
            style={{ background: `linear-gradient(90deg, ${a}, ${b})` }}
            initial={{ width: 0 }} animate={{ width: 120 }} transition={{ delay: 0.25, duration: 0.6 }}
          />
          {subtitle && <p className="mt-2 text-[24px] text-muted">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

/* ---------- Блок кода C# ---------- */
export function CodeBlock({
  code, title = 'Form1.cs', highlight = [], fontSize = 20, className = '', maxLines, lang = 'C#',
}: {
  code: string; title?: string; highlight?: number[]; fontSize?: number; className?: string; maxLines?: number; lang?: string
}) {
  const lines = code.replace(/\n$/, '').split('\n')
  const shown = maxLines ? lines.slice(0, maxLines) : lines
  return (
    <div className={`overflow-hidden rounded-[18px] bg-[#1e1e1e] shadow-lift ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#252526] px-5 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[15px] text-white/60">{title}</span>
        <span className="ml-auto rounded-md bg-[#68217a] px-2 py-0.5 font-mono text-[13px] font-bold text-white">{lang}</span>
      </div>
      <pre className="py-3 font-mono leading-[1.55]" style={{ fontSize }}>
        {shown.map((l, i) => {
          const on = highlight.includes(i + 1)
          return (
            <div
              key={i}
              className={`flex pr-5 transition-colors duration-300 ${on ? 'bg-[#264f78]/80' : ''}`}
            >
              <span className={`w-12 shrink-0 select-none pr-4 text-right ${on ? 'text-[#c6c6c6]' : 'text-[#858585]'}`}>
                {i + 1}
              </span>
              <code className="whitespace-pre">{highlightLine(l)}</code>
            </div>
          )
        })}
      </pre>
    </div>
  )
}

/* ---------- Окно Windows Forms (демонстрация в браузере) ---------- */
export function WinWindow({
  title, children, width, bg = '#f0f0f0', onClose, className = '', bodyClass = '', active = true,
}: {
  title: string; children: ReactNode; width?: number; bg?: string; onClose?: () => void
  className?: string; bodyClass?: string; active?: boolean
}) {
  return (
    <div
      className={`overflow-hidden border shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] ${active ? 'border-[#1883d7]' : 'border-[#aaa]'} ${className}`}
      style={{ width, fontFamily: "'Segoe UI', var(--font-sans)" }}
    >
      <div className="flex h-[44px] items-center bg-white pl-3 text-[17px] text-[#111]">
        <FormIcon />
        <span className="ml-2.5 truncate">{title}</span>
        <div className="ml-auto flex h-full">
          <span className="grid w-[54px] place-items-center text-[#333]">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 6h10" stroke="currentColor" /></svg>
          </span>
          <span className="grid w-[54px] place-items-center text-[#333]">
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" /></svg>
          </span>
          <button
            type="button"
            onClick={onClose}
            className={`grid w-[54px] place-items-center text-[#333] ${onClose ? 'hover:bg-[#e81123] hover:text-white' : 'cursor-default'}`}
            aria-label="Жабу"
          >
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.1" /></svg>
          </button>
        </div>
      </div>
      <div className={`relative ${bodyClass}`} style={{ background: bg, transition: 'background-color 0.6s ease' }}>
        {children}
      </div>
    </div>
  )
}

export function FormIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <rect x="1" y="2" width="14" height="12" rx="1" fill="#fff" stroke="#3b6fb6" />
      <rect x="1" y="2" width="14" height="3" fill="#3b6fb6" />
      <rect x="3" y="7" width="5" height="2" fill="#f3b33d" />
      <rect x="3" y="10" width="9" height="2" fill="#9cc3ea" />
    </svg>
  )
}

/* ---------- Пометка «демонстрация в браузере» ---------- */
export function DemoNote({ children = 'Браузердегі демонстрация — нақты C# бағдарламасы емес' }: { children?: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-4 py-1.5 text-[16px] font-medium text-[#9a5a06]">
      <span className="h-2 w-2 rounded-full bg-amber" />
      {children}
    </div>
  )
}

export function ProposalTag({ children = 'Ұсынылған нұсқа' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[15px] font-semibold text-violet">
      <Lightbulb size={15} /> {children}
    </span>
  )
}

/* ---------- Таймер задания ---------- */
function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function useTick(active: boolean, every = 250) {
  const [, set] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => set((x) => x + 1), every)
    return () => clearInterval(id)
  }, [active, every])
}

export function TaskTimer({ stage, compact = false, label }: { stage: StageId; compact?: boolean; label?: string }) {
  const t = useLesson((s) => s.timers[stage])
  const minutes = useLesson((s) => s.stageMinutes[stage])
  const toggle = useLesson((s) => s.timerToggle)
  const reset = useLesson((s) => s.timerReset)
  const running = !!t?.runningSince
  useTick(running)
  const total = minutes * 60_000
  const elapsed = timerElapsed(t)
  const left = total - elapsed
  const over = left <= 0 && elapsed > 0
  const pct = total ? Math.min(1, elapsed / total) : 1

  // Сигнал один раз при окончании (слайд не переключается)
  const rang = useRef(false)
  useEffect(() => {
    if (over && running && !rang.current) { rang.current = true; play('end') }
    if (!over) rang.current = false
  }, [over, running])

  const r = compact ? 26 : 34
  const c = 2 * Math.PI * r
  const color = over ? '#dc2626' : left < 60_000 ? '#ea8a0c' : '#0d9488'
  const name = label ?? stages.find((s) => s.id === stage)?.title

  return (
    <div className={`card flex items-center ${compact ? 'gap-3 px-3 py-2' : 'gap-4 px-4 py-3'}`}>
      <svg width={(r + 6) * 2} height={(r + 6) * 2} className="-rotate-90">
        <circle cx={r + 6} cy={r + 6} r={r} fill="none" stroke="#e6edf6" strokeWidth="7" />
        <circle
          cx={r + 6} cy={r + 6} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * pct} style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>
      <div className="min-w-[118px]">
        <div className="flex items-center gap-1.5 text-[14px] font-semibold uppercase tracking-wide text-muted">
          <Timer size={15} /> {over ? 'Уақыт бітті' : `${minutes} мин`}
        </div>
        <div className={`font-mono font-bold tabular-nums ${compact ? 'text-[28px]' : 'text-[36px]'}`} style={{ color: over ? '#dc2626' : '#0f2a5f' }}>
          {over ? `+${fmt(-left)}` : fmt(left)}
        </div>
        {!compact && name && <div className="max-w-[170px] truncate text-[13px] text-muted">{name}</div>}
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" className="btn btn-primary h-11 w-11 !rounded-xl" onClick={() => { toggle(stage); play('click') }} aria-label="Таймер">
          {running ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button type="button" className="btn btn-ghost h-11 w-11 !rounded-xl" onClick={() => reset(stage)} aria-label="Қайта бастау">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  )
}

/* ---------- Рисунок из Word-документа ---------- */
export function DocFigure({ src, caption, label = 'Құжаттағы сурет' }: { src: string; caption: string; label?: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  // окно выводится в слой поверх таймера и навигации
  const root = typeof document !== 'undefined' ? document.getElementById('stage-overlay-root') : null
  const overlay = (
      <AnimatePresence>
        {open && (
          <motion.div
            className="pointer-events-auto absolute inset-0 grid place-items-center bg-navy/60 p-16 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.figure
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              className="card max-h-full max-w-full p-5" onClick={(e) => e.stopPropagation()}
            >
              <img src={src} alt={caption} className="h-[820px] w-auto max-w-[1500px] rounded-lg object-contain" />
              <figcaption className="mt-3 flex items-center justify-between gap-6 text-[20px] text-muted">
                <span>{caption}</span>
                <button type="button" className="btn btn-ghost h-11 px-4" onClick={() => setOpen(false)}>
                  <X size={18} /> Жабу
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
  )
  return (
    <>
      <button type="button" className="btn btn-ghost h-12 px-4 text-[17px]" onClick={() => setOpen(true)}>
        <ImageIcon size={19} /> {label}
      </button>
      {root ? createPortal(overlay, root) : overlay}
    </>
  )
}

/* ---------- Модальное окно ---------- */
export function Modal({ open, onClose, title, children, width = 1100 }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-navy/55 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
            className="card max-h-[960px] overflow-hidden" style={{ width }} onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-8 py-5">
              <h3 className="text-[30px] font-bold text-navy">{title}</h3>
              <button type="button" className="btn btn-ghost h-12 w-12" onClick={onClose} aria-label="Жабу"><X /></button>
            </div>
            <div className="scroll-thin max-h-[860px] overflow-auto p-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Общая разметка слайда: фон этапа + контент ---------- */
const ThemeCtx = createContext<string[]>([C.blue, C.violet, C.teal])
export const useTheme = () => useContext(ThemeCtx)

export function Slide({ children, className = '', stage, decor }: { children: ReactNode; className?: string; stage?: StageId; decor?: DecorKind }) {
  const theme = stage ? STAGE_THEME[stage] : { colors: [C.blue, C.violet, C.teal], decor: 'blobs' as DecorKind }
  return (
    <ThemeCtx.Provider value={theme.colors}>
      <div className="absolute inset-0">
        <Decor kind={decor ?? theme.decor} colors={theme.colors} />
        <div className={`absolute inset-0 flex flex-col px-20 pb-[84px] pt-[84px] ${className}`}>{children}</div>
      </div>
    </ThemeCtx.Provider>
  )
}
