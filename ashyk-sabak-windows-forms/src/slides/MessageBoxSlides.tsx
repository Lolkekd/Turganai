import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageSquareText, Play, RotateCcw } from 'lucide-react'
import { useSlideState } from '../store/useLesson'
import { CodeBlock, DemoNote, DocFigure, FormIcon, Slide, SlideHeader, TaskTimer, WinWindow } from '../components/ui'
import { DialogBox, DialogIcon, WinDialog, type DlgIcon } from '../components/WinDialog'
import { play } from '../lib/sound'
import { DOC } from '../assets/docImages'

/* ======================= Теория ======================= */
const SIGNATURE = `MessageBox.Show(string text,
                string caption,
                MessageBoxButtons buttons,
                MessageBoxIcon icon,
                MessageBoxDefaultButton defaultButton,
                MessageBoxOptions options);`

const PARAMS = [
  { k: 'text', d: 'хабарлама мәтіні' },
  { k: 'caption', d: 'сұқбаттық терезе тақырыбы' },
  { k: 'buttons', d: 'терезеде көрінетін батырмалар' },
  { k: 'icon', d: 'хабарлама белгісі' },
  { k: 'defaultButton', d: 'үнсіз келісім бойынша тағайындалатын батырма' },
  { k: 'options', d: 'хабарлама терезесінің параметрлері' },
]

const BUTTON_VALUES: { v: string; d: string; b: string[] }[] = [
  { v: 'OK', d: 'бір батырма OK', b: ['OK'] },
  { v: 'OKCancel', d: 'екі батырма OK және Cancel', b: ['OK', 'Cancel'] },
  { v: 'YesNo', d: 'екі батырма Yes және No', b: ['Yes', 'No'] },
  { v: 'YesNoCancel', d: 'үш батырма Yes, No және Cancel', b: ['Yes', 'No', 'Cancel'] },
  { v: 'RetryCancel', d: 'екі батырма Retry және Cancel', b: ['Retry', 'Cancel'] },
  { v: 'AbortRetryIgnore', d: 'үш батырма Abort, Retry, Ignore', b: ['Abort', 'Retry', 'Ignore'] },
]

const ICON_VALUES: { v: string; icon: DlgIcon }[] = [
  { v: 'Asterisk, Information', icon: 'Information' },
  { v: 'Error, Hand, Stop', icon: 'Error' },
  { v: 'Exclamation, Warning', icon: 'Warning' },
  { v: 'Question', icon: 'Question' },
  { v: 'None — белгісі жоқ', icon: 'None' },
]

const MORE = {
  default: [['Button1', 'алғашқы батырма'], ['Button2', 'екінші батырма'], ['Button3', 'үшінші батырма']],
  options: [
    ['DefaultDesktopOnly', 'хабарлама белсенді үстелде көрсетіледі'],
    ['RightAlign', 'хабарлама мәтіні оңға қарай тураланады'],
    ['RtlReading', 'терезе элементтері кері жаққа орналасады'],
    ['ServiceNotification', 'белсенді қолданушы болмаса да көрсетіледі'],
  ],
}

const RESULTS = ['OK', 'Cancel', 'Yes', 'No', 'Abort', 'Retry', 'Ignore', 'None']

type Tab = 'buttons' | 'icon' | 'more' | 'result'
const TABS: { id: Tab; label: string }[] = [
  { id: 'buttons', label: 'MessageBoxButtons' },
  { id: 'icon', label: 'MessageBoxIcon' },
  { id: 'more', label: 'DefaultButton · Options' },
  { id: 'result', label: 'DialogResult' },
]

export function MessageBoxTheory() {
  const [param, setParam] = useSlideState('mb.param', 0)
  const [tab, setTab] = useSlideState<Tab>('mb.tab', 'buttons')
  const [btnSel, setBtnSel] = useSlideState('mb.btn', 2)
  const [iconSel, setIconSel] = useSlideState('mb.icon', 0)
  const [pressed, setPressed] = useState<string | null>(null)

  return (
    <Slide stage="demo" decor="code">
      <SlideHeader stage="7 · Енгізу және шығару" title="Енгізу және шығару сұқбаттық терезелері" icon={<MessageSquareText size={44} />} />
      <div className="mt-6 grid flex-1 grid-cols-[820px_1fr] gap-9">
        <div className="flex flex-col gap-5">
          <p className="text-[24px] leading-snug text-ink">
            Мәліметтерді экранға шығару үшін <b className="font-mono text-violet">MessageBox</b> элементінің <b className="font-mono text-violet">Show</b> әдісі қолданылады:
          </p>
          <CodeBlock code={SIGNATURE} highlight={[param + 1]} fontSize={19} title="MessageBox.Show" />
          <div className="grid grid-cols-3 gap-2.5">
            {PARAMS.map((p, i) => (
              <button key={p.k} type="button" onClick={() => setParam(i)}
                className={`rounded-xl border px-3 py-2.5 text-left font-mono text-[19px] transition ${param === i ? 'border-violet bg-violet text-white' : 'border-line bg-white text-navy hover:bg-paper'}`}>
                {p.k}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={param} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card px-6 py-4 text-[26px]">
              <span className="font-mono font-bold text-violet">{PARAMS[param].k}</span> — {PARAMS[param].d}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-1.5 rounded-2xl bg-white p-1.5 shadow-card">
            {TABS.map((t, i) => (
              <button key={t.id} type="button" onClick={() => { setTab(t.id); play('click') }}
                className={`flex-1 rounded-xl px-2 py-2.5 text-[17px] font-semibold transition ${tab === t.id ? 'bg-violet text-white' : 'text-muted hover:bg-paper'}`}>
                <span className="mr-1 opacity-60">{i + 1}.</span>{t.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 flex flex-1 flex-col">
              {tab === 'buttons' && (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    {BUTTON_VALUES.map((b, i) => (
                      <button key={b.v} type="button" onClick={() => setBtnSel(i)}
                        className={`rounded-xl border px-4 py-2.5 text-left transition ${btnSel === i ? 'border-brand bg-brand/5' : 'border-line bg-white hover:bg-paper'}`}>
                        <div className="font-mono text-[20px] font-bold text-brand">{b.v}</div>
                        <div className="text-[17px] text-muted">{b.d}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-auto grid place-items-center pt-4">
                    <DialogBox caption="Хабарлама" text="Мысал хабарлама" icon="Information" buttons={BUTTON_VALUES[btnSel].b} />
                  </div>
                </>
              )}
              {tab === 'icon' && (
                <>
                  <div className="space-y-2">
                    {ICON_VALUES.map((v, i) => (
                      <button key={v.v} type="button" onClick={() => setIconSel(i)}
                        className={`flex w-full items-center gap-4 rounded-xl border px-4 py-2 text-left transition ${iconSel === i ? 'border-brand bg-brand/5' : 'border-line bg-white hover:bg-paper'}`}>
                        <span className="grid h-10 w-10 place-items-center">{v.icon === 'None' ? <span className="text-[14px] text-muted">—</span> : <DialogIcon icon={v.icon} size={34} />}</span>
                        <span className="font-mono text-[21px] font-semibold text-navy">{v.v}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-auto grid place-items-center pt-4">
                    <DialogBox caption="Хабарлама" text="Белгісі бар хабарлама" icon={ICON_VALUES[iconSel].icon} buttons={['OK']} />
                  </div>
                </>
              )}
              {tab === 'more' && (
                <div className="grid grid-cols-1 gap-5">
                  <div className="card p-5">
                    <div className="font-mono text-[21px] font-bold text-brand">MessageBoxDefaultButton</div>
                    {MORE.default.map(([k, d]) => <div key={k} className="mt-1.5 text-[20px]"><span className="font-mono font-semibold text-navy">{k}</span> — {d}</div>)}
                  </div>
                  <div className="card p-5">
                    <div className="font-mono text-[21px] font-bold text-brand">MessageBoxOptions</div>
                    {MORE.options.map(([k, d]) => <div key={k} className="mt-1.5 text-[20px]"><span className="font-mono font-semibold text-navy">{k}</span> — {d}</div>)}
                  </div>
                </div>
              )}
              {tab === 'result' && (
                <>
                  <p className="text-[22px] leading-snug text-ink">
                    <span className="font-mono font-semibold text-violet">MessageBox.Show</span> әдісі қай батырманың басылғанын <span className="font-mono font-semibold text-violet">DialogResult</span> мәні ретінде қайтарады.
                    Батырманы басып көріңіз:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {RESULTS.map((r) => (
                      <span key={r} className={`rounded-lg px-3 py-1.5 font-mono text-[19px] transition ${pressed === r ? 'bg-teal text-white' : 'bg-white text-navy shadow-card'}`}>{r}</span>
                    ))}
                  </div>
                  <div className="mt-auto grid place-items-center pt-4">
                    <DialogBox caption="Хабарлама" text="Жалғастырамыз ба?" icon="Question" buttons={['Yes', 'No', 'Cancel']} onButton={(b) => { setPressed(b); play('click') }} />
                    <div className="mt-3 h-8 font-mono text-[22px] text-navy">{pressed ? `result == DialogResult.${pressed}` : ''}</div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Slide>
  )
}

/* ======================= Демонстрация ======================= */
const EX1 = `private void button1_Click(object sender, EventArgs e)
{
    DialogResult result = MessageBox.Show(
        "Батырманы қызыл түске бояйын ба?",
        "Хабарлама",
        MessageBoxButtons.YesNo,
        MessageBoxIcon.Information,
        MessageBoxDefaultButton.Button1,
        MessageBoxOptions.DefaultDesktopOnly);
    if (result == DialogResult.Yes)
        button1.BackColor = Color.Red;
    this.TopMost = true;
}`

const EX2 = `private void Form1_FormClosing(object sender, FormClosingEventArgs e)
{
    const string message =
        "Шынымен де форманы жабасыз ба?";
    const string caption = "Форманы жабу";
    var result = MessageBox.Show(message, caption,
        MessageBoxButtons.YesNo,
        MessageBoxIcon.Question);
    if (result == DialogResult.No)
    {
        e.Cancel = true;
    }
}`

export function MessageBoxDemo({ teamTask = false }: { teamTask?: boolean }) {
  const [ex1, setEx1] = useSlideState(teamTask ? 'mbt.ex1' : 'mbd.ex1', { red: false, open: false, result: '' })
  const [ex2, setEx2] = useSlideState(teamTask ? 'mbt.ex2' : 'mbd.ex2', { closed: false, open: false, result: '' })
  const [shake, setShake] = useState(0)

  const hl1 = ex1.open ? [3, 4, 5, 6, 7, 8, 9] : ex1.result === 'Yes' ? [10, 11] : ex1.result === 'No' ? [10] : []
  const hl2 = ex2.open ? [6, 7, 8] : ex2.result === 'No' ? [9, 10, 11, 12] : ex2.result === 'Yes' ? [9] : []

  return (
    <Slide stage={teamTask ? 'practice2' : 'demo'} decor="code">
      {teamTask ? (
        <SlideHeader stage="9 · Топтық жұмыс · 2-топтың тапсырмасы" title="Форма бетінде хабарлама шығару" icon={<MessageSquareText size={44} />} right={<TaskTimer stage="practice2" compact />} />
      ) : (
        <SlideHeader stage="7 · MessageBox мысалдары" title="MessageBox.Show және DialogResult" icon={<MessageSquareText size={44} />} right={<DemoNote />} />
      )}
      <div className="mt-6 grid flex-1 grid-cols-2 gap-9">
        {/* Пример 1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-[26px] font-bold text-navy"><span className="text-cyan">Мысал №1.</span> Хабарлама шығару</div>
            <DocFigure src={DOC.fig6} caption="6-сурет. Хабарлама шығару" label="6-сурет" />
          </div>
          <div className="relative h-[220px]">
            <WinWindow title="Form1" width={820}>
              <div className="relative flex h-[176px] items-center justify-center gap-6">
                <button type="button" onClick={() => { setEx1({ ...ex1, open: true, result: '' }); play('click') }}
                  className="win-btn h-[60px] w-[200px] text-[22px]" style={ex1.red ? { background: '#ff0000', color: 'white', borderColor: '#b00' } : undefined}>
                  button1
                </button>
                <button type="button" className="btn btn-ghost h-11 px-3 text-[16px]" onClick={() => setEx1({ red: false, open: false, result: '' })}><RotateCcw size={16} /> Қайта</button>

              </div>
            </WinWindow>
            <WinDialog open={ex1.open} caption="Хабарлама" text="Батырманы қызыл түске бояйын ба?" icon="Information" buttons={['Yes', 'No']}
                  onButton={(b) => { setEx1({ red: b === 'Yes' ? true : ex1.red, open: false, result: b }); play(b === 'Yes' ? 'success' : 'click') }} />
          </div>
          <ResultLine result={ex1.result} effect={ex1.result === 'Yes' ? 'button1.BackColor = Color.Red' : ex1.result === 'No' ? 'түс өзгермейді' : ''} />
          <CodeBlock code={EX1} highlight={hl1} fontSize={15} />
        </div>

        {/* Пример 2 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-[26px] font-bold text-navy"><span className="text-cyan">Мысал №2.</span> Форманы жабуды растау</div>
            <DocFigure src={DOC.fig7} caption="7-сурет. Форманы жабуды растау" label="7-сурет" />
          </div>
          <div className="relative h-[220px]">
            <AnimatePresence mode="wait">
              {!ex2.closed ? (
                <motion.div key={`w${shake}`} initial={{ opacity: 0 }} animate={shake ? { opacity: 1, x: [0, -10, 10, -6, 6, 0] } : { opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <WinWindow title="Form1" width={820} onClose={() => { setEx2({ ...ex2, open: true, result: '' }); play('click') }}>
                    <div className="relative flex h-[176px] flex-col items-center justify-center gap-3 text-[21px] text-[#333]">
                      <FormIcon size={40} />
                      <span>Терезенің <b>✕</b> батырмасын басыңыз</span>

                    </div>
                  </WinWindow>
                </motion.div>
              ) : (
                <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-full place-items-center rounded-[18px] border-2 border-dashed border-line bg-white/50">
                  <div className="text-center">
                    <div className="text-[22px] text-muted">Форма жабылды</div>
                    <button type="button" className="btn btn-primary mt-4 h-12 px-5 text-[18px]" onClick={() => setEx2({ closed: false, open: false, result: '' })}>
                      <Play size={18} /> Қайта ашу
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
                      <WinDialog open={ex2.open} caption="Форманы жабу" text="Шынымен де форманы жабасыз ба?" icon="Question" buttons={['Yes', 'No']}
                        onButton={(b) => {
                          if (b === 'Yes') { setEx2({ closed: true, open: false, result: b }); play('click') }
                          else { setEx2({ ...ex2, open: false, result: b }); setShake((x) => x + 1) }
                        }} />
          </div>
          <ResultLine result={ex2.result} effect={ex2.result === 'No' ? 'e.Cancel = true → форма ашық қалады' : ex2.result === 'Yes' ? 'форма жабылады' : ''} />
          <CodeBlock code={EX2} highlight={hl2} fontSize={15} />
        </div>
      </div>
    </Slide>
  )
}

function ResultLine({ result, effect }: { result: string; effect: string }) {
  return (
    <div className="flex h-[48px] items-center gap-3 rounded-xl bg-white px-5 font-mono text-[19px] shadow-card">
      {result ? (
        <>
          <span className="text-muted">result =</span>
          <span className="rounded-md bg-teal px-2 py-0.5 font-bold text-white">DialogResult.{result}</span>
          <span className="text-navy">→ {effect}</span>
        </>
      ) : (
        <span className="font-sans text-muted">Нәтиже осында көрсетіледі</span>
      )}
    </div>
  )
}

/** 2-топтың тапсырмасы (новая редакция Word): хабарлама шығару және форманы жабуды растау */
export function MessageBoxTeamTask() {
  return <MessageBoxDemo teamTask />
}
