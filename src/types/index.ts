import { Node } from 'node-html-parser'

type ParsedHTML = string
interface SubjectData {
  code: string
  overview: ParsedHTML
  eligibility: ParsedHTML
  assessment: ParsedHTML
  dates: ParsedHTML
}

interface SubjectsData {
  university: string
  subjects: SubjectData[]
}
interface UniversityData {
  university: string
}

interface TabOption {
  label: string
  icon: JSX.Element
}

export type { ParsedHTML, SubjectData, SubjectsData, UniversityData, TabOption }