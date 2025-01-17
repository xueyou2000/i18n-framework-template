import React from 'react'
import { FaSpinner } from 'react-icons/fa'

import './index.scss'

export const Spinner: React.FC = () => {
  return (
    <span className='spinner'>
      <FaSpinner className='fa-spin' />
    </span>
  )
}
