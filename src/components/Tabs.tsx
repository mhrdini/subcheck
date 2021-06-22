import React, { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import Tab from './Tab'
import { TabOption } from '../types'
interface TabsProps {
  options: TabOption[]
  onTabSelect: (tabLabel: string) => void
}

const Tabs: React.FC<TabsProps> = ({ options, onTabSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<TabOption>(options ? options[0] : null)

  const handleClick = (option: TabOption, index: number) => {
    setSelectedIndex(index)
    setSelectedOption(option)
    onTabSelect(option.label)
  }

  const handleChange = (option: TabOption) => {
    setSelectedIndex(options.indexOf(option))
    setSelectedOption(option)
    onTabSelect(option.label)
  }

  return (
    <div>
      {options && (
        <div className='neu-flat rounded-xl'>
          {/* Normal tabs for Small and beyond */}
          <div className='hidden sm:block py-2.5 px-4'>
            <div className={`grid grid-cols-${options.length} text-center`}>
              {options.map((option, idx) => (
                <Tab
                  key={`${option.label}-${idx}`}
                  selected={idx === selectedIndex}
                  index={idx}
                  option={option}
                  handleClick={handleClick}
                />
              ))}
            </div>
            <div className={`rounded-2xl bg-gray-200 h-0.5`}>
              <div
                className={`rounded-2xl bg-skin-accent-primary h-full w-1/${options.length} transition-transform transform duration-300 translate-x-full-${selectedIndex}`}
                // style={{
                //   '--tw-translate-x': `${selectedIndex * 100}%`
                // }}
              />
            </div>
          </div>
          {/* Dropdown list of tabs for XS */}
          <div className='block sm:hidden'>
            <Listbox value={selectedOption} onChange={(value) => handleChange(value)}>
              {({ open }) => (
                <div className='relative'>
                  <Listbox.Button
                    className={`relative w-full py-4 pl-10 pr-4 text-left 
                      text-skin-muted
                      ${!open && 'hover:text-skin hover:underline'} 
                      rounded-lg cursor-default 
                      focus:outline-none 
                      focus-visible:ring-2 
                      focus-visible:ring-opacity-75 
                      focus-visible:ring-white 
                      focus-visible:ring-offset-orange-300 
                      focus-visible:ring-offset-2 
                      focus-visible:border-indigo-500`}
                  >
                    <span className='flex truncate uppercase tracking-widest text-xs font-medium'>
                      {selectedOption.label}
                    </span>
                    <span
                      className={`
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                    >
                      {selectedOption.icon}
                    </span>
                    <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                      <ChevronDownIcon className='w-5 h-5 text-gray-400 ' aria-hidden='true' />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options
                    static
                    className={`absolute w-full py-1 mt-1 overflow-auto 
                        bg-white rounded-md shadow-lg max-h-60 
                        ring-1 ring-black ring-opacity-5
                        focus:outline-none
                        transition transform duration-200 ${
                          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                        }
                        `}
                  >
                    {options.map((option, idx) => (
                      <Listbox.Option
                        key={`${option.label}-${idx}`}
                        className={({ selected, active }) =>
                          `${selected && 'hidden'}
                            ${active ? 'bg-skin-accent-primary text-white' : 'text-skin'}
                            cursor-default select-none relative py-2 pl-10 pr-4`
                        }
                        value={option}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`text-xs uppercase tracking-widest font-light block truncate`}
                            >
                              {option.label}
                            </span>
                            <span
                              className={`
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              {option.icon}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              )}
            </Listbox>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tabs
