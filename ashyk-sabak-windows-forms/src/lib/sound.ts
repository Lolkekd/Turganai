import { useLesson } from '../store/useLesson'

// Короткие сигналы WebAudio — без звуковых файлов и интернета.
let ctx: AudioContext | null = null

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.12) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, ctx.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur)
  o.connect(g).connect(ctx.destination)
  o.start(ctx.currentTime + start)
  o.stop(ctx.currentTime + start + dur + 0.05)
}

export function play(kind: 'click' | 'success' | 'error' | 'reveal' | 'end') {
  if (!useLesson.getState().sound) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    switch (kind) {
      case 'click': tone(660, 0, 0.08, 'triangle', 0.06); break
      case 'success': tone(523, 0, 0.15); tone(659, 0.1, 0.15); tone(784, 0.2, 0.3); break
      case 'error': tone(220, 0, 0.25, 'triangle', 0.1); break
      case 'reveal': tone(440, 0, 0.12); tone(880, 0.12, 0.35); break
      case 'end': [0, 0.35, 0.7].forEach((t) => tone(880, t, 0.25, 'square', 0.06)); break
    }
  } catch {
    /* звук недоступен — игнорируем */
  }
}
