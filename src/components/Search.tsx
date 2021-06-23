import React, { useEffect, useRef, useState } from 'react'
import { HomeIcon } from '@heroicons/react/solid'
import { SearchIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/dist/client/router'
import Spinner from './Spinner'

const alphanumericRegex = new RegExp('^[a-zA-Z0-9]+$')

const Search = () => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const valueRef = useRef(value)
  const router = useRouter()

  // Setting the input field value to ""
  // Event listeners for when:
  // - User starts typing
  // - Route starts to change
  // - Route finishes changing
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true)
    }

    const handleRouteChangeComplete = () => {
      setLoading(false)
      valueRef.current = ''
      setValue('')
    }

    setValue('')
    window.addEventListener('keyup', onKeyUp)
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      window.removeEventListener('keyup', onKeyUp)
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value.toLowerCase()

    if (newValue === '' || alphanumericRegex.test(newValue)) {
      valueRef.current = newValue
      setValue(newValue)
    }
  }

  const isAlphanumeric = (keyCode: number): boolean => {
    return alphanumericRegex.test(String.fromCharCode(keyCode))
  }

  const onKeyUp = ({ key, keyCode }) => {
    let searchInputElement = document.getElementById('searchInput')

    if (isAlphanumeric(keyCode)) {
      if (document.activeElement !== searchInputElement) searchInputElement.focus()
      if (valueRef.current === '') {
        const alphaNum = String.fromCharCode(keyCode).toLowerCase()
        valueRef.current = alphaNum
        setValue(alphaNum)
      }
    }
  }

  const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    let searchInputElement = document.getElementById('searchInput')

    if (document.activeElement === searchInputElement && e.key === 'Enter') {
      if (valueRef.current) {
        document.getElementById('searchInput').blur()
        // const subjectCode = valueRef.current.toLowerCase()

        // valueRef.current = ''
        // setValue('')

        // const url = '/subjects/' + subjectCode
        // window.location.href = url

        // router.push('/subjects/[code]', `/subjects/${subjectCode}`)

        let searchButtonElement = document.getElementById('searchButton')
        searchButtonElement.click()
      }
    }
  }

  const goHome: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    router.push('/')
  }

  const goToSubject: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const subjectCode = valueRef.current.toLowerCase()
    router.push('/subjects/[code]', `/subjects/${subjectCode}`)
  }

  return (
    <form>
      <div className='relative text-left text-gray-300 focus-within:text-skin-muted transition-colors'>
        <div
          onClick={goHome}
          className='absolute inset-y-0 left-0 flex items-center pl-7 transition-colors text-skin-muted hover:text-skin-accent-primary focus:outline-none'
        >
          <HomeIcon className='h-5 w-5' />
        </div>
        <div className='absolute inset-y-0 left-16 flex justify-center items-center pl-2 pointer-events-none'>
          <button id='searchButton' onClick={goToSubject}>
            <SearchIcon className='h-5 w-5' />
          </button>
        </div>
        <input
          aria-label='search bar input'
          id='searchInput'
          type='text'
          disabled={loading}
          value={value}
          onChange={handleChange}
          onKeyUp={handleSubmit}
          autoComplete='off'
          placeholder='Start typing to search subjects'
          className={`py-5 pl-28 w-screen shadow-sm
            placeholder-gray-500 focus:placeholder-gray-400
            font-light tracking-wide text-skin-muted bg-gray-100
            focus:outline-none focus:bg-gray-50`}
        ></input>
        <div className='absolute inset-y-0 right-0 pr-7 flex items-center'>
          {loading && <Spinner size={6} />}
        </div>
      </div>
    </form>
  )
}

export default Search
