import { AnimatePresence, motion } from 'motion/react'
import { MousePointerClick, Palette, Zap } from 'lucide-react'
import { useSlideState } from '../store/useLesson'
import { CodeBlock, DemoNote, DocFigure, Slide, SlideHeader, WinWindow } from '../components/ui'
import { play } from '../lib/sound'

// Код соответствует примеру №1 из Word-документа (Color.* = System.Drawing.Color.*)
const CODE = `public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }
    // button1 компонентінің Click оқиғасы
    private void button1_Click(object sender, EventArgs e)
    {
        this.BackColor = Color.DarkBlue;
    }
    // button2 компонентінің Click оқиғасы
    private void button2_Click(object sender, EventArgs e)
    {
        this.BackColor = Color.Red;
    }
    // button3 компонентінің Click оқиғасы
    private void button3_Click(object sender, EventArgs e)
    {
        this.BackColor = Color.Yellow;
    }
}`

const BUTTONS = [
  { id: 'button1', text: 'Көк', color: '#00008B', name: 'DarkBlue', lines: [8, 9, 10, 11] },
  { id: 'button2', text: 'Қызыл', color: '#FF0000', name: 'Red', lines: [13, 14, 15, 16] },
  { id: 'button3', text: 'Сары', color: '#FFFF00', name: 'Yellow', lines: [18, 19, 20, 21] },
]

export default function ColorDemo() {
  const [last, setLast] = useSlideState<number | 'load' | null>('colors.last', null)
  const bg = last === null ? '#F0F0F0' : last === 'load' ? '#7FFFD4' : BUTTONS[last].color
  const hl = typeof last === 'number' ? BUTTONS[last].lines : []

  return (
    <Slide>
      <SlideHeader stage="7 · Мысал №1" title="Батырма арқылы форманың түсін өзгерту" icon={<Palette size={44} />} />
      <div className="mt-6 grid flex-1 grid-cols-[420px_600px_1fr] gap-8">
        {/* Слева: свойства и событие Click */}
        <div className="flex flex-col gap-4">
          <div className="card overflow-hidden">
            <div className="bg-paper px-5 py-2.5 text-[16px] font-semibold uppercase tracking-wider text-muted">1-кесте. Қасиеттер</div>
            <table className="w-full text-[19px]">
              <tbody>
                {[['Form1', 'Text', 'Түстерді таңдау'], ['button1', 'Text', 'Көк'], ['button2', 'Text', 'Қызыл'], ['button3', 'Text', 'Сары']].map((r) => (
                  <tr key={r[0]} className="border-t border-line">
                    <td className="px-5 py-2 font-mono font-semibold text-navy">{r[0]}</td>
                    <td className="py-2 font-mono text-muted">{r[1]}</td>
                    <td className="py-2 pr-4">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card flex-1 p-6">
            <div className="flex items-center gap-2 text-[22px] font-bold text-navy"><MousePointerClick className="text-violet" /> Click оқиғасы</div>
            <p className="mt-2 text-[19px] leading-snug text-ink">Тышқан батырмасын бір рет шерту. Өңдегішті құрудың екі жолы:</p>
            <ol className="mt-2 space-y-2 text-[18px] leading-snug text-ink">
              <li className="flex gap-2"><span className="font-bold text-violet">1.</span> Конструкторда батырманы жылдам екі рет шерту;</li>
              <li className="flex gap-2"><span className="font-bold text-violet">2.</span> Properties → <Zap size={17} className="inline text-amber" /> Оқиғалар → Click өрісін екі рет шерту.</li>
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <DocFigure src="images/doc/fig3-events.png" caption="3-сурет. Button1 компонентінің оқиғалары" label="3-сурет" />
              <DocFigure src="images/doc/fig4-colors.png" caption="4-сурет. Түстерді таңдау жобасының орындалуы" label="4-сурет" />
            </div>
          </div>
        </div>

        {/* Центр: демо-окно */}
        <div className="flex flex-col items-center">
          <DemoNote />
          <div className="mt-4">
            <WinWindow title="Түстерді таңдау" width={600} bg={bg}>
              <motion.div key={String(last)} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="flex h-[330px] items-start justify-between gap-4 px-8 pt-10">
                {BUTTONS.map((b, i) => (
                  <button key={b.id} type="button" className="win-btn h-[52px] flex-1 text-[22px]" onClick={() => { setLast(i); play('click') }}>
                    {b.text}
                  </button>
                ))}
              </motion.div>
            </WinWindow>
          </div>
          <div className="mt-5 h-[96px] w-full">
            <AnimatePresence mode="wait">
              {typeof last === 'number' ? (
                <motion.div key={last} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-mono text-[19px] shadow-card">
                  <span className="text-violet">{BUTTONS[last].id}.Click</span> →
                  <span className="text-[#795e26]">{BUTTONS[last].id}_Click()</span> →
                  <span className="inline-flex items-center gap-2 text-navy"><span className="h-5 w-5 rounded border border-black/20" style={{ background: BUTTONS[last].color }} />Color.{BUTTONS[last].name}</span>
                </motion.div>
              ) : (
                <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 text-center text-[20px] text-muted">
                  {last === 'load' ? 'Load оқиғасы: форма ашылғанда Color.Aquamarine орнатылды' : 'Батырманы басыңыз — форманың түсі өзгереді'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="card mt-auto flex w-full items-center gap-4 p-4">
            <div className="flex-1">
              <div className="text-[18px] font-bold text-navy">Load оқиғасы</div>
              <code className="font-mono text-[16px] text-muted">BackColor = Color.Aquamarine;</code>
              <div className="text-[15px] text-muted">форманы іске қосқан кезде орындалады</div>
            </div>
            <button type="button" className="btn btn-ghost h-12 px-4 text-[17px]" onClick={() => { setLast('load'); play('click') }}>Form1_Load</button>
            <button type="button" className="btn btn-ghost h-12 px-4 text-[17px]" onClick={() => setLast(null)}>Тазалау</button>
          </div>
        </div>

        {/* Справа: C# код */}
        <div className="flex flex-col">
          <div className="mb-2 text-[17px] font-semibold uppercase tracking-wider text-muted">Нақты C# коды (Windows Forms)</div>
          <CodeBlock code={CODE} highlight={hl} fontSize={17} />
        </div>
      </div>
    </Slide>
  )
}
