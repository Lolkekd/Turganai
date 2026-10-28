// Собирает папку release/Ashyk-sabak-WinForms и ZIP-архив для компьютера колледжа.
// Запуск: npm run package (сначала выполняется npm run build).
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const releaseDir = join(root, 'release')
const name = 'Ashyk-sabak-WinForms'
const out = join(releaseDir, name)
const zipPath = join(releaseDir, `${name}.zip`)

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Нет dist/index.html — сначала выполните npm run build')
  process.exit(1)
}

rmSync(out, { recursive: true, force: true })
rmSync(zipPath, { force: true })
mkdirSync(out, { recursive: true })
cpSync(dist, join(out, 'presentation'), { recursive: true })
rmSync(join(out, 'presentation', 'images', '.gitkeep'), { force: true })
rmSync(join(out, 'presentation', 'videos', '.gitkeep'), { force: true })
mkdirSync(join(out, 'presentation', 'videos'), { recursive: true })

const crlf = (s) => s.replace(/\r?\n/g, '\r\n')

// Подсказка, куда положить фото
writeFileSync(
  join(out, 'presentation', 'images', 'PHOTO-README.txt'),
  crlf(`Положите фото преподавателя в эту папку под именем teacher.jpg
(полный путь: presentation\\images\\teacher.jpg).
Фото появится на титульном слайде автоматически. Рекомендуемая ориентация — вертикальная (3:4).
`),
)

// Подсказка, куда положить видео ИИ для этапа «Ұйымдастыру кезеңі»
writeFileSync(
  join(out, 'presentation', 'videos', 'VIDEO-README.txt'),
  crlf(`Положите видео ИИ в эту папку под именем org-video.mp4
(полный путь: presentation\\videos\\org-video.mp4).
Видео появится на слайде «Ұйымдастыру кезеңі» (сразу после титульного).
Формат: MP4 (видео H.264, звук AAC) — так оно откроется в Edge и Chrome без интернета.
`),
)

// START.bat — открыть в Microsoft Edge на весь экран, иначе в браузере по умолчанию
writeFileSync(
  join(out, 'START.bat'),
  crlf(`@echo off
chcp 65001 >nul
set "PAGE=%~dp0presentation\\index.html"
if not exist "%PAGE%" (
  echo Файл presentation\\index.html не найден. Распакуйте архив полностью.
  pause
  exit /b 1
)
where msedge >nul 2>nul
if %errorlevel%==0 (
  start "" msedge --new-window --start-fullscreen "%PAGE%"
  exit /b 0
)
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
  start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --new-window --start-fullscreen "%PAGE%"
  exit /b 0
)
if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
  start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --new-window --start-fullscreen "%PAGE%"
  exit /b 0
)
start "" "%PAGE%"
`),
)

// OPEN-OFFLINE.bat — открыть в браузере по умолчанию (Node.js и интернет не нужны)
writeFileSync(
  join(out, 'OPEN-OFFLINE.bat'),
  crlf(`@echo off
start "" "%~dp0presentation\\index.html"
`),
)

writeFileSync(join(out, 'README.txt'), crlf(readFileSync(join(root, 'scripts', 'release-readme.txt'), 'utf8')))

// ZIP
try {
  if (process.platform === 'win32') {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${out}' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' })
  } else {
    execSync(`zip -r -q -X "${name}.zip" "${name}"`, { cwd: releaseDir, stdio: 'inherit' })
  }
  console.log(`Готово: ${zipPath}`)
} catch {
  console.warn(`ZIP не создан (нет zip/PowerShell). Папка готова: ${out}`)
}
