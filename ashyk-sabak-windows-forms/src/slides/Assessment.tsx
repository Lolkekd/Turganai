import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Award, ChevronLeft, ChevronRight, Crown, CreditCard, Minus, Plus, Trash2, UserPlus, Wifi, X } from 'lucide-react'
import { assessment } from '../config/lesson.config'
import { useLesson, type Student } from '../store/useLesson'
import { ProposalTag, Slide, SlideHeader, TaskTimer } from '../components/ui'
import { Overlay, TEAM_COLORS } from './Teams'
import { play } from '../lib/sound'

type Criteria = { name: string; max: number }[]
const teamOf = (s: Student) => (s.id.startsWith('t1-') ? 0 : s.id.startsWith('t2-') ? 1 : -1)
const scoreOf = (s: Student, criteria: Criteria) => (criteria.length ? criteria.reduce((a, c) => a + (s.scores[c.name] ?? 0), 0) : s.bank)

export default function Assessment() {
  const rubric = useLesson((s) => s.rubric)
  const confirmed = useLesson((s) => s.rubricConfirmed)
  const students = useLesson((s) => s.students)
  const addStudent = useLesson((s) => s.addStudent)
  const names = useLesson((s) => s.teamNames)
  const scores = useLesson((s) => s.teamScores)
  const useProposed = rubric === 'proposed' && confirmed
  const criteria = useProposed ? assessment.proposed.criteria : assessment.original.criteria
  const hasCriteria = criteria.length > 0
  const [bankId, setBankId] = useState<string | null>(null)
  const [lastId, setLastId] = useState<string | null>(null)
  const openBank = (id: string) => { setBankId(id); setLastId(id); play('reveal') }
  const shown = students.find((s) => s.id === lastId)

  return (
    <Slide stage="assessment">
      <SlideHeader stage="12 · Бағалау" title="Бағалау" icon={<Award size={44} />} right={<TaskTimer stage="assessment" compact />} />
      <div className="mt-6 grid min-h-0 flex-1 grid-cols-[480px_1fr] grid-rows-[minmax(0,1fr)] gap-9">
        <div className="scroll-thin flex min-h-0 flex-col gap-5 overflow-y-auto">
          <div className="card p-6">
            <div className="text-[17px] font-semibold uppercase tracking-wider text-muted">Топтардың ұпайлары</div>
            <div className="mt-3 space-y-3">
              {([0, 1] as const).map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl px-5 py-3" style={{ background: `${TEAM_COLORS[i]}10` }}>
                  <span className="h-10 w-2 rounded-full" style={{ background: TEAM_COLORS[i] }} />
                  <span className="flex-1 truncate text-[23px] font-bold text-navy">{names[i]}</span>
                  <span className="font-mono text-[40px] font-extrabold tabular-nums" style={{ color: TEAM_COLORS[i] }}>{scores[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[15px] text-muted">Baamboozle мен тест кезінде жиналған ұпайлар</div>
            <div className="mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[16px] font-semibold leading-snug" style={{ background: '#fbbf2422', color: '#92400e' }}>
              <Crown size={20} className="shrink-0" /> {assessment.original.leaderNote}
            </div>
          </div>

          {/* Карточка «Оқушы банкі» как на рисунке в Word */}
          <button type="button" disabled={!shown} onClick={() => shown && openBank(shown.id)} title={shown ? 'Үлкейту' : undefined}
            className="relative shrink-0 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#1d4ed8] via-[#0891b2] to-[#22d3ee] p-6 text-left text-white shadow-lift enabled:hover:brightness-105">
            <div className="flex items-center justify-between">
              <CreditCard size={34} className="text-white/80" />
              <div className="text-right text-[24px] font-extrabold leading-tight">Оқушы банкі<div className="text-[14px] font-medium text-white/70">Ученический банк</div></div>
              <Wifi size={28} className="rotate-90 text-white/80" />
            </div>
            <div className="mt-4 grid grid-cols-[130px_1fr] gap-3 text-[18px]">
              <div className="rounded-xl bg-white/90 px-3 py-2 text-navy"><div className="text-[13px] text-muted">Балл</div><b className="text-[24px]">{shown ? scoreOf(shown, criteria) : '…'}</b></div>
              <div className="min-w-0 rounded-xl bg-white/90 px-3 py-2 text-navy"><div className="text-[13px] text-muted">Аты-жөні</div><b className="block truncate text-[20px]">{shown?.name || '…'}</b></div>
            </div>
          </button>

          <div className="card flex-1 p-6 text-[19px] leading-snug">
            {useProposed ? (
              <>
                <ProposalTag>Мұғалім растаған ұсыныс</ProposalTag>
                <div className="mt-2 font-bold text-navy">{assessment.proposed.title}</div>
                {assessment.proposed.criteria.map((c) => (
                  <div key={c.name} className="flex justify-between border-b border-line py-1 text-[17px]"><span>{c.name}</span><b className="font-mono">{c.max}</b></div>
                ))}
              </>
            ) : (
              <>
                <div className="font-bold text-navy">{assessment.original.title}</div>
                <p className="mt-1 text-muted">{assessment.original.description}</p>
                <p className="mt-2 text-[15px] text-muted">100 балдық ұсынылған шкаланы мұғалім панелінде (T) растағаннан кейін қосуға болады.</p>
              </>
            )}
          </div>
        </div>

        <div className="card flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <div className="text-[22px] font-bold text-navy">Студенттердің бағалау парағы</div>
            <button type="button" className="btn btn-primary h-12 px-5 text-[18px]" onClick={addStudent}><UserPlus size={20} /> Студент қосу</button>
          </div>
          {hasCriteria && (
            <div className="grid items-end gap-2 bg-paper px-6 py-2 text-[14px] font-semibold leading-tight text-muted" style={{ gridTemplateColumns: `minmax(220px,1fr) repeat(${criteria.length}, 92px) 90px 44px 44px` }}>
              <span>Аты-жөні</span>
              {criteria.map((c) => <span key={c.name} className="text-center" title={c.name}>{c.name.split(' ').slice(0, 2).join(' ')}<br /><span className="font-mono text-navy">/{c.max}</span></span>)}
              <span className="text-center">Барлығы</span><span /><span />
            </div>
          )}
          <div className="scroll-thin flex-1 overflow-y-auto px-6 py-3">
            {students.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-5 text-center text-[22px] text-muted">
                <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: -6 }} transition={{ type: 'spring' }}
                  className="grid h-28 w-28 place-items-center rounded-[32px] text-white shadow-lift" style={{ background: 'linear-gradient(140deg, #fbbf24, #f97316 55%, #fb7185)' }}>
                  <Award size={60} />
                </motion.div>
                <div>Студенттер әлі қосылмаған.<br />«Студент қосу» батырмасын басып, аты-жөнін енгізіңіз.</div>
              </div>
            )}
            <AnimatePresence initial={false}>
              {students.map((s, i) => (
                <motion.div key={s.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}>
                  {hasCriteria ? <RubricRow s={s} i={i} criteria={criteria} onBank={() => openBank(s.id)} /> : <BankRow s={s} i={i} onBank={() => openBank(s.id)} />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {bankId && (
          <BankModal students={students} id={bankId} criteria={criteria}
            onMove={(id) => { setBankId(id); setLastId(id); play('click') }} onClose={() => setBankId(null)} />
        )}
      </AnimatePresence>
    </Slide>
  )
}

function BankButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title="Оқушы банкін көру" aria-label="Оқушы банкі"
      className="btn h-11 w-11 text-[#0891b2] hover:bg-[#ecfeff]"><CreditCard size={20} /></button>
  )
}

/** Большая карточка «Оқушы банкі» выбранного студента (← → — соседние студенты). */
function BankModal({ students, id, criteria, onMove, onClose }: {
  students: Student[]; id: string; criteria: Criteria; onMove: (id: string) => void; onClose: () => void
}) {
  const i = students.findIndex((s) => s.id === id)
  const s = students[i]
  if (!s) return null
  const team = teamOf(s)
  const move = (d: number) => { const n = students[i + d]; if (n) onMove(n.id) }
  const score = scoreOf(s, criteria)
  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center gap-8" onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') move(-1); if (e.key === 'ArrowRight') move(1) }} tabIndex={-1} ref={(el) => el?.focus()}>
        <button type="button" className="btn btn-ghost h-20 w-20 !rounded-full bg-white/90" disabled={i <= 0} onClick={() => move(-1)} aria-label="Алдыңғы оқушы"><ChevronLeft size={36} /></button>
        <motion.div key={s.id} initial={{ rotateY: -70, opacity: 0, scale: 0.85 }} animate={{ rotateY: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 150 }}
          className="relative w-[980px] overflow-hidden rounded-[48px] bg-gradient-to-br from-[#1d4ed8] via-[#0891b2] to-[#22d3ee] p-12 text-white"
          style={{ boxShadow: '0 50px 110px -40px #0891b2' }}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-32 left-40 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <CreditCard size={64} className="text-white/85" />
            <div className="text-right text-[48px] font-extrabold leading-tight">Оқушы банкі<div className="text-[24px] font-medium text-white/75">Ученический банк</div></div>
            <Wifi size={52} className="rotate-90 text-white/85" />
          </div>
          <div className="relative mt-10 grid grid-cols-[260px_1fr] gap-6">
            <div className="rounded-3xl bg-white/95 px-7 py-5 text-navy">
              <div className="text-[22px] text-muted">Балл</div>
              <motion.b key={score} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="block font-mono text-[84px] leading-none">{score}</motion.b>
            </div>
            <div className="min-w-0 rounded-3xl bg-white/95 px-7 py-5 text-navy">
              <div className="text-[22px] text-muted">Аты-жөні</div>
              <b className="mt-2 block text-[50px] leading-tight">{s.name || '—'}</b>
            </div>
          </div>
          <div className="relative mt-8 flex items-center justify-between text-[24px] font-semibold text-white/85">
            <span className="flex items-center gap-3">
              {team >= 0 && <span className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: TEAM_COLORS[team as 0 | 1] }} />}
              {team >= 0 ? `${team + 1}-топ` : ''}
            </span>
            <span className="font-mono">{i + 1} / {students.length}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Жабу" className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white/20 hover:bg-white/30"><X size={26} /></button>
        </motion.div>
        <button type="button" className="btn btn-ghost h-20 w-20 !rounded-full bg-white/90" disabled={i >= students.length - 1} onClick={() => move(1)} aria-label="Келесі оқушы"><ChevronRight size={36} /></button>
      </div>
    </Overlay>
  )
}

function NameInput({ s, i }: { s: Student; i: number }) {
  const update = useLesson((st) => st.updateStudent)
  // студенты из составов групп имеют id вида t1-3 / t2-7
  const team = teamOf(s)
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="w-7 text-right font-mono text-[16px] text-muted">{i + 1}</span>
      {team >= 0 && <span className="h-3 w-3 shrink-0 rounded-full" title={`${team + 1}-топ`} style={{ background: TEAM_COLORS[team as 0 | 1] }} />}
      <input value={s.name} placeholder="Аты-жөні" onChange={(e) => update(s.id, { name: e.target.value })}
        className="min-w-0 flex-1 rounded-xl border border-line px-3 py-2 text-[20px] font-semibold text-navy placeholder:font-normal placeholder:text-[#a0aec0]" />
    </div>
  )
}

function BankRow({ s, i, onBank }: { s: Student; i: number; onBank: () => void }) {
  const update = useLesson((st) => st.updateStudent)
  const remove = useLesson((st) => st.removeStudent)
  const set = (v: number) => update(s.id, { bank: Math.max(0, Math.min(100, Number.isFinite(v) ? Math.round(v) : 0)) })
  return (
    <div className="mb-2 grid grid-cols-[1fr_auto_44px_44px] items-center gap-3 rounded-2xl border border-line px-4 py-2.5">
      <NameInput s={s} i={i} />
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-ghost h-11 w-11" onClick={() => set(s.bank - 1)}><Minus size={18} /></button>
        <input type="number" min={0} max={100} value={s.bank} onChange={(e) => set(Number(e.target.value))} className="w-24 rounded-xl border border-line py-1.5 text-center font-mono text-[26px] font-bold text-navy" />
        <button type="button" className="btn btn-ghost h-11 w-11" onClick={() => set(s.bank + 1)}><Plus size={18} /></button>
        <button type="button" className="btn btn-ghost h-11 px-3 text-[16px]" onClick={() => set(s.bank + 5)}>+5</button>
        <span className="ml-1 text-[17px] text-muted">балл</span>
      </div>
      <BankButton onClick={onBank} />
      <button type="button" className="btn h-11 w-11 text-[#b91c1c] hover:bg-[#fef2f2]" onClick={() => remove(s.id)} aria-label="Жою"><Trash2 size={18} /></button>
    </div>
  )
}

function RubricRow({ s, i, criteria, onBank }: { s: Student; i: number; criteria: Criteria; onBank: () => void }) {
  const update = useLesson((st) => st.updateStudent)
  const remove = useLesson((st) => st.removeStudent)
  const total = criteria.reduce((a, c) => a + (s.scores[c.name] ?? 0), 0)
  return (
    <div className="mb-2 grid items-center gap-2 rounded-2xl border border-line py-2 pr-2" style={{ gridTemplateColumns: `minmax(220px,1fr) repeat(${criteria.length}, 92px) 90px 44px 44px` }}>
      <NameInput s={s} i={i} />
      {criteria.map((c) => (
        <input key={c.name} type="number" min={0} max={c.max} value={s.scores[c.name] ?? ''} placeholder="0"
          onChange={(e) => {
            const v = Math.max(0, Math.min(c.max, Math.round(Number(e.target.value) || 0)))
            update(s.id, { scores: { ...s.scores, [c.name]: v } })
          }}
          className="rounded-lg border border-line py-1.5 text-center font-mono text-[20px]" />
      ))}
      <span className="text-center font-mono text-[28px] font-extrabold text-teal">{total}</span>
      <BankButton onClick={onBank} />
      <button type="button" className="btn h-11 w-11 text-[#b91c1c] hover:bg-[#fef2f2]" onClick={() => remove(s.id)} aria-label="Жою"><Trash2 size={18} /></button>
    </div>
  )
}
