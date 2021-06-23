import React, { useEffect, useRef, useState } from 'react'
import { HomeIcon } from '@heroicons/react/solid'
import { SearchIcon } from '@heroicons/react/outline'
import Link from 'next/link'

const alphanumericRegex = new RegExp('^[a-zA-Z0-9]+$')

const Search = () => {
  const [value, setValue] = useState('')
  const valueRef = useRef(value)

  useEffect(() => {
    setValue('')

    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keyup', onKeyUp)
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
    let searchInputElement = document.getElementById('searchInput')

    if (document.activeElement === searchInputElement && e.key === 'Enter') {
      if (valueRef.current) {
        // let searchButtonElement = document.getElementById('searchButton')

        document.getElementById('searchInput').blur()

        const subjectCode = valueRef.current.toLowerCase()

        valueRef.current = ''
        setValue('')

        window.location.href = '/subjects/' + subjectCode

        // searchButtonElement.click()
      }
    }
  }

  const goHome = () => {
    window.location.href = '/'
  }

  return (
    <form>
      <div className='relative text-left text-gray-300 focus-within:text-skin-muted transition-colors'>
        {/* <Link href='/'> */}
        <div
          onClick={goHome}
          className='absolute inset-y-0 left-0 transition-colors text-skin-muted hover:text-skin-accent-primary flex items-center pl-7 focus:outline-none'
        >
          <HomeIcon className='h-5 w-5' />
        </div>
        {/* </Link> */}
        <span className='absolute inset-y-0 left-16 flex items-center pl-2'>
          {/* <Link href={`/subjects/${valueRef.current.toLowerCase()}`}>
            <button
              aria-label='search bar button'
              id='searchButton'
              type='submit'
              className='pointer-events-none'
            > */}
          <SearchIcon className='h-5 w-5' />
          {/* </button>
          </Link> */}
        </span>
        <input
          aria-label='search bar input'
          id='searchInput'
          type='text'
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
      </div>
    </form>
  )
}

export default Search
