import { parse } from 'node-html-parser'
import { parse as parse5 } from 'parse5'
import { StudyPeriodData, SubjectData } from '../types'
import { JSDOM } from 'jsdom'

// For each section in the subject handbook page for an input subject code,
// retrieve the HTML string of the following sections:
// Overview, Eligibility and requirements, Assessment, and Dates and times
// If subject exists, return a SubjectData object
// Otherwise, return null
export const fetchSubjectPage = async (subjectCode: string): Promise<SubjectData> => {
  const response = await (
    await fetch(`https://handbook.unimelb.edu.au/subjects/${subjectCode}/print`)
  ).text()

  const subjectName =
    parse(response).childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0]
      .childNodes[1].childNodes[2].childNodes[1].childNodes[0].innerText

  if (!subjectName) {
    return null
  }

  const mainDiv =
    parse(response).childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0]
      .childNodes[4].childNodes[1].childNodes[0].childNodes[0]

  let rawSubjectData = {
    overview: parse('') as unknown as HTMLElement,
    eligibility: parse('') as unknown as HTMLElement,
    assessment: parse('') as unknown as HTMLElement,
    dates: parse('') as unknown as HTMLElement
  }

  let numberOfH2s = 0

  for (const childNode of Array.from(mainDiv.childNodes)) {
    const node = childNode as unknown as HTMLElement

    if (node.tagName === 'H2') numberOfH2s += 1

    switch (numberOfH2s) {
      case 1:
        rawSubjectData.overview.appendChild(node)
        break
      case 2:
        rawSubjectData.eligibility.appendChild(node)
        break
      case 3:
        rawSubjectData.assessment.appendChild(node)
        break
      case 4:
        rawSubjectData.dates.appendChild(node)
        break
    }
  }

  const subjectData: SubjectData = {
    name: subjectName,
    code: subjectCode,
    overview: rawSubjectData.overview.outerHTML,
    eligibility: processEligibilitySection(rawSubjectData.eligibility.outerHTML),
    assessment: processAssessmentSection(rawSubjectData.assessment.outerHTML),
    dates: rawSubjectData.dates.outerHTML,
    overviewData: getOverviewData(rawSubjectData.overview),
    eligibilityData: getEligibilityData(rawSubjectData.eligibility),
    assessmentData: getAssessmentData(rawSubjectData.assessment),
    datesData: getDatesData(rawSubjectData.dates)
  }

  console.dir(subjectData.datesData, { depth: null })

  return subjectData
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

// Adds necessary responsive attributes to each row and cells of tables in the Eligibility section
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

// Adds necessary responsive attributes to each row and cells of tables in the Assessment section
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

function getOverviewData(overview: HTMLElement): Object {
  const courseOverviewRows = Array.from(overview.querySelectorAll('tr'))
  let availability = []

  for (const row of courseOverviewRows) {
    if (row.childNodes.length && row.firstChild.textContent === 'Availability') {
      availability = Array.from(row.childNodes[1].childNodes).map((divNode) => divNode.textContent)
    }
  }
  return { availability }
}
function getEligibilityData(eligibility: HTMLElement): Object {
  return {}
}

function getAssessmentData(assessment: HTMLElement): Object {
  return {}
}

function getDatesData(dates: HTMLElement): Object {
  const studyPeriods = Array.from(dates.querySelectorAll('li')).map((period) => {
    // Get the name of the study period
    const studyPeriod = period.firstChild.textContent

    let studyPeriodDetails: StudyPeriodData = { studyPeriod }

    // Get the list of study period details, extracting the name of the detail and its value
    const studyPeriodRows = Array.from(period.querySelectorAll('tr'))

    for (const detailRow of studyPeriodRows) {
      const detailName = detailRow.firstChild.textContent
      const detailValue = detailRow.lastChild.textContent

      studyPeriodDetails = { ...studyPeriodDetails, [toCamelCase(detailName)]: detailValue }
    }

    // Get the contact emails for the study period
    const contactEmails = extractEmails(
      period.querySelector('.course__body__inner__contact_details').innerHTML
    )

    studyPeriodDetails = { ...studyPeriodDetails, contactEmails }

    return studyPeriodDetails
  })

  return { studyPeriods }
}

// Retrieved from https://stackoverflow.com/a/24916356
const toCamelCase = function (string: string) {
  const nonDashString = string.replace('-', ' ')

  return nonDashString
    .replace(/(?:^.|[A-Z]|\b.)/g, function (letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase()
    })
    .replace(/\s+/g, '')
}

const extractEmails = (text: string) => {
  return Array.from(new Set(text.match(/([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)))
}
