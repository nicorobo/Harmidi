import {
  Button,
  ButtonGroup,
  Checkbox,
  IconButton,
  Option,
  Select,
  Slider,
  Stack,
  Switch,
  ToggleButtonGroup,
} from '@mui/joy'
import { InputLabel } from './InputLabel'
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  SwapHoriz,
} from '@mui/icons-material'
import isNumber from 'lodash/isNumber'
import { useRef, useState } from 'react'
import { useStore } from '../../store'
import { toNumber } from 'lodash'
import { availableScales } from '../../constants'
import { Chord, ChordType, Interval } from 'tonal'
import { ScaleRoot, ScaleType } from '../../types/scale'
import { Voice } from './VoicesInput'
import { notEmpty } from '../../util'
import { OrientationSettings } from '../../zone-settings'

const channels = new Array(16).fill(0).map((_, i) => i)
export const ChannelInput = ({
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

export const StepperInput = ({
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

export const OcatveInput = ({
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

export const VelocityInput = ({
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

export const MuteZoneInput = ({
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

export const HoldToggleInput = ({
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
const rootNotes = [
  'Ab',
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
]

export const RootNoteInput = ({
  value,
  onChange,
}: {
  value: ScaleRoot
  onChange: (note: ScaleRoot) => void
}) => {
  return (
    <Stack flexGrow={1}>
      <InputLabel title="Root" />
      <Select
        size="sm"
        value={value}
        onChange={(_, val) => onChange(val as ScaleRoot)}
        sx={{ textTransform: 'capitalize' }}
      >
        {rootNotes.map((note) => (
          <Option value={note}>{note}</Option>
        ))}
      </Select>
    </Stack>
  )
}
export const KeyTypeInput = ({
  value,
  onChange,
}: {
  value: 'major' | 'minor'
  onChange: (keyType: 'major' | 'minor') => void
}) => {
  return (
    <Stack>
      <InputLabel title="Key" />
      <ToggleButtonGroup
        size="sm"
        value={value}
        onChange={(_, val) => val && onChange(value)}
      >
        <Button value="major">Major</Button>
        <Button value="minor">Minor</Button>
      </ToggleButtonGroup>
    </Stack>
  )
}

export const ScaleInput = ({
  value,
  onChange,
}: {
  value: ScaleType
  onChange: (type: ScaleType) => void
}) => {
  return (
    <Stack flexGrow={1}>
      <InputLabel title="Scale" />
      <Select
        size="sm"
        value={value}
        onChange={(_, val) => onChange(val as ScaleType)}
      >
        {availableScales.map((scale) => (
          <Option value={scale}>{scale}</Option>
        ))}
      </Select>
    </Stack>
  )
}

type QuantizeSettings = { root: boolean; voices: boolean }
export const QuantizeInput = ({
  quantize,
  onChange,
}: {
  quantize: QuantizeSettings
  onChange: (value: QuantizeSettings) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Quantize" />
      <Stack direction={'row'} spacing={2}>
        <Checkbox
          label="Root"
          checked={quantize.root}
          onChange={(e) => onChange({ ...quantize, root: e.target.checked })}
        />
        <Checkbox
          label="Voices"
          checked={quantize.voices}
          onChange={(e) => onChange({ ...quantize, voices: e.target.checked })}
        />
      </Stack>
    </Stack>
  )
}

export const TranslateInput = ({
  value,
  onChange,
}: {
  value: number
  onChange: (offset: number) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Translate" />
      <StepperInput
        value={value}
        onChange={onChange}
        resetValue={0}
        min={-11}
        max={11}
      />
    </Stack>
  )
}

export const OrientationInput = ({
  value,
  onChange,
}: {
  value: OrientationSettings
  onChange: (orientation: OrientationSettings) => void
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
      <InputLabel title="Orientation" />
      <ButtonGroup>
        {...orientationButtons}
        <IconButton onClick={toggleReverse}>
          <SwapHoriz />
        </IconButton>
      </ButtonGroup>
    </Stack>
  )
}

const chordTypes = ChordType.all().map(({ name, aliases }) => ({
  name,
  value: aliases[0],
}))

// const Reset

export const ChordInput = ({
  onChange,
}: {
  onChange: (voices: Voice[]) => void
}) => {
  const [chord, setChord] = useState<string | null>(null)
  const updateVoices = (cho = chord) => {
    console.log('updating voices with chord: ', cho)
    const offsets = cho
      ? Chord.getChord(cho)
          .intervals.map((interval) => Interval.semitones(interval))
          .filter(notEmpty)
      : [0]
    const voices = offsets.map((offset) => ({
      offset,
      velocity: 100,
      on: true,
    }))
    onChange(voices)
  }
  const onChordSelected = (value: string | null) => {
    setChord(value)
    updateVoices(value)
  }
  return (
    <Stack>
      <InputLabel title="Chord" />

      <Stack direction="row">
        <Select
          size="sm"
          value={chord}
          sx={{
            flexGrow: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          onChange={(_, value) => onChordSelected(value)}
        >
          {chordTypes.map(({ name, value }) => (
            <Option key={value} value={value}>
              {value} {name && `(${name})`}
            </Option>
          ))}
        </Select>
        <ButtonGroup>
          <Button
            sx={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeft: 0,
            }}
            onClick={() => updateVoices()}
          >
            Reset
          </Button>
          <Button onClick={() => updateVoices(null)}>Single</Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  )
}
