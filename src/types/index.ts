type ParsedHTML = string
interface SubjectData {
  name: string
  code: string
  overview: ParsedHTML
  eligibility: ParsedHTML
  assessment: ParsedHTML
  dates: ParsedHTML
  overviewData?: Object
  eligibilityData?: Object
  assessmentData?: Object
  datesData?: Object
}

interface StudyPeriodData {
  studyPeriod?: string
  principalCoordinator?: string
  modeOfDelivery?: string
  contactHours?: string
  totalTimeCommitment?: string
  teachingPeriod?: string
  lastSelfEnrolDate?: string
  censusDate?: string
  lastDateToWithdrawWithoutFail?: string
  assessmentPeriodEnds?: string
  contactEmails?: string[]
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

export type { ParsedHTML, SubjectData, SubjectsData, UniversityData, TabOption, StudyPeriodData }
