import { Option, Select } from '@mui/joy'
import { isNumber } from 'lodash'

export const NumberSelectInput = ({
  value,
  options,
  onChange,
}: {
  value: number
  options: number[]
  onChange: (value: number) => void
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
