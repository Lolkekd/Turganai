import { motion, AnimatePresence } from 'motion/react'
import {
  AppWindow, Bot, Camera, Clapperboard, Ghost, LayoutGrid, Map as MapIcon, MessageCircle, Music, Pencil, Play,
  Handshake, PartyPopper, RotateCcw, Scissors, Send, Shuffle, Store, Users, type LucideIcon,
} from 'lucide-react'
import { teamsConfig } from '../config/lesson.config'
import { useLesson, useSlideState } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { play } from '../lib/sound'
import { useState } from 'react'

const APP_ICONS: Record<string, LucideIcon> = {
  MessageCircle, Camera, Play, Store, LayoutGrid, Send, Music, Ghost, Scissors, Clapperboard, Map: MapIcon, Bot,
}

export const TEAM_COLORS = ['#2563eb', '#0fb5a6'] as const

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
    <Slide stage="teams">
      <SlideHeader stage="2 · Топқа бөлу" title={teamsConfig.prompt} icon={<Users size={44} />} right={<TaskTimer stage="teams" compact />} />
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
          <AnimatePresence mode="wait">
            {!formed ? (
              <motion.button key="btn" type="button" exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="btn btn-primary h-[78px] w-full text-[26px] !rounded-[22px]" onClick={() => { setFormed(true); play('success') }}>
                <PartyPopper size={28} /> Топтарды бекіту
              </motion.button>
            ) : (
              <motion.div
                key="wish"
                initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', damping: 14 }}
                className="relative flex h-[78px] w-full items-center justify-center gap-4 overflow-hidden whitespace-nowrap rounded-[22px] px-6 text-[28px] font-extrabold text-white"
                style={{ background: 'linear-gradient(110deg, #2563eb, #7c3aed 50%, #0fb5a6)', boxShadow: '0 18px 34px -16px #7c3aed' }}
              >
                <motion.span className="absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 blur-xl" animate={{ x: ['0%', '450%'] }} transition={{ duration: 1.6, delay: 0.4, ease: 'easeInOut' }} />
                <motion.span initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.25, type: 'spring' }}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20"><Handshake size={30} /></motion.span>
                {teamsConfig.wish}
              </motion.div>
            )}
          </AnimatePresence>
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
      className="relative flex-1 overflow-hidden rounded-[30px] bg-white p-7 shadow-card"
      style={formed ? { boxShadow: `0 24px 46px -18px ${color}` } : { boxShadow: `inset 0 0 0 2px ${color}30, 0 14px 30px -20px #14306b66` }}
    >
      <motion.div
        className="absolute inset-y-0 left-0"
        initial={false}
        animate={{ width: formed ? '100%' : 10 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
      />
      <span className="pointer-events-none absolute -bottom-10 right-4 select-none text-[220px] font-black leading-none" style={{ color: formed ? '#ffffff22' : `${color}14` }}>{index + 1}</span>
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
