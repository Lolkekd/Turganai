import { motion } from 'motion/react'
import { Check, Gavel, Hammer, Handshake, Quote, Scale, ShieldCheck, Sparkles, Code2 } from 'lucide-react'
import { organization, lessonInfo } from '../config/lesson.config'
import { useSlideState } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { play } from '../lib/sound'

export function Greeting() {
  const [done, setDone] = useSlideState<boolean[]>('org.check', organization.checklist.map(() => false))
  const words = organization.greeting.split(' ')
  return (
    <Slide className="items-center justify-center">
      <div className="grid-dots absolute inset-0 opacity-50" />
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="relative mb-8 text-[110px]"
      >
        <motion.span className="inline-block" animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ delay: 0.6, duration: 1.4 }}>
          👋
        </motion.span>
      </motion.div>
      <h1 className="relative text-center text-[92px] font-extrabold leading-tight tracking-tight text-navy">
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="mr-[0.25em] inline-block"
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
          >
            {i >= 2 ? <span className="bg-gradient-to-r from-brand to-cyan bg-clip-text text-transparent">{w}</span> : w}
          </motion.span>
        ))}
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="relative mt-4 text-[28px] text-muted">
        {lessonInfo.group} тобы · {lessonInfo.course}-курс · Ұйымдастыру кезеңі
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="relative mt-14 flex items-center gap-5">
        {organization.checklist.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => { setDone(done.map((d, j) => (j === i ? !d : d))); play('click') }}
            className={`card flex items-center gap-4 !rounded-2xl px-7 py-5 text-[26px] font-semibold transition ${done[i] ? '!border-teal bg-teal/5 text-teal' : 'text-navy hover:-translate-y-0.5'}`}
          >
            <span className={`grid h-10 w-10 place-items-center rounded-xl border-2 transition ${done[i] ? 'border-teal bg-teal text-white' : 'border-line text-transparent'}`}>
              <Check size={24} strokeWidth={3} />
            </span>
            {c}
          </button>
        ))}
        <TaskTimer stage="org" compact />
      </motion.div>
    </Slide>
  )
}

const VALUE_ICONS = [Scale, Gavel, Hammer, Handshake]
const VALUE_COLORS = ['#1d4ed8', '#0891b2', '#ea8a0c', '#7c3aed']

export function AdalAzamat() {
  const a = organization.adalAzamat
  return (
    <Slide>
      <SlideHeader
        stage="1 · Ұйымдастыру кезеңі"
        title={`${a.title} — ${a.subtitle}`}
        icon={<ShieldCheck size={44} />}
      />
      <div className="mt-10 grid flex-1 grid-cols-[1fr_640px] gap-10">
        <div className="grid grid-cols-2 gap-6">
          {a.values.map((v, i) => {
            const Icon = VALUE_ICONS[i]
            return (
              <motion.div
                key={v}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="card relative flex flex-col justify-center overflow-hidden p-9"
              >
                <div className="absolute right-0 top-0 h-full w-2" style={{ background: VALUE_COLORS[i] }} />
                <div className="grid h-16 w-16 place-items-center rounded-2xl text-white" style={{ background: VALUE_COLORS[i] }}>
                  <Icon size={34} />
                </div>
                <div className="mt-5 text-[34px] font-bold leading-tight text-navy">{v}</div>
                <div className="mt-4 flex items-center gap-2.5 text-[25px] text-muted">
                  <Code2 size={24} style={{ color: VALUE_COLORS[i] }} /> {a.valueHints[i]}
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-navy to-brand p-10 text-white shadow-lift"
          >
            <Quote size={70} className="absolute -right-2 -top-2 text-white/10" />
            <div className="text-[18px] font-semibold uppercase tracking-[0.18em] text-cyan">Апта дәйексөзі</div>
            <div className="mt-4 text-[44px] font-extrabold leading-[1.15]">«{a.quote}»</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
            className="card flex-1 p-9"
          >
            <div className="flex items-center gap-3 text-[20px] font-semibold uppercase tracking-wider text-teal">
              <Sparkles size={22} /> Бағдарламалаумен байланысы
            </div>
            <p className="mt-4 text-[29px] leading-snug text-ink">{a.programmingLink}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Сапа', 'Қауіпсіздік', 'Ыңғайлылық', 'Әділдік'].map((t) => (
                <span key={t} className="rounded-full bg-teal/10 px-4 py-1.5 text-[20px] font-semibold text-teal">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Slide>
  )
}
