import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { links as defaultLinks, stages, teamsConfig, type StageId } from '../config/lesson.config'

export interface TimerState { elapsedMs: number; runningSince: number | null }
export interface Student { id: string; name: string; bank: number; scores: Record<string, number> }
export type HomeworkVariant = 'original' | 'proposed' | 'both'
export type RubricMode = 'original' | 'proposed'

interface LessonState {
  slide: number
  direction: 1 | -1
  panelOpen: boolean
  links: typeof defaultLinks
  stageMinutes: Record<StageId, number>
  teamNames: [string, string]
  teamScores: [number, number]
  sound: boolean
  showAnswers: boolean
  showLessonTimer: boolean
  homeworkVariant: HomeworkVariant
  rubric: RubricMode
  rubricConfirmed: boolean
  lessonTimer: TimerState
  timers: Record<string, TimerState>
  students: Student[]
  slideState: Record<string, unknown>

  goTo: (i: number) => void
  setPanel: (open: boolean) => void
  patch: (p: Partial<LessonState>) => void
  setLink: (k: keyof typeof defaultLinks, v: string) => void
  setStageMinutes: (id: StageId, m: number) => void
  setTeamName: (i: 0 | 1, v: string) => void
  addScore: (i: 0 | 1, delta: number) => void
  setScore: (i: 0 | 1, v: number) => void
  timerToggle: (key: string) => void
  timerReset: (key: string) => void
  lessonToggle: () => void
  lessonReset: () => void
  setSlideState: (key: string, v: unknown) => void
  addStudent: () => void
  updateStudent: (id: string, p: Partial<Student>) => void
  removeStudent: (id: string) => void
  resetLesson: () => void
}

const defaultMinutes = Object.fromEntries(stages.map((s) => [s.id, s.minutes])) as Record<StageId, number>

const initial = () => ({
  slide: 0,
  direction: 1 as const,
  links: { ...defaultLinks },
  stageMinutes: { ...defaultMinutes },
  teamNames: [...teamsConfig.defaultNames] as [string, string],
  teamScores: [0, 0] as [number, number],
  sound: true,
  showAnswers: false,
  showLessonTimer: true,
  homeworkVariant: 'original' as HomeworkVariant,
  rubric: 'original' as RubricMode,
  rubricConfirmed: false,
  lessonTimer: { elapsedMs: 0, runningSince: null },
  timers: {} as Record<string, TimerState>,
  students: [] as Student[],
  slideState: {} as Record<string, unknown>,
})

const toggle = (t: TimerState | undefined): TimerState => {
  const s = t ?? { elapsedMs: 0, runningSince: null }
  if (s.runningSince) return { elapsedMs: s.elapsedMs + Date.now() - s.runningSince, runningSince: null }
  return { ...s, runningSince: Date.now() }
}

export const timerElapsed = (t: TimerState | undefined) =>
  !t ? 0 : t.elapsedMs + (t.runningSince ? Date.now() - t.runningSince : 0)

// localStorage может быть недоступен (приватный режим) — тогда работаем без сохранения
const safeStorage = createJSONStorage(() => {
  try {
    const k = '__probe__'
    localStorage.setItem(k, '1')
    localStorage.removeItem(k)
    return localStorage
  } catch {
    const mem = new Map<string, string>()
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    }
  }
})

export const useLesson = create<LessonState>()(
  persist(
    (set, get) => ({
      ...initial(),
      panelOpen: false,
      goTo: (i) => set({ slide: i, direction: i >= get().slide ? 1 : -1 }),
      setPanel: (open) => set({ panelOpen: open }),
      patch: (p) => set(p),
      setLink: (k, v) => set({ links: { ...get().links, [k]: v } }),
      setStageMinutes: (id, m) => set({ stageMinutes: { ...get().stageMinutes, [id]: Math.max(0, Math.min(90, m)) } }),
      setTeamName: (i, v) => {
        const n = [...get().teamNames] as [string, string]
        n[i] = v
        set({ teamNames: n })
      },
      addScore: (i, d) => {
        const s = [...get().teamScores] as [number, number]
        s[i] = Math.max(0, s[i] + d)
        set({ teamScores: s })
      },
      setScore: (i, v) => {
        const s = [...get().teamScores] as [number, number]
        s[i] = Math.max(0, Number.isFinite(v) ? Math.round(v) : 0)
        set({ teamScores: s })
      },
      timerToggle: (key) => set({ timers: { ...get().timers, [key]: toggle(get().timers[key]) } }),
      timerReset: (key) => set({ timers: { ...get().timers, [key]: { elapsedMs: 0, runningSince: null } } }),
      lessonToggle: () => set({ lessonTimer: toggle(get().lessonTimer) }),
      lessonReset: () => set({ lessonTimer: { elapsedMs: 0, runningSince: null } }),
      setSlideState: (key, v) => set({ slideState: { ...get().slideState, [key]: v } }),
      addStudent: () =>
        set({
          students: [
            ...get().students,
            { id: Math.random().toString(36).slice(2, 9), name: '', bank: 0, scores: {} },
          ],
        }),
      updateStudent: (id, p) => set({ students: get().students.map((s) => (s.id === id ? { ...s, ...p } : s)) }),
      removeStudent: (id) => set({ students: get().students.filter((s) => s.id !== id) }),
      // Подготовка к новому уроку: сбрасываются результаты и интерактив,
      // но сохраняются настройки (ссылки, таймеры, названия команд, выборы).
      resetLesson: () => {
        const keep = get()
        set({
          ...initial(),
          links: keep.links,
          stageMinutes: keep.stageMinutes,
          teamNames: keep.teamNames,
          sound: keep.sound,
          homeworkVariant: keep.homeworkVariant,
          rubric: keep.rubric,
          rubricConfirmed: keep.rubricConfirmed,
          showLessonTimer: keep.showLessonTimer,
          panelOpen: false,
        })
      },
    }),
    {
      name: 'ashyk-sabak-winforms-v2',
      storage: safeStorage,
      partialize: ({ panelOpen: _p, ...rest }) => rest,
    },
  ),
)

/** Состояние интерактива конкретного слайда, сохраняется при переходах. */
export function useSlideState<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void] {
  const value = useLesson((s) => (key in s.slideState ? (s.slideState[key] as T) : init))
  const setSlideState = useLesson((s) => s.setSlideState)
  const setter = (v: T | ((p: T) => T)) => {
    const cur = useLesson.getState().slideState
    const prev = (key in cur ? cur[key] : init) as T
    setSlideState(key, typeof v === 'function' ? (v as (p: T) => T)(prev) : v)
  }
  return [value, setter]
}
