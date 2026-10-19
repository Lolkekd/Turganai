import { motion } from 'motion/react'
import { BookMarked, Heart, House, Star } from 'lucide-react'
import { conclusion, homework, lessonInfo } from '../config/lesson.config'
import { useLesson } from '../store/useLesson'
import { ProposalTag, Slide, SlideHeader, TaskTimer } from '../components/ui'

export function Homework() {
  const variant = useLesson((s) => s.homeworkVariant)
  const showOriginal = variant !== 'proposed'
  const showProposed = variant !== 'original'
  const both = variant === 'both'
  return (
    <Slide>
      <SlideHeader stage="14 · Үй тапсырмасы" title="Үйге тапсырма" icon={<House size={44} />} right={<TaskTimer stage="finish" compact />} />
      <div className={`mt-7 grid flex-1 gap-8 ${both ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {showOriginal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col p-9">
            <div className="flex items-center gap-3 text-[18px] font-semibold uppercase tracking-wider text-cyan"><BookMarked size={22} /> {homework.original.title}</div>
            <p className={`mt-3 font-bold leading-snug text-navy ${both ? 'text-[28px]' : 'text-[38px]'}`}>{homework.original.lead}</p>
            <ol className={`mt-6 ${both ? 'space-y-3' : 'space-y-6'}`}>
              {homework.original.items.map((t, i) => (
                <li key={i} className={`flex items-start gap-5 leading-snug text-ink ${both ? 'text-[22px]' : 'text-[31px]'}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 font-bold text-brand">{i + 1}</span>{t}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
        {showProposed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card flex flex-col border-violet/30 p-9">
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-semibold uppercase tracking-wider text-violet">{homework.proposed.title}</span>
              <ProposalTag />
            </div>
            <p className={`mt-3 font-bold leading-snug text-navy ${both ? 'text-[28px]' : 'text-[38px]'}`}>{homework.proposed.lead}</p>
            <ol className={`mt-6 ${both ? 'space-y-3' : 'space-y-6'}`}>
              {homework.proposed.items.map((t, i) => (
                <li key={i} className={`flex items-start gap-5 leading-snug text-ink ${both ? 'text-[22px]' : 'text-[31px]'}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet/10 font-bold text-violet">{i + 1}</span>{t}
                </li>
              ))}
            </ol>
            <div className={`mt-auto rounded-2xl bg-violet/5 px-5 py-4 leading-snug text-[#4c1d95] ${both ? 'text-[19px]' : 'text-[23px]'}`}>
              <Star size={20} className="mr-2 inline text-violet" />{homework.proposed.extra}
            </div>
          </motion.div>
        )}
      </div>
    </Slide>
  )
}

export function Conclusion() {
  const goTo = useLesson((s) => s.goTo)
  return (
    <Slide className="items-center justify-center text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`, background: ['#1d4ed8', '#0891b2', '#7c3aed', '#ea8a0c'][i % 4], opacity: 0.25 }}
            animate={{ y: [0, -30, 0], opacity: [0.15, 0.45, 0.15] }}
            transition={{ repeat: Infinity, duration: 6 + (i % 5), delay: i * 0.3 }}
          />
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-[1500px]">
        <div className="text-[22px] font-semibold uppercase tracking-[0.2em] text-cyan">Қорытынды</div>
        <p className="mt-5 text-[46px] font-bold leading-tight text-navy">{conclusion.main}</p>
        <p className="mx-auto mt-5 max-w-[1250px] text-[26px] italic leading-snug text-muted">«{conclusion.quote}»</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
        className="relative mt-10 rounded-[28px] bg-gradient-to-r from-navy via-brand to-cyan px-14 py-8 text-[44px] font-extrabold leading-tight text-white shadow-lift">
        {conclusion.final}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }} className="relative mt-12 flex items-center gap-4 text-[64px] font-extrabold text-navy">
        <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}><Heart size={54} className="fill-[#ef4444] text-[#ef4444]" /></motion.span>
        {conclusion.thanks}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="relative mt-8 flex items-center gap-6 text-[21px] text-muted">
        {lessonInfo.teacher} · {lessonInfo.group} · {lessonInfo.course}-курс
        <button type="button" className="btn btn-ghost h-12 px-5 text-[19px]" onClick={() => goTo(0)}><House size={19} /> Басына оралу</button>
      </motion.div>
    </Slide>
  )
}
