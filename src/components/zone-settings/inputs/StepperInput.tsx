import { Button, ButtonGroup, IconButton } from '@mui/joy'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { isNumber } from 'lodash'

type Props = {
  value: number
  min?: number
  max?: number
  resetValue?: number
  onChange: (newValue: number) => void
}

export const StepperInput: React.FC<Props> = ({
  value,
  min,
  max,
  resetValue,
  onChange,
}) => {
  const stepDown = () => onChange(value - 1)
  const stepUp = () => onChange(value + 1)
  const reset = () => isNumber(resetValue) && onChange(resetValue)
  return (
    <ButtonGroup size="sm">
      <IconButton disabled={isNumber(min) && value <= min} onClick={stepDown}>
        <ChevronLeft />
      </IconButton>
      <Button onClick={reset}>{value}</Button>
      <IconButton disabled={isNumber(max) && value >= max} onClick={stepUp}>
        <ChevronRight />
      </IconButton>
    </ButtonGroup>
  )
}
