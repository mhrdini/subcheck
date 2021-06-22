import { parse } from 'node-html-parser'
import { SubjectData } from '../types'
import { JSDOM } from 'jsdom'

export const fetchSubjectPage = async (subjectCode: string): Promise<SubjectData> => {
  const overview = await getSectionDivString(
    `https://handbook.unimelb.edu.au/subjects/${subjectCode}`
  )

  if (!overview) {
    return null
  }

  const eligibility = processEligibilityTables(
    await getSectionDivString(
      `https://handbook.unimelb.edu.au/subjects/${subjectCode}/eligibility-and-requirements`
    )
  )
  const assessment = processAssessmentTables(
    await getSectionDivString(`https://handbook.unimelb.edu.au/subjects/${subjectCode}/assessment`)
  )
  const dates = await getSectionDivString(
    `https://handbook.unimelb.edu.au/subjects/${subjectCode}/dates-times`
  )

  const subjectData: SubjectData = {
    code: subjectCode,
    overview,
    eligibility,
    assessment,
    dates
  }

  return subjectData
}

const getSectionDivNode = async (url: string) => {
  const response = await (await fetch(url)).text()

  return parse(response).childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0]
    .childNodes[4].childNodes[1].childNodes[0]
}
const getSectionDivString = async (url) => {
  const response = await fetch(url)

  if (response.url.endsWith('404')) return null

  const body = await response.text()

  return parse(
    body
  ).childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[4].childNodes[1].childNodes[0].toString()
}

const RESPONSIVE_CLASS = 'responsive'

const ELIGIBILITY_COLUMNS = ['code', 'name', 'teaching period', 'credit points']
const ELIGIBILITY_LENGTH = ELIGIBILITY_COLUMNS.length

function processEligibilityTables(sectionString: string) {
  let eligibilitySection = new JSDOM(sectionString)

  let tableRows = eligibilitySection.window.document.querySelectorAll('tr')
  tableRows.forEach((row) => {
    row.setAttribute('class', RESPONSIVE_CLASS)
  })

  let tableCells = eligibilitySection.window.document.querySelectorAll('td')
  for (let index = 0; index < tableCells.length; index++) {
    tableCells[index].setAttribute('class', RESPONSIVE_CLASS)
    tableCells[index].setAttribute('data-label', ELIGIBILITY_COLUMNS[index % ELIGIBILITY_LENGTH])
  }

  let newSection = eligibilitySection.serialize()

  return newSection
}

const ASSESSMENT_COLUMNS = ['description', 'timing', 'percentage']
const ASSESSMENT_LENGTH = ASSESSMENT_COLUMNS.length

function processAssessmentTables(sectionString: string) {
  let assessmentSection = new JSDOM(sectionString)

  let tableRows = assessmentSection.window.document.querySelectorAll('tr')
  tableRows.forEach((row) => {
    row.setAttribute('class', RESPONSIVE_CLASS)
  })

  let tableCells = assessmentSection.window.document.querySelectorAll('td')
  for (let index = 0; index < tableCells.length; index++) {
    tableCells[index].setAttribute('class', RESPONSIVE_CLASS)
    tableCells[index].setAttribute('data-label', ASSESSMENT_COLUMNS[index % ASSESSMENT_LENGTH])
  }

  let newSection = assessmentSection.serialize()

  return newSection
}
