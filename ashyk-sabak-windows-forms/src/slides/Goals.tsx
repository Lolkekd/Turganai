import { motion } from 'motion/react'
import { FolderPlus, LayoutPanelLeft, FileCode2, MousePointerClick, PlayCircle, Target, Flag } from 'lucide-react'
import { goals, stages } from '../config/lesson.config'
import { useLesson } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { C, STAGE_THEME } from '../components/brand'
import { slides } from '.'

const TASK_ICONS = [FolderPlus, LayoutPanelLeft, FileCode2, MousePointerClick, PlayCircle]
const TASK_COLORS = [C.blue, C.violet, C.teal, C.orange, C.coral]

export default function Goals() {
  const minutes = useLesson((s) => s.stageMinutes)
  const goTo = useLesson((s) => s.goTo)
  const current = stages.findIndex((s) => s.id === 'goals')
  let acc = 0
  return (
    <Slide stage="goals">
      <SlideHeader stage="5 · Сабақтың мақсаты мен жоспары" title="Бүгін не үйренеміз?" icon={<Target size={44} />} right={<TaskTimer stage="goals" compact />} />
      <div className="mt-8 grid grid-cols-[640px_1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-10 text-white shadow-lift"
        >
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full border-[40px] border-white/5" />
          <div className="inline-flex items-center gap-3 rounded-full bg-white/20 px-4 py-1 text-[20px] font-bold uppercase tracking-[0.18em]">
            <Target size={24} /> Мақсаты
          </div>
          <p className="mt-5 text-[36px] font-bold leading-[1.25]">{goals.aim}</p>
        </motion.div>
        <div className="card p-7">
          <div className="mb-3 text-[20px] font-bold uppercase tracking-[0.16em] text-violet">Міндеттері</div>
          <div className="space-y-2.5">
            {goals.tasks.map((t, i) => {
              const Icon = TASK_ICONS[i]
              return (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-5 rounded-2xl px-5 py-3"
                  style={{ background: `${TASK_COLORS[i]}10` }}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white" style={{ background: TASK_COLORS[i], boxShadow: `0 8px 18px -8px ${TASK_COLORS[i]}` }}><Icon size={26} /></span>
                  <span className="text-[27px] font-semibold text-navy">{t}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Дорожная карта урока */}
      <div className="mt-auto">
        <div className="mb-4 flex items-center gap-3 text-[20px] font-semibold uppercase tracking-[0.16em] text-muted">
          <Flag size={22} /> Сабақтың жол картасы · 90 минут
        </div>
        <div className="relative flex">
          <div className="absolute left-0 right-0 top-[26px] h-1.5 rounded-full bg-line" />
          <motion.div
            className="absolute left-0 top-[26px] h-1.5 rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#0fb5a6]"
            initial={{ width: 0 }} animate={{ width: `${((current + 0.5) / stages.length) * 100}%` }} transition={{ duration: 1.2, delay: 0.4 }}
          />
          {stages.map((s, i) => {
            const from = acc
            acc += minutes[s.id]
            const state = i < current ? 'done' : i === current ? 'now' : 'next'
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(slides.findIndex((x) => x.stage === s.id))}
                className="relative flex flex-1 flex-col items-center px-1 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                  className={`grid h-[56px] w-[56px] place-items-center rounded-full border-4 text-[20px] font-bold ${state === 'now' ? 'scale-125 shadow-lift' : ''}`}
                  style={{
                    borderColor: STAGE_THEME[s.id].colors[0],
                    background: state === 'next' ? 'white' : STAGE_THEME[s.id].colors[0],
                    color: state === 'next' ? STAGE_THEME[s.id].colors[0] : 'white',
                  }}
                >
                  {i + 1}
                </motion.span>
                <span className={`mt-2 text-[15.5px] font-semibold leading-tight text-navy`} style={state === 'now' ? { color: STAGE_THEME[s.id].colors[0] } : undefined}>{s.title}</span>
                <span className="mt-1 font-mono text-[14px] text-muted">{from}–{acc} мин</span>
              </button>
            )
          })}
        </div>
      </div>
    </Slide>
  )
}
