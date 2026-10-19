import { AnimatePresence, motion } from 'motion/react'

export type DlgIcon = 'Information' | 'Question' | 'Warning' | 'Error' | 'None'

export function DialogIcon({ icon, size = 44 }: { icon: DlgIcon; size?: number }) {
  if (icon === 'None') return null
  if (icon === 'Warning')
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <path d="M16 3 L30 28 H2 Z" fill="#f7c518" stroke="#b8860b" strokeWidth="1" strokeLinejoin="round" />
        <rect x="14.6" y="11" width="2.8" height="9" rx="1.2" fill="#222" />
        <circle cx="16" cy="23.5" r="1.7" fill="#222" />
      </svg>
    )
  const fill = icon === 'Error' ? '#e0302f' : '#1f6fd1'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <radialGradient id={`g-${icon}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="white" stopOpacity="0.55" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14.5" fill={fill} />
      <circle cx="16" cy="16" r="14.5" fill={`url(#g-${icon})`} />
      {icon === 'Information' && (
        <>
          <circle cx="16" cy="9.2" r="2.1" fill="white" />
          <rect x="14.2" y="13" width="3.6" height="11" rx="1.2" fill="white" />
        </>
      )}
      {icon === 'Question' && (
        <text x="16" y="22.5" textAnchor="middle" fontSize="19" fontWeight="700" fill="white" fontFamily="Segoe UI, Arial">?</text>
      )}
      {icon === 'Error' && <path d="M10.5 10.5 L21.5 21.5 M21.5 10.5 L10.5 21.5" stroke="white" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  )
}

/** Окно, похожее на MessageBox Windows. Отображается внутри презентации. */
export function WinDialog({
  open, caption, text, icon = 'Information', buttons, onButton, defaultIndex = 0,
}: {
  open: boolean; caption: string; text: string; icon?: DlgIcon
  buttons: string[]; onButton: (b: string) => void; defaultIndex?: number
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-40 grid place-items-center bg-black/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', damping: 22, stiffness: 320 }}>
            <DialogBox caption={caption} text={text} icon={icon} buttons={buttons} onButton={onButton} defaultIndex={defaultIndex} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function DialogBox({
  caption, text, icon = 'Information', buttons, onButton, defaultIndex = 0, scale = 1,
}: {
  caption: string; text: string; icon?: DlgIcon; buttons: string[]; onButton?: (b: string) => void; defaultIndex?: number; scale?: number
}) {
  return (
    <div
      className="min-w-[460px] max-w-[640px] border border-[#1883d7] bg-white shadow-[0_24px_60px_-10px_rgba(0,0,0,0.45)]"
      style={{ fontFamily: "'Segoe UI', var(--font-sans)", zoom: scale }}
    >
      <div className="flex h-[40px] items-center justify-between pl-4 text-[17px] text-[#111]">
        {caption}
        <span className="grid h-full w-[50px] place-items-center text-[#555]">
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.1" /></svg>
        </span>
      </div>
      <div className="flex items-center gap-5 px-6 pb-7 pt-4">
        <DialogIcon icon={icon} />
        <div className="text-[20px] leading-snug text-[#111]">{text}</div>
      </div>
      <div className="flex justify-end gap-3 bg-[#f0f0f0] px-5 py-4">
        {buttons.map((b, i) => (
          <button
            key={b} type="button" onClick={() => onButton?.(b)}
            className={`win-btn min-w-[110px] px-5 py-1.5 text-[18px] ${i === defaultIndex ? '!border-[#0078d7] ring-1 ring-[#0078d7]' : ''}`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  )
}
