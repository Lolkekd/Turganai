import { motion } from 'motion/react'
import { BookMarked, Heart, House, Star } from 'lucide-react'
import { conclusion, homework, lessonInfo } from '../config/lesson.config'
import { useLesson } from '../store/useLesson'
import { ProposalTag, Slide, SlideHeader, TaskTimer } from '../components/ui'
import { C, CSharpLogo, CodeChip, VsLogo, WinLogo } from '../components/brand'

const HW_COLORS = [C.blue, C.violet, C.teal, C.orange, C.coral]

export function Homework() {
  const variant = useLesson((s) => s.homeworkVariant)
  const showOriginal = variant !== 'proposed'
  const showProposed = variant !== 'original'
  const both = variant === 'both'
  return (
    <Slide stage="finish" decor="grid">
      <SlideHeader stage="14 · Үй тапсырмасы" title="Үйге тапсырма" icon={<House size={44} />} right={<TaskTimer stage="finish" compact />} />
      <div className={`mt-7 grid flex-1 gap-8 ${both ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {showOriginal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col p-9">
            <div className="flex items-center gap-3 text-[18px] font-semibold uppercase tracking-wider text-cyan"><BookMarked size={22} /> {homework.original.title}</div>
            <p className={`mt-3 font-bold leading-snug text-navy ${both ? 'text-[28px]' : 'text-[38px]'}`}>{homework.original.lead}</p>
            <ol className={`mt-6 ${both ? 'space-y-2.5' : 'space-y-3.5'}`}>
              {homework.original.items.map((t, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  className={`flex items-start gap-5 rounded-2xl leading-snug text-ink ${both ? 'px-3 py-2 text-[22px]' : 'px-5 py-3.5 text-[29px]'}`}
                  style={{ background: `${HW_COLORS[i % HW_COLORS.length]}10` }}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-bold text-white" style={{ background: HW_COLORS[i % HW_COLORS.length] }}>{i + 1}</span>{t}
                </motion.li>
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
    <Slide stage="finish" className="items-center justify-center text-center">
      <CodeChip color={C.violet} delay={1.6} style={{ left: 90, top: 150 }}>Application.Run(new Form1());</CodeChip>
      <CodeChip color={C.teal} delay={1.9} style={{ right: 100, bottom: 200 }}>// Рақмет!</CodeChip>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`, width: 12 + (i % 3) * 6, height: i % 2 ? 12 + (i % 3) * 6 : 8, borderRadius: i % 3 === 0 ? 99 : 4, background: [C.blue, C.violet, C.teal, C.orange, C.yellow, C.coral][i % 6], rotate: i * 20 }}
            animate={{ y: [0, -24, 0], rotate: [i * 20, i * 20 + 40, i * 20], opacity: [0.35, 0.7, 0.35] }}
            transition={{ repeat: Infinity, duration: 6 + (i % 5), delay: i * 0.3 }}
          />
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-[1500px]">
        <div className="mb-6 flex items-center justify-center gap-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}><CSharpLogo size={72} /></motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}><VsLogo size={66} /></motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }} className="rounded-2xl bg-white p-3 shadow-card"><WinLogo size={42} /></motion.div>
        </div>
        <div className="inline-block rounded-full px-5 py-1.5 text-[22px] font-bold uppercase tracking-[0.2em]" style={{ background: `${C.blue}14`, color: C.blue }}>Қорытынды</div>
        <p className="mt-5 text-[46px] font-bold leading-tight text-navy">{conclusion.main}</p>
        <p className="mx-auto mt-5 max-w-[1250px] text-[26px] italic leading-snug text-muted">«{conclusion.quote}»</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
        className="relative mt-10 rounded-[28px] bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#0fb5a6] px-14 py-8 text-[44px] font-extrabold leading-tight text-white shadow-lift">
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
