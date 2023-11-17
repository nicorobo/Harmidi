import {
  Button,
  ButtonGroup,
  IconButton,
  Option,
  Select,
  Slider,
  Stack,
  Switch,
  ToggleButtonGroup,
} from '@mui/joy'
import { CommonLivePlaySettings, ZoneSettings } from '../../zone-settings'
import { InputLabel } from './InputLabel'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import isNumber from 'lodash/isNumber'
import { useRef } from 'react'
import { useStore } from '../../store'
import { toNumber } from 'lodash'

const channels = new Array(16).fill(0).map((_, i) => i)
const ChannelInput = ({
  channel,
  onChange,
}: {
  channel: number
  onChange: (channel: number) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Channel" />
      <Select
        size="sm"
        value={channel}
        onChange={(_, value) => isNumber(value) && onChange(value)}
      >
        {channels.map((channel) => (
          <Option value={channel}>{channel + 1}</Option>
        ))}
      </Select>
    </Stack>
  )
}

const StepperInput = ({
  value,
  min,
  max,
  resetValue,
  onChange,
}: {
  value: number
  min?: number
  max?: number
  resetValue?: number
  onChange: (newValue: number) => void
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

const OcatveInput = ({
  octaveOffset,
  onChange,
}: {
  octaveOffset: number
  onChange: (octaveOffset: number) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Octave" />
      <StepperInput
        value={octaveOffset}
        onChange={onChange}
        resetValue={0}
        min={-3}
        max={3}
      />
    </Stack>
  )
}

const VelocityInput = ({
  velocity,
  onChange,
}: {
  velocity: number
  onChange: (velocity: number) => void
}) => {
  const defaultVelocity = useRef(velocity)
  return (
    <Stack>
      <InputLabel title="Velocity" />
      <Slider
        size="sm"
        min={0}
        max={127}
        step={1}
        valueLabelDisplay="auto"
        defaultValue={defaultVelocity.current}
        onChangeCommitted={(_, value) => onChange(value as number)}
      />
    </Stack>
  )
}

const MuteZoneInput = ({
  muteZones,
  onChange,
}: {
  muteZones: number[]
  onChange: (muteZones: number[]) => void
}) => {
  const zones = useStore((state) => state.settings)

  return (
    <Stack>
      <InputLabel title="Mute" />
      <ToggleButtonGroup
        size="sm"
        value={muteZones.map((zone) => `${zone}`)}
        onChange={(_, muteZones) =>
          onChange(muteZones.map((zone) => toNumber(zone)))
        }
      >
        {zones.map((_, i) => (
          <Button key={i} value={`${i}`}>
            {'ABCDEFGHIJ'[i]}
          </Button>
        ))}
      </ToggleButtonGroup>
    </Stack>
  )
}

const HoldToggleInput = ({
  value,
  onChange,
}: {
  value: boolean
  onChange: (hold: boolean) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Hold" />
      <Switch
        checked={value}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
    </Stack>
  )
}

export const SharedSettings = ({
  settings,
  onUpdate,
}: {
  settings: ZoneSettings
  onUpdate: (settings: Partial<CommonLivePlaySettings>) => void
}) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={4}>
        <Stack>
          <ChannelInput
            channel={settings.channel}
            onChange={(channel) => onUpdate({ channel })}
          />
          <OcatveInput
            octaveOffset={settings.octave}
            onChange={(octave) => onUpdate({ octave })}
          />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={4}>
        <VelocityInput
          velocity={settings.velocity}
          onChange={(velocity) => onUpdate({ velocity })}
        />
        <MuteZoneInput
          muteZones={settings.muteZones}
          onChange={(muteZones) => onUpdate({ muteZones })}
        />
        <HoldToggleInput
          value={settings.hold}
          onChange={(hold) => onUpdate({ hold })}
        />
      </Stack>
    </Stack>
  )
}
