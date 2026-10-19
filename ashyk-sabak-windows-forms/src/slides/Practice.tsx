import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ClipboardList, Code2, Eye, EyeOff, LifeBuoy, ListChecks, Puzzle, Target, Award, Laptop } from 'lucide-react'
import type { StageId } from '../config/lesson.config'
import { useLesson, useSlideState } from '../store/useLesson'
import { CodeBlock, DemoNote, Modal, ProposalTag, Slide, SlideHeader, TaskTimer, WinWindow } from '../components/ui'
import { WinDialog } from '../components/WinDialog'
import { play } from '../lib/sound'

interface PracticeDef {
  key: string
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
    <Slide>
      <SlideHeader stage={p.stageLabel} title={p.title} icon={<Laptop size={44} />} right={<TaskTimer stage={p.stage} />} />
      <div className="mt-2 text-[19px] text-muted">{p.source}</div>
      <div className="mt-5 grid flex-1 grid-cols-[1000px_1fr] gap-9">
        <div className="card flex flex-col overflow-hidden">
          <div className="flex gap-1.5 border-b border-line bg-paper p-2">
            {TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => { setTab(t.id); play('click') }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[21px] font-semibold transition ${tab === t.id ? 'bg-white text-brand shadow-card' : 'text-muted hover:bg-white/60'}`}>
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
                      <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-[21px] font-bold text-white">{i + 1}</span>
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

/* ======================= №1: түстер ======================= */
const P1_COLORS = [
  { t: 'Жасыл', c: '#008000', n: 'Green' },
  { t: 'Күлгін', c: '#800080', n: 'Purple' },
  { t: 'Қызғылт', c: '#FF69B4', n: 'HotPink' },
]

function Practice1Demo() {
  const [bg, setBg] = useSlideState('p1.bg', '#F0F0F0')
  return (
    <WinWindow title="Менің түстерім" bg={bg}>
      <div className="flex h-[420px] items-start gap-4 p-7">
        {P1_COLORS.map((c) => (
          <button key={c.n} type="button" className="win-btn h-[50px] flex-1 text-[20px]" onClick={() => { setBg(c.c); play('click') }}>{c.t}</button>
        ))}
      </div>
    </WinWindow>
  )
}

export function Practice1() {
  return (
    <PracticeSlide
      p={{
        key: 'p1',
        stage: 'practice1',
        stageLabel: '8 · Практикалық жұмыс №1',
        title: 'Өзіңізге ұнайтын түстермен ауысатын форма',
        source: 'Құжаттағы тапсырма: «Өзіңізге ұнайтын түстермен ауысатын форманы құру бағдарламасы».',
        steps: [
          'Visual Studio-да жаңа <b>Windows Forms</b> жобасын құрыңыз.',
          'Form1 формасының <b>Text</b> қасиетіне атау жазыңыз (мысалы, «Менің түстерім»).',
          '<b>Toolbox</b>-тан формаға кемінде <b>3 Button</b> қойыңыз.',
          'Әр батырманың <b>Text</b> қасиетіне өзіңіз таңдаған түстің атын жазыңыз.',
          'Батырманы екі рет шертіп, <b>Click</b> оқиғасына <code>this.BackColor = Color.…;</code> кодын жазыңыз.',
          'Жобаны сақтап, <b>F5</b> арқылы іске қосып тексеріңіз.',
        ],
        components: [
          ['Form1', 'Text', 'Форма атауы'],
          ['button1', 'Text, Click', '1-түс атауы'],
          ['button2', 'Text, Click', '2-түс атауы'],
          ['button3', 'Text, Click', '3-түс атауы'],
          ['Form1', 'BackColor', 'Кодпен өзгереді'],
        ],
        requirements: [
          'Кемінде үш түрлі түс қолданылады.',
          'Батырмадағы жазу таңдалған түске сәйкес келеді.',
          'Әр батырманың өз Click өңдегіші бар.',
          'Бағдарлама қатесіз іске қосылады.',
          'Жоба сақталады және мұғалімге көрсетіледі.',
        ],
        criteria: [
          ['Жоба дұрыс құрылды', 5],
          ['Компоненттер орналастырылды, Text қасиеттері берілді', 5],
          ['Click оқиғалары дұрыс жазылды', 10],
          ['Бағдарлама қатесіз іске қосылады', 5],
          ['Интерфейс ұқыпты, шығармашылық', 5],
        ],
        hints: [
          'Батырманы конструкторда <b>екі рет шертсеңіз</b>, <code>button1_Click</code> әдісі автоматты түрде құрылады.',
          '<code>Color.</code> деп жазғанда IntelliSense тізімі шығады: <code>Color.Green</code>, <code>Color.Purple</code>, <code>Color.Orange</code>, <code>Color.HotPink</code>…',
          'Код жолы нүктелі үтірмен аяқталуы керек: <code>this.BackColor = Color.Green;</code>',
          'Қате болса, <b>Error List</b> (Список ошибок) терезесін қараңыз.',
        ],
        sample: `public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }

    private void button1_Click(object sender, EventArgs e)
    {
        this.BackColor = Color.Green;     // Жасыл
    }

    private void button2_Click(object sender, EventArgs e)
    {
        this.BackColor = Color.Purple;    // Күлгін
    }

    private void button3_Click(object sender, EventArgs e)
    {
        this.BackColor = Color.HotPink;   // Қызғылт
    }
}`,
        demo: <Practice1Demo />,
      }}
    />
  )
}

/* ======================= №2: «Мен туралы» ======================= */
const P2_FIELDS = [
  { k: 'name', l: 'Аты-жөні', ph: 'Аты-жөніңіз' },
  { k: 'group', l: 'Тобы', ph: 'Тобыңыз' },
  { k: 'spec', l: 'Мамандығы', ph: 'Мамандығыңыз' },
  { k: 'hobby', l: 'Қызығушылығы', ph: 'Қызығушылығыңыз' },
] as const

function Practice2Demo() {
  const [v, setV] = useSlideState<Record<string, string>>('p2.values', {})
  const [out, setOut] = useSlideState('p2.out', '')
  const [warn, setWarn] = useState(false)
  const show = () => {
    if (!v.name?.trim() || !v.group?.trim()) { setWarn(true); play('error'); return }
    setOut(P2_FIELDS.map((f) => `${f.l}: ${v[f.k]?.trim() || '—'}`).join('\n'))
    play('success')
  }
  return (
    <div className="relative">
      <WinWindow title="Мен туралы">
        <div className="grid grid-cols-[1fr_250px] gap-4 p-6 text-[19px] text-[#111]">
          <div className="space-y-4">
            {P2_FIELDS.map((f) => (
              <div key={f.k} className="grid grid-cols-[150px_1fr] items-center">
                <span>{f.l}</span>
                <input value={v[f.k] ?? ''} placeholder={f.ph} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} className="win-input h-[44px] text-[19px] placeholder:text-[#aaa]" />
              </div>
            ))}
            <div className="flex gap-3 pt-3">
              <button type="button" className="win-btn h-[44px] flex-1 text-[18px] !border-[#0078d7]" onClick={show}>Ақпаратты көрсету</button>
              <button type="button" className="win-btn h-[44px] w-[110px] text-[18px]" onClick={() => { setV({}); setOut('') }}>Тазалау</button>
            </div>
          </div>
          <div className="whitespace-pre-wrap rounded border border-[#c8c8c8] bg-white p-3 text-[17px] leading-relaxed text-[#123]">
            <div className="mb-1 text-[13px] text-[#888]">label5</div>
            {out || <span className="text-[#aaa]">Нәтиже осында шығады</span>}
          </div>
        </div>
      </WinWindow>
      <WinDialog open={warn} caption="Ескерту" icon="Warning" text="Аты-жөніңізді және тобыңызды енгізіңіз!" buttons={['OK']} onButton={() => setWarn(false)} />
    </div>
  )
}

export function Practice2() {
  return (
    <PracticeSlide
      p={{
        key: 'p2',
        stage: 'practice2',
        stageLabel: '9 · Практикалық жұмыс №2',
        title: 'Өзі жайлы ақпарат шығатын жоба',
        source: (
          <span className="inline-flex flex-wrap items-center gap-3">
            Құжаттағы тапсырма: «Әрбір студент өзі жайлы ақпарат шығатын жоба жасау».
            <ProposalTag>Төмендегі іске асыру жолы — ұсынылған нұсқа, құжатта сипатталмаған</ProposalTag>
          </span>
        ),
        steps: [
          'Жаңа Windows Forms жобасын құрып, Form1.Text = «Мен туралы» деп жазыңыз.',
          'Формаға 4 <b>Label</b> қойыңыз: Аты-жөні, Тобы, Мамандығы, Қызығушылығы.',
          'Әр Label-дің қасына <b>TextBox</b> қойыңыз (textBox1…textBox4).',
          '<b>Button</b> қойып, Text = «Ақпаратты көрсету» деп жазыңыз.',
          'Нәтижені шығару үшін тағы бір <b>Label</b> (label5) қойыңыз.',
          'Click оқиғасында енгізілген мәтіндерді жинап, <code>label5.Text</code>-ке шығарыңыз. F5 — тексеру.',
        ],
        components: [
          ['Form1', 'Text', 'Мен туралы'],
          ['label1…label4', 'Text', 'Өріс атаулары'],
          ['textBox1…textBox4', 'Text', 'Студент енгізеді'],
          ['button1', 'Text, Click', 'Ақпаратты көрсету'],
          ['label5', 'Text', 'Нәтиже шығады'],
        ],
        requirements: [
          'Төрт өріс бар: аты-жөні, тобы, мамандығы, қызығушылығы.',
          'Батырманы басқанда енгізілген ақпарат толық шығады.',
          'Бос өріс болса, бағдарлама қатесіз жұмыс істейді (ескерту шығуы мүмкін).',
          'Компоненттер ұқыпты, тураланып орналасқан.',
        ],
        criteria: [
          ['Форма және компоненттер орналастырылды', 5],
          ['Text қасиеттері дұрыс берілді', 5],
          ['Click өңдегіші дұрыс жазылды', 10],
          ['Ақпарат толық және дұрыс шығады', 5],
          ['Безендіру, ұқыптылық', 5],
        ],
        hints: [
          'Мәтіндерді <code>+</code> белгісімен біріктіреміз: <code>"Тобы: " + textBox2.Text</code>',
          'Жаңа жолға көшу үшін <code>"\\n"</code> немесе <code>Environment.NewLine</code> қолданыңыз.',
          'Бос өрісті тексеру: <code>if (textBox1.Text == "")</code>',
          'Нәтижені MessageBox арқылы да шығаруға болады: <code>MessageBox.Show(info, "Мен туралы");</code>',
        ],
        sample: `private void button1_Click(object sender, EventArgs e)
{
    if (textBox1.Text == "" || textBox2.Text == "")
    {
        MessageBox.Show("Аты-жөніңізді және тобыңызды енгізіңіз!", "Ескерту",
            MessageBoxButtons.OK, MessageBoxIcon.Warning);
        return;
    }
    label5.Text = "Аты-жөні: " + textBox1.Text + "\\n" +
                  "Тобы: " + textBox2.Text + "\\n" +
                  "Мамандығы: " + textBox3.Text + "\\n" +
                  "Қызығушылығы: " + textBox4.Text;
}`,
        demo: <Practice2Demo />,
      }}
    />
  )
}
