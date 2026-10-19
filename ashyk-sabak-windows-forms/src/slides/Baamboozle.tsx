import { useState } from 'react'
import { motion } from 'motion/react'
import { ExternalLink, Gamepad2, Link2, Minus, Plus, Trophy, Check } from 'lucide-react'
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
    <div className="grid flex-1 grid-cols-2 gap-6">
      {([0, 1] as const).map((i) => (
        <div key={i} className="card relative flex flex-col justify-center overflow-hidden p-6 text-center" style={{ borderColor: `${TEAM_COLORS[i]}55` }}>
          <div className="absolute inset-x-0 top-0 h-2" style={{ background: TEAM_COLORS[i] }} />
          <div className="flex items-center justify-center gap-2 text-[18px] font-semibold uppercase tracking-[0.14em] text-muted">
            {i + 1}-топ {lead === i && <Trophy size={20} className="text-amber" />}
          </div>
          <div className="truncate text-[38px] font-extrabold" style={{ color: TEAM_COLORS[i] }}>{names[i]}</div>
          <motion.input
            key={scores[i]}
            initial={{ scale: 1.25 }} animate={{ scale: 1 }}
            type="number" min={0} value={scores[i]} onChange={(e) => set(i, Number(e.target.value))}
            className={`mx-auto block w-[220px] bg-transparent text-center font-mono font-extrabold tabular-nums text-navy outline-none ${big ? 'text-[170px] leading-[1.1]' : 'text-[72px]'}`}
          />
          <div className="mt-2 flex justify-center gap-3">
            <button type="button" className="btn btn-ghost h-14 w-14" onClick={() => add(i, -1)} aria-label="−1"><Minus /></button>
            <button type="button" className="btn h-14 w-20 text-[22px] text-white" style={{ background: TEAM_COLORS[i] }} onClick={() => { add(i, 1); play('click') }}><Plus size={20} />1</button>
            <button type="button" className="btn h-14 w-20 text-[22px] text-white" style={{ background: TEAM_COLORS[i] }} onClick={() => { add(i, 5); play('click') }}><Plus size={20} />5</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Baamboozle() {
  const link = useLesson((s) => s.links.baamboozle)
  const setLink = useLesson((s) => s.setLink)
  const [edit, setEdit] = useState(false)
  return (
    <Slide>
      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-[#fde68a]/40 to-transparent" />
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
