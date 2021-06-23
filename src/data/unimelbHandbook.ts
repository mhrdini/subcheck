import { parse } from 'node-html-parser'
import { SubjectData } from '../types'
import { JSDOM } from 'jsdom'

// For each section in the subject handbook page for an input subject code,
// retrieve the HTML string of the following sections:
// Overview, Eligibility and requirements, Assessment, and Dates and times
// If subject exists, return a SubjectData object
// Otherwise, return null
export const fetchSubjectPage = async (subjectCode: string): Promise<SubjectData> => {
  // Check if the subject exists and retrieve the HTML string for the Overview section if it does
  const { name, overview } = await getOverviewAndName(subjectCode)

  // If the url returns a 404 page, null is returned to indicate that the subject does not exist
  if (!name) {
    return null
  }

  // Ensures that the tables in the returned HTML string are responsive
  const eligibility = processEligibilitySection(
    await getSectionDivString(
      `https://handbook.unimelb.edu.au/subjects/${subjectCode}/eligibility-and-requirements`
    )
  )
  const assessment = processAssessmentSection(
    await getSectionDivString(`https://handbook.unimelb.edu.au/subjects/${subjectCode}/assessment`)
  )

  const dates = await getSectionDivString(
    `https://handbook.unimelb.edu.au/subjects/${subjectCode}/dates-times`
  )

  const subjectData: SubjectData = {
    name,
    code: subjectCode,
    overview,
    eligibility,
    assessment,
    dates
  }

  return subjectData
}

const getOverviewAndName = async (subjectCode: string) => {
  const response = await fetch(`https://handbook.unimelb.edu.au/subjects/${subjectCode}`)

  if (response.url.endsWith('404')) return { name: null, overview: null }

  // Get the HTML string of the entire page via the URL
  const body = await response.text()

  // Parses the HTML string to retrieve the specific element that encapsulates the section
  // Need to update if the HTML structure of the subject page in the handbook changes
  // Alternatively find dynamic solution to immediately retrieve the specific element

  const name =
    parse(body).childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1]
      .childNodes[2].childNodes[1].childNodes[0].innerText

  const overview =
    parse(
      body
    ).childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[4].childNodes[1].childNodes[0].toString()

  return { name, overview }
}

// Returns the stringified HTML of a subject's handbook section.
// The specific subject and section is given in the URL
// e.g. the Assessment section of COMP10001 =
// https://handbook.unimelb.edu.au/subjects/comp10001/assessment
// Returns null if url returns a 404 page
const getSectionDivString = async (url: string) => {
  const response = await fetch(url)

  if (response.url.endsWith('404')) return null

  // Get the HTML string of the entire page via the URL
  const body = await response.text()

  // Parses the HTML string to retrieve the specific element that encapsulates the section
  // Need to update if the HTML structure of the subject page in the handbook changes
  // Alternatively find dynamic solution to immediately retrieve the specific element
  return parse(
    body
  ).childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[4].childNodes[1].childNodes[0].toString()
}

// To be added as the class attribute for responsive elements that change in different breakpoints
const RESPONSIVE_CLASS = 'responsive'

// The different columns for tables in the "Eligibility and Requirements" and "Assessment" pages
const ELIGIBILITY_COLUMNS = ['code', 'name', 'teaching period', 'credit points']
const ELIGIBILITY_LENGTH = ELIGIBILITY_COLUMNS.length

const ASSESSMENT_COLUMNS = ['description', 'timing', 'percentage']
const ASSESSMENT_LENGTH = ASSESSMENT_COLUMNS.length

function processEligibilitySection(sectionString: string) {
  let eligibilitySection = new JSDOM(sectionString)

  // Each row will collapse from being read from left-to-right (horizontal alignment)
  // to top-down (vertical alignment) to keep the responsive design readable
  let tableRows = eligibilitySection.window.document.querySelectorAll('tr')
  tableRows.forEach((row) => {
    row.setAttribute('class', RESPONSIVE_CLASS)
  })

  // Since each row is squashed into a vertically formatted series of column values,
  // we attach the column name as the data-label to the corresponding table cell of the row
  // e.g. For a row describing the COMP10001 subject, assign "name" as the data-label for
  // the table cell with "Foundations of Computing"
  let tableCells = eligibilitySection.window.document.querySelectorAll('td')
  for (let index = 0; index < tableCells.length; index++) {
    tableCells[index].setAttribute('class', RESPONSIVE_CLASS)
    tableCells[index].setAttribute('data-label', ELIGIBILITY_COLUMNS[index % ELIGIBILITY_LENGTH])
  }

  let newSection = eligibilitySection.serialize()

  return newSection
}

function processAssessmentSection(sectionString: string) {
  let assessmentSection = new JSDOM(sectionString)

  // Each row will collapse from being read from left-to-right (horizontal alignment)
  // to top-down (vertical alignment) to keep the responsive design readable
  let tableRows = assessmentSection.window.document.querySelectorAll('tr')
  tableRows.forEach((row) => {
    row.setAttribute('class', RESPONSIVE_CLASS)
  })

  // Since each row is squashed into a vertically formatted series of column values
  // we attach the column name as the data-label to the corresponding table cell of the row
  // e.g. For a row describing an assignment, assign "percentage" as the data-label for
  // the table cell with "60%"
  let tableCells = assessmentSection.window.document.querySelectorAll('td')
  for (let index = 0; index < tableCells.length; index++) {
    tableCells[index].setAttribute('class', RESPONSIVE_CLASS)
    tableCells[index].setAttribute('data-label', ASSESSMENT_COLUMNS[index % ASSESSMENT_LENGTH])
  }

  let newSection = assessmentSection.serialize()

  return newSection
}
