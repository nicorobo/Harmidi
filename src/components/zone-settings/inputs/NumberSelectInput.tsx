import { Option, Select } from '@mui/joy'
import { isNumber } from 'lodash'
import React from 'react'

type Props = {
  value: number
  options: number[]
  onChange: (value: number) => void
}

export const NumberSelectInput: React.FC<Props> = ({
  value,
  options,
  onChange,
}) => {
  return (
    <Select
      size="sm"
      value={value}
      onChange={(_, value) => isNumber(value) && onChange(value)}
    >
      {options.map((opt) => (
        <Option key={opt} value={opt}>
          {opt}
        </Option>
      ))}
    </Select>
  )
}
