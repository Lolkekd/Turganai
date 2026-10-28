import { AnimatePresence, motion } from 'motion/react'
import { Bot, Bug, CheckCircle2, Eye, EyeOff, HelpCircle, Scale } from 'lucide-react'
import { findError } from '../config/lesson.config'
import { useLesson, useSlideState } from '../store/useLesson'
import { CodeBlock, Slide, SlideHeader, TaskTimer } from '../components/ui'
import { Burst } from '../components/brand'
import { TEAM_COLORS } from './Teams'
import { play } from '../lib/sound'

// Топтық жұмыс «Қатені тап» (ЖИ көмегімен) — задания из новой редакции Word.
// По документу: 1-топ — первый фрагмент, 2-топ — второй фрагмент.
export default function FindError() {
  const names = useLesson((s) => s.teamNames)
  const showAnswers = useLesson((s) => s.showAnswers)
  const [shown, setShown] = useSlideState<boolean[]>('finderr.shown', [false, false])

  return (
    <Slide stage="practice2">
      <SlideHeader stage="9 · Топтық жұмыс · ЖИ көмегімен" title="«Қатені тап»" icon={<Bug size={44} />} right={<TaskTimer stage="practice2" compact />} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mt-4 flex items-center gap-4 rounded-2xl px-6 py-3 text-[19px] font-semibold leading-snug text-[#7c2d12]"
        style={{ background: 'linear-gradient(90deg, #fff7ed, #ffe4e6)' }}>
        <Scale size={26} className="shrink-0 text-[#f97316]" /> {findError.value}
      </motion.div>

      <div className="mt-5 grid flex-1 grid-cols-2 gap-8">
        {findError.teams.map((t, i) => {
          const open = shown[i] || showAnswers
          const color = TEAM_COLORS[i]
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.15 }}
              className="relative flex flex-col overflow-hidden rounded-[30px] bg-white p-6 shadow-lift" style={{ boxShadow: `inset 0 0 0 3px ${color}40, 0 24px 44px -26px ${color}` }}>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl px-4 py-1.5 text-[20px] font-extrabold text-white" style={{ background: color }}>{i + 1}-топ</span>
                <span className="truncate text-[26px] font-extrabold" style={{ color }}>{names[i]}</span>
                <span className="ml-auto flex items-center gap-2 rounded-full bg-[#ede9fe] px-3 py-1 text-[16px] font-bold text-violet"><Bot size={18} /> ЖИ көмекші</span>
              </div>
              <CodeBlock code={t.code} highlight={open ? t.errorLines : []} fontSize={17} className="mt-4" />
              <div className="mt-4 space-y-2">
                {t.questions.map((q) => (
                  <div key={q} className="flex items-start gap-3 text-[22px] font-semibold leading-snug text-navy">
                    <HelpCircle size={24} className="mt-1 shrink-0" style={{ color }} /> {q}
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div key="a" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="rounded-2xl p-4 text-[18px] leading-snug" style={{ background: `${color}12` }}>
                      {t.answer.map((a) => (
                        <div key={a} className="flex items-start gap-2 py-0.5 text-ink"><CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color }} /> {a}</div>
                      ))}
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <code className="rounded-lg bg-white px-3 py-1.5 font-mono text-[17px] text-[#047857]">{t.fixed.replace('\n', '  ')}</code>
                        {!showAnswers && (
                          <button type="button" className="btn btn-ghost h-10 px-3 text-[15px]" onClick={() => setShown(shown.map((x, j) => (j === i ? false : x)))}>
                            <EyeOff size={16} /> Жасыру
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button key="b" type="button" exit={{ opacity: 0 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setShown(shown.map((x, j) => (j === i ? true : x))); play('success') }}
                      className="btn h-14 w-full text-[20px] text-white" style={{ background: color }}>
                      <Eye size={22} /> Жауабын көрсету
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              {shown[i] && <Burst trigger={`fe-${i}`} />}
            </motion.div>
          )
        })}
      </div>
    </Slide>
  )
}
