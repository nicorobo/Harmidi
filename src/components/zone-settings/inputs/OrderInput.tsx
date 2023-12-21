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
      {order.leftToRight ? (
        <ChevronRight fontSize="small" />
      ) : (
        <ChevronLeft fontSize="small" />
      )}
    </IconButton>,
    <IconButton onClick={toggleTopToBottom}>
      {order.topToBottom ? (
        <ExpandMore fontSize="small" />
      ) : (
        <ExpandLess fontSize="small" />
      )}
    </IconButton>,
  ]
  if (order.reverse) {
    orientationButtons.reverse()
  }
  return (
    <Stack>
      <InputLabel title="Order" />
      <ButtonGroup size="sm">
        {...orientationButtons}
        <IconButton onClick={toggleReverse}>
          <SwapHoriz fontSize="small" />
        </IconButton>
      </ButtonGroup>
    </Stack>
  )
}
