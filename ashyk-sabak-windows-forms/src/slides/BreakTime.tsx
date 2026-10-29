import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Frown, Brain, HandFist, Laugh, RotateCcw, Trophy, Music } from 'lucide-react'
import { breakTime } from '../config/lesson.config'
import { useSlideState } from '../store/useLesson'
import { DocFigure, Slide, SlideHeader, TaskTimer } from '../components/ui'
import { Burst, C } from '../components/brand'
import { play } from '../lib/sound'

// «Бағдарламашының көңіл күйі» мини-флешмобы [WORD]
const ICONS = [Laugh, Frown, Brain, HandFist, Trophy]
const COLORS = [C.teal, C.coral, C.blue, C.orange, C.violet]
const CODE = ['Build succeeded ✓', 'Console.WriteLine("…")  ← ;', 'button1_Click ✕', 'Error → Fixed ✓', 'Қосымша сәтті жұмыс істейді!']

export default function BreakTime() {
  const [idx, setIdx] = useSlideState('break.idx', -1)
  const total = breakTime.situations.length
  const go = (i: number) => { setIdx(Math.max(-1, Math.min(total - 1, i))); play(i === total - 1 ? 'success' : 'reveal') }
  const cur = idx >= 0 ? breakTime.situations[idx] : null
  const Icon = idx >= 0 ? ICONS[idx] : Music
  const color = idx >= 0 ? COLORS[idx] : C.violet

  return (
    <Slide stage="break">
      <SlideHeader stage={`10 · Сергіту сәті · ${breakTime.subtitle}`} title={breakTime.topic} icon={<Music size={44} />} right={<TaskTimer stage="break" compact />} />
      <p className="mt-3 text-[24px] text-muted">{breakTime.intro}</p>

      <div className="mt-6 grid flex-1 grid-cols-[1fr_620px] gap-9">
        <div className="flex flex-col">
          {/* текущая ситуация */}
          <div className="relative flex-1">
            <AnimatePresence initial={false}>
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.85, rotate: -3, y: 30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, rotate: 2, y: -16, transition: { duration: 0.25 } }}
                transition={{ type: 'spring', damping: 16, stiffness: 150 }}
                className="absolute inset-0 flex items-center gap-10 overflow-hidden rounded-[40px] px-14 text-white"
                style={{ background: `linear-gradient(140deg, ${color}, ${color}cc)`, boxShadow: `0 30px 60px -28px ${color}` }}
              >
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
                <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/10" />
                <motion.div
                  animate={cur ? { rotate: [0, -10, 10, -6, 0], scale: [1, 1.12, 1] } : { y: [0, -10, 0] }}
                  transition={cur ? { duration: 1.2, delay: 0.3 } : { repeat: Infinity, duration: 3 }}
                  className="relative grid h-[200px] w-[200px] shrink-0 place-items-center rounded-[48px] bg-white/20"
                >
                  <Icon size={120} strokeWidth={1.6} />
                </motion.div>
                <div className="relative">
                  {cur ? (
                    <>
                      <div className="text-[22px] font-bold uppercase tracking-[0.18em] text-white/75">{idx + 1}-жағдай</div>
                      {/* «речевой пузырь» */}
                      <div className="relative mt-3 rounded-[30px] bg-white px-9 py-6 text-[50px] font-black leading-tight text-navy shadow-lift">
                        «{cur.say}»
                        <span className="absolute -left-4 bottom-8 h-8 w-8 rotate-45 bg-white" />
                      </div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                        className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/20 px-6 py-3 text-[32px] font-bold">
                        → {cur.move}
                      </motion.div>
                      <div className="mt-5 font-mono text-[22px] text-white/80">{CODE[idx]}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-[56px] font-black leading-tight">Дайынсыздар ма?</div>
                      <div className="mt-3 text-[28px] text-white/85">Жағдайды тыңдап, көңіл күйді қимылмен көрсетеміз!</div>
                    </>
                  )}
                </div>
                {idx === total - 1 && <Burst trigger="done" />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* управление и прогресс */}
          <div className="mt-6 flex items-center gap-3">
            <button type="button" className="btn btn-ghost h-16 w-16" disabled={idx < 0} onClick={() => go(idx - 1)} aria-label="Артқа"><ChevronLeft size={28} /></button>
            <div className="flex flex-1 gap-2.5">
              {breakTime.situations.map((s, i) => {
                const I = ICONS[i]
                return (
                  <button key={s.say} type="button" onClick={() => go(i)}
                    className="flex flex-1 items-center gap-2 rounded-2xl px-3 py-3 text-left text-[16px] font-semibold leading-tight transition"
                    style={i === idx ? { background: COLORS[i], color: 'white' } : i < idx ? { background: `${COLORS[i]}22`, color: COLORS[i] } : { background: 'white', color: '#64748b', boxShadow: 'inset 0 0 0 2px #e2e8f0' }}>
                    <I size={22} className="shrink-0" /> <span className="line-clamp-2">{s.say}</span>
                  </button>
                )
              })}
            </div>
            {idx < total - 1 ? (
              <button type="button" className="btn btn-primary h-16 px-7 text-[22px]" onClick={() => go(idx + 1)}>
                {idx < 0 ? 'Бастау' : 'Келесі'} <ChevronRight size={26} />
              </button>
            ) : (
              <button type="button" className="btn btn-ghost h-16 px-6 text-[20px]" onClick={() => setIdx(-1)}><RotateCcw size={22} /> Қайта</button>
            )}
          </div>
        </div>

        {/* персонаж текущей ситуации (фрагмент коллажа из Word) */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4">
          <div className="relative flex-1 overflow-hidden rounded-[34px] border-[6px] border-white bg-white shadow-lift"
            style={{ boxShadow: `0 26px 50px -26px ${color}` }}>
            <AnimatePresence initial={false}>
              {cur ? (
                <motion.img
                  key={cur.image}
                  src={cur.image}
                  alt={`${idx + 1}-жағдай: ${cur.say}`}
                  className="absolute inset-0 h-full w-full object-contain p-2"
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : (
                <motion.div key="start" className="absolute inset-0 grid place-items-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {/* веер из пяти карточек-превью */}
                  <div className="relative h-[300px] w-[420px]">
                    {breakTime.situations.map((s, i) => (
                      <img key={s.image} src={s.image} alt="" className="absolute left-1/2 top-1/2 h-[220px] w-[190px] rounded-[20px] border-4 border-white object-cover shadow-card"
                        style={{ transform: `translate(-50%, -50%) translateX(${(i - 2) * 62}px) rotate(${(i - 2) * 7}deg)`, zIndex: 5 - Math.abs(i - 2) }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {cur && (
              <span className="absolute left-4 top-4 z-10 rounded-full px-4 py-1.5 text-[18px] font-bold text-white" style={{ background: color }}>
                {idx + 1}-жағдай
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {cur ? (
              <DocFigure key={cur.image} src={cur.image} caption={`${idx + 1}-жағдай: «${cur.say}» — ${cur.move}`} label="Үлкейту" />
            ) : (
              <span className="text-[18px] text-muted">«Бастау» батырмасын басыңыз</span>
            )}
          </div>
        </motion.div>
      </div>
    </Slide>
  )
}
