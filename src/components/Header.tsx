import React, { useEffect } from 'react'
import Search from './Search'

interface HeaderProps {
  className: string
}

const Header = ({ className }) => {
  return (
    <div
      aria-label='header'
      className={`${className} top-0 z-50 flex flex-row justify-around items-center mb-5 w-screen`}
    >
      <Search />
    </div>
  )
}

export default Header
