import { useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Maximize, Minimize, Pause, Play, Settings2 } from 'lucide-react'
import { slides } from './slides'
import { timerElapsed, useLesson } from './store/useLesson'
import { stages, lessonInfo } from './config/lesson.config'
import { TeacherPanel } from './components/TeacherPanel'
import { useTick } from './components/ui'

const W = 1920
const H = 1080

function useStageScale() {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return scale
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen()
  else void document.documentElement.requestFullscreen?.().catch(() => {})
}

export default function App() {
  const scale = useStageScale()
  const slide = useLesson((s) => Math.min(s.slide, slides.length - 1))
  const direction = useLesson((s) => s.direction)
  const goTo = useLesson((s) => s.goTo)
  const panelOpen = useLesson((s) => s.panelOpen)
  const setPanel = useLesson((s) => s.setPanel)
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return
      if (e.ctrlKey || e.altKey || e.metaKey) return
      const s = useLesson.getState()
      const cur = Math.min(s.slide, slides.length - 1)
      switch (e.key) {
        case 'ArrowRight': case 'PageDown':
          if (cur < slides.length - 1) goTo(cur + 1); e.preventDefault(); break
        case 'ArrowLeft': case 'PageUp':
          if (cur > 0) goTo(cur - 1); e.preventDefault(); break
        case 'Home': goTo(0); break
        case 'End': goTo(slides.length - 1); break
        case 't': case 'T': case 'е': case 'Е': setPanel(!s.panelOpen); break
        case 'f': case 'F': case 'а': case 'А': toggleFullscreen(); break
        case 'Escape': if (s.panelOpen) setPanel(false); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, setPanel])

  const Current = slides[slide].Component
  const isTitle = slide === 0

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b1430]">
      <div
        className="stage-bg absolute left-1/2 top-1/2 overflow-hidden"
        style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: 'center center' }}
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={slide}
            custom={direction}
            className="absolute inset-0"
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Current />
          </motion.div>
        </AnimatePresence>

        {!isTitle && <BottomBar />}
        <TopControls isFs={isFs} />
        <TeacherPanel open={panelOpen} onClose={() => setPanel(false)} />
      </div>
    </div>
  )
}

function LessonClock() {
  const t = useLesson((s) => s.lessonTimer)
  const toggle = useLesson((s) => s.lessonToggle)
  const running = !!t.runningSince
  useTick(running, 500)
  const ms = timerElapsed(t)
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  const over = min >= lessonInfo.durationMin
  return (
    <button
      type="button"
      onClick={toggle}
      title="Сабақтың жалпы уақыты (басу — бастау/кідірту)"
      className={`flex h-12 items-center gap-2.5 rounded-xl border px-4 font-mono text-[19px] font-bold tabular-nums backdrop-blur transition ${
        running ? 'border-teal/30 bg-white/90 text-navy' : 'border-line bg-white/70 text-muted'
      } ${over ? '!text-[#dc2626]' : ''}`}
    >
      {running ? <Pause size={17} /> : <Play size={17} />}
      {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
      <span className="font-sans text-[15px] font-medium text-muted">/ {lessonInfo.durationMin} мин</span>
    </button>
  )
}

function TopControls({ isFs }: { isFs: boolean }) {
  const setPanel = useLesson((s) => s.setPanel)
  const showClock = useLesson((s) => s.showLessonTimer)
  return (
    <div className="absolute right-8 top-6 z-30 flex items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100">
      {showClock && <LessonClock />}
      <button type="button" onClick={toggleFullscreen} title="Толық экран (F)" className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-white/80 text-navy backdrop-blur hover:bg-white">
        {isFs ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>
      <button type="button" onClick={() => setPanel(true)} title="Мұғалім панелі (T)" className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-white/80 text-navy backdrop-blur hover:bg-white">
        <Settings2 size={20} />
      </button>
    </div>
  )
}

function BottomBar() {
  const slide = useLesson((s) => Math.min(s.slide, slides.length - 1))
  const goTo = useLesson((s) => s.goTo)
  const stageId = slides[slide].stage
  const stageIdx = stages.findIndex((s) => s.id === stageId)
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-[64px] items-center gap-5 px-10">
      <button type="button" disabled={slide === 0} onClick={() => goTo(slide - 1)} className="btn btn-ghost h-11 w-11 !rounded-xl" aria-label="Артқа">
        <ChevronLeft size={22} />
      </button>
      <div className="flex flex-1 items-center gap-1.5">
        {stages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            title={s.title}
            onClick={() => goTo(slides.findIndex((x) => x.stage === s.id))}
            className="group relative h-2.5 flex-1 rounded-full transition"
            style={{ flexGrow: s.minutes, background: i < stageIdx ? '#1d4ed8' : i === stageIdx ? '#0891b2' : '#d6dfeb' }}
          />
        ))}
      </div>
      <div className="min-w-[340px] text-right text-[17px] text-muted">
        <span className="font-semibold text-navy">{stageIdx >= 0 ? `${stageIdx + 1}. ${stages[stageIdx].title}` : ''}</span>
        <span className="ml-3 font-mono tabular-nums">{slide}/{slides.length - 1}</span>
      </div>
      <button type="button" disabled={slide === slides.length - 1} onClick={() => goTo(slide + 1)} className="btn btn-primary h-11 w-11 !rounded-xl" aria-label="Алға">
        <ChevronRight size={22} />
      </button>
    </div>
  )
}
