import { motion } from 'motion/react'
import { FolderPlus, LayoutPanelLeft, FileCode2, MousePointerClick, PlayCircle, Target, Flag } from 'lucide-react'
import { goals, stages } from '../config/lesson.config'
import { useLesson } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { slides } from '.'

const TASK_ICONS = [FolderPlus, LayoutPanelLeft, FileCode2, MousePointerClick, PlayCircle]

export default function Goals() {
  const minutes = useLesson((s) => s.stageMinutes)
  const goTo = useLesson((s) => s.goTo)
  const current = stages.findIndex((s) => s.id === 'goals')
  let acc = 0
  return (
    <Slide>
      <SlideHeader stage="5 · Сабақтың мақсаты мен жоспары" title="Бүгін не үйренеміз?" icon={<Target size={44} />} right={<TaskTimer stage="goals" compact />} />
      <div className="mt-8 grid grid-cols-[640px_1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-navy via-brand-dark to-brand p-10 text-white shadow-lift"
        >
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full border-[40px] border-white/5" />
          <div className="flex items-center gap-3 text-[20px] font-semibold uppercase tracking-[0.18em] text-cyan">
            <Target size={24} /> Мақсаты
          </div>
          <p className="mt-5 text-[36px] font-bold leading-[1.25]">{goals.aim}</p>
        </motion.div>
        <div className="card p-7">
          <div className="mb-3 text-[20px] font-semibold uppercase tracking-[0.16em] text-cyan">Міндеттері</div>
          <div className="space-y-2.5">
            {goals.tasks.map((t, i) => {
              const Icon = TASK_ICONS[i]
              return (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-5 rounded-2xl bg-paper px-5 py-3"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-card"><Icon size={26} /></span>
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
            className="absolute left-0 top-[26px] h-1.5 rounded-full bg-gradient-to-r from-brand to-cyan"
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
                  className={`grid h-[56px] w-[56px] place-items-center rounded-full border-4 text-[20px] font-bold ${
                    state === 'now' ? 'border-cyan bg-cyan text-white shadow-lift' : state === 'done' ? 'border-brand bg-brand text-white' : 'border-line bg-white text-muted'
                  }`}
                >
                  {i + 1}
                </motion.span>
                <span className={`mt-2 text-[15.5px] font-semibold leading-tight ${state === 'now' ? 'text-cyan' : 'text-navy'}`}>{s.title}</span>
                <span className="mt-1 font-mono text-[14px] text-muted">{from}–{acc} мин</span>
              </button>
            )
          })}
        </div>
      </div>
    </Slide>
  )
}
