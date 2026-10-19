import { AnimatePresence, motion } from 'motion/react'
import { BrainCircuit, MessageCircleQuestion, RotateCcw, Sparkles } from 'lucide-react'
import { breakTime } from '../config/lesson.config'
import { useSlideState } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { play } from '../lib/sound'

const COLORS = ['#1d4ed8', '#0d9488', '#7c3aed']

export default function BreakTime() {
  const [open, setOpen] = useSlideState<boolean[]>('break.open', breakTime.questions.map(() => false))
  const next = open.findIndex((o) => !o)
  return (
    <Slide>
      {/* спокойный фон с медленными кругами */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: 520 + i * 220, height: 520 + i * 220, right: -160 - i * 110, top: 120 - i * 110, border: `2px solid ${COLORS[i]}14` }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60 + i * 20, ease: 'linear' }}
          >
            <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `${COLORS[i]}55` }} />
          </motion.div>
        ))}
      </div>
      <SlideHeader stage="10 · Сергіту сәті" title={breakTime.topic} icon={<BrainCircuit size={44} />} right={<TaskTimer stage="break" compact />} />
      <p className="relative mt-3 text-[24px] text-muted">{breakTime.intro}</p>

      <div className="relative mt-8 grid grid-cols-3 gap-7">
        {breakTime.questions.map((q, i) => (
          <button key={q} type="button" onClick={() => { if (!open[i]) { setOpen(open.map((o, j) => (j === i ? true : o))); play('reveal') } }}
            className="relative h-[470px] [perspective:1200px]">
            <motion.div className="absolute inset-0 [transform-style:preserve-3d]" animate={{ rotateY: open[i] ? 180 : 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-[28px] text-white shadow-lift [backface-visibility:hidden]"
                style={{ background: `linear-gradient(150deg, ${COLORS[i]}, ${COLORS[i]}bb)` }}>
                <MessageCircleQuestion size={80} strokeWidth={1.4} />
                <span className="text-[30px] font-bold">{i + 1}-сұрақ</span>
                {i === next && <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[19px] text-white/80">ашу үшін басыңыз</motion.span>}
              </div>
              <div className="absolute inset-0 flex flex-col justify-center rounded-[28px] border-2 bg-white p-9 text-left shadow-lift [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{ borderColor: COLORS[i] }}>
                <span className="text-[19px] font-semibold uppercase tracking-wider" style={{ color: COLORS[i] }}>{i + 1}-сұрақ</span>
                <span className="mt-4 text-[42px] font-bold leading-tight text-navy">{q}</span>
              </div>
            </motion.div>
          </button>
        ))}
      </div>

      <div className="relative mt-auto flex items-center gap-5">
        <AnimatePresence>
          {open.every(Boolean) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 items-center gap-4 rounded-2xl bg-gradient-to-r from-navy to-brand px-8 py-5 text-[26px] font-semibold text-white shadow-lift">
              <motion.span animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }}><Sparkles size={32} className="text-cyan" /></motion.span>
              {breakTime.motto}
            </motion.div>
          )}
        </AnimatePresence>
        <button type="button" className="btn btn-ghost ml-auto h-12 px-4 text-[17px]" onClick={() => setOpen(open.map(() => false))}><RotateCcw size={17} /> Қайта</button>
      </div>
    </Slide>
  )
}
