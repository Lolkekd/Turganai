import { useState } from 'react'
import { motion } from 'motion/react'
import { ExternalLink, Gamepad2, Link2, Minus, Plus, Star, Trophy, Check } from 'lucide-react'
import { useLesson } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { TEAM_COLORS } from './Teams'
import { play } from '../lib/sound'

export function openExternal(url: string) {
  if (!url) return
  window.open(url, '_blank', 'noopener')
}

export function TeamScoreboard({ big = true }: { big?: boolean }) {
  const names = useLesson((s) => s.teamNames)
  const scores = useLesson((s) => s.teamScores)
  const add = useLesson((s) => s.addScore)
  const set = useLesson((s) => s.setScore)
  const lead = scores[0] === scores[1] ? -1 : scores[0] > scores[1] ? 0 : 1
  return (
    <div className="relative grid flex-1 grid-cols-2 gap-8">
      {([0, 1] as const).map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, rotate: i ? 3 : -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.15 + i * 0.15, type: 'spring', damping: 16 }}
          className="relative flex flex-col justify-center overflow-hidden rounded-[34px] p-6 text-center text-white"
          style={{ background: GRADS[i], boxShadow: `0 26px 50px -22px ${TEAM_COLORS[i]}` }}
        >
          {/* декоративные звёзды */}
          <Star className="absolute left-6 top-6 text-white/25" size={46} fill="currentColor" />
          <Star className="absolute bottom-8 right-8 text-white/20" size={64} fill="currentColor" />
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-center gap-2 text-[19px] font-bold uppercase tracking-[0.16em] text-white/80">
            {i + 1}-топ {lead === i && <Trophy size={22} className="text-[#fde047]" />}
          </div>
          <div className="relative truncate text-[40px] font-extrabold">{names[i]}</div>
          <motion.input
            key={scores[i]}
            initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
            type="number" min={0} value={scores[i]} onChange={(e) => set(i, Number(e.target.value))}
            className={`relative mx-auto block w-[260px] bg-transparent text-center font-mono font-black tabular-nums text-white outline-none drop-shadow-[0_6px_0_rgba(0,0,0,0.12)] ${big ? 'text-[170px] leading-[1.1]' : 'text-[72px]'}`}
          />
          <div className="relative mt-2 flex justify-center gap-3">
            <button type="button" className="btn h-14 w-14 bg-white/20 text-white hover:bg-white/30" onClick={() => add(i, -1)} aria-label="−1"><Minus /></button>
            <button type="button" className="btn h-14 w-20 bg-white text-[22px]" style={{ color: TEAM_COLORS[i] }} onClick={() => { add(i, 1); play('click') }}><Plus size={20} />1</button>
            <button type="button" className="btn h-14 w-20 bg-white text-[22px]" style={{ color: TEAM_COLORS[i] }} onClick={() => { add(i, 5); play('click') }}><Plus size={20} />5</button>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: 'spring' }}
        className="absolute left-1/2 top-1/2 z-10 grid h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-white text-[34px] font-black text-white shadow-lift"
        style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}
      >
        VS
      </motion.div>
    </div>
  )
}

const GRADS = ['linear-gradient(150deg, #3b82f6, #2563eb 50%, #7c3aed)', 'linear-gradient(150deg, #2dd4bf, #0fb5a6 50%, #0ea5e9)']

export default function Baamboozle() {
  const link = useLesson((s) => s.links.baamboozle)
  const setLink = useLesson((s) => s.setLink)
  const [edit, setEdit] = useState(false)
  return (
    <Slide stage="homeworkCheck">
            <div className="relative">
        <SlideHeader
          stage="3 · Baamboozle әдісі · 4 минут"
          title="Үй тапсырмасын тексеру"
          icon={<Gamepad2 size={46} />}
        />
      </div>
      <div className="relative mt-8 grid flex-1 grid-cols-[1fr_560px] gap-10">
        <div className="flex flex-col">
          <TeamScoreboard />
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              'Baamboozle ойынын ашамыз',
              'Топтар кезекпен сұрақ нөмірін таңдайды',
              'Жиналған ұпайды осында жазамыз',
            ].map((t, i) => (
              <div key={t} className="flex items-center gap-4 rounded-2xl bg-white/70 px-5 py-4 text-[23px] text-navy">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber text-[22px] font-bold text-white">{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card flex flex-col items-center p-8 text-center">
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }} transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
              className="grid h-28 w-28 place-items-center rounded-[30px] bg-gradient-to-br from-[#fbbf24] to-[#f97316] text-white shadow-lift"
            >
              <Gamepad2 size={64} />
            </motion.div>
            <div className="mt-4 text-[34px] font-extrabold text-navy">Baamboozle</div>
            <div className="text-[19px] text-muted">Ойын түріндегі викторина · 2 топ</div>
            <button type="button" disabled={!link} onClick={() => openExternal(link)} className="btn mt-6 h-16 w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-[24px] text-white shadow-lift">
              <ExternalLink size={24} /> Baamboozle ашу
            </button>
            <div className="mt-4 w-full">
              {edit ? (
                <div className="flex gap-2">
                  <input autoFocus value={link} onChange={(e) => setLink('baamboozle', e.target.value.trim())}
                    placeholder="https://www.baamboozle.com/…" className="flex-1 rounded-xl border border-line px-3 py-2 font-mono text-[15px]" />
                  <button type="button" className="btn btn-teal h-11 w-11" onClick={() => setEdit(false)}><Check size={18} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => setEdit(true)} className="flex w-full items-center justify-center gap-2 truncate rounded-xl px-3 py-2 font-mono text-[15px] text-muted hover:bg-paper">
                  <Link2 size={16} /> {link || 'Ойын сілтемесін енгізіңіз'}
                </button>
              )}
            </div>
            <div className="mt-1 text-[14px] text-muted">Интернет қажет</div>
          </div>
          <TaskTimer stage="homeworkCheck" />
        </div>
      </div>
    </Slide>
  )
}
