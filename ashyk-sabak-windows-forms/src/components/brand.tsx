import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { StageId } from '../config/lesson.config'

/* ============================================================
 *  Палитра презентации
 * ============================================================ */
export const C = {
  blue: '#2563eb',
  blueSoft: '#dbeafe',
  violet: '#7c3aed',
  violetSoft: '#ede9fe',
  teal: '#0fb5a6',
  tealSoft: '#ccfbf1',
  orange: '#f97316',
  orangeSoft: '#ffedd5',
  yellow: '#fbbf24',
  yellowSoft: '#fef3c7',
  coral: '#fb7185',
  coralSoft: '#ffe4e6',
  navy: '#14306b',
} as const

/* ============================================================
 *  Стилизованные логотипы (векторные, без внешних файлов)
 * ============================================================ */
export function CSharpLogo({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-label="C#">
      <defs>
        <linearGradient id="cs-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b4dff" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <path d="M32 3 L57 17.5 V46.5 L32 61 L7 46.5 V17.5 Z" fill="url(#cs-g)" />
      <path d="M32 3 L57 17.5 V46.5 L32 32 Z" fill="#000" opacity="0.12" />
      <text x="29" y="41" textAnchor="middle" fontSize="23" fontWeight="800" fill="white" fontFamily="Inter Variable, Arial">C</text>
      <text x="44" y="38" textAnchor="middle" fontSize="15" fontWeight="800" fill="white" fontFamily="Inter Variable, Arial">#</text>
    </svg>
  )
}

export function VsLogo({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-label="Visual Studio">
      <defs>
        <linearGradient id="vs-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a970ff" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <path d="M45 4 L58 10 V54 L45 60 L20 38 L10 46 L5 43 V21 L10 18 L20 26 Z M45 19 L31 32 L45 45 Z M10 25 V39 L17 32 Z" fill="url(#vs-g)" fillRule="evenodd" />
    </svg>
  )
}

export function WinLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  const s = size / 2 - 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-label="Windows">
      <rect x="0" y="0" width={s} height={s} rx="2" fill="#f25022" />
      <rect x={s + 4} y="0" width={s} height={s} rx="2" fill="#7fba00" />
      <rect x="0" y={s + 4} width={s} height={s} rx="2" fill="#00a4ef" />
      <rect x={s + 4} y={s + 4} width={s} height={s} rx="2" fill="#ffb900" />
    </svg>
  )
}

/* ============================================================
 *  Иллюстрация: монитор с формой Windows Forms и кодом
 * ============================================================ */
export function ComputerIllustration({ width = 520 }: { width?: number }) {
  const [c, setC] = useState(0)
  const colors = ['#2563eb', '#fb7185', '#fbbf24', '#0fb5a6']
  useEffect(() => {
    const id = setInterval(() => setC((x) => (x + 1) % colors.length), 2200)
    return () => clearInterval(id)
  }, [colors.length])
  return (
    <div style={{ width }} className="relative">
      {/* монитор */}
      <div className="rounded-[22px] bg-gradient-to-b from-[#e9eefb] to-[#cdd8f1] p-3 shadow-[0_30px_60px_-25px_rgba(37,99,235,0.45)]">
        <div className="overflow-hidden rounded-[14px] bg-white">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-3 py-1.5 text-[13px] font-semibold text-white">
            <VsLogo size={18} /> Visual Studio — Form1.cs [Конструктор]
          </div>
          <div className="grid grid-cols-[92px_1fr] gap-2 bg-[#f4f7ff] p-2">
            <div className="space-y-1.5 rounded-lg bg-white p-2 text-[11px] text-[#334]">
              {['Button', 'Label', 'TextBox', 'CheckBox'].map((t, i) => (
                <div key={t} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: [C.blue, C.violet, C.teal, C.orange][i] }} />{t}
                </div>
              ))}
            </div>
            <div className="grid place-items-center rounded-lg bg-white py-3">
              <div className="w-[85%] overflow-hidden rounded border border-[#1883d7] shadow">
                <div className="bg-white px-2 py-1 text-[11px]">Form1</div>
                <motion.div className="flex h-[92px] items-start justify-center gap-2 p-3" animate={{ backgroundColor: colors[c] }} transition={{ duration: 0.8 }}>
                  {['Көк', 'Қызыл', 'Сары'].map((t) => <span key={t} className="win-btn px-2 py-0.5 text-[11px]">{t}</span>)}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* подставка */}
      <div className="mx-auto h-8 w-24 bg-gradient-to-b from-[#c4d0ec] to-[#aebde3]" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} />
      <div className="mx-auto h-3 w-48 rounded-full bg-[#b8c6e8]" />
    </div>
  )
}

/* ============================================================
 *  Плавающий фрагмент кода (светлая «таблетка»)
 * ============================================================ */
export function CodeChip({ children, color = C.violet, style, delay = 0, className = '' }: { children: ReactNode; color?: string; style?: CSSProperties; delay?: number; className?: string }) {
  return (
    <motion.div
      className={`absolute flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2.5 font-mono text-[17px] font-semibold shadow-[0_12px_30px_-12px_rgba(20,48,107,0.35)] backdrop-blur ${className}`}
      style={{ color, ...style }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ opacity: { delay, duration: 0.6 }, y: { delay, duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {children}
    </motion.div>
  )
}

/* ============================================================
 *  Декоративные фоны слайдов
 * ============================================================ */
export type DecorKind = 'blobs' | 'geo' | 'code' | 'rays' | 'grid' | 'waves'

export function Decor({ kind = 'blobs', colors = [C.blue, C.violet, C.teal] }: { kind?: DecorKind; colors?: string[] }) {
  const [a, b, c] = [colors[0], colors[1] ?? colors[0], colors[2] ?? colors[0]]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* базовый светлый градиент с оттенком этапа */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #ffffff 0%, ${a}0d 45%, ${b}12 100%)` }} />
      {kind === 'blobs' && (
        <>
          <Blob color={a} size={720} style={{ right: -220, top: -260 }} />
          <Blob color={b} size={560} style={{ left: -200, bottom: -260 }} delay={1} />
          <Blob color={c} size={300} style={{ right: 260, bottom: -150 }} delay={2} />
        </>
      )}
      {kind === 'geo' && (
        <>
          <motion.div className="absolute rounded-[60px]" style={{ width: 420, height: 420, right: -120, top: -140, background: `${a}1f`, rotate: 18 }} animate={{ rotate: [18, 26, 18] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="absolute rounded-full border-[28px]" style={{ width: 360, height: 360, left: -140, bottom: -150, borderColor: `${b}22` }} />
          <svg className="absolute" style={{ right: 140, bottom: 90 }} width="120" height="104" viewBox="0 0 120 104"><path d="M60 0 L120 104 H0 Z" fill={`${c}26`} /></svg>
          <Plus color={b} style={{ left: 760, top: 40 }} />
          <Plus color={a} style={{ right: 520, bottom: 110 }} />
          <Dots color={c} style={{ left: 60, top: 260 }} />
        </>
      )}
      {kind === 'code' && (
        <>
          <Blob color={a} size={600} style={{ right: -200, top: -240 }} />
          <div className="absolute font-mono text-[120px] font-black leading-none" style={{ right: 60, bottom: 70, color: `${b}12` }}>{'{ }'}</div>
          <div className="absolute font-mono text-[90px] font-black leading-none" style={{ left: 40, bottom: 110, color: `${c}14` }}>{'</>'}</div>
          <Dots color={b} style={{ right: 380, top: 30 }} />
        </>
      )}
      {kind === 'rays' && (
        <>
          <motion.div
            className="absolute left-1/2 top-1/2 h-[2600px] w-[2600px] -translate-x-1/2 -translate-y-1/2"
            style={{ background: `repeating-conic-gradient(${a}10 0deg 9deg, transparent 9deg 18deg)` }}
            animate={{ rotate: 360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          />
          <Blob color={b} size={520} style={{ left: -160, top: -200 }} />
          <Blob color={c} size={460} style={{ right: -140, bottom: -200 }} delay={1.5} />
        </>
      )}
      {kind === 'grid' && (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${a}10 1px, transparent 1px), linear-gradient(90deg, ${a}10 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
          <Blob color={b} size={520} style={{ right: -180, top: -220 }} />
          <Blob color={c} size={380} style={{ left: -120, bottom: -180 }} delay={1} />
        </>
      )}
      {kind === 'waves' && (
        <>
          <svg className="absolute bottom-0 left-0" width="1920" height="360" viewBox="0 0 1920 360" preserveAspectRatio="none">
            <path d="M0 220 C 400 120, 700 320, 1100 210 S 1700 120, 1920 200 V360 H0 Z" fill={`${a}14`} />
            <path d="M0 290 C 500 210, 900 360, 1300 270 S 1800 230, 1920 280 V360 H0 Z" fill={`${b}14`} />
          </svg>
          <Blob color={c} size={520} style={{ right: -160, top: -220 }} />
        </>
      )}
    </div>
  )
}

function Blob({ color, size, style, delay = 0 }: { color: string; size: number; style: CSSProperties; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: size, height: size, background: `radial-gradient(circle at 35% 35%, ${color}38, ${color}10 60%, transparent 72%)`, ...style }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

function Plus({ color, style }: { color: string; style: CSSProperties }) {
  return (
    <svg className="absolute" style={style} width="44" height="44" viewBox="0 0 44 44">
      <path d="M22 4 V40 M4 22 H40" stroke={`${color}55`} strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

function Dots({ color, style }: { color: string; style: CSSProperties }) {
  return (
    <div className="absolute grid grid-cols-6 gap-3" style={style}>
      {Array.from({ length: 24 }).map((_, i) => <span key={i} className="h-2 w-2 rounded-full" style={{ background: `${color}40` }} />)}
    </div>
  )
}

/* ============================================================
 *  Короткий «салют» для правильного ответа / раскрытия
 * ============================================================ */
export function Burst({ trigger, colors = [C.blue, C.violet, C.teal, C.orange, C.yellow, C.coral] }: { trigger: unknown; colors?: string[] }) {
  const [key, setKey] = useState(0)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!trigger) return
    setKey((k) => k + 1)
    setShow(true)
    const t = setTimeout(() => setShow(false), 1300)
    return () => clearTimeout(t)
  }, [trigger])
  if (!show) return null
  return (
    <div key={key} className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      {Array.from({ length: 22 }).map((_, i) => {
        const ang = (i / 22) * Math.PI * 2
        const dist = 160 + (i % 4) * 50
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 block"
            style={{ width: i % 3 ? 12 : 16, height: i % 3 ? 12 : 8, background: colors[i % colors.length], borderRadius: i % 2 ? 99 : 3 }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{ x: Math.cos(ang) * dist, y: Math.sin(ang) * dist + 40, opacity: 0, rotate: 240, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.15, 0.8, 0.3, 1] }}
          />
        )
      })}
    </div>
  )
}

/* ============================================================
 *  Тема каждого этапа: цвета и тип фона
 * ============================================================ */
export const STAGE_THEME: Record<StageId, { colors: string[]; decor: DecorKind }> = {
  org: { colors: [C.coral, C.orange, C.yellow], decor: 'blobs' },
  teams: { colors: [C.blue, C.teal, C.violet], decor: 'geo' },
  homeworkCheck: { colors: [C.orange, C.yellow, C.coral], decor: 'rays' },
  puzzle: { colors: [C.violet, C.teal, C.blue], decor: 'geo' },
  goals: { colors: [C.blue, C.teal, C.violet], decor: 'waves' },
  newTopic: { colors: [C.violet, C.blue, C.teal], decor: 'code' },
  demo: { colors: [C.teal, C.blue, C.violet], decor: 'grid' },
  practice1: { colors: [C.blue, C.violet, C.orange], decor: 'grid' },
  practice2: { colors: [C.teal, C.blue, C.coral], decor: 'grid' },
  break: { colors: [C.coral, C.violet, C.yellow], decor: 'waves' },
  consolidation: { colors: [C.violet, C.orange, C.blue], decor: 'rays' },
  assessment: { colors: [C.yellow, C.blue, C.teal], decor: 'geo' },
  feedback: { colors: [C.orange, C.yellow, C.coral], decor: 'rays' },
  finish: { colors: [C.blue, C.teal, C.coral], decor: 'blobs' },
}
