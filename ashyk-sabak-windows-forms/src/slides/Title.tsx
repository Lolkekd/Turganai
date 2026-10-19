import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, CalendarClock, GraduationCap, Sparkles, UserRound, Users } from 'lucide-react'
import { lessonInfo } from '../config/lesson.config'
import { useLesson } from '../store/useLesson'
import { C, CSharpLogo, CodeChip, ComputerIllustration, VsLogo, WinLogo } from '../components/brand'
import { play } from '../lib/sound'

const rise = (d: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Title() {
  const goTo = useLesson((s) => s.goTo)
  const start = () => {
    const s = useLesson.getState()
    if (!s.lessonTimer.runningSince && s.lessonTimer.elapsedMs === 0) s.lessonToggle()
    play('reveal')
    goTo(1)
  }

  const facts = [
    { icon: UserRound, text: `Оқытушы: ${lessonInfo.teacher}`, color: C.blue },
    { icon: Users, text: `${lessonInfo.group} тобы`, color: C.violet },
    { icon: GraduationCap, text: `${lessonInfo.course}-курс`, color: C.teal },
    { icon: CalendarClock, text: `${lessonInfo.durationMin} минут`, color: C.orange },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {/* ===== Фон: светлые цветные геометрические формы ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f3f7ff] to-[#f6f0ff]" />
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#2563eb22 1.4px, transparent 1.4px)', backgroundSize: '30px 30px' }} />
      <motion.div className="absolute -right-[260px] -top-[300px] h-[980px] w-[980px] rounded-full"
        style={{ background: 'radial-gradient(circle at 40% 40%, #7c3aed33, #2563eb1f 45%, transparent 70%)' }}
        animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute -bottom-[220px] -left-[160px] h-[560px] w-[560px] rounded-full" style={{ background: 'radial-gradient(circle, #0fb5a62e, transparent 68%)' }} />
      <div className="absolute bottom-[90px] left-[1040px] h-[120px] w-[120px] rounded-full border-[18px] border-[#fb718544]" />
      <motion.div className="absolute right-[90px] top-[86px] h-[70px] w-[70px] rounded-[20px] bg-[#fbbf2466]" animate={{ rotate: [12, 30, 12] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <svg className="absolute left-[930px] top-[110px]" width="70" height="62" viewBox="0 0 70 62"><path d="M35 0 L70 62 H0 Z" fill="#0fb5a640" /></svg>

      {/* ===== Шапка: колледж ===== */}
      <motion.header {...rise(0)} className="absolute left-20 top-8 flex items-center gap-4 rounded-full bg-white/85 py-2 pl-2 pr-7 shadow-[0_10px_30px_-14px_rgba(20,48,107,0.35)] backdrop-blur">
        <div className="grid h-12 w-12 place-items-center rounded-full text-white" style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.violet})` }}>
          <GraduationCap size={26} />
        </div>
        <div className="text-[21px] font-bold text-navy">{lessonInfo.college}</div>
      </motion.header>

      {/* ===== Левая колонка ===== */}
      <div className="absolute left-20 top-[148px] w-[1080px]">
        <motion.div {...rise(0.1)} className="inline-flex items-center gap-3 rounded-2xl px-6 py-2.5 text-[24px] font-extrabold tracking-[0.32em] text-white shadow-[0_14px_30px_-12px_rgba(249,115,22,0.7)]"
          style={{ background: `linear-gradient(120deg, ${C.orange}, ${C.coral})` }}>
          <Sparkles size={24} /> {lessonInfo.format}
        </motion.div>

        <motion.h1 {...rise(0.2)} className="mt-6 text-[74px] font-black leading-[1.04] tracking-tight text-navy">
          Алғашқы{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, #0ea5e9)` }}>Windows</span>{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${C.violet}, #a855f7)` }}>қосымшаларын</span>{' '}
          құру және бағдарлама{' '}
          <span className="relative inline-block">
            <span className="relative z-10">интерфейсі</span>
            <motion.span className="absolute bottom-2 left-0 z-0 h-5 rounded-full bg-[#fbbf2499]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 1, duration: 0.7 }} />
          </span>
        </motion.h1>

        <motion.div {...rise(0.35)} className="mt-8 flex flex-nowrap gap-2.5">
          {facts.map((f) => (
            <div key={f.text} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-2xl py-2 pl-2 pr-4 text-[21px] font-bold text-navy"
              style={{ background: `${f.color}14`, boxShadow: `inset 0 0 0 2px ${f.color}26` }}>
              <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: f.color }}><f.icon size={23} /></span>
              {f.text}
            </div>
          ))}
        </motion.div>

        <div className="mt-10 flex items-end gap-10">
          <div>
            <motion.div {...rise(0.5)} className="flex items-center gap-4">
              <CSharpLogo size={64} />
              <VsLogo size={60} />
              <span className="grid h-[60px] w-[60px] place-items-center rounded-2xl bg-white shadow-card"><WinLogo size={34} /></span>
              <div className="text-[19px] font-semibold leading-tight text-muted">C# · Visual Studio<br />Windows Forms</div>
            </motion.div>
            <motion.button
              {...rise(0.65)}
              type="button"
              onClick={start}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary mt-9 h-[84px] px-12 text-[30px] !rounded-[22px]"
            >
              Сабақты бастау
              <motion.span animate={{ x: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ArrowRight size={32} />
              </motion.span>
            </motion.button>
          </div>
          <motion.div {...rise(0.6)} className="relative -mb-4">
            <ComputerIllustration width={430} />
          </motion.div>
        </div>
      </div>

      {/* ===== Правая колонка: фото преподавателя ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[120px] top-[128px] w-[540px]"
      >
        <TeacherPhoto />
      </motion.div>

      {/* ===== Плавающий код ===== */}
      <CodeChip color={C.violet} delay={1.1} style={{ right: 640, top: 175 }}>button1_Click()</CodeChip>
      <CodeChip color={C.teal} delay={1.4} style={{ right: 36, top: 690 }}>new Form1()</CodeChip>
      <CodeChip color={C.coral} delay={1.7} style={{ right: 600, bottom: 150 }}>this.BackColor = Color.Red;</CodeChip>
    </div>
  )
}

function TeacherPhoto() {
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading')
  const arch = '270px 270px 40px 40px'
  return (
    <div className="relative">
      {/* цветные слои рамки */}
      <motion.div className="absolute inset-0" style={{ borderRadius: arch, background: `linear-gradient(160deg, ${C.violet}, ${C.blue})` }}
        initial={{ rotate: 0 }} animate={{ rotate: -5 }} transition={{ delay: 0.7, duration: 0.8 }} />
      <motion.div className="absolute inset-0" style={{ borderRadius: arch, background: `linear-gradient(160deg, ${C.teal}, ${C.yellow})` }}
        initial={{ rotate: 0 }} animate={{ rotate: 4 }} transition={{ delay: 0.8, duration: 0.8 }} />
      <div className="relative h-[690px] overflow-hidden border-[8px] border-white bg-gradient-to-b from-[#eef3ff] to-[#dfe8fb] shadow-[0_40px_80px_-30px_rgba(37,99,235,0.55)]" style={{ borderRadius: arch }}>
        <img
          src={lessonInfo.teacherPhoto}
          alt={`Оқытушы ${lessonInfo.teacher}`}
          onLoad={() => setState('ok')}
          onError={() => setState('missing')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
        {state !== 'ok' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-[#6b7fa3]">
            <div className="grid h-[210px] w-[210px] place-items-center rounded-full border-4 border-dashed border-[#a9bbd6] bg-white/70">
              <UserRound size={112} strokeWidth={1.3} />
            </div>
            <div className="text-[28px] font-semibold">Оқытушының фотосы</div>
          </div>
        )}
      </div>
      {/* табличка с именем */}
      <motion.div {...rise(0.9)} className="absolute -bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap rounded-[22px] bg-white px-7 py-3.5 shadow-[0_18px_40px_-16px_rgba(20,48,107,0.45)]">
        <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.violet})` }}><UserRound size={26} /></span>
        <div>
          <div className="text-[15px] font-semibold uppercase tracking-[0.16em] text-muted">{lessonInfo.teacherRole}</div>
          <div className="text-[28px] font-extrabold leading-tight text-navy">{lessonInfo.teacher}</div>
        </div>
      </motion.div>
      {/* логотипы на рамке */}
      <motion.div className="absolute -left-12 top-[150px] rounded-[22px] bg-white p-3 shadow-card" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
        <CSharpLogo size={70} />
      </motion.div>
      <motion.div className="absolute -right-10 top-[330px] rounded-[22px] bg-white p-3 shadow-card" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}>
        <VsLogo size={62} />
      </motion.div>
    </div>
  )
}
