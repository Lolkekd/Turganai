import { AnimatePresence, motion } from 'motion/react'
import { Box, FileCode2, FileCog, FileImage, FileText, Files, FolderOpen } from 'lucide-react'
import { useSlideState } from '../store/useLesson'
import { CodeBlock, Slide, SlideHeader } from '../components/ui'
import { play } from '../lib/sound'

type F = 'csproj' | 'form' | 'designer' | 'resx' | 'program'

// Описания — из Word-документа (раздел «Жоба файлдары»).
const FILES: Record<F, { name: string; role: string; text: string; icon: typeof FileCode2; color: string; snippet: string; snippetTitle: string; edit: string }> = {
  csproj: {
    name: 'WindowsFormsApplication1.csproj', role: 'Жоба файлы', icon: FileCog, color: '#7c3aed',
    text: 'Қосымшадағы барлық объектілерге қызмет көрсетеді. Кез келген жаңа форма, бағдарламалық модуль немесе берілген модуль жобалық файлға автоматты түрде қосылады.',
    edit: 'Visual Studio өзі жүргізеді',
    snippetTitle: 'WindowsFormsApplication1.csproj (үзінді, XML)',
    snippet: '<ItemGroup>\n  <Compile Include="Form1.cs">\n    <SubType>Form</SubType>\n  </Compile>\n  <Compile Include="Form1.Designer.cs">\n    <DependentUpon>Form1.cs</DependentUpon>\n  </Compile>\n  <Compile Include="Program.cs" />\n</ItemGroup>',
  },
  form: {
    name: 'Form1.cs', role: 'Форманың код файлы', icon: FileCode2, color: '#1d4ed8',
    text: 'Біз жазатын негізгі код осында: оқиғаларды өңдеу әдістері (мысалы, button1_Click).',
    edit: 'Бағдарламашы жазады',
    snippetTitle: 'Form1.cs',
    snippet: 'public partial class Form1 : Form\n{\n    public Form1()\n    {\n        InitializeComponent();\n    }\n\n    private void button1_Click(object sender, EventArgs e)\n    {\n        this.BackColor = Color.DarkBlue;\n    }\n}',
  },
  designer: {
    name: 'Form1.Designer.cs', role: 'Конструктор коды', icon: FileText, color: '#0891b2',
    text: 'Басқару элементтерін құралдар жинағынан (Toolbox) формаға сүйреп апарғанда барлық әрекеттерді орындайтын кодты автоматты түрде жазады.',
    edit: 'Конструктор автоматты жазады',
    snippetTitle: 'Form1.Designer.cs (үзінді)',
    snippet: 'private void InitializeComponent()\n{\n    this.button1 = new System.Windows.Forms.Button();\n    this.button1.Text = "Көк";\n    this.button1.Click += new System.EventHandler(this.button1_Click);\n    this.Text = "Түстерді таңдау";\n}',
  },
  resx: {
    name: 'Form1.resx', role: 'Ресурстар файлы', icon: FileImage, color: '#ea8a0c',
    text: 'Форманың ресурстары (суреттер, белгішелер, мәтіндер) сақталатын XML файл.',
    edit: 'Visual Studio өзі жүргізеді',
    snippetTitle: 'Form1.resx (үзінді, XML)',
    snippet: '<root>\n  <resheader name="resmimetype">\n    <value>text/microsoft-resx</value>\n  </resheader>\n  <!-- форма ресурстары -->\n</root>',
  },
  program: {
    name: 'Program.cs', role: 'Бағдарламаның кіру нүктесі', icon: Box, color: '#0d9488',
    text: 'Стандартты Main() әдісін және Form класының данасын автоматты түрде жасау кодын қамтиды. Бұл файл бүкіл бағдарламаны іске асыруға жауапты. Windows қосымшаларында ол әдетте өзгертілмейді.',
    edit: 'Әдетте өзгертілмейді',
    snippetTitle: 'Program.cs',
    snippet: 'static class Program\n{\n    [STAThread]\n    static void Main()\n    {\n        Application.EnableVisualStyles();\n        Application.SetCompatibleTextRenderingDefault(false);\n        Application.Run(new Form1());\n    }\n}',
  },
}

const TREE: { f?: F; label: string; depth: number; folder?: boolean }[] = [
  { label: 'Решение «WindowsFormsApplication1»', depth: 0, folder: true },
  { f: 'csproj', label: 'WindowsFormsApplication1', depth: 1 },
  { label: 'Properties', depth: 2, folder: true },
  { label: 'Ссылки', depth: 2, folder: true },
  { f: 'form', label: 'Form1.cs', depth: 2 },
  { f: 'designer', label: 'Form1.Designer.cs', depth: 3 },
  { f: 'resx', label: 'Form1.resx', depth: 3 },
  { f: 'program', label: 'Program.cs', depth: 2 },
]

export default function ProjectFiles() {
  const [sel, setSel] = useSlideState<F>('files.sel', 'csproj')
  const f = FILES[sel]
  return (
    <Slide>
      <SlideHeader stage="6 · Жаңа тақырыпты түсіндіру" title="Жоба файлдары" icon={<Files size={44} />} />
      <div className="mt-7 grid flex-1 grid-cols-[640px_1fr] gap-9">
        <div className="card p-6">
          <div className="mb-3 flex items-center gap-2 text-[18px] font-semibold uppercase tracking-wider text-muted">
            <FolderOpen size={20} /> Solution Explorer
          </div>
          <div className="relative">
            {TREE.map((n, i) => {
              const active = n.f === sel
              const Icon = n.f ? FILES[n.f].icon : FolderOpen
              return (
                <motion.button
                  key={i} type="button" disabled={!n.f}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => { if (n.f) { setSel(n.f); play('click') } }}
                  className={`relative flex w-full items-center gap-3 rounded-xl py-3 pr-3 text-left text-[23px] transition ${n.f ? 'cursor-pointer hover:bg-paper' : 'cursor-default text-muted'} ${active ? 'bg-paper font-bold' : ''}`}
                  style={{ paddingLeft: 14 + n.depth * 40 }}
                >
                  {n.depth > 0 && <span className="absolute top-0 h-1/2 border-b-2 border-l-2 border-line" style={{ left: n.depth * 40 - 14, width: 18 }} />}
                  <Icon size={26} style={{ color: n.f ? FILES[n.f].color : '#94a3b8' }} />
                  <span className={active ? 'text-navy' : n.f ? 'text-ink' : ''}>{n.f === 'csproj' ? 'WindowsFormsApplication1.csproj' : n.label}</span>
                  {active && <motion.span layoutId="file-dot" className="ml-auto h-3 w-3 rounded-full" style={{ background: FILES[n.f!].color }} />}
                </motion.button>
              )
            })}
          </div>
          <div className="mt-5 rounded-xl bg-paper px-4 py-3 text-[18px] text-muted">Файлды басыңыз — оның қызметі оң жақта шығады</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-5">
            <div className="card relative overflow-hidden p-8">
              <div className="absolute inset-y-0 left-0 w-2" style={{ background: f.color }} />
              <div className="flex items-center gap-5">
                <div className="grid h-[72px] w-[72px] place-items-center rounded-2xl text-white" style={{ background: f.color }}><f.icon size={38} /></div>
                <div>
                  <div className="font-mono text-[28px] font-bold text-navy">{f.name}</div>
                  <div className="text-[24px] font-semibold" style={{ color: f.color }}>{f.role}</div>
                </div>
                <span className="ml-auto rounded-full bg-paper px-4 py-1.5 text-[17px] font-semibold text-muted">{f.edit}</span>
              </div>
              <p className="mt-5 text-[26px] leading-snug text-ink">{f.text}</p>
            </div>
            <CodeBlock code={f.snippet} title={f.snippetTitle} fontSize={19} lang={f.snippetTitle.includes('XML') ? 'XML' : 'C#'} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Slide>
  )
}
