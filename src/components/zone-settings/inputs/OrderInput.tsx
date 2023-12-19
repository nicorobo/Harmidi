import { ButtonGroup, IconButton, Stack } from '@mui/joy'
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  SwapHoriz,
} from '@mui/icons-material'
import { ZoneOrderSettings } from '../../../zone-settings'
import { InputLabel } from './InputLabel'

type Props = {
  order: ZoneOrderSettings
  onChange: (order: ZoneOrderSettings) => void
}

export const OrderInput: React.FC<Props> = ({ order, onChange }) => {
  const toggleLeftToRight = () =>
    onChange({ ...order, leftToRight: !order.leftToRight })
  const toggleTopToBottom = () =>
    onChange({ ...order, topToBottom: !order.topToBottom })
  const toggleReverse = () => onChange({ ...order, reverse: !order.reverse })
  const orientationButtons = [
    <IconButton onClick={toggleLeftToRight}>
      {order.leftToRight ? <ChevronRight /> : <ChevronLeft />}
    </IconButton>,
    <IconButton onClick={toggleTopToBottom}>
      {order.topToBottom ? <ExpandMore /> : <ExpandLess />}
    </IconButton>,
  ]
  if (order.reverse) {
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
