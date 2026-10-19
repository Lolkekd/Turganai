import { motion, AnimatePresence } from 'motion/react'
import {
  AppWindow, Bot, Camera, Clapperboard, Ghost, LayoutGrid, Map as MapIcon, MessageCircle, Music, Pencil, Play,
  PartyPopper, RotateCcw, Scissors, Send, Shuffle, Store, Users, type LucideIcon,
} from 'lucide-react'
import { teamsConfig } from '../config/lesson.config'
import { useLesson, useSlideState } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { play } from '../lib/sound'
import { useState } from 'react'

const APP_ICONS: Record<string, LucideIcon> = {
  MessageCircle, Camera, Play, Store, LayoutGrid, Send, Music, Ghost, Scissors, Clapperboard, Map: MapIcon, Bot,
}

export const TEAM_COLORS = ['#1d4ed8', '#0d9488'] as const

const balanced = () => {
  const n = teamsConfig.apps.length
  const arr = Array.from({ length: n }, (_, i) => i % 2)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function Teams() {
  const [assign, setAssign] = useSlideState<number[]>('teams.assign', teamsConfig.apps.map((_, i) => (i * 7 + 3) % 4 < 2 ? 0 : 1))
  const [open, setOpen] = useSlideState<boolean[]>('teams.open', teamsConfig.apps.map(() => false))
  const [formed, setFormed] = useSlideState('teams.formed', false)
  const names = useLesson((s) => s.teamNames)

  const flip = (i: number) => {
    if (open[i]) return
    setOpen(open.map((o, j) => (j === i ? true : o)))
    play('click')
  }

  return (
    <Slide>
      <SlideHeader stage="2 · Топқа бөлу" title={teamsConfig.prompt} icon={<Users size={44} />} />
      <div className="mt-8 grid flex-1 grid-cols-[1000px_1fr] gap-10">
        <div>
          <div className="grid grid-cols-4 gap-5">
            {teamsConfig.apps.map((app, i) => {
              const Icon = APP_ICONS[app.icon] ?? AppWindow
              const team = assign[i]
              return (
                <button key={app.name} type="button" onClick={() => flip(i)} className="relative h-[170px] [perspective:900px]">
                  <motion.div
                    className="absolute inset-0 [transform-style:preserve-3d]"
                    animate={{ rotateY: open[i] ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[22px] text-white shadow-card [backface-visibility:hidden]"
                      style={{ background: `linear-gradient(145deg, ${app.color}, ${app.color}cc)` }}
                    >
                      <Icon size={58} strokeWidth={1.8} />
                      <span className="text-[23px] font-bold">{app.name}</span>
                    </div>
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-[22px] border-4 bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]"
                      style={{ borderColor: TEAM_COLORS[team] }}
                    >
                      <span className="text-[18px] font-medium text-muted">{app.name}</span>
                      <span className="text-[44px] font-extrabold" style={{ color: TEAM_COLORS[team] }}>{team + 1}-топ</span>
                    </div>
                  </motion.div>
                </button>
              )
            })}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button type="button" className="btn btn-ghost h-12 px-5 text-[18px]" onClick={() => { setAssign(balanced()); setOpen(open.map(() => false)); setFormed(false) }}>
              <Shuffle size={19} /> Араластыру
            </button>
            <button type="button" className="btn btn-ghost h-12 px-5 text-[18px]" onClick={() => { setOpen(open.map(() => false)); setFormed(false) }}>
              <RotateCcw size={19} /> Қайта бастау
            </button>
            <span className="ml-2 text-[18px] text-muted">Студент картаны таңдайды → картаның артында тобы шығады</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {[0, 1].map((t) => (
            <TeamCard key={t} index={t as 0 | 1} name={names[t]} formed={formed} apps={teamsConfig.apps.filter((_, i) => open[i] && assign[i] === t).map((a) => a.name)} />
          ))}
          <div className="flex items-center gap-4">
            {!formed ? (
              <button type="button" className="btn btn-primary h-16 flex-1 text-[24px]" onClick={() => { setFormed(true); play('success') }}>
                <PartyPopper size={26} /> Топтарды бекіту
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex h-16 flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-brand to-teal text-[28px] font-bold text-white shadow-lift"
                >
                  🤝 {teamsConfig.wish}
                </motion.div>
              </AnimatePresence>
            )}
            <TaskTimer stage="teams" compact />
          </div>
        </div>
      </div>
    </Slide>
  )
}

function TeamCard({ index, name, formed, apps }: { index: 0 | 1; name: string; formed: boolean; apps: string[] }) {
  const setName = useLesson((s) => s.setTeamName)
  const [edit, setEdit] = useState(false)
  const color = TEAM_COLORS[index]
  return (
    <motion.div
      layout
      animate={formed ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="card relative flex-1 overflow-hidden p-7"
      style={formed ? { borderColor: color, boxShadow: `0 20px 40px -18px ${color}88` } : undefined}
    >
      <motion.div
        className="absolute inset-y-0 left-0"
        initial={false}
        animate={{ width: formed ? '100%' : 10 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
      />
      <div className={`relative ${formed ? 'text-white' : ''}`}>
        <div className={`text-[20px] font-semibold uppercase tracking-[0.16em] ${formed ? 'text-white/80' : 'text-muted'}`}>{index + 1}-топ</div>
        <div className="mt-1 flex items-center gap-3">
          {edit ? (
            <input
              autoFocus value={name} onChange={(e) => setName(index, e.target.value)} onBlur={() => setEdit(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEdit(false)}
              className="w-full rounded-xl border border-line bg-white px-3 py-1 text-[40px] font-extrabold text-navy"
            />
          ) : (
            <>
              <span className="text-[46px] font-extrabold leading-tight" style={{ color: formed ? 'white' : color }}>{name}</span>
              <button type="button" onClick={() => setEdit(true)} className={`rounded-lg p-2 ${formed ? 'text-white/70 hover:bg-white/10' : 'text-muted hover:bg-paper'}`} aria-label="Атауын өзгерту">
                <Pencil size={20} />
              </button>
            </>
          )}
        </div>
        <div className="mt-3 flex min-h-[40px] flex-wrap gap-2">
          {apps.map((a) => (
            <motion.span key={a} initial={{ scale: 0 }} animate={{ scale: 1 }}
              className={`rounded-full px-3 py-1 text-[18px] font-semibold ${formed ? 'bg-white/20 text-white' : 'bg-paper text-navy'}`}>
              {a}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
