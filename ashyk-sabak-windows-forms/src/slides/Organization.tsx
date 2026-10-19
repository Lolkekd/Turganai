import { motion } from 'motion/react'
import { Check, Gavel, Hammer, Handshake, Quote, Scale, ShieldCheck, Sparkles, Code2 } from 'lucide-react'
import { organization, lessonInfo } from '../config/lesson.config'
import { useSlideState } from '../store/useLesson'
import { FormIcon, Slide, SlideHeader, TaskTimer } from '../components/ui'
import { DialogIcon } from '../components/WinDialog'
import { C, CSharpLogo, CodeChip, VsLogo } from '../components/brand'
import { play } from '../lib/sound'

const CHECK_COLORS = [C.coral, C.orange, C.violet]

export function Greeting() {
  const [done, setDone] = useSlideState<boolean[]>('org.check', organization.checklist.map(() => false))
  const words = organization.greeting.split(' ')
  return (
    <Slide stage="org" className="items-center justify-center">
      {/* плавающие элементы: окно приветствия, логотипы, код */}
      <motion.div initial={{ opacity: 0, x: -40, rotate: -8 }} animate={{ opacity: 1, x: 0, rotate: -6 }} transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute left-[120px] top-[150px] w-[330px] overflow-hidden rounded-lg border border-[#1883d7] bg-white shadow-lift" style={{ fontFamily: "'Segoe UI', var(--font-sans)" }}>
        <div className="flex items-center gap-2 px-3 py-2 text-[16px]"><FormIcon size={18} /> Хабарлама</div>
        <div className="flex items-center gap-3 bg-[#f6f8fc] px-5 py-5 text-[19px]"><DialogIcon icon="Information" size={36} /> Қош келдіңіздер!</div>
        <div className="flex justify-end bg-[#eef1f6] px-4 py-2.5"><span className="win-btn px-6 py-1 text-[16px]">OK</span></div>
      </motion.div>
      <motion.div className="absolute right-[150px] top-[130px]" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, rotate: 8 }} transition={{ delay: 1.1, type: 'spring' }}>
        <div className="rounded-[26px] bg-white p-4 shadow-lift"><CSharpLogo size={86} /></div>
      </motion.div>
      <motion.div className="absolute bottom-[150px] right-[230px]" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ delay: 1.3, type: 'spring' }}>
        <div className="rounded-[26px] bg-white p-4 shadow-lift"><VsLogo size={74} /></div>
      </motion.div>
      <CodeChip color={C.orange} delay={1.5} style={{ left: 150, bottom: 170 }}>MessageBox.Show("Сәлем!");</CodeChip>
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
            {i >= 2 ? <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${C.coral}, ${C.orange}, ${C.violet})` }}>{w}</span> : w}
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
            className="flex items-center gap-4 rounded-[20px] px-7 py-5 text-[26px] font-bold transition hover:-translate-y-0.5"
            style={done[i] ? { background: CHECK_COLORS[i], color: 'white', boxShadow: `0 14px 30px -14px ${CHECK_COLORS[i]}` } : { background: 'white', color: '#14306b', boxShadow: `inset 0 0 0 2px ${CHECK_COLORS[i]}55, 0 10px 24px -16px #14306b55` }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl border-2 transition" style={done[i] ? { borderColor: 'white', background: 'white', color: CHECK_COLORS[i] } : { borderColor: CHECK_COLORS[i], color: 'transparent' }}>
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
const VALUE_COLORS = [C.blue, C.teal, C.orange, C.violet]

export function AdalAzamat() {
  const a = organization.adalAzamat
  return (
    <Slide stage="org" decor="geo">
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
                initial={{ opacity: 0, rotateX: -60, y: 30 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ delay: 0.15 + i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="relative flex flex-col justify-center overflow-hidden p-9"
                style={{ borderRadius: '36px 36px 36px 10px', background: `linear-gradient(150deg, white 30%, ${VALUE_COLORS[i]}1c)`, boxShadow: `inset 0 0 0 2px ${VALUE_COLORS[i]}2e, 0 18px 40px -24px ${VALUE_COLORS[i]}` }}
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ background: `${VALUE_COLORS[i]}14` }} />
                <div className="relative grid h-[72px] w-[72px] place-items-center rounded-[22px] text-white" style={{ background: `linear-gradient(140deg, ${VALUE_COLORS[i]}, ${VALUE_COLORS[i]}bb)`, boxShadow: `0 12px 24px -10px ${VALUE_COLORS[i]}` }}>
                  <Icon size={38} />
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
            className="relative overflow-hidden rounded-[32px] p-10 text-white shadow-lift" style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.violet} 60%, ${C.coral})` }}
          >
            <Quote size={120} className="absolute -right-3 -top-3 text-white/15" />
            <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border-[22px] border-white/10" />
            <div className="inline-block rounded-full bg-white/20 px-4 py-1 text-[18px] font-bold uppercase tracking-[0.18em]">Апта дәйексөзі</div>
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
              {['Сапа', 'Қауіпсіздік', 'Ыңғайлылық', 'Әділдік'].map((t, i) => (
                <span key={t} className="rounded-full px-4 py-1.5 text-[20px] font-bold" style={{ background: `${VALUE_COLORS[i]}18`, color: VALUE_COLORS[i] }}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Slide>
  )
}
