import { AnimatePresence, motion } from 'motion/react'
import { Code2, FolderTree, LayoutTemplate, MonitorCog, SlidersHorizontal, Wrench } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSlideState } from '../store/useLesson'
import { DocFigure, FormIcon, Slide, SlideHeader } from '../components/ui'
import { highlightLine } from '../lib/csharp'
import { VsLogo } from '../components/brand'
import { play } from '../lib/sound'

type Zone = 'toolbox' | 'designer' | 'code' | 'solution' | 'properties'

const INFO: Record<Zone, { en: string; ru: string; kk: string; text: string; color: string; icon: typeof Wrench }> = {
  toolbox: {
    en: 'Toolbox', ru: 'Панель элементов', kk: 'Компоненттер панелі', color: '#f97316', icon: Wrench,
    text: 'Қосымша құру үшін арналған және қайталап қолданылатын 100-ден астам компоненттер жиыны. Керекті элементті (Button, Label, TextBox…) тышқанмен формаға сүйреп апарамыз.',
  },
  designer: {
    en: 'Form Designer', ru: 'Конструктор', kk: 'Форма құрастыру аймағы', color: '#2563eb', icon: LayoutTemplate,
    text: 'Форманың сыртқы түрін көзбен құрастыратын аймақ. Компоненттерді орналастырып, өлшемін өзгертеміз. Батырманы екі рет шертсек — оның Click оқиғасының кодына өтеміз.',
  },
  code: {
    en: 'Code Editor', ru: 'Редактор кода', kk: 'Код редакторы', color: '#7c3aed', icon: Code2,
    text: 'Бағдарлама мәтінін жазуға, әсіресе оқиғаларды өңдеу әдістерін (мысалы, button1_Click) жазуға арналған терезе.',
  },
  solution: {
    en: 'Solution Explorer', ru: 'Обозреватель решений', kk: 'Жоба құрылымы', color: '#0fb5a6', icon: FolderTree,
    text: 'Жоба файлдарының құрылымы: шешім, жоба, Form1.cs, Program.cs және т.б. Файлды осы жерден ашамыз.',
  },
  properties: {
    en: 'Properties', ru: 'Свойства', kk: 'Қасиеттер мен оқиғалар терезесі', color: '#fb7185', icon: SlidersHorizontal,
    text: 'Кез келген объектінің қасиетін (Text, BackColor, Name…) код жазбай-ақ өзгертуге және ⚡ бөлімінде оның оқиғаларына код байланыстыруға мүмкіндік береді.',
  },
}

const ORDER: Zone[] = ['toolbox', 'designer', 'code', 'solution', 'properties']

export default function VsInterface() {
  const [zone, setZone] = useSlideState<Zone | null>('vs.zone', null)
  const pick = (z: Zone) => { setZone(z); play('click') }
  const info = zone ? INFO[zone] : null

  const Panel = ({ z, children, className = '' }: { z: Zone; children: ReactNode; className?: string }) => {
    const active = zone === z
    const dim = zone && !active
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => pick(z)}
        className={`relative flex cursor-pointer flex-col overflow-hidden text-left transition-all duration-300 ${dim ? 'opacity-35 saturate-50' : ''} ${className}`}
        style={active ? { boxShadow: `inset 0 0 0 4px ${INFO[z].color}`, zIndex: 2 } : undefined}
      >
        <div className="flex h-8 items-center gap-2 px-3 text-[15px] font-semibold text-white" style={{ background: INFO[z].color }}>
          {INFO[z].en}
        </div>
        {children}
        {active && (
          <motion.div layoutId="vs-pulse" className="pointer-events-none absolute inset-0" style={{ background: `${INFO[z].color}14` }} />
        )}
      </div>
    )
  }

  return (
    <Slide stage="newTopic" decor="geo">
      <SlideHeader stage="6 · Жаңа тақырыпты түсіндіру" title="Visual Studio интерфейсі" icon={<MonitorCog size={44} />} />
      <div className="mt-6 grid flex-1 grid-cols-[1250px_1fr] gap-8">
        {/* Макет VS 2010 */}
        <div className="flex flex-col overflow-hidden rounded-[20px] border-[3px] border-white bg-[#dbe3f4] shadow-lift" style={{ fontFamily: "'Segoe UI', var(--font-sans)" }}>
          <div className="flex h-9 items-center gap-5 bg-gradient-to-r from-[#ede9fe] to-[#dbeafe] px-4 text-[15px] text-black">
            <VsLogo size={24} className="mr-1" />
            {['Файл', 'Правка', 'Вид', 'Проект', 'Построение', 'Отладка', 'Сервис', 'Окно', 'Справка'].map((m) => <span key={m}>{m}</span>)}
          </div>
          <div className="flex h-8 items-center gap-2 bg-[#cfd6e3] px-4 text-[14px] text-[#333]">
            <span>💾</span><span>📂</span><span className="mx-2 text-[#2a7d2a]">▶ Debug</span><span className="text-muted">F5</span>
          </div>
          <div className="grid flex-1 grid-cols-[240px_1fr_300px] gap-[4px] bg-[#dbe3f4] p-[4px]">
            <Panel z="toolbox" className="bg-white">
              <div className="space-y-1 p-3 text-[16px] text-[#222]">
                <div className="font-semibold text-[#555]">▾ Стандартные элементы</div>
                {['Button', 'CheckBox', 'ComboBox', 'Label', 'ListBox', 'PictureBox', 'RadioButton', 'TextBox', 'Timer'].map((x) => (
                  <div key={x} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-[#e5f1fb]"><span className="h-4 w-4 rounded-sm border border-[#888] bg-[#eee]" />{x}</div>
                ))}
              </div>
            </Panel>
            <div className="grid grid-rows-[1fr_250px] gap-[3px]">
              <Panel z="designer" className="bg-[#f5f6f8]">
                <div className="grid flex-1 place-items-center">
                  <div className="w-[440px] border border-[#1883d7] bg-white shadow-md">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-[15px]"><FormIcon size={16} /> Түстерді таңдау</div>
                    <div className="flex h-[150px] items-start gap-3 bg-[#f0f0f0] p-5">
                      {['Көк', 'Қызыл', 'Сары'].map((b) => <span key={b} className="win-btn px-5 py-1 text-[16px]">{b}</span>)}
                    </div>
                  </div>
                </div>
              </Panel>
              <Panel z="code" className="bg-[#1e1e1e]">
                <pre className="px-4 py-2 font-mono text-[15px] leading-[1.6]">
                  {['private void button1_Click(object sender, EventArgs e)', '{', '    this.BackColor = Color.DarkBlue;', '}'].map((l, i) => (
                    <div key={i}><span className="mr-4 text-[#858585]">{i + 21}</span>{highlightLine(l)}</div>
                  ))}
                </pre>
              </Panel>
            </div>
            <div className="grid grid-rows-[1fr_1fr] gap-[3px]">
              <Panel z="solution" className="bg-white">
                <div className="space-y-1 whitespace-pre p-3 font-mono text-[14.5px] text-[#222]">
                  <div>📁 Решение «WindowsForms…»</div>
                  <div>  🟪 WindowsFormsApplication1</div>
                  <div>     📁 Properties</div>
                  <div>     📁 Ссылки</div>
                  <div>     📝 Form1.cs</div>
                  <div>     📝 Program.cs</div>
                </div>
              </Panel>
              <Panel z="properties" className="bg-white">
                <div className="p-2 text-[15px] text-[#222]">
                  <div className="mb-1 rounded bg-[#eef1f6] px-2 py-1 font-semibold">button1 System.Windows.Forms.Button</div>
                  {[['BackColor', 'Control'], ['Name', 'button1'], ['Size', '75; 23'], ['Text', 'Көк']].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-2 border-b border-[#eee] px-2 py-1"><span>{k}</span><span className="text-[#555]">{v}</span></div>
                  ))}
                  <div className="mt-1 px-2 text-[14px] text-[#555]">⚡ Оқиғалар: Click</div>
                </div>
              </Panel>
            </div>
          </div>
        </div>

        {/* Описание */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-2">
            {ORDER.map((z) => {
              const I = INFO[z].icon
              return (
                <button key={z} type="button" onClick={() => pick(z)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-[20px] font-semibold transition ${zone === z ? 'bg-white shadow-card' : 'border-transparent text-navy/70 hover:bg-white/70'}`}
                  style={zone === z ? { borderColor: INFO[z].color, color: INFO[z].color } : undefined}>
                  <I size={22} /> {INFO[z].en}
                </button>
              )
            })}
          </div>
          <AnimatePresence mode="wait">
            {info ? (
              <motion.div key={zone} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card flex-1 p-7" style={{ borderTop: `6px solid ${info.color}` }}>
                <div className="text-[17px] font-semibold uppercase tracking-wider" style={{ color: info.color }}>{info.en} · {info.ru}</div>
                <div className="mt-1 text-[32px] font-extrabold leading-tight text-navy">{info.kk}</div>
                <p className="mt-3 text-[23px] leading-snug text-ink">{info.text}</p>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card grid flex-1 place-items-center p-7 text-center text-[24px] text-muted">
                Интерфейстің кез келген бөлігін басыңыз — сипаттамасы осында шығады
              </motion.div>
            )}
          </AnimatePresence>
          <DocFigure src="images/doc/fig2-interface.png" caption="2-сурет. Бағдарлама интерфейсі (құжаттан)" label="2-сурет: бағдарлама интерфейсі" />
        </div>
      </div>
    </Slide>
  )
}
