import { AnimatePresence, motion } from 'motion/react'
import { Bomb, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, GraduationCap, RotateCcw, XCircle } from 'lucide-react'
import { quiz } from '../config/lesson.config'
import { useLesson, useSlideState } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { Burst } from '../components/brand'
import { openExternal } from './Baamboozle'
import { TEAM_COLORS } from './Teams'
import { play } from '../lib/sound'

interface QState { idx: number; picked: (number | null)[]; checked: boolean[] }
const LETTERS = ['A', 'B', 'C', 'D']
const SHAPES = ['▲', '◆', '●', '■']
const OPT_COLORS = ['#2563eb', '#7c3aed', '#0fb5a6', '#f97316']

export default function Quiz() {
  const link = useLesson((s) => s.links.genially)
  const showAnswers = useLesson((s) => s.showAnswers)
  const names = useLesson((s) => s.teamNames)
  const addScore = useLesson((s) => s.addScore)
  const [st, setSt] = useSlideState<QState>('quiz.state', { idx: 0, picked: quiz.map(() => null), checked: quiz.map(() => false) })
  const q = quiz[st.idx]
  const picked = st.picked[st.idx]
  const checked = st.checked[st.idx]
  const correctCount = quiz.filter((qq, i) => st.checked[i] && st.picked[i] === qq.correct).length
  const answered = st.checked.filter(Boolean).length

  const pick = (i: number) => {
    if (checked) return
    setSt({ ...st, picked: st.picked.map((p, j) => (j === st.idx ? i : p)) })
    play('click')
  }
  const check = () => {
    if (picked === null) return
    setSt({ ...st, checked: st.checked.map((c, j) => (j === st.idx ? true : c)) })
    play(picked === q.correct ? 'success' : 'error')
  }
  const go = (d: number) => setSt({ ...st, idx: Math.max(0, Math.min(quiz.length - 1, st.idx + d)) })

  return (
    <Slide stage="consolidation">
      <SlideHeader stage="11 · Сабақты бекіту · Genially" title="Білімді бекіту" icon={<GraduationCap size={44} />} right={<TaskTimer stage="consolidation" compact />} />
      <div className="mt-6 grid flex-1 grid-cols-[1fr_440px] gap-9">
        <div className="card relative flex flex-col p-8">
          <Burst trigger={checked && picked === q.correct ? `ok-${st.idx}` : null} />
          <div className="flex items-center gap-2">
            {quiz.map((qq, i) => {
              const state = st.checked[i] ? (st.picked[i] === qq.correct ? 'ok' : 'bad') : i === st.idx ? 'now' : 'idle'
              return (
                <button key={i} type="button" onClick={() => setSt({ ...st, idx: i })}
                  className={`h-10 flex-1 rounded-lg text-[17px] font-bold transition ${
                    state === 'ok' ? 'bg-teal text-white' : state === 'bad' ? 'bg-[#ef4444] text-white' : state === 'now' ? 'bg-violet text-white' : 'bg-paper text-muted'
                  } ${i === st.idx ? 'ring-4 ring-cyan/40' : ''}`}>
                  {i + 1}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={st.idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="mt-6 flex flex-1 flex-col">
              <div className="text-[18px] font-semibold uppercase tracking-wider text-cyan">{st.idx + 1}-сұрақ / {quiz.length}</div>
              <div className="mt-1 text-[46px] font-extrabold leading-tight text-navy">{q.q}</div>
              <div className="mt-6 grid grid-cols-2 gap-5">
                {q.options.map((o, i) => {
                  const isCorrect = i === q.correct
                  const color = OPT_COLORS[i]
                  const faded = checked && !isCorrect && i !== picked
                  const wrong = checked && !isCorrect && i === picked
                  return (
                    <motion.button
                      key={i} type="button" onClick={() => pick(i)}
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={wrong ? { opacity: 1, y: 0, scale: 1, x: [0, -12, 12, -8, 8, 0] } : { opacity: faded ? 0.35 : 1, y: 0, scale: picked === i && !checked ? 1.03 : 1 }}
                      transition={{ delay: wrong ? 0 : i * 0.07, duration: wrong ? 0.45 : 0.35 }}
                      whileHover={checked ? undefined : { y: -4 }}
                      whileTap={checked ? undefined : { scale: 0.97 }}
                      className="relative flex min-h-[124px] items-center gap-5 rounded-[26px] px-6 py-4 text-left text-[26px] font-semibold leading-snug text-white"
                      style={{
                        background: wrong ? '#94a3b8' : `linear-gradient(140deg, ${color}, ${color}d9)`,
                        boxShadow: picked === i ? `0 0 0 5px white, 0 0 0 9px ${color}, 0 18px 30px -14px ${color}` : `0 7px 0 ${color}66, 0 16px 26px -16px ${color}`,
                        outline: !checked && showAnswers && isCorrect ? '4px dashed white' : 'none', outlineOffset: -10,
                      }}
                    >
                      <span className="pointer-events-none absolute bottom-1 right-4 text-[64px] leading-none text-white/15">{SHAPES[i]}</span>
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/25 text-[28px] font-black">{LETTERS[i]}</span>
                      <span className="flex-1">{o}</span>
                      {checked && isCorrect && (
                        <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white" style={{ color }}>
                          <CheckCircle2 size={34} />
                        </motion.span>
                      )}
                      {wrong && <XCircle className="shrink-0 text-white" size={34} />}
                    </motion.button>
                  )
                })}
              </div>
              <div className="mt-auto pt-4">
                <AnimatePresence>
                  {checked && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl px-6 py-4 text-[23px] leading-snug ${picked === q.correct ? 'bg-teal/10 text-[#0f5f58]' : 'bg-[#fef2f2] text-[#991b1b]'}`}>
                      <b>{picked === q.correct ? 'Дұрыс! ' : `Дұрыс жауап: ${LETTERS[q.correct]}. `}</b>{q.explain}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mt-4 flex items-center gap-3">
                  <button type="button" className="btn btn-ghost h-14 w-14" disabled={st.idx === 0} onClick={() => go(-1)}><ChevronLeft /></button>
                  {!checked ? (
                    <button type="button" className="btn btn-primary h-14 flex-1 text-[22px]" disabled={picked === null} onClick={check}>Тексеру</button>
                  ) : (
                    <div className="flex flex-1 items-center gap-3">
                      <span className="text-[18px] text-muted">Ұпай қосу:</span>
                      {([0, 1] as const).map((t) => (
                        <button key={t} type="button" className="btn h-14 flex-1 truncate px-3 text-[19px] text-white" style={{ background: TEAM_COLORS[t] }} onClick={() => { addScore(t, 1); play('click') }}>
                          +1 {names[t]}
                        </button>
                      ))}
                    </div>
                  )}
                  <button type="button" className="btn btn-ghost h-14 w-14" disabled={st.idx === quiz.length - 1} onClick={() => go(1)}><ChevronRight /></button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4c1d95] to-[#7c3aed] p-7 text-white shadow-lift">
            <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 2 }} className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15">
              <Bomb size={46} />
            </motion.div>
            <div className="mt-4 text-[30px] font-extrabold">Genially · Bomb quiz</div>
            <div className="text-[18px] text-white/75">Құжаттағы интерактивті тест · интернет қажет</div>
            <button type="button" disabled={!link} onClick={() => openExternal(link)} className="btn mt-5 h-14 w-full bg-white text-[21px] text-violet">
              <ExternalLink size={21} /> Genially тестін ашу
            </button>
          </div>
          <div className="card flex-1 p-7">
            <div className="text-[18px] font-semibold uppercase tracking-wider text-muted">Резервтік тест (интернетсіз)</div>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-mono text-[80px] font-extrabold leading-none text-teal">{correctCount}</span>
              <span className="pb-2 text-[26px] text-muted">/ {answered} дұрыс</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-paper">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-brand to-teal" animate={{ width: `${(answered / quiz.length) * 100}%` }} />
            </div>
            <div className="mt-2 text-[17px] text-muted">{answered} / {quiz.length} сұрақ тексерілді</div>
            <button type="button" className="btn btn-ghost mt-6 h-12 px-4 text-[17px]" onClick={() => setSt({ idx: 0, picked: quiz.map(() => null), checked: quiz.map(() => false) })}>
              <RotateCcw size={17} /> Тестті қайта бастау
            </button>
          </div>
        </div>
      </div>
    </Slide>
  )
}
