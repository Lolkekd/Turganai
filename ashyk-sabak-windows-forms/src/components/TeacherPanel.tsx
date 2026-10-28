import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Clock, Eye, Link2, ListOrdered, RotateCcw, Settings, Users, Volume2, VolumeX, X } from 'lucide-react'
import { slides } from '../slides'
import { lessonInfo, stages, type StageId } from '../config/lesson.config'
import { timerElapsed, useLesson, type HomeworkVariant } from '../store/useLesson'
import { useTick } from './ui'

type Tab = 'stages' | 'timers' | 'teams' | 'links' | 'settings'

const TABS: { id: Tab; label: string; icon: typeof Clock }[] = [
  { id: 'stages', label: 'Кезеңдер', icon: ListOrdered },
  { id: 'timers', label: 'Таймерлер', icon: Clock },
  { id: 'teams', label: 'Топтар', icon: Users },
  { id: 'links', label: 'Сілтемелер', icon: Link2 },
  { id: 'settings', label: 'Баптаулар', icon: Settings },
]

export function TeacherPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('stages')
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-navy/30"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          />
          <motion.aside
            className="absolute bottom-0 right-0 top-0 z-50 flex w-[680px] flex-col border-l border-line bg-white shadow-2xl"
            initial={{ x: 700 }} animate={{ x: 0 }} exit={{ x: 700 }} transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-line px-7 py-5">
              <div>
                <div className="text-[14px] font-semibold uppercase tracking-[0.14em] text-cyan">Мұғалім режимі</div>
                <div className="text-[28px] font-bold text-navy">Басқару панелі</div>
              </div>
              <LessonDuration />
              <button type="button" className="btn btn-ghost h-12 w-12" onClick={onClose} aria-label="Жабу"><X /></button>
            </div>
            <div className="flex gap-1.5 border-b border-line bg-paper px-5 py-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[14px] font-semibold transition ${
                    tab === t.id ? 'bg-white text-brand shadow-card' : 'text-muted hover:bg-white/60'
                  }`}
                >
                  <t.icon size={19} /> {t.label}
                </button>
              ))}
            </div>
            <div className="scroll-thin flex-1 overflow-y-auto px-7 py-5 text-[17px]">
              {tab === 'stages' && <StagesTab onClose={onClose} />}
              {tab === 'timers' && <TimersTab />}
              {tab === 'teams' && <TeamsTab />}
              {tab === 'links' && <LinksTab />}
              {tab === 'settings' && <SettingsTab />}
            </div>
            <div className="border-t border-line px-7 py-3 text-[14px] text-muted">
              <kbd>←</kbd> <kbd>→</kbd> слайдтар · <kbd>T</kbd> панель · <kbd>F</kbd> толық экран · <kbd>Esc</kbd> жабу
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function LessonDuration() {
  const t = useLesson((s) => s.lessonTimer)
  const toggle = useLesson((s) => s.lessonToggle)
  const reset = useLesson((s) => s.lessonReset)
  useTick(!!t.runningSince, 500)
  const ms = timerElapsed(t)
  return (
    <div className="flex items-center gap-2">
      <div className="text-right">
        <div className="text-[13px] text-muted">Сабақ уақыты</div>
        <div className="font-mono text-[24px] font-bold tabular-nums text-navy">
          {String(Math.floor(ms / 60000)).padStart(2, '0')}:{String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}
        </div>
      </div>
      <button type="button" className="btn btn-primary h-10 px-3 text-[14px]" onClick={toggle}>{t.runningSince ? 'Кідірту' : 'Бастау'}</button>
      <button type="button" className="btn btn-ghost h-10 w-10" onClick={reset} title="Нөлдеу"><RotateCcw size={16} /></button>
    </div>
  )
}

function StagesTab({ onClose }: { onClose: () => void }) {
  const slide = useLesson((s) => s.slide)
  const goTo = useLesson((s) => s.goTo)
  const minutes = useLesson((s) => s.stageMinutes)
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => { goTo(0); onClose() }}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-paper ${slide === 0 ? 'bg-brand/10' : ''}`}
      >
        <span className="w-8 text-center font-mono text-muted">0</span>
        <span className="font-semibold text-navy">Титулдық бет</span>
      </button>
      {stages.map((st, i) => {
        const list = slides.map((s, idx) => ({ ...s, idx })).filter((s) => s.stage === st.id)
        return (
          <div key={st.id} className="rounded-xl border border-line">
            <div className="flex items-center gap-3 bg-paper px-3 py-1.5 text-[15px] font-bold text-navy">
              <span className="w-8 text-center text-cyan">{i + 1}</span>
              {st.title}
              <span className="ml-auto font-mono text-muted">{minutes[st.id]} мин</span>
            </div>
            {list.map((s) => (
              <button
                key={s.idx}
                type="button"
                onClick={() => { goTo(s.idx); onClose() }}
                className={`flex w-full items-center gap-3 px-3 py-1.5 text-left text-[16px] hover:bg-brand/5 ${slide === s.idx ? 'bg-brand/10 font-semibold text-brand' : 'text-ink'}`}
              >
                <span className="w-8 text-center font-mono text-[14px] text-muted">{s.idx}</span>
                {s.title}
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function TimersTab() {
  const minutes = useLesson((s) => s.stageMinutes)
  const setM = useLesson((s) => s.setStageMinutes)
  const reset = useLesson((s) => s.timerReset)
  const total = Object.values(minutes).reduce((a, b) => a + b, 0)
  return (
    <div>
      <p className="mb-3 text-muted">Кезең ұзақтығы (минут). Таймер біткенде слайд автоматты ауыспайды.</p>
      <div className="space-y-1.5">
        {stages.map((st, i) => (
          <div key={st.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-1.5">
            <span className="w-6 text-center font-mono text-[14px] text-cyan">{i + 1}</span>
            <span className="flex-1">{st.title}{st.method ? <span className="text-muted"> · {st.method}</span> : null}</span>
            <input
              type="number" min={0} max={lessonInfo.durationMin} value={minutes[st.id]}
              onChange={(e) => setM(st.id as StageId, Number(e.target.value))}
              className="w-20 rounded-lg border border-line px-2 py-1 text-center font-mono"
            />
            <button type="button" className="btn btn-ghost h-9 w-9" title="Таймерді нөлдеу" onClick={() => reset(st.id)}><RotateCcw size={15} /></button>
          </div>
        ))}
      </div>
      <div className={`mt-3 rounded-xl px-4 py-2.5 font-semibold ${total === lessonInfo.durationMin ? 'bg-teal/10 text-teal' : 'bg-amber/10 text-[#9a5a06]'}`}>
        Барлығы: {total} мин {total === lessonInfo.durationMin ? '✓' : `(${lessonInfo.durationMin} минут болуы керек)`}
      </div>
    </div>
  )
}

function TeamsTab() {
  const names = useLesson((s) => s.teamNames)
  const scores = useLesson((s) => s.teamScores)
  const setName = useLesson((s) => s.setTeamName)
  const setScore = useLesson((s) => s.setScore)
  const add = useLesson((s) => s.addScore)
  return (
    <div className="space-y-4">
      {([0, 1] as const).map((i) => (
        <div key={i} className="rounded-2xl border border-line p-4">
          <div className="mb-2 text-[14px] font-semibold uppercase tracking-wide text-muted">{i + 1}-топ атауы</div>
          <input
            value={names[i]} onChange={(e) => setName(i, e.target.value)}
            className="w-full rounded-xl border border-line px-3 py-2 text-[20px] font-semibold text-navy"
          />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-muted">Ұпай:</span>
            <button type="button" className="btn btn-ghost h-10 w-10" onClick={() => add(i, -1)}>−</button>
            <input
              type="number" min={0} value={scores[i]} onChange={(e) => setScore(i, Number(e.target.value))}
              className="w-24 rounded-lg border border-line px-2 py-1.5 text-center font-mono text-[20px]"
            />
            <button type="button" className="btn btn-ghost h-10 w-10" onClick={() => add(i, 1)}>+</button>
            <button type="button" className="btn btn-ghost h-10 px-3" onClick={() => add(i, 5)}>+5</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function LinksTab() {
  const links = useLesson((s) => s.links)
  const setLink = useLesson((s) => s.setLink)
  const rows: { k: keyof typeof links; label: string; note: string }[] = [
    { k: 'baamboozle', label: 'Baamboozle', note: 'Құжаттағы скриншоттан алынды — ойынның дұрыс екенін тексеріңіз.' },
    { k: 'learningApps', label: 'LearningApps (пазл)', note: 'Құжаттан алынды.' },
    { k: 'genially', label: 'Genially (тест)', note: 'Құжаттан алынды.' },
  ]
  return (
    <div className="space-y-4">
      <p className="text-muted">Сыртқы сайттар интернетті қажет етеді. Презентацияның өзі интернетсіз жұмыс істейді.</p>
      {rows.map((r) => (
        <label key={r.k} className="block rounded-2xl border border-line p-4">
          <div className="mb-1.5 font-semibold text-navy">{r.label}</div>
          <input
            value={links[r.k]} onChange={(e) => setLink(r.k, e.target.value.trim())}
            placeholder="https://…"
            className="w-full rounded-xl border border-line px-3 py-2 font-mono text-[15px]"
          />
          <div className="mt-1.5 text-[14px] text-muted">{r.note}</div>
        </label>
      ))}
    </div>
  )
}

function Toggle({ on, onChange, label, hint, icon }: { on: boolean; onChange: (v: boolean) => void; label: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex w-full items-center gap-3 rounded-2xl border border-line p-4 text-left hover:bg-paper">
      {icon}
      <span className="flex-1">
        <span className="block font-semibold text-navy">{label}</span>
        {hint && <span className="block text-[14px] text-muted">{hint}</span>}
      </span>
      <span className={`relative h-8 w-14 rounded-full transition ${on ? 'bg-teal' : 'bg-[#cbd5e1]'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? 'left-7' : 'left-1'}`} />
      </span>
    </button>
  )
}

function SettingsTab() {
  const s = useLesson()
  const [confirmReset, setConfirmReset] = useState(false)
  const hw: { v: HomeworkVariant; label: string }[] = [
    { v: 'original', label: 'Құжаттағы тапсырма' },
    { v: 'proposed', label: 'Тақырып бойынша (ұсыныс)' },
    { v: 'both', label: 'Екеуі де' },
  ]
  return (
    <div className="space-y-3">
      <Toggle on={s.showAnswers} onChange={(v) => s.patch({ showAnswers: v })} label="Жауаптарды көрсету" hint="Үлгі кодтар мен тест жауаптары бірден ашық болады" icon={<Eye className="text-brand" />} />
      <Toggle on={s.sound} onChange={(v) => s.patch({ sound: v })} label="Дыбыс" hint="Таймер сигналы, дұрыс/қате жауап" icon={s.sound ? <Volume2 className="text-brand" /> : <VolumeX className="text-muted" />} />
      <Toggle on={s.showLessonTimer} onChange={(v) => s.patch({ showLessonTimer: v })} label="Жалпы таймерді экранда көрсету" icon={<Clock className="text-brand" />} />

      <div className="rounded-2xl border border-line p-4">
        <div className="mb-2 font-semibold text-navy">Үйге тапсырма нұсқасы</div>
        <div className="flex gap-2">
          {hw.map((h) => (
            <button key={h.v} type="button" onClick={() => s.patch({ homeworkVariant: h.v })}
              className={`flex-1 rounded-xl border px-3 py-2 text-[15px] font-semibold ${s.homeworkVariant === h.v ? 'border-brand bg-brand text-white' : 'border-line text-navy hover:bg-paper'}`}>
              {h.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[14px] text-muted">
          Құжаттағы кейбір тапсырмалар (сөздік, set/frozenset) басқа тақырыпқа қатысты. Мәтін өзгертілмеген — таңдау мұғалімде.
        </p>
      </div>

      <div className="rounded-2xl border border-line p-4">
        <div className="mb-2 font-semibold text-navy">Бағалау шкаласы</div>
        <div className="flex gap-2">
          <button type="button" onClick={() => s.patch({ rubric: 'original' })}
            className={`flex-1 rounded-xl border px-3 py-2 text-[15px] font-semibold ${s.rubric === 'original' ? 'border-brand bg-brand text-white' : 'border-line text-navy hover:bg-paper'}`}>
            Құжаттағы «Оқушы банкі»
          </button>
          <button type="button" onClick={() => s.patch({ rubric: 'proposed' })} disabled={!s.rubricConfirmed}
            className={`btn flex-1 rounded-xl border px-3 py-2 text-[15px] font-semibold ${s.rubric === 'proposed' ? 'border-brand bg-brand text-white' : 'border-line text-navy hover:bg-paper'}`}>
            100 балдық (ұсыныс)
          </button>
        </div>
        <label className="mt-3 flex items-start gap-3 text-[15px]">
          <input type="checkbox" className="mt-1 h-5 w-5" checked={s.rubricConfirmed}
            onChange={(e) => s.patch({ rubricConfirmed: e.target.checked, rubric: e.target.checked ? s.rubric : 'original' })} />
          <span>Ұсынылған 100 балдық шкаланы қарап шықтым және қолдануды растаймын.</span>
        </label>
      </div>

      <div className="rounded-2xl border border-[#fecaca] bg-[#fff5f5] p-4">
        <div className="font-semibold text-[#b91c1c]">Жаңа сабаққа дайындау</div>
        <p className="mt-1 text-[14px] text-[#7f1d1d]">
          Ұпайлар, студенттер тізімі, таймерлер, пазл, тест және сандық тазаланады. Сілтемелер, уақыт пен атаулар сақталады.
        </p>
        {!confirmReset ? (
          <button type="button" className="btn mt-3 h-11 bg-[#dc2626] px-4 text-white" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={17} /> Барлығын тазалау
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn h-11 bg-[#dc2626] px-4 text-white" onClick={() => { s.resetLesson(); setConfirmReset(false) }}>Иә, тазалау</button>
            <button type="button" className="btn btn-ghost h-11 px-4" onClick={() => setConfirmReset(false)}>Болдырмау</button>
          </div>
        )}
      </div>
    </div>
  )
}
