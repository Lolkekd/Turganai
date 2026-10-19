import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, RotateCcw, X } from 'lucide-react'
import { feedback } from '../config/lesson.config'
import { useSlideState } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { play } from '../lib/sound'

const CARD_COLORS = ['#1d4ed8', '#0d9488', '#ea8a0c', '#7c3aed', '#0891b2']
const SCALE_COLORS = ['#16a34a', '#f59e0b', '#dc2626']

interface FState { open: boolean; seen: boolean[]; active: number | null; votes: number[] }

export default function Feedback() {
  const [st, setSt] = useSlideState<FState>('fb.state', { open: false, seen: feedback.questions.map(() => false), active: null, votes: feedback.scale.map(() => 0) })
  const openChest = () => { if (!st.open) { setSt({ ...st, open: true }); play('reveal') } }
  const pick = (i: number) => { setSt({ ...st, active: i, seen: st.seen.map((s, j) => (j === i ? true : s)) }); play('click') }
  const vote = (i: number, d: number) => setSt({ ...st, votes: st.votes.map((v, j) => (j === i ? Math.max(0, v + d) : v)) })

  return (
    <Slide stage="feedback">
      <SlideHeader stage="13 · Кері байланыс · 3 минут" title={`${feedback.method} әдісі`} icon={<span className="text-[44px]">🧰</span>} right={<TaskTimer stage="feedback" compact />} />
      <div className="mt-4 grid flex-1 grid-cols-[1fr_520px] gap-9">
        <div className="relative">
          {/* Сундук */}
          <div className="absolute left-1/2 top-[300px] -translate-x-1/2">
            <Chest open={st.open} onClick={openChest} />
          </div>
          {/* Карточки вопросов */}
          {feedback.questions.map((q, i) => {
            // веер карточек над сундуком
            const x = (i - 2) * 232
            const y = -250 + Math.abs(i - 2) * 45
            return (
              <motion.button
                key={q} type="button" onClick={() => pick(i)}
                className="absolute left-1/2 top-[300px] w-[218px] rounded-2xl border-2 bg-white px-4 py-3 text-left shadow-lift"
                style={{ borderColor: CARD_COLORS[i], marginLeft: -109, pointerEvents: st.open ? 'auto' : 'none' }}
                initial={false}
                animate={st.open ? { x, y: y + 10, opacity: st.seen[i] && st.active !== i ? 0.55 : 1, scale: 1, rotate: (i - 2) * 2 } : { x: 0, y: 60, opacity: 0, scale: 0.3, rotate: 0 }}
                transition={{ type: 'spring', damping: 16, stiffness: 120, delay: st.open ? 0.35 + i * 0.12 : 0 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-[15px] font-bold uppercase tracking-wider" style={{ color: CARD_COLORS[i] }}>{i + 1}-карта</div>
                <div className="text-[19px] font-semibold leading-snug text-navy">{q}</div>
              </motion.button>
            )
          })}
          {!st.open && (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 left-0 right-0 text-center text-[24px] text-muted">
              Сандықты ашу үшін басыңыз
            </motion.div>
          )}
          <AnimatePresence>
            {st.active !== null && (
              <motion.div className="absolute inset-0 z-10 grid place-items-center bg-paper/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSt({ ...st, active: null })}>
                <motion.div initial={{ scale: 0.6, rotate: -6, y: 80 }} animate={{ scale: 1, rotate: 0, y: 0 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', damping: 15 }}
                  className="relative w-[860px] rounded-[30px] p-12 text-white shadow-2xl" style={{ background: `linear-gradient(140deg, ${CARD_COLORS[st.active]}, ${CARD_COLORS[st.active]}cc)` }}>
                  <button type="button" className="absolute right-5 top-5 rounded-xl p-2 text-white/80 hover:bg-white/10" aria-label="Жабу"><X /></button>
                  <div className="text-[22px] font-semibold uppercase tracking-[0.2em] text-white/75">{st.active + 1}-сұрақ</div>
                  <div className="mt-4 text-[58px] font-extrabold leading-tight">{feedback.questions[st.active]}</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <div className="text-[22px] font-bold leading-snug text-navy">{feedback.scaleTitle}</div>
            <div className="mt-4 space-y-3">
              {feedback.scale.map((s, i) => (
                <div key={s} className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: `${SCALE_COLORS[i]}12` }}>
                  <span className="h-10 w-3 rounded-full" style={{ background: SCALE_COLORS[i] }} />
                  <span className="flex-1 text-[23px] font-semibold text-navy">{s}</span>
                  <button type="button" className="btn btn-ghost h-11 w-11" onClick={() => vote(i, -1)}><Minus size={18} /></button>
                  <span className="w-12 text-center font-mono text-[30px] font-bold" style={{ color: SCALE_COLORS[i] }}>{st.votes[i]}</span>
                  <button type="button" className="btn h-11 w-11 text-white" style={{ background: SCALE_COLORS[i] }} onClick={() => { vote(i, 1); play('click') }}><Plus size={18} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[15px] text-muted">Студенттер өз деңгейін көрсетеді, мұғалім санын белгілейді.</div>
          </div>
          <div className="card flex-1 p-6 text-[20px] leading-snug text-ink">
            <div className="font-bold text-navy">Қалай өткіземіз?</div>
            <ol className="mt-2 list-decimal space-y-1 pl-6">
              <li>Сандықты ашамыз.</li>
              <li>Мұғалім картаны таңдайды.</li>
              <li>Студенттер ауызша жауап береді.</li>
            </ol>
          </div>
          <button type="button" className="btn btn-ghost h-14 text-[19px]" onClick={() => setSt({ open: false, seen: feedback.questions.map(() => false), active: null, votes: feedback.scale.map(() => 0) })}>
            <RotateCcw size={19} /> Тапсырманы қайта бастау
          </button>
        </div>
      </div>
    </Slide>
  )
}

function Chest({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <motion.button type="button" onClick={onClick} className="relative block h-[300px] w-[380px]"
      whileHover={open ? undefined : { scale: 1.04 }} animate={open ? {} : { rotate: [0, -2, 2, -2, 0] }} transition={open ? {} : { repeat: Infinity, duration: 2.4, repeatDelay: 1.5 }}>
      <svg viewBox="0 0 380 300" width="380" height="300" className="overflow-visible">
        <defs>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b45309" /><stop offset="1" stopColor="#78350f" /></linearGradient>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#d97706" /></linearGradient>
          <radialGradient id="glow" cx="50%" cy="100%" r="80%"><stop offset="0" stopColor="#fef3c7" stopOpacity="0.95" /><stop offset="1" stopColor="#fef3c7" stopOpacity="0" /></radialGradient>
        </defs>
        {/* свечение */}
        <motion.ellipse cx="190" cy="140" rx="200" ry="150" fill="url(#glow)" initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.6 }} />
        {/* корпус */}
        <rect x="30" y="140" width="320" height="150" rx="16" fill="url(#wood)" />
        <rect x="30" y="140" width="320" height="22" fill="#92400e" />
        <rect x="58" y="140" width="22" height="150" fill="url(#gold)" />
        <rect x="300" y="140" width="22" height="150" fill="url(#gold)" />
        <rect x="30" y="268" width="320" height="22" rx="8" fill="url(#gold)" opacity="0.9" />
        {/* крышка */}
        <motion.g style={{ transformOrigin: '30px 140px', transformBox: 'view-box' }} initial={false} animate={{ rotate: open ? -32 : 0, y: open ? -18 : 0 }} transition={{ type: 'spring', damping: 12, stiffness: 90 }}>
          <path d="M30 140 V95 Q30 40 190 40 Q350 40 350 95 V140 Z" fill="url(#wood)" />
          <path d="M58 140 V74 Q60 52 80 50 V140 Z" fill="url(#gold)" />
          <path d="M300 140 V50 Q320 52 322 74 V140 Z" fill="url(#gold)" />
          <rect x="30" y="128" width="320" height="14" fill="url(#gold)" />
        </motion.g>
        {/* замок */}
        <motion.g initial={false} animate={{ opacity: open ? 0 : 1 }}>
          <rect x="168" y="124" width="44" height="50" rx="8" fill="url(#gold)" stroke="#92400e" strokeWidth="2" />
          <circle cx="190" cy="145" r="6" fill="#78350f" />
          <rect x="187" y="148" width="6" height="14" rx="2" fill="#78350f" />
        </motion.g>
        <text x="190" y="222" textAnchor="middle" fill="#fde68a" fontSize="26" fontWeight="800" fontFamily="Inter Variable, sans-serif">БІЛІМ САНДЫҒЫ</text>
      </svg>
    </motion.button>
  )
}
