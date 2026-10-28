import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ClipboardList, Code2, Eye, EyeOff, LifeBuoy, ListChecks, Puzzle, Target, Award, Laptop } from 'lucide-react'
import { sumTask, type StageId } from '../config/lesson.config'
import { useLesson, useSlideState } from '../store/useLesson'
import { CodeBlock, DemoNote, Modal, ProposalTag, Slide, SlideHeader, TaskTimer, WinWindow } from '../components/ui'
import { WinDialog } from '../components/WinDialog'
import { play } from '../lib/sound'
import { C, VsLogo } from '../components/brand'

const TAB_COLORS = [C.blue, C.violet, C.teal, C.orange]
const STEP_COLORS = [C.blue, C.violet, C.teal, C.orange, C.coral, '#0ea5e9']

interface PracticeDef {
  key: string
  project: string
  stage: StageId
  stageLabel: string
  title: string
  source: ReactNode
  steps: string[]
  components: [string, string, string][]
  requirements: string[]
  criteria: [string, number][]
  hints: string[]
  sample: string
  demo: ReactNode
}

type Tab = 'steps' | 'components' | 'req' | 'criteria'
const TABS: { id: Tab; label: string; icon: typeof ListChecks }[] = [
  { id: 'steps', label: 'Қадамдар', icon: ListChecks },
  { id: 'components', label: 'Компоненттер', icon: Puzzle },
  { id: 'req', label: 'Талаптар', icon: Target },
  { id: 'criteria', label: 'Бағалау', icon: Award },
]

function PracticeSlide({ p }: { p: PracticeDef }) {
  const [tab, setTab] = useSlideState<Tab>(`${p.key}.tab`, 'steps')
  const [hintsShown, setHintsShown] = useSlideState(`${p.key}.hints`, 0)
  const [codeOpen, setCodeOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const showAnswers = useLesson((s) => s.showAnswers)
  const total = p.criteria.reduce((a, [, n]) => a + n, 0)

  return (
    <Slide stage={p.stage}>
      <SlideHeader stage={p.stageLabel} title={p.title} icon={<Laptop size={44} />} right={<TaskTimer stage={p.stage} />} />
      <div className="mt-2 text-[19px] text-muted">{p.source}</div>
      <div className="mt-5 grid flex-1 grid-cols-[1000px_1fr] gap-9">
        <div className="flex flex-col overflow-hidden rounded-[22px] border-[3px] border-white bg-white shadow-lift">
          {/* «рабочая область разработчика» */}
          <div className="flex items-center gap-3 px-5 py-2.5 text-[17px] font-semibold text-white" style={{ background: `linear-gradient(90deg, ${C.violet}, ${C.blue})` }}>
            <VsLogo size={26} /> {p.project} — Microsoft Visual Studio
            <span className="ml-auto flex gap-2"><span className="h-3 w-3 rounded-full bg-white/50" /><span className="h-3 w-3 rounded-full bg-white/50" /><span className="h-3 w-3 rounded-full bg-white/80" /></span>
          </div>
          <div className="flex gap-1 bg-[#eef2fb] px-3 pt-2">
            {TABS.map((t, i) => (
              <button key={t.id} type="button" onClick={() => { setTab(t.id); play('click') }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-t-xl border-t-4 py-3 text-[21px] font-semibold transition ${tab === t.id ? 'bg-white' : 'border-transparent text-muted hover:bg-white/60'}`}
                style={tab === t.id ? { borderColor: TAB_COLORS[i], color: TAB_COLORS[i] } : undefined}>
                <t.icon size={22} /> {t.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 px-8 py-6">
              {tab === 'steps' && (
                <ol className="space-y-5">
                  {p.steps.map((s, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-start gap-4 text-[28px] leading-snug text-ink">
                      <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[21px] font-bold text-white" style={{ background: STEP_COLORS[i % STEP_COLORS.length] }}>{i + 1}</span>
                      <span dangerouslySetInnerHTML={{ __html: s }} />
                    </motion.li>
                  ))}
                </ol>
              )}
              {tab === 'components' && (
                <table className="w-full text-[25px]">
                  <thead>
                    <tr className="text-left text-[17px] uppercase tracking-wider text-muted">
                      <th className="pb-2">Компонент</th><th className="pb-2">Қасиет / оқиға</th><th className="pb-2">Мәні</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.components.map((r, i) => (
                      <tr key={i} className="border-t border-line">
                        <td className="py-3.5 font-mono font-semibold text-navy">{r[0]}</td>
                        <td className="py-2.5 font-mono text-violet">{r[1]}</td>
                        <td className="py-2.5">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === 'req' && (
                <ul className="space-y-6">
                  {p.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-[29px] leading-snug text-ink">
                      <span className="mt-2.5 h-3 w-3 shrink-0 rounded-full bg-teal" /> {r}
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'criteria' && (
                <div>
                  <div className="mb-3"><ProposalTag>Ұсынылған бағалау критерийлері</ProposalTag></div>
                  {p.criteria.map(([c, n]) => (
                    <div key={c} className="flex items-center gap-4 border-b border-line py-3.5 text-[26px]">
                      <span className="flex-1 text-ink">{c}</span>
                      <span className="w-20 rounded-lg bg-paper py-1 text-center font-mono font-bold text-navy">{n}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex justify-end gap-4 text-[23px] font-bold text-navy">Барлығы <span className="w-20 text-center font-mono">{total}</span></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[19px] font-semibold uppercase tracking-wider text-muted"><ClipboardList size={20} /> Күтілетін нәтиже</div>
            <DemoNote>Үлгі · браузерде</DemoNote>
          </div>
          {p.demo}
          <div className="mt-auto grid grid-cols-2 gap-3">
            <button type="button" className="btn btn-ghost h-16 text-[21px]" onClick={() => { setHelpOpen(true); play('click') }}>
              <LifeBuoy size={22} className="text-amber" /> Көмек
            </button>
            <button type="button" className="btn btn-primary h-16 text-[21px]" onClick={() => { setCodeOpen(true); play('reveal') }}>
              <Code2 size={22} /> Үлгі кодты көрсету
            </button>
          </div>
        </div>
      </div>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Көмек" width={1000}>
        <div className="space-y-3">
          {p.hints.slice(0, Math.max(1, hintsShown)).map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 rounded-2xl bg-paper p-5 text-[23px] leading-snug">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber font-bold text-white">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: h }} />
            </motion.div>
          ))}
        </div>
        {Math.max(1, hintsShown) < p.hints.length && (
          <button type="button" className="btn btn-ghost mt-5 h-12 px-5 text-[19px]" onClick={() => setHintsShown(Math.max(1, hintsShown) + 1)}>
            Келесі кеңес ({Math.max(1, hintsShown)}/{p.hints.length})
          </button>
        )}
      </Modal>

      <Modal open={codeOpen} onClose={() => setCodeOpen(false)} title="Үлгі код (мұғалім көрсеткенде)" width={1150}>
        <SampleCode code={p.sample} forceShow={showAnswers} />
      </Modal>
    </Slide>
  )
}

function SampleCode({ code, forceShow }: { code: string; forceShow: boolean }) {
  const [shown, setShown] = useState(forceShow)
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button type="button" className="btn btn-ghost h-12 px-5 text-[19px]" onClick={() => setShown(!shown)}>
          {shown ? <EyeOff size={20} /> : <Eye size={20} />} {shown ? 'Жасыру' : 'Кодты ашу'}
        </button>
        <span className="text-[18px] text-muted">Студенттер өздері орындап болғаннан кейін ашыңыз</span>
      </div>
      <div className="relative">
        <CodeBlock code={code} fontSize={19} className={shown ? '' : 'pointer-events-none select-none blur-md'} />
        {!shown && <div className="absolute inset-0 grid place-items-center text-[28px] font-bold text-white drop-shadow">🔒 Жасырылған</div>}
      </div>
    </div>
  )
}

/* ======================= Практикалық жұмыс: «Қосу» формасы ======================= */
function SumFormDemo() {
  const [v, setV] = useSlideState('sumtask.v', { a: '', b: '', c: '' })
  const [err, setErr] = useState(false)
  const add = () => {
    const a = Number(v.a.trim().replace(',', '.'))
    const b = Number(v.b.trim().replace(',', '.'))
    if (!v.a.trim() || !v.b.trim() || !Number.isFinite(a) || !Number.isFinite(b)) { setErr(true); play('error'); return }
    const r = String(Number((a + b).toPrecision(15)))
    setV({ ...v, c: v.a.includes(',') || v.b.includes(',') ? r.replace('.', ',') : r })
    play('success')
  }
  return (
    <div className="relative">
      <WinWindow title="Екі санды қосу">
        <div className="space-y-5 px-9 py-8 text-[21px] text-[#111]">
          {([['a', 'textBox1', 'Бірінші сан'], ['b', 'textBox2', 'Екінші сан']] as const).map(([k, name, label]) => (
            <div key={k} className="grid grid-cols-[170px_1fr] items-center">
              <span>{label}</span>
              <input aria-label={name} value={v[k]} inputMode="decimal" onChange={(e) => setV({ ...v, [k]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && add()} className="win-input h-[46px] text-[21px]" />
            </div>
          ))}
          <div className="grid grid-cols-[170px_1fr] items-center">
            <span>Нәтиже</span>
            <input aria-label="textBox3" value={v.c} readOnly title="ReadOnly = True" className="win-input h-[46px] cursor-not-allowed bg-[#f0f0f0] text-[21px] font-semibold" />
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" className="win-btn h-[54px] w-[170px] text-[21px] !border-[#0078d7]" onClick={add}>Қосу</button>
            <button type="button" className="win-btn h-[54px] w-[150px] text-[19px]" onClick={() => setV({ a: '', b: '', c: '' })}>Тазалау</button>
            <span className="ml-auto self-center rounded-md bg-[#fff7d6] px-3 py-1 font-mono text-[15px] text-[#7a5b00]">textBox3.ReadOnly = True</span>
          </div>
        </div>
      </WinWindow>
      <WinDialog open={err} caption="Қате" icon="Warning" text="Екі санды дұрыс енгізіңіз!" buttons={['OK']} onButton={() => setErr(false)} />
    </div>
  )
}

export function SumTaskPractice() {
  return (
    <PracticeSlide
      p={{
        key: 'sumtask',
        project: 'SumForm',
        stage: 'practice1',
        stageLabel: '8 · Практикалық жұмыс',
        title: '«Қосу» батырмасы бар Windows формасы',
        source: (
          <span className="inline-flex flex-wrap items-center gap-3">
            Құжаттағы тапсырма: Form1 бетіне компоненттерді қойып, «Қосу» батырмасына C# кодын жазу.
            <ProposalTag>Компоненттер тізімі — ұсыныс (құжатта кесте берілмеген)</ProposalTag>
          </span>
        ),
        steps: [
          'Visual Studio-да жаңа <b>Windows Forms</b> жобасын құрыңыз.',
          'Form1 бетіне <b>3 TextBox</b>, <b>1 Button</b> және түсініктеме үшін <b>Label</b> қойыңыз.',
          '<b>textBox3</b> компонентінің <b>ReadOnly</b> қасиетін <b>True</b> етіп орнатыңыз.',
          'button1 батырмасының <b>Text</b> қасиетіне «Қосу» деп жазыңыз.',
          '«Қосу» батырмасын екі рет шертіп, <code>button1_Click</code> әдісіне кодты жазыңыз.',
          'Жобаны <b>F5</b> арқылы іске қосып, екі санның қосындысын тексеріңіз.',
        ],
        components: [
          ['textBox1', 'Text', 'Бірінші сан'],
          ['textBox2', 'Text', 'Екінші сан'],
          ['textBox3', 'ReadOnly', 'True — нәтиже'],
          ['button1', 'Text, Click', 'Қосу'],
          ['label1…label3', 'Text', 'Өріс атаулары'],
        ],
        requirements: [
          'Екі сан енгізіліп, «Қосу» басылғанда қосынды textBox3-ке шығады.',
          sumTask.readOnlyNote,
          'Батырмалар мен өрістер түсінікті орналасқан.',
          'Егер бағдарламада қате болса, оны жасыру емес, түзету – бағдарламашының жауапкершілігі.',
        ],
        criteria: [
          ['Компоненттер дұрыс орналастырылды', 5],
          ['Қасиеттер берілді (Text, ReadOnly)', 5],
          ['button1_Click коды дұрыс жазылды', 10],
          ['Бағдарлама қатесіз іске қосылып, дұрыс есептейді', 5],
          ['Интерфейс ұқыпты және түсінікті', 5],
        ],
        hints: [
          'Батырманы конструкторда <b>екі рет шертсеңіз</b>, <code>button1_Click</code> әдісі автоматты түрде құрылады.',
          'Мәтінді санға айналдыру: <code>Convert.ToDouble(textBox1.Text)</code>',
          'Санды мәтінге айналдыру: <code>sum.ToString()</code>',
          'ReadOnly қасиеті Properties терезесінде: <b>ReadOnly → True</b>.',
        ],
        sample: sumTask.code,
        demo: <SumFormDemo />,
      }}
    />
  )
}
