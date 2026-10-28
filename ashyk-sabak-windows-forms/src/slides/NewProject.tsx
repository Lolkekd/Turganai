import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, FolderPlus, Info, MousePointer2 } from 'lucide-react'
import { useSlideState } from '../store/useLesson'
import { DocFigure, FormIcon, Slide, SlideHeader } from '../components/ui'
import { VsLogo, WinLogo } from '../components/brand'
import { play } from '../lib/sound'
import { DOC } from '../assets/docImages'

const STEPS = [
  { t: 'Visual Studio бағдарламасын ашу', d: 'Іске қосу → Бағдарламалар → Microsoft Visual Studio → Microsoft Visual C# 2010 командасын орындаймыз.' },
  { t: 'Жаңа жоба құру', d: 'Бастапқы беттен «Создать проект…» сілтемесін немесе Файл → Создать проект (Ctrl+Shift+N) мәзірін таңдаймыз.' },
  { t: 'Windows Forms қолданбасын таңдау', d: 'Ашылған терезеде Visual C# бөлімінен «Приложение Windows Forms» үлгісін таңдаймыз.' },
  { t: 'Жоба атауын енгізу', d: '«Имя» өрісіне жоба атауын жазамыз. Үнсіз келісім бойынша — WindowsFormsApplication1.' },
  { t: 'Жобаны құру', d: 'OK батырмасын басамыз. Visual Studio жоба файлдарын автоматты түрде жасайды.' },
  { t: 'Form терезесін ашу', d: 'Экранда Form1 формасы бар конструктор ашылады. Енді формаға компоненттер қоюға болады.' },
]

export default function NewProject() {
  const [step, setStep] = useSlideState('newproject.step', 0)
  const go = (i: number) => { setStep(Math.max(0, Math.min(STEPS.length - 1, i))); play('click') }
  return (
    <Slide stage="newTopic">
      <SlideHeader
        stage="6 · Жаңа тақырыпты түсіндіру"
        title="Visual Studio ортасында жаңа жоба құру"
        icon={<FolderPlus size={44} />}
      />
      <div className="mt-7 grid flex-1 grid-cols-[600px_1fr] gap-9">
        <div className="flex flex-col">
          <div className="space-y-2.5">
            {STEPS.map((s, i) => {
              const state = i < step ? 'done' : i === step ? 'now' : 'next'
              return (
                <button
                  key={s.t} type="button" onClick={() => go(i)}
                  className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-3.5 text-left transition ${
                    state === 'now' ? 'border-brand bg-white shadow-lift' : state === 'done' ? 'border-transparent bg-white/60' : 'border-transparent opacity-55 hover:opacity-80'
                  }`}
                >
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[21px] font-bold ${state === 'next' ? 'bg-line text-muted' : 'bg-brand text-white'}`}>{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-[24px] font-bold text-navy">{s.t}</span>
                    <AnimatePresence initial={false}>
                      {state === 'now' && (
                        <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden text-[19px] leading-snug text-muted">
                          <span className="block pt-1">{s.d}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-auto flex items-center gap-3">
            <button type="button" className="btn btn-ghost h-14 w-14" disabled={step === 0} onClick={() => go(step - 1)}><ChevronLeft /></button>
            <button type="button" className="btn btn-primary h-14 flex-1 text-[21px]" disabled={step === STEPS.length - 1} onClick={() => go(step + 1)}>
              Келесі қадам <ChevronRight />
            </button>
            <DocFigure src={DOC.fig1} caption="1-сурет. Жаңа жоба құру терезесі (Visual C# 2010)" label="1-сурет" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="relative flex-1 overflow-hidden rounded-[20px] border-[3px] border-white bg-gradient-to-br from-[#e0ecff] to-[#efe6ff] shadow-lift">
            <AnimatePresence mode="wait">
              <motion.div key={step} className="absolute inset-0" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {step === 0 && <StartMenu />}
                {step === 1 && <StartPage />}
                {(step === 2 || step === 3 || step === 4) && <NewProjectDialog step={step} />}
                {step === 5 && <Designer />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex items-start gap-2 text-[16px] leading-snug text-muted">
            <Info size={18} className="mt-0.5 shrink-0 text-cyan" />
            <span>
              Схема құжаттағыдай <b className="text-navy">Microsoft Visual C# 2010</b> (орысша интерфейс) бойынша. Жаңа <b className="text-navy">Visual Studio 2022</b> нұсқасында:
              «Create a new project» → «Windows Forms App (.NET Framework)» → «Next» → атауы → «Create».
            </span>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/** Курсор мыши «подъезжает» к элементу, внутри которого он размещён */
function Cursor() {
  return (
    <motion.div
      className="pointer-events-none absolute right-6 top-1/2 z-10 text-white drop-shadow"
      initial={{ x: 140, y: 110, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
    >
      <MousePointer2 size={34} fill="black" />
    </motion.div>
  )
}

function StartMenu() {
  const items = ['Microsoft Office', 'Microsoft Visual Studio 2010 Express', 'Paint', 'Блокнот', 'Калькулятор']
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3fc] via-[#60a5fa] to-[#a78bfa]">
      <div className="absolute right-[120px] top-[80px] opacity-90"><WinLogo size={150} /></div>
      <div className="absolute bottom-12 left-0 w-[520px] rounded-tr-lg bg-[#f1f4f9] p-4 text-[21px] shadow-2xl" style={{ fontFamily: "'Segoe UI', var(--font-sans)" }}>
        <div className="mb-2 px-2 text-[15px] font-semibold text-[#555]">Все программы</div>
        {items.map((it) => (
          <div key={it} className={`rounded px-3 py-2 ${it.includes('Visual') ? 'bg-[#cfe3fb]' : ''}`}>📁 {it}</div>
        ))}
        <div className="relative ml-8 mt-1 rounded border border-[#7eb4ea] bg-[#e5f1fb] px-3 py-2 font-semibold">
          <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded bg-[#68217a] text-[11px] font-bold text-white">C#</span>
          Microsoft Visual C# 2010 Express
          <Cursor />
        </div>
        <div className="mt-3 border-t border-[#d5dbe5] pt-3 text-[16px] text-[#555]">🔍 Найти программы и файлы</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center gap-3 bg-white/75 px-4 backdrop-blur"><WinLogo size={26} /></div>
    </div>
  )
}

function StartPage() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#f5f3ff] via-white to-[#e0e7ff] text-navy" style={{ fontFamily: "'Segoe UI', var(--font-sans)" }}>
      <div className="flex h-10 items-center gap-5 bg-[#e4e9f7] px-4 text-[16px] text-black">
        <span className="rounded bg-white px-2 shadow">Файл</span><span>Правка</span><span>Вид</span><span>Отладка</span><span>Сервис</span><span>Окно</span><span>Справка</span>
      </div>
      <div className="p-10">
        <div className="flex items-center gap-4 text-[40px] font-light"><VsLogo size={56} /> Microsoft<sup>®</sup> Visual C# 2010 Express</div>
        <div className="mt-8 w-[380px] space-y-3 text-[24px]">
          <motion.div className="relative rounded-lg bg-white px-4 py-2 font-semibold text-violet shadow-card ring-2 ring-[#fbbf24]" animate={{ boxShadow: ['0 0 0 0 #fbbf2477', '0 0 0 12px #fbbf2400'] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            📄 Создать проект…
            <Cursor />
          </motion.div>
          <div className="px-4 py-2 text-muted">📂 Открыть проект…</div>
        </div>
        <div className="mt-8 text-[18px] text-muted">Последние проекты</div>
      </div>
    </div>
  )
}

function NewProjectDialog({ step }: { step: number }) {
  const templates = ['Приложение Windows Forms', 'Приложение WPF', 'Консольное приложение', 'Библиотека классов']
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ fontFamily: "'Segoe UI', var(--font-sans)" }}>
      <div className="w-[1040px] overflow-hidden rounded border border-[#8796ae] bg-[#eef1f6] text-[20px] text-black shadow-2xl">
        <div className="bg-[#d3dbe7] px-4 py-2">Создать проект</div>
        <div className="grid grid-cols-[250px_1fr] gap-3 p-3">
          <div className="rounded border border-[#bcc6d4] bg-white p-3">
            <div className="text-[15px] font-semibold text-[#555]">Установленные шаблоны</div>
            <div className="mt-2 rounded bg-[#3399ff] px-2 py-1 text-white">▾ Visual C#</div>
            <div className="ml-5 mt-1 space-y-1 text-[15px] text-[#333]"><div>Windows</div><div>Веб</div><div>Office</div></div>
          </div>
          <div className="rounded border border-[#bcc6d4] bg-white p-2">
            {templates.map((t, i) => (
              <div key={t} className={`relative flex items-center gap-3 rounded px-3 py-2.5 ${i === 0 ? (step >= 2 ? 'bg-[#cde6ff] ring-1 ring-[#7eb4ea]' : '') : ''}`}>
                <span className="grid h-8 w-8 place-items-center rounded bg-[#68217a] text-[11px] font-bold text-white">C#</span>
                <span className="flex-1">{t}</span>
                <span className="text-[14px] text-[#666]">Visual C#</span>
                {i === 0 && step === 2 && <Cursor />}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center gap-3 border-t border-[#c8d0dc] px-4 py-3">
          <span>Имя:</span>
          <div className={`rounded border bg-white px-2 py-1.5 font-mono text-[20px] ${step === 3 ? 'border-[#3399ff] ring-2 ring-[#3399ff]/40' : 'border-[#aab4c3]'}`}>
            {step === 3 ? <TypeText text="WindowsFormsApplication1" /> : 'WindowsFormsApplication1'}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 pb-4">
          <motion.span
            className={`relative rounded border px-8 py-1.5 ${step === 4 ? 'border-[#3399ff] bg-[#cde6ff]' : 'border-[#8a96a8] bg-[#f4f4f4]'}`}
            animate={step === 4 ? { scale: [1, 0.94, 1] } : {}} transition={{ delay: 0.9, duration: 0.3 }}
          >
            OK
            {step === 4 && <Cursor />}
          </motion.span>
          <span className="rounded border border-[#8a96a8] bg-[#f4f4f4] px-6 py-1.5">Отмена</span>
        </div>
      </div>
      {step === 4 && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-6 py-2 text-[20px] font-semibold text-navy">
            ⏳ Жоба құрылуда…
          </motion.div>
        </>
      )}
    </div>
  )
}

function TypeText({ text }: { text: string }) {
  return (
    <span>
      {text.split('').map((ch, i) => (
        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>{ch}</motion.span>
      ))}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>
    </span>
  )
}

function Designer() {
  return (
    <div className="absolute inset-0 grid grid-rows-[40px_1fr]" style={{ fontFamily: "'Segoe UI', var(--font-sans)" }}>
      <div className="flex items-center gap-3 bg-[#e4e9f7] px-4 text-[16px] text-black">
        <span className="rounded-t bg-[#f5f6f8] px-3 py-1 font-semibold">Form1.cs [Конструктор]</span>
        <span className="text-[#333]">Program.cs</span>
      </div>
      <div className="grid place-items-center bg-[#f5f6f8]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 16 }}
          className="w-[560px] border border-[#1883d7] bg-white shadow-xl">
          <div className="flex items-center gap-2 px-3 py-2 text-[18px]"><FormIcon /> Form1</div>
          <div className="relative h-[330px] bg-[#f0f0f0]">
            {[[0, 0], [100, 0], [0, 100], [100, 100]].map(([x, y], i) => (
              <span key={i} className="absolute h-2.5 w-2.5 border border-black bg-white" style={{ left: `calc(${x}% - 5px)`, top: `calc(${y}% - 5px)` }} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
