import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Clapperboard, FileVideo, Maximize, Play } from 'lucide-react'
import { lessonInfo } from '../config/lesson.config'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { C } from '../components/brand'
import { play } from '../lib/sound'

/** Этап «Ұйымдастыру кезеңі»: видео ИИ (файл videos/org-video.mp4). */
export default function OrgVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')
  const [started, setStarted] = useState(false)

  const start = () => {
    const v = ref.current
    if (!v) return
    play('click')
    setStarted(true)
    void v.play().catch(() => {})
  }
  const fullscreen = () => void ref.current?.requestFullscreen?.().catch(() => {})

  return (
    <Slide stage="org">
      <SlideHeader stage="1 · Ұйымдастыру кезеңі" title="Сабаққа кіріспе: бейнеролик" icon={<Clapperboard size={44} />} right={<TaskTimer stage="org" compact />} />
      <div className="mt-6 flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 18 }}
          className="relative rounded-[36px] p-[6px]"
          style={{ background: `linear-gradient(120deg, ${C.coral}, ${C.orange}, ${C.violet}, ${C.blue})`, boxShadow: '0 40px 80px -30px #7c3aed88' }}
        >
          <div className="relative h-[700px] w-[1244px] overflow-hidden rounded-[30px] bg-[#0f172a]">
            <video
              ref={ref}
              src={lessonInfo.orgVideo}
              className="h-full w-full object-contain"
              controls={started}
              preload="metadata"
              playsInline
              onLoadedMetadata={() => setState('ready')}
              onError={() => setState('missing')}
              onEnded={() => setStarted(false)}
            />

            {/* большая кнопка запуска */}
            {state === 'ready' && !started && (
              <button type="button" onClick={start} className="group absolute inset-0 grid place-items-center bg-black/25">
                <motion.span
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  className="grid h-[150px] w-[150px] place-items-center rounded-full text-white shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.coral})` }}
                >
                  <Play size={70} fill="white" className="ml-2" />
                </motion.span>
              </button>
            )}

            {/* файла пока нет — понятная заглушка */}
            {state === 'missing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-[#fff7ed] via-white to-[#f5f3ff] text-center">
                <div className="grid h-28 w-28 place-items-center rounded-[30px] text-white shadow-lift" style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.coral})` }}>
                  <FileVideo size={60} />
                </div>
                <div className="text-[34px] font-extrabold text-navy">Бейнеролик осында көрсетіледі</div>
                <div className="text-[22px] text-muted">
                  Файлды мына жерге салыңыз: <code className="rounded-lg bg-paper px-3 py-1 font-mono text-violet">presentation/videos/org-video.mp4</code>
                </div>
              </div>
            )}
          </div>
          {state === 'ready' && (
            <button type="button" onClick={fullscreen} className="btn btn-ghost absolute -bottom-7 right-8 h-14 px-5 text-[19px] shadow-card">
              <Maximize size={20} /> Толық экран
            </button>
          )}
        </motion.div>
      </div>
    </Slide>
  )
}
