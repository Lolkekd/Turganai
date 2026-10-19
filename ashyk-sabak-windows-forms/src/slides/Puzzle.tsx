import { motion, AnimatePresence } from 'motion/react'
import { ExternalLink, Eye, HelpCircle, Puzzle as PuzzleIcon, RotateCcw, Sparkles } from 'lucide-react'
import { lessonInfo, puzzleHints } from '../config/lesson.config'
import { useLesson, useSlideState } from '../store/useLesson'
import { FormIcon, Slide, SlideHeader, TaskTimer } from '../components/ui'
import { Burst, VsLogo } from '../components/brand'
import { openExternal } from './Baamboozle'
import { play } from '../lib/sound'

const COLS = 3
const ROWS = 3
const W = 1020
const H = 660
const TILE_COLORS = ['#2563eb', '#7c3aed', '#0fb5a6', '#f97316', '#fb7185', '#fbbf24', '#0ea5e9', '#a855f7', '#10b981']

/** Путь кусочка пазла с «ушками» (чисто декоративная форма) */
function piecePath(c: number, r: number, w: number, h: number) {
  const tab = 0.18
  const top = r === 0 ? 0 : ((c + r) % 2 ? 1 : -1)
  const right = c === COLS - 1 ? 0 : ((c + r) % 2 ? -1 : 1)
  const bottom = r === ROWS - 1 ? 0 : ((c + r + 1) % 2 ? 1 : -1) * -1
  const left = c === 0 ? 0 : ((c + r + 1) % 2 ? -1 : 1) * -1
  const x = c * w
  const y = r * h
  // top (→), right (↓), bottom (←), left (↑) — через поворот системы координат вручную
  const seg = (len: number, dir: number, ax: 'h' | 'v', sign: number) => {
    if (dir === 0) return ax === 'h' ? `l ${len * sign} 0` : `l 0 ${len * sign}`
    const a = len * 0.35 * sign
    const mid = (len - 2 * len * 0.35) * sign
    const t = len * tab * dir
    return ax === 'h'
      ? `l ${a} 0 c 0 ${-t * sign} ${mid} ${-t * sign} ${mid} 0 l ${a} 0`
      : `l 0 ${a} c ${t * sign} 0 ${t * sign} ${mid} 0 ${mid} l 0 ${a}`
  }
  return `M ${x} ${y} ${seg(w, top, 'h', 1)} ${seg(h, right, 'v', 1)} ${seg(w, bottom, 'h', -1)} ${seg(h, left, 'v', -1)} Z`
}

export default function Puzzle() {
  const [open, setOpen] = useSlideState<boolean[]>('puzzle.open', puzzleHints.map(() => false))
  const [revealed, setRevealed] = useSlideState('puzzle.revealed', false)
  const link = useLesson((s) => s.links.learningApps)
  const all = open.every(Boolean)
  const tw = W / COLS
  const th = H / ROWS

  const flip = (i: number) => {
    if (open[i]) return
    const next = open.map((o, j) => (j === i ? true : o))
    setOpen(next)
    play(next.every(Boolean) ? 'success' : 'click')
  }

  return (
    <Slide stage="puzzle">
      <SlideHeader stage="4 · LearningApps · 3 минут" title="Жасырын тақырып" icon={<PuzzleIcon size={44} />} />
      <div className="mt-6 grid flex-1 grid-cols-[1020px_1fr] gap-10">
        <div className="relative" style={{ width: W, height: H }}>
          {/* Скрытое изображение под пазлом */}
          <HiddenPicture revealed={revealed} />
          <Burst trigger={revealed} />
          {/* Части пазла */}
          <svg width={W} height={H} className="absolute inset-0 overflow-visible">
            {puzzleHints.map((_, i) => {
              const c = i % COLS
              const r = Math.floor(i / COLS)
              return (
                <motion.g
                  key={i}
                  style={{ cursor: open[i] ? 'default' : 'pointer', transformOrigin: `${c * tw + tw / 2}px ${r * th + th / 2}px` }}
                  initial={false}
                  animate={open[i] ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => flip(i)}
                  whileHover={open[i] ? undefined : { scale: 1.02 }}
                >
                  <path d={piecePath(c, r, tw, th)} fill={TILE_COLORS[i]} stroke="white" strokeWidth={4} />
                  <text x={c * tw + tw / 2} y={r * th + th / 2 + 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="68" fontWeight="800" opacity="0.9">
                    {i + 1}
                  </text>
                </motion.g>
              )
            })}
          </svg>
          {/* Подсказки, которые остаются видны после открытия */}
          {puzzleHints.map((hint, i) => {
            const c = i % COLS
            const r = Math.floor(i / COLS)
            return (
              <AnimatePresence key={i}>
                {open[i] && !revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.8, x: '-50%' }} animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} exit={{ opacity: 0 }}
                    transition={{ delay: 0.25 }}
                    className="pointer-events-none absolute rounded-xl bg-white/95 px-4 py-2 text-[24px] font-bold text-navy shadow-card"
                    style={{ left: c * tw + tw / 2, top: r * th + th - 36 }}
                  >
                    {hint}
                  </motion.div>
                )}
              </AnimatePresence>
            )
          })}
        </div>

        <div className="flex flex-col gap-5">
          <div className="card p-7">
            <div className="text-[19px] font-semibold uppercase tracking-wider text-cyan">Тапсырма</div>
            <p className="mt-2 text-[25px] leading-snug text-ink">
              Пазлдың бөліктерін ашыңыз. Кілт сөздер мен сурет арқылы бүгінгі сабақтың тақырыбын анықтаңыз.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[20px] text-muted">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-paper">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-brand to-cyan" animate={{ width: `${(open.filter(Boolean).length / open.length) * 100}%` }} />
              </div>
              {open.filter(Boolean).length}/{open.length}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {all && !revealed && (
              <motion.div key="q" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-[24px] bg-gradient-to-br from-violet to-brand p-7 text-white shadow-lift">
                <HelpCircle size={40} className="text-white/70" />
                <div className="mt-2 text-[36px] font-extrabold leading-tight">Бүгінгі сабақтың тақырыбы қандай?</div>
                <button type="button" className="btn mt-5 h-14 w-full bg-white text-[22px] text-violet" onClick={() => { setRevealed(true); play('reveal') }}>
                  <Sparkles size={22} /> Тақырыпты ашу
                </button>
              </motion.div>
            )}
            {revealed && (
              <motion.div key="t" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-[24px] border-2 border-teal bg-white p-7 shadow-lift">
                <div className="text-[19px] font-semibold uppercase tracking-wider text-teal">Сабақтың тақырыбы</div>
                <div className="mt-2 text-[34px] font-extrabold leading-tight text-navy">{lessonInfo.topic}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto flex flex-wrap items-center gap-3">
            <TaskTimer stage="puzzle" compact />
            <div className="flex flex-col gap-2">
              <button type="button" className="btn btn-ghost h-12 px-4 text-[17px]" onClick={() => openExternal(link)} disabled={!link}>
                <ExternalLink size={18} /> LearningApps түпнұсқасы
              </button>
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost h-11 flex-1 px-3 text-[16px]" onClick={() => setOpen(open.map(() => true))}>
                  <Eye size={17} /> Барлығын ашу
                </button>
                <button type="button" className="btn btn-ghost h-11 w-11" title="Қайта бастау" onClick={() => { setOpen(open.map(() => false)); setRevealed(false) }}>
                  <RotateCcw size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/** Изображение, которое постепенно открывается: окно Visual Studio с формой */
function HiddenPicture({ revealed }: { revealed: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[18px] bg-gradient-to-br from-[#e8eef8] to-[#d6e2f3] shadow-inner">
      {/* строка меню VS */}
      <div className="flex h-[54px] items-center gap-4 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 text-[19px] font-semibold text-white">
        <VsLogo size={30} />
        Microsoft Visual Studio · C#
      </div>
      <div className="grid h-[606px] grid-cols-[190px_1fr_270px]">
        <div className="border-r border-[#c9d4e5] bg-white/70 p-4 text-[18px] text-navy">
          <div className="mb-2 font-bold">Toolbox</div>
          {['Button', 'Label', 'TextBox', 'CheckBox', 'ListBox', 'PictureBox'].map((x) => (
            <div key={x} className="py-1.5">▸ {x}</div>
          ))}
        </div>
        <div className="relative grid place-items-center">
          <div className="w-[420px] border border-[#1883d7] bg-white shadow-lift">
            <div className="flex items-center gap-2 px-3 py-2 text-[17px]"><FormIcon /> Form1</div>
            <div className="flex h-[230px] flex-col items-center justify-center gap-4 bg-[#f0f0f0]">
              <span className="text-[22px] text-navy">Сәлем, Windows!</span>
              <span className="win-btn px-8 py-2 text-[20px]">button1</span>
            </div>
          </div>
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-6 bottom-6 rounded-2xl bg-gradient-to-r from-[#7c3aed]/95 to-[#2563eb]/95 px-6 py-4 text-center text-[30px] font-extrabold leading-tight text-white"
              >
                {lessonInfo.topic}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="border-l border-[#c9d4e5] bg-white/70 p-4 text-[18px] text-navy">
          <div className="mb-2 font-bold">Solution Explorer</div>
          {['WindowsForms…', '  Form1.cs', '  Program.cs'].map((x) => (
            <div key={x} className="whitespace-pre py-1">{x}</div>
          ))}
          <div className="mb-2 mt-5 font-bold">Properties</div>
          {['Text', 'BackColor', 'Size'].map((x) => (
            <div key={x} className="py-1">{x}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
