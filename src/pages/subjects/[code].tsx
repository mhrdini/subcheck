import React, { useEffect, useRef, useState } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/dist/client/router'
import {
  BookOpenIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/outline'

import { fetchSubjectPage, unimelbSubjects } from '../../data'
import { SubjectData, TabOption } from '../../types'
import Tabs from '../../components/Tabs'

const options: TabOption[] = [
  { label: 'overview', icon: <BookOpenIcon className='w-5 h-5' /> },
  { label: 'requirements', icon: <CheckCircleIcon className='w-5 h-5' /> },
  { label: 'assessment', icon: <AcademicCapIcon className='w-5 h-5' /> },
  { label: 'dates & times', icon: <CalendarIcon className='w-5 h-5' /> }
]

// TODO: Fix flashing to / page when rendering a /subjects/[code] page
const Subject = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const overviewRef = useRef<HTMLDivElement>(null)
  const eligibilityRef = useRef<HTMLDivElement>(null)
  const assessmentRef = useRef<HTMLDivElement>(null)
  const datesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (overviewRef.current) overviewRef.current.innerHTML = data.overview
    if (eligibilityRef.current) eligibilityRef.current.innerHTML = data.eligibility
    if (assessmentRef.current) assessmentRef.current.innerHTML = data.assessment
    if (datesRef.current) datesRef.current.innerHTML = data.dates
  }, [data, overviewRef.current, eligibilityRef.current, assessmentRef.current, datesRef.current])

  // useRouter uses useContext, so need to be placed after useRef hooks
  const router = useRouter()

  // Corresponds to a specific tab in the UniMelb subject page handbook
  const [tabLabel, setTabLabel] = useState(options[0].label)

  const onTabSelect = (tabLabel: string) => {
    setTabLabel(tabLabel)
  }

  // To render the HTML of the section that corresponds to the currently selected tab
  const getTabDivRef = () => {
    switch (tabLabel) {
      case options[0].label:
        return overviewRef
      case options[1].label:
        return eligibilityRef
      case options[2].label:
        return assessmentRef
      case options[3].label:
        return datesRef
      default:
        return overviewRef
    }
  }

  if (router.isFallback) {
    return (
      <div className='flex justify-center align-center'>
        <div className='w-full max-w-2xl md:w-3/4 h-screen space-y-5'>
          <div className='bg-gray-200 animate-pulse rounded-xl h-12'></div>
          <div className='bg-gray-200 animate-pulse rounded-xl h-5/6'></div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex justify-center align-center'>
        <div className='w-full max-w-2xl md:w-3/4 space-y-5'>
          <Tabs options={options} onTabSelect={onTabSelect} />
          <div
            className='neu-flat rounded-none px-0 pt-1 sm:rounded-lg sm:px-4'
            ref={getTabDivRef()}
          ></div>
        </div>
      </div>
    )
  }
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = unimelbSubjects
    .slice(0, 51)
    .map((subjectCode) => ({ params: { code: subjectCode } }))

  // const paths = [{ params: { code: 'comp10001' } }, { params: { code: 'comp10002' } }]

  return {
    paths,
    fallback: true
  }
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const code = params.code as string

  const data: SubjectData = await fetchSubjectPage(code)

  if (!data) return { notFound: true }

  return { props: { data } }
}

export default Subject
