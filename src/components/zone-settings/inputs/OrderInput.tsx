import { ButtonGroup, IconButton, Stack } from '@mui/joy'
import { ZoneOrderSettings } from '../../../zone-settings'
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  SwapHoriz,
} from '@mui/icons-material'
import { InputLabel } from './InputLabel'

export const OrderInput = ({
  value,
  onChange,
}: {
  value: ZoneOrderSettings
  onChange: (order: ZoneOrderSettings) => void
}) => {
  const toggleLeftToRight = () =>
    onChange({ ...value, leftToRight: !value.leftToRight })
  const toggleTopToBottom = () =>
    onChange({ ...value, topToBottom: !value.topToBottom })
  const toggleReverse = () => onChange({ ...value, reverse: !value.reverse })
  const orientationButtons = [
    <IconButton onClick={toggleLeftToRight}>
      {value.leftToRight ? <ChevronRight /> : <ChevronLeft />}
    </IconButton>,
    <IconButton onClick={toggleTopToBottom}>
      {value.topToBottom ? <ExpandMore /> : <ExpandLess />}
    </IconButton>,
  ]
  if (value.reverse) {
    orientationButtons.reverse()
  }
  return (
    <Stack>
      <InputLabel title="Order" />
      <ButtonGroup>
        {...orientationButtons}
        <IconButton onClick={toggleReverse}>
          <SwapHoriz />
        </IconButton>
      </ButtonGroup>
    </Stack>
  )
}
