import type { ReactNode } from 'react'

// Простая подсветка синтаксиса C# (без внешних библиотек).
const KEYWORDS = new Set([
  'using', 'namespace', 'public', 'private', 'partial', 'class', 'static', 'void', 'new', 'this',
  'if', 'else', 'return', 'const', 'var', 'string', 'double', 'int', 'bool', 'true', 'false',
  'object', 'out', 'null',
])
const TYPES = new Set([
  'Form', 'Form1', 'EventArgs', 'Color', 'MessageBox', 'MessageBoxButtons', 'MessageBoxIcon',
  'MessageBoxDefaultButton', 'MessageBoxOptions', 'DialogResult', 'FormClosingEventArgs',
  'Application', 'STAThread', 'Button', 'System', 'TextBox', 'Label',
])

const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/gm

export function highlightLine(line: string): ReactNode[] {
  const out: ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(line))) {
    const [t, comment, str, num, word] = m
    let cls = ''
    if (comment) cls = 'text-[#6a9955] italic'
    else if (str) cls = 'text-[#ce9178]'
    else if (num) cls = 'text-[#b5cea8]'
    else if (word && KEYWORDS.has(word)) cls = 'text-[#569cd6]'
    else if (word && TYPES.has(word)) cls = 'text-[#4ec9b0]'
    else if (word && line[m.index + word.length] === '(') cls = 'text-[#dcdcaa]'
    else if (word) cls = 'text-[#9cdcfe]'
    else cls = 'text-[#d4d4d4]'
    out.push(<span key={i++} className={cls}>{t}</span>)
    if (m[0].length === 0) TOKEN.lastIndex++
  }
  return out
}
