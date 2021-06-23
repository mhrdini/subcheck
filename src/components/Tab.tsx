import React from 'react'
import { TabOption } from '../types'

interface TabProps {
  selected: boolean
  index: number
  option: TabOption
  handleClick: (option: TabOption, index: number) => void
}

const Tab: React.FC<TabProps> = ({ selected, index, option, handleClick }) => {
  const onClick: React.MouseEventHandler<HTMLDivElement> = (_) => {
    handleClick(option, index)
  }

  return (
    <div
      className={`pt-1 pb-2 text-xs uppercase cursor-pointer tracking-widest  ${
        selected ? 'text-skin' : 'text-skin-muted'
      }`}
      onClick={onClick}
    >
      {option.label}
    </div>
  )
}

export default Tab
