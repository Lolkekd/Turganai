import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, CalendarClock, GraduationCap, UserRound, Users } from 'lucide-react'
import { lessonInfo } from '../config/lesson.config'
import { useLesson } from '../store/useLesson'
import { FormIcon } from '../components/ui'
import { play } from '../lib/sound'

const rise = (d: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
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
    { icon: UserRound, k: 'Оқытушы', v: lessonInfo.teacher },
    { icon: Users, k: 'Топ', v: lessonInfo.group },
    { icon: GraduationCap, k: 'Курс', v: `${lessonInfo.course}-курс` },
    { icon: CalendarClock, k: 'Ұзақтығы', v: `${lessonInfo.durationMin} минут` },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* фон */}
      <div className="grid-dots absolute inset-0 opacity-60" />
      <div className="absolute -right-40 -top-40 h-[760px] w-[760px] rounded-full bg-gradient-to-br from-cyan/20 via-brand/10 to-transparent blur-2xl" />
      <div className="absolute -bottom-56 -left-40 h-[620px] w-[620px] rounded-full bg-gradient-to-tr from-violet/10 to-transparent blur-2xl" />

      {/* колледж */}
      <motion.header {...rise(0)} className="absolute left-20 top-8 flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-white shadow-card">
          <GraduationCap size={30} />
        </div>
        <div>
          <div className="text-[22px] font-bold text-navy">{lessonInfo.college}</div>
          <div className="text-[17px] text-muted">{lessonInfo.module}</div>
        </div>
      </motion.header>

      {/* левая колонка */}
      <div className="absolute left-20 top-[150px] w-[1060px]">
        <motion.div {...rise(0.1)} className="inline-flex items-center gap-3 rounded-full bg-navy px-6 py-2.5 text-[22px] font-bold tracking-[0.3em] text-white">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan" />
          {lessonInfo.format}
        </motion.div>

        <motion.h1 {...rise(0.2)} className="mt-7 text-[70px] font-extrabold leading-[1.07] tracking-tight text-navy">
          Алғашқы <span className="bg-gradient-to-r from-brand to-cyan bg-clip-text text-transparent">Windows қосымшаларын</span> құру және бағдарлама интерфейсі
        </motion.h1>

        <motion.div {...rise(0.35)} className="mt-9 grid grid-cols-4 gap-4">
          {facts.map((f) => (
            <div key={f.k} className="card flex items-center gap-3 !rounded-2xl px-4 py-3.5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><f.icon size={22} /></div>
              <div className="min-w-0">
                <div className="text-[15px] text-muted">{f.k}</div>
                <div className="truncate text-[21px] font-bold text-navy">{f.v}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div {...rise(0.5)} className="mt-9">
          <MiniScene />
        </motion.div>

        <motion.button
          {...rise(0.65)}
          type="button"
          onClick={start}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-primary mt-9 h-[78px] px-12 text-[28px]"
        >
          Сабақты бастау
          <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ArrowRight size={30} />
          </motion.span>
        </motion.button>
      </div>

      {/* правая колонка — фото */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="absolute right-[110px] top-[140px] w-[560px]"
      >
        <TeacherPhoto />
        <div className="mt-6 text-center">
          <div className="text-[34px] font-bold text-navy">{lessonInfo.teacher}</div>
          <div className="text-[20px] text-muted">{lessonInfo.teacherRole} · {lessonInfo.environment}</div>
        </div>
      </motion.div>
    </div>
  )
}

function TeacherPhoto() {
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading')
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[44px] bg-gradient-to-br from-brand via-cyan to-teal opacity-90" />
      <div className="relative h-[700px] overflow-hidden rounded-[36px] border-[6px] border-white bg-gradient-to-b from-[#eaf1fb] to-[#dbe6f5] shadow-lift">
        <img
          src={lessonInfo.teacherPhoto}
          alt={`Оқытушы ${lessonInfo.teacher}`}
          onLoad={() => setState('ok')}
          onError={() => setState('missing')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
        {state !== 'ok' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-[#6b7fa3]">
            <div className="grid h-[200px] w-[200px] place-items-center rounded-full border-4 border-dashed border-[#a9bbd6] bg-white/60">
              <UserRound size={110} strokeWidth={1.3} />
            </div>
            <div className="text-[28px] font-semibold">Оқытушының фотосы</div>
          </div>
        )}
      </div>
      {/* плавающие метки */}
      <motion.div
        animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="card absolute -left-16 top-[90px] flex items-center gap-3 px-5 py-3"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#68217a] font-mono text-[18px] font-bold text-white">C#</span>
        <span className="text-[19px] font-semibold text-navy">Visual Studio</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="card absolute -right-10 bottom-[110px] flex items-center gap-3 px-5 py-3"
      >
        <FormIcon size={30} />
        <span className="text-[19px] font-semibold text-navy">Windows Forms</span>
      </motion.div>
    </div>
  )
}

/** Небольшая иллюстрация: код C# + окно Windows Forms */
function MiniScene() {
  return (
    <div className="relative h-[230px] w-[860px]">
      <div className="absolute left-0 top-0 h-[210px] w-[500px] overflow-hidden rounded-2xl bg-[#1e1e1e] shadow-lift">
        <div className="flex items-center gap-2 bg-[#2d2d30] px-4 py-2 font-mono text-[14px] text-white/60">
          <span className="rounded bg-[#68217a] px-1.5 text-[12px] font-bold text-white">C#</span> Form1.cs
        </div>
        <pre className="px-5 py-3 font-mono text-[16px] leading-[1.6]">
          <div><span className="text-[#569cd6]">private void</span> <span className="text-[#dcdcaa]">button1_Click</span><span className="text-[#d4d4d4]">(…)</span></div>
          <div className="text-[#d4d4d4]">{'{'}</div>
          <div className="pl-6"><span className="text-[#6a9955]">// форма түсін өзгерту</span></div>
          <div className="pl-6"><span className="text-[#569cd6]">this</span><span className="text-[#d4d4d4]">.BackColor = </span><span className="text-[#4ec9b0]">Color</span><span className="text-[#d4d4d4]">.DarkBlue;</span></div>
          <div className="text-[#d4d4d4]">{'}'}</div>
        </pre>
      </div>
      <motion.div
        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}
        className="absolute left-[440px] top-[34px] w-[380px] overflow-hidden border border-[#1883d7] bg-white shadow-lift"
        style={{ fontFamily: "'Segoe UI', var(--font-sans)" }}
      >
        <div className="flex items-center gap-2 px-3 py-2 text-[15px]"><FormIcon size={16} /> Түстерді таңдау</div>
        <motion.div
          className="flex h-[138px] items-start gap-3 p-4"
          animate={{ backgroundColor: ['#00008b', '#ff0000', '#ffff00', '#00008b'] }}
          transition={{ repeat: Infinity, duration: 6, times: [0, 0.33, 0.66, 1] }}
        >
          {['Көк', 'Қызыл', 'Сары'].map((t) => (
            <span key={t} className="win-btn px-5 py-1.5 text-[16px]">{t}</span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
