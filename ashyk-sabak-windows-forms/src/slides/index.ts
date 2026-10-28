import type { ComponentType } from 'react'
import type { StageId } from '../config/lesson.config'
import Title from './Title'
import { Greeting, AdalAzamat } from './Organization'
import Teams from './Teams'
import Baamboozle from './Baamboozle'
import Puzzle from './Puzzle'
import Goals from './Goals'
import NewProject from './NewProject'
import VsInterface from './VsInterface'
import ProjectFiles from './ProjectFiles'
import ColorDemo from './ColorDemo'
import SumDemo from './SumDemo'
import { MessageBoxTheory, MessageBoxTeamTask } from './MessageBoxSlides'
import { SumTaskPractice } from './Practice'
import FindError from './FindError'
import BreakTime from './BreakTime'
import Quiz from './Quiz'
import Assessment from './Assessment'
import Feedback from './Feedback'
import { Homework, Conclusion } from './Finish'

export interface SlideDef { title: string; stage: StageId | null; Component: ComponentType }

// Порядок слайдов = сценарий урока. stage связывает слайд с этапом и таймером.
export const slides: SlideDef[] = [
  { title: 'Титулдық бет', stage: null, Component: Title },
  { title: 'Сәлемдесу', stage: 'org', Component: Greeting },
  { title: '«Адал азамат»', stage: 'org', Component: AdalAzamat },
  { title: 'Топқа бөлу', stage: 'teams', Component: Teams },
  { title: 'Үй тапсырмасын тексеру (Baamboozle)', stage: 'homeworkCheck', Component: Baamboozle },
  { title: 'Жасырын тақырып (пазл)', stage: 'puzzle', Component: Puzzle },
  { title: 'Мақсаты мен жоспары', stage: 'goals', Component: Goals },
  { title: 'Жаңа жоба құру', stage: 'newTopic', Component: NewProject },
  { title: 'Visual Studio интерфейсі', stage: 'newTopic', Component: VsInterface },
  { title: 'Жоба файлдары', stage: 'newTopic', Component: ProjectFiles },
  { title: 'Мысал №1: форма түсі', stage: 'demo', Component: ColorDemo },
  { title: 'Мысал №2: екі санның қосындысы', stage: 'demo', Component: SumDemo },
  { title: 'MessageBox: теория', stage: 'demo', Component: MessageBoxTheory },
  { title: 'Практикалық жұмыс: «Қосу» формасы', stage: 'practice1', Component: SumTaskPractice },
  { title: '«Қатені тап» (ЖИ көмегімен)', stage: 'practice2', Component: FindError },
  { title: '2-топ: хабарлама шығару', stage: 'practice2', Component: MessageBoxTeamTask },
  { title: 'Сергіту сәті: мини-флешмоб', stage: 'break', Component: BreakTime },
  { title: 'Білімді бекіту', stage: 'consolidation', Component: Quiz },
  { title: 'Бағалау', stage: 'assessment', Component: Assessment },
  { title: 'Кері байланыс', stage: 'feedback', Component: Feedback },
  { title: 'Үйге тапсырма', stage: 'finish', Component: Homework },
  { title: 'Қорытынды', stage: 'finish', Component: Conclusion },
]
