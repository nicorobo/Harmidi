import { Box, Button, ButtonGroup, Stack } from '@mui/joy'
import { MultiPointSliderInput } from './MultiPointSliderInput'
import { DEFAULT_VELOCITY, Voice } from '../../../zone-settings'
import { QuickSelectInput } from './QuickSelectInput'
import { availableChords } from '../../../constants'
import { Chord, Interval } from 'tonal'
import { notEmpty } from '../../../util'
import { InputLabel } from './InputLabel'

// TODO This whole file needs some TLC
// TODO make this all more general/reusable later
// TODO show value (should be a callback)
const defaultVoice = { offset: 0, velocity: DEFAULT_VELOCITY }

const LABELS = [
  { value: -24, label: '-24st' },
  { value: -12, label: '-12st' },
  { value: 0, label: '0st' },
  { value: 12, label: '12st' },
  { value: 24, label: '24st' },
]

const MAX_VOICES = 8
const MIN_VOICES = 1

type Props = {
  voices: Voice[]
  onChange: (voices: Voice[]) => void
  trackColor: string
}

export const VoicesInput: React.FC<Props> = ({
  voices,
  onChange,
  trackColor,
}) => {
  const onVoiceAdded = (offset: number) => {
    if (voices.length < MAX_VOICES) {
      onChange([...voices, { offset, velocity: DEFAULT_VELOCITY }])
    }
  }

  const onVoiceRemoved = (i: number) => {
    if (voices.length > MIN_VOICES) {
      onChange(voices.filter((_, j) => j !== i))
    }
  }

  const onVoiceUpdated = (i: number, offset: number) => {
    onChange(voices.with(i, { ...voices[i], offset }))
  }

  const setToDefault = () => {
    onChange([defaultVoice])
  }

  const onChordSelected = (chord: string) => {
    const offsets = Chord.getChord(chord)
      .intervals.map((interval) => Interval.semitones(interval))
      .filter(notEmpty)
    const voices = offsets.map((offset) => ({
      offset,
      velocity: DEFAULT_VELOCITY,
    }))
    onChange(voices)
  }

  return (
    <Stack>
      <InputLabel title="Voices" />
      <MultiPointSliderInput
        points={voices.map(({ offset }) => offset)}
        min={-24}
        max={24}
        canAddPoint={voices.length < MAX_VOICES}
        onPointAdded={onVoiceAdded}
        onPointRemoved={onVoiceRemoved}
        onPointUpdated={onVoiceUpdated}
        labels={LABELS}
        trackColor={trackColor}
      />
      <Stack gap={1} direction={'row'} justifyContent={'right'}>
        <QuickSelectInput
          options={availableChords}
          onSelect={onChordSelected}
          buttonContent={'Chords'}
        />
        <Button onClick={setToDefault} size="sm">
          Single
        </Button>
      </Stack>
    </Stack>
  )
}
