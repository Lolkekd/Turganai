import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Calculator, Play, ShieldAlert } from 'lucide-react'
import { useSlideState } from '../store/useLesson'
import { CodeBlock, DemoNote, DocFigure, Modal, ProposalTag, Slide, SlideHeader, WinWindow } from '../components/ui'
import { WinDialog } from '../components/WinDialog'
import { play } from '../lib/sound'

// Код примера №2 из Word-документа
const CODE = `public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }
    // button_eseptey компонентінің Click оқиғасы
    private void button_eseptey_Click(object sender, EventArgs e)
    {
        double a = double.Parse(textBox1.Text); // а мәнін енгізу
        double b = double.Parse(textBox2.Text); // b мәнін енгізу
        double c = a + b;                       // есептеу
        textBox3.Text = c.ToString();           // нәтижені шығару
    }
    // button_close компонентінің Click оқиғасы
    private void button_close_Click(object sender, EventArgs e)
    {
        this.Close();          // форманы жабу
    }
    // button_clear компонентінің Click оқиғасы
    private void button_clear_Click(object sender, EventArgs e)
    {
        textBox1.Clear();      // Clear әдісімен тазалау
        textBox2.Text = " ";   // бос орынмен (пробел) тазалау
        textBox3.Text = " ";
    }
}`

// [ПРЕДЛ.] безопасный вариант (совместим с C# 4 / Visual Studio 2010)
const SAFE_CODE = `private void button_eseptey_Click(object sender, EventArgs e)
{
    double a, b;
    if (!double.TryParse(textBox1.Text, out a) ||
        !double.TryParse(textBox2.Text, out b))
    {
        MessageBox.Show("Екі санды дұрыс енгізіңіз!", "Қате",
            MessageBoxButtons.OK, MessageBoxIcon.Warning);
        return;
    }
    textBox3.Text = (a + b).ToString();
}`

const HL = { calc: [8, 9, 10, 11, 12, 13, 14], close: [16, 17, 18, 19], clear: [21, 22, 23, 24, 25, 26] }

function parseNum(s: string): number | null {
  const t = s.trim().replace(',', '.')
  if (!/^[+-]?\d+(\.\d+)?$/.test(t)) return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

/** Как double.ToString() в .NET Framework: до 15 значащих цифр */
function fmt(n: number, comma: boolean) {
  const s = String(Number(n.toPrecision(15)))
  return comma ? s.replace('.', ',') : s
}

export default function SumDemo() {
  const [st, setSt] = useSlideState('sum.state', { a: '', b: '', c: '', closed: false, hl: [] as number[] })
  const [warn, setWarn] = useState(false)
  const [safe, setSafe] = useState(false)
  const up = (p: Partial<typeof st>) => setSt({ ...st, ...p })

  const calc = () => {
    const a = parseNum(st.a)
    const b = parseNum(st.b)
    if (a === null || b === null) { setWarn(true); play('error'); up({ hl: HL.calc }); return }
    up({ c: fmt(a + b, st.a.includes(',') || st.b.includes(',')), hl: HL.calc })
    play('success')
  }

  return (
    <Slide stage="demo">
      <SlideHeader stage="7 · Мысал №2" title="Екі санның қосындысын табу" icon={<Calculator size={44} />} />
      <div className="mt-6 grid flex-1 grid-cols-[700px_1fr] gap-9">
        <div className="flex flex-col">
          <DemoNote />
          <div className="relative mt-4 h-[470px]">
            <AnimatePresence mode="wait">
              {!st.closed ? (
                <motion.div key="win" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85, y: 30 }} transition={{ duration: 0.3 }}>
                  <WinWindow title="Екі санның қосындысын табу" width={680} onClose={() => { up({ closed: true, hl: HL.close }); play('click') }}>
                    <div className="relative h-[420px] px-10 pt-9 text-[22px] text-[#111]">
                      {[
                        { l: 'А санын енгіз', k: 'a' as const, name: 'textBox1' },
                        { l: 'В санын енгіз', k: 'b' as const, name: 'textBox2' },
                        { l: 'Нәтиже', k: 'c' as const, name: 'textBox3' },
                      ].map((f) => (
                        <div key={f.k} className="mb-6 grid grid-cols-[200px_1fr] items-center">
                          <span>{f.l}</span>
                          <input
                            value={st[f.k]} readOnly={f.k === 'c'} inputMode="decimal" aria-label={f.name}
                            onChange={(e) => up({ [f.k]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && calc()}
                            className={`win-input h-[44px] text-[22px] ${f.k === 'c' ? 'bg-[#f7f7f7] font-semibold' : ''}`}
                          />
                        </div>
                      ))}
                      <div className="mt-9 flex gap-6">
                        <button type="button" className="win-btn h-[54px] w-[150px] text-[21px] !border-[#0078d7]" onClick={calc}>Есептеу</button>
                        <button type="button" className="win-btn h-[54px] w-[150px] text-[21px]" onClick={() => { up({ closed: true, hl: HL.close }); play('click') }}>Жабу</button>
                        <button type="button" className="win-btn h-[54px] w-[150px] text-[21px]" onClick={() => { up({ a: '', b: '', c: '', hl: HL.clear }); play('click') }}>Тазалау</button>
                      </div>
                      <WinDialog
                        open={warn} caption="Қате" icon="Warning" text="Екі санды дұрыс енгізіңіз!"
                        buttons={['OK']} onButton={() => setWarn(false)}
                      />
                    </div>
                  </WinWindow>
                </motion.div>
              ) : (
                <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-full place-items-center rounded-[18px] border-2 border-dashed border-line bg-white/50">
                  <div className="text-center">
                    <div className="font-mono text-[24px] text-navy">this.Close();</div>
                    <div className="mt-1 text-[22px] text-muted">Форма жабылды</div>
                    <button type="button" className="btn btn-primary mt-5 h-14 px-6 text-[20px]" onClick={() => up({ closed: false, a: '', b: '', c: '', hl: [] })}>
                      <Play size={20} /> Қайта іске қосу (F5)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-auto flex items-center gap-3">
            <button type="button" className="btn btn-ghost h-12 px-4 text-[17px]" onClick={() => setSafe(true)}>
              <ShieldAlert size={19} className="text-amber" /> Қате енгізу болса?
            </button>
            <DocFigure src="images/doc/fig5-sum.png" caption="5-сурет. Екі санның қосындысын табу жобасының орындалуы" label="5-сурет" />
            <div className="ml-auto text-right text-[16px] leading-tight text-muted">Name: button_eseptey,<br />button_close, button_clear</div>
          </div>
        </div>
        <CodeBlock code={CODE} highlight={st.hl} fontSize={16} title="Form1.cs — prog1" />
      </div>

      <Modal open={safe} onClose={() => setSafe(false)} title="Бос немесе қате мән енгізілсе" width={1180}>
        <p className="text-[22px] leading-snug text-ink">
          Құжаттағы кодта <code className="rounded bg-paper px-2 font-mono">double.Parse</code> қолданылған. Өріс бос болса немесе
          мәтін енгізілсе, бағдарлама <b>FormatException</b> қатесімен тоқтайды. Сенімдірек нұсқа — <code className="rounded bg-paper px-2 font-mono">double.TryParse</code>:
        </p>
        <div className="mt-3"><ProposalTag>Ұсынылған жетілдіру (құжатта жоқ)</ProposalTag></div>
        <CodeBlock code={SAFE_CODE} className="mt-4" fontSize={19} />
        <p className="mt-4 text-[18px] text-muted">Ескерту: қазақ/орыс тілді Windows-та бөлшек сан үтірмен жазылады (2,5). Браузердегі демонстрация нүктені де, үтірді де қабылдайды.</p>
      </Modal>
    </Slide>
  )
}
