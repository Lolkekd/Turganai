import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowDown, ArrowUp, ClipboardPaste, ExternalLink, Eye, Handshake, Loader2, Pencil, Plus, Terminal, Trash2,
  Users, WifiOff, X,
} from 'lucide-react'
import { teamsConfig } from '../config/lesson.config'
import { useLesson } from '../store/useLesson'
import { Slide, SlideHeader, TaskTimer } from '../components/ui'
import { C } from '../components/brand'
import { openExternal } from './Baamboozle'
import { play } from '../lib/sound'

export const TEAM_COLORS = ['#2563eb', '#0fb5a6'] as const

// Оформление двух групп: 1-топ — синий, 2-топ — бирюзово-фиолетовый
const TEAM_STYLE = [
  { grad: 'linear-gradient(135deg, #3b82f6, #2563eb 55%, #1d4ed8)', soft: '#2563eb', code: 'Console.WriteLine("Сәлем, 1-топ!");' },
  { grad: 'linear-gradient(135deg, #2dd4bf, #0fb5a6 45%, #7c3aed)', soft: '#0fb5a6', code: 'string name = Console.ReadLine();' },
] as const

/** Окно поверх всей сцены (перекрывает таймер и навигацию) */
function Overlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const root = typeof document !== 'undefined' ? document.getElementById('stage-overlay-root') : null
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const node = (
    <motion.div
      className="pointer-events-auto absolute inset-0 grid place-items-center bg-navy/45 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    >
      {children}
    </motion.div>
  )
  return root ? createPortal(node, root) : node
}

export default function Teams() {
  const names = useLesson((s) => s.teamNames)
  const members = useLesson((s) => s.teamMembers)
  const [view, setView] = useState<0 | 1 | null>(null)
  const [edit, setEdit] = useState<0 | 1 | null>(null)
  const [wheel, setWheel] = useState(false)

  return (
    <Slide stage="teams">
      {/* лёгкий декор с символами кода */}
      <div className="pointer-events-none absolute inset-0 select-none font-mono font-black">
        <span className="absolute left-[46%] top-[150px] text-[90px] text-[#2563eb]/[0.06]">{'{ }'}</span>
        <span className="absolute bottom-[240px] right-[60px] text-[80px] text-[#7c3aed]/[0.07]">{'</>'}</span>
        <span className="absolute bottom-[300px] left-[30px] text-[46px] text-[#0fb5a6]/[0.10]">{'>_'}</span>
      </div>

      <SlideHeader stage="2 · Топқа бөлу" title={teamsConfig.title} subtitle={teamsConfig.subtitle} icon={<Users size={44} />} right={<TaskTimer stage="teams" compact />} />

      <div className="relative mt-6 grid min-h-0 flex-1 grid-cols-2 gap-10">
        {([0, 1] as const).map((i) => (
          <TeamCard key={i} index={i} name={names[i]} count={members[i].length}
            onOpen={() => { setView(i); play('reveal') }} onEdit={() => setEdit(i)} />
        ))}
      </div>

      {/* колесо фортуны + пожелание из Word */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="relative mt-7 flex items-center gap-7 overflow-hidden rounded-[30px] bg-white/90 px-8 py-6 shadow-card"
        style={{ boxShadow: 'inset 0 0 0 2px #f9731626, 0 18px 40px -26px #f97316' }}
      >
        <WheelIcon />
        <div>
          <div className="text-[34px] font-extrabold leading-tight text-navy">Сәттілік дөңгелегі</div>
          <div className="mt-1 text-[19px] text-muted">wheelofnames.com · интернет қажет</div>
        </div>
        <motion.button type="button" whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}
          onClick={() => { setWheel(true); play('click') }}
          className="btn h-[70px] px-9 text-[26px] text-white !rounded-[20px]"
          style={{ background: `linear-gradient(120deg, ${C.orange}, ${C.coral})`, boxShadow: '0 14px 28px -12px #f97316' }}>
          Дөңгелекті ашу
        </motion.button>
        <div className="ml-auto flex items-center gap-3 rounded-2xl px-5 py-3 text-[22px] font-bold text-violet" style={{ background: '#ede9fe' }}>
          <Handshake size={28} /> {teamsConfig.wish}
        </div>
      </motion.div>

      <AnimatePresence>
        {view !== null && <GroupView index={view} name={names[view]} list={members[view]} onClose={() => setView(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {edit !== null && <GroupEditor index={edit} name={names[edit]} onClose={() => setEdit(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {wheel && <WheelModal onClose={() => setWheel(false)} />}
      </AnimatePresence>
    </Slide>
  )
}

/* ============================ Карточка группы ============================ */
function TeamCard({ index, name, count, onOpen, onEdit }: { index: 0 | 1; name: string; count: number; onOpen: () => void; onEdit: () => void }) {
  const st = TEAM_STYLE[index]
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.15, type: 'spring', damping: 18 }}
      className="relative flex flex-col overflow-hidden rounded-[36px] text-white"
      style={{ background: st.grad, boxShadow: `0 30px 60px -30px ${st.soft}` }}
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-14 right-6 select-none font-mono text-[300px] font-black leading-none text-white/10">{index + 1}</span>

      {/* «терминал» */}
      <div className="relative flex items-center gap-3 bg-black/15 px-6 py-3 font-mono text-[18px]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-white/85">{st.code}</span>
        <button type="button" onClick={onEdit} title="Топ құрамын өзгерту"
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white/55 transition hover:bg-white/15 hover:text-white" aria-label="Топ құрамын өзгерту">
          <Pencil size={19} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-9 pb-8 pt-6">
        <div className="flex items-center gap-4">
          <span className="grid h-[72px] w-[72px] place-items-center rounded-[22px] bg-white/20"><Terminal size={40} /></span>
          <span className="rounded-full bg-white/20 px-5 py-1.5 text-[22px] font-extrabold tracking-[0.18em]">{index + 1}-ТОП</span>
        </div>
        <div className="mt-5 font-mono text-[96px] font-black leading-none tracking-tight">{name}</div>
        <div className="mt-4 flex items-center gap-2 text-[22px] font-semibold text-white/85">
          <Users size={24} /> {count > 0 ? `${count} оқушы` : 'Тізім әлі енгізілмеген'}
        </div>
        <motion.button type="button" onClick={onOpen} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="btn mt-8 h-[76px] self-start bg-white px-10 text-[28px] !rounded-[22px] shadow-lift" style={{ color: st.soft }}>
          <Eye size={28} /> {index + 1}-топты ашу
        </motion.button>
      </div>
    </motion.div>
  )
}

function WheelIcon() {
  const colors = [C.blue, C.violet, C.teal, C.orange, C.yellow, C.coral]
  return (
    <motion.svg width="96" height="96" viewBox="0 0 100 100" whileHover={{ rotate: 120 }} transition={{ duration: 0.8 }} className="shrink-0">
      {colors.map((c, i) => {
        const a1 = (i / 6) * Math.PI * 2
        const a2 = ((i + 1) / 6) * Math.PI * 2
        return <path key={i} d={`M50 50 L${50 + 46 * Math.cos(a1)} ${50 + 46 * Math.sin(a1)} A46 46 0 0 1 ${50 + 46 * Math.cos(a2)} ${50 + 46 * Math.sin(a2)} Z`} fill={c} />
      })}
      <circle cx="50" cy="50" r="10" fill="white" />
      <path d="M50 0 L57 12 H43 Z" fill="#14306b" />
    </motion.svg>
  )
}

/* ============================ Открытие группы ============================ */
function GroupView({ index, name, list, onClose }: { index: 0 | 1; name: string; list: string[]; onClose: () => void }) {
  const st = TEAM_STYLE[index]
  const cols = list.length > 16 ? 3 : list.length > 7 ? 2 : 1
  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ scale: 0.7, y: 60, opacity: 0, rotateX: 25 }} animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }} transition={{ type: 'spring', damping: 18, stiffness: 150 }}
        className="w-[1240px] overflow-hidden rounded-[40px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center gap-5 px-10 py-7 text-white" style={{ background: st.grad }}>
          <span className="grid h-[76px] w-[76px] place-items-center rounded-[24px] bg-white/20"><Terminal size={42} /></span>
          <div>
            <div className="text-[22px] font-extrabold tracking-[0.18em] text-white/80">{index + 1}-ТОП</div>
            <div className="font-mono text-[58px] font-black leading-none">{name}</div>
          </div>
          <div className="ml-auto rounded-2xl bg-white/20 px-5 py-2 text-[24px] font-bold"><Users size={24} className="mr-2 inline" />{list.length} оқушы</div>
        </div>
        <div className="max-h-[640px] overflow-y-auto px-10 py-8 scroll-thin">
          {list.length === 0 ? (
            <div className="py-16 text-center text-[32px] font-semibold text-muted">Оқушылар тізімі әлі енгізілмеген</div>
          ) : (
            <ol className="grid gap-x-8 gap-y-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {list.map((n, k) => (
                <motion.li key={`${k}-${n}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + k * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl px-5 py-3 text-[30px] font-semibold text-navy" style={{ background: `${st.soft}10` }}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[20px] font-bold text-white" style={{ background: st.soft }}>{k + 1}</span>
                  <span className="truncate">{n}</span>
                </motion.li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex justify-end border-t border-line px-10 py-5">
          <button type="button" className="btn btn-ghost h-14 px-7 text-[22px]" onClick={onClose}><X size={24} /> Жабу</button>
        </div>
      </motion.div>
    </Overlay>
  )
}

/* ============================ Редактор состава ============================ */
function GroupEditor({ index, name, onClose }: { index: 0 | 1; name: string; onClose: () => void }) {
  const list = useLesson((s) => s.teamMembers[index])
  const setList = useLesson((s) => s.setTeamMembers)
  const [draft, setDraft] = useState('')
  const [bulk, setBulk] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const st = TEAM_STYLE[index]
  const listRef = useRef<HTMLDivElement>(null)

  const save = (l: string[]) => setList(index, l)
  const add = () => {
    const v = draft.trim()
    if (!v) return
    save([...list, v])
    setDraft('')
    setTimeout(() => listRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }), 50)
  }
  const addBulk = () => {
    const names = bulk.split(/\r?\n/).map((x) => x.trim()).filter(Boolean)
    if (!names.length) return
    save([...list, ...names])
    setBulk('')
    setShowBulk(false)
  }
  const move = (k: number, d: -1 | 1) => {
    const j = k + d
    if (j < 0 || j >= list.length) return
    const l = [...list]
    ;[l[k], l[j]] = [l[j], l[k]]
    save(l)
  }

  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 180 }}
        className="flex max-h-[960px] w-[1100px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 px-8 py-5 text-white" style={{ background: st.grad }}>
          <Pencil size={28} />
          <div className="text-[30px] font-extrabold">{index + 1}-топ құрамы — <span className="font-mono">{name}</span></div>
          <span className="ml-auto rounded-xl bg-white/20 px-4 py-1 text-[20px] font-bold">{list.length} оқушы</span>
          <button type="button" className="grid h-12 w-12 place-items-center rounded-xl hover:bg-white/15" onClick={onClose} aria-label="Жабу"><X /></button>
        </div>

        <div ref={listRef} className="scroll-thin min-h-[160px] flex-1 space-y-2 overflow-y-auto px-8 py-5">
          {list.length === 0 && <div className="py-10 text-center text-[22px] text-muted">Оқушылар тізімі әлі енгізілмеген. Төменде аты-жөнін жазып, «Қосу» батырмасын басыңыз.</div>}
          {list.map((n, k) => (
            <div key={k} className="flex items-center gap-3 rounded-2xl px-3 py-2" style={{ background: `${st.soft}0d` }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[18px] font-bold text-white" style={{ background: st.soft }}>{k + 1}</span>
              <input value={n} aria-label={`${k + 1}-оқушы`} onChange={(e) => save(list.map((x, j) => (j === k ? e.target.value : x)))}
                onBlur={() => { if (!list[k]?.trim()) save(list.filter((_, j) => j !== k)) }}
                className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-2 text-[22px] font-semibold text-navy" />
              <button type="button" className="btn btn-ghost h-11 w-11" disabled={k === 0} onClick={() => move(k, -1)} aria-label="Жоғары"><ArrowUp size={18} /></button>
              <button type="button" className="btn btn-ghost h-11 w-11" disabled={k === list.length - 1} onClick={() => move(k, 1)} aria-label="Төмен"><ArrowDown size={18} /></button>
              <button type="button" className="btn h-11 w-11 text-[#b91c1c] hover:bg-[#fef2f2]" onClick={() => save(list.filter((_, j) => j !== k))} aria-label="Жою"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-line bg-paper px-8 py-5">
          <div className="flex gap-3">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="Оқушының аты-жөні" aria-label="Жаңа оқушы"
              className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 text-[22px] placeholder:text-[#a0aec0]" />
            <button type="button" className="btn h-[58px] px-6 text-[20px] text-white" style={{ background: st.soft }} onClick={add}><Plus size={22} /> Қосу</button>
            <button type="button" className="btn btn-ghost h-[58px] px-5 text-[18px]" onClick={() => setShowBulk(!showBulk)}><ClipboardPaste size={20} /> Тізімді қою</button>
          </div>
          <AnimatePresence initial={false}>
            {showBulk && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <textarea value={bulk} onChange={(e) => setBulk(e.target.value)} rows={5} aria-label="Бірнеше оқушы"
                  placeholder={'Әр жолға бір оқушы:\nАты-жөні 1\nАты-жөні 2'}
                  className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-[20px] placeholder:text-[#a0aec0]" />
                <button type="button" className="btn mt-2 h-12 px-5 text-[18px] text-white" style={{ background: st.soft }} onClick={addBulk}><Plus size={20} /> Тізімге қосу</button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between text-[16px] text-muted">
            <span>Өзгерістер автоматты түрде осы браузерде сақталады.</span>
            {list.length > 0 && (!confirmClear
              ? <button type="button" className="font-semibold text-[#b91c1c] hover:underline" onClick={() => setConfirmClear(true)}>Тізімді тазалау</button>
              : <span className="flex gap-3"><button type="button" className="font-bold text-[#b91c1c]" onClick={() => { save([]); setConfirmClear(false) }}>Иә, тазалау</button><button type="button" className="font-semibold" onClick={() => setConfirmClear(false)}>Болдырмау</button></span>)}
          </div>
        </div>
      </motion.div>
    </Overlay>
  )
}

/* ============================ Колесо фортуны ============================ */
function WheelModal({ onClose }: { onClose: () => void }) {
  const url = useLesson((s) => s.links.wheel)
  const [online] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 10000)
    return () => clearTimeout(t)
  }, [])

  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -6 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 140 }}
        className="flex h-[1000px] w-[1800px] flex-col overflow-hidden rounded-[34px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 px-7 py-4 text-white" style={{ background: `linear-gradient(110deg, ${C.orange}, ${C.coral}, ${C.violet})` }}>
          <WheelIcon />
          <div className="text-[34px] font-extrabold">Сәттілік дөңгелегі</div>
          <div className="ml-auto flex gap-3">
            <button type="button" className="btn h-14 bg-white/20 px-5 text-[19px] text-white hover:bg-white/30" onClick={() => openExternal(url)} disabled={!url}>
              <ExternalLink size={20} /> Жаңа қойындыда ашу
            </button>
            <button type="button" className="btn h-14 bg-white px-6 text-[20px] text-[#c2410c]" onClick={onClose}><X size={22} /> Жабу</button>
          </div>
        </div>
        <div className="relative flex-1 bg-[#f8fafc]">
          {online && url ? (
            <>
              <iframe src={url} title="Сәттілік дөңгелегі" className="h-full w-full border-0" allow="autoplay; fullscreen; clipboard-write"
                onLoad={() => setLoaded(true)} />
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center bg-white/90">
                  <div className="flex flex-col items-center gap-4 text-center text-[24px] text-muted">
                    <Loader2 size={56} className="animate-spin text-[#f97316]" />
                    Дөңгелек жүктелуде…
                    {slow && <span className="max-w-[760px] text-[20px]">Ұзақ ашылмаса, «Жаңа қойындыда ашу» батырмасын басыңыз.</span>}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div className="flex flex-col items-center gap-5">
                <span className="grid h-28 w-28 place-items-center rounded-[30px] bg-[#fff7ed] text-[#f97316]"><WifiOff size={60} /></span>
                <div className="text-[34px] font-extrabold text-navy">Интернет байланысы жоқ</div>
                <div className="max-w-[900px] text-[22px] text-muted">Сәттілік дөңгелегі wheelofnames.com сайтында орналасқан. Интернетке қосылып, қайта ашыңыз немесе сілтемені жаңа қойындыда ашыңыз.</div>
                <button type="button" className="btn btn-ghost h-14 px-6 text-[20px]" onClick={() => openExternal(url)}><ExternalLink size={20} /> Жаңа қойындыда ашу</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Overlay>
  )
}
