/* 
A React component ScaleInput that allows a user to either select a scale from a dropdown or enter a custom scale.
The component displays a musical keyboard showing a single octave of the scale, with the root note highlighted.
Below the PianoInput is
    * a dropdown menu of scale types.
    * a switch for choosing the behavior of the keyboard input: either selecting root note, or selecting scale notes.
*/

import { Box, Switch } from '@mui/joy'
import { availableScales } from '../../../constants'
import { Scale } from 'tonal'
import { useState } from 'react'
import { QuickSelectInput } from './QuickSelectInput'
import { PianoInput } from './PianoInput'

interface Props {
  root: number
  scale: number[]
  onChange: (root: number, notes: number[]) => void
}

export const ScaleInput: React.FC<Props> = ({ root, scale, onChange }) => {
  const [rootMode, setRootMode] = useState(false)

  const onNoteClicked = (note: number) => {
    if (rootMode) {
      return onChange(note, rotateScale(note - root, scale))
    }
    if (note !== root) {
      onChange(root, scale.with(note, scale[note] === 0 ? 1 : 0))
    }
  }

  const onScaleSelected = (scaleType: string) => {
    const scale = Scale.get(scaleType)
      .chroma.split('')
      .map((n) => +n)
    onChange(root, rotateScale(root, scale))
  }

  return (
    <Box>
      <PianoInput root={root} notes={scale} onClick={onNoteClicked} />
      <Box>
        <QuickSelectInput
          options={availableScales}
          onSelect={onScaleSelected}
          buttonContent={'Scale'}
        />
        <Switch
          startDecorator="Scale"
          endDecorator="Root"
          checked={rootMode}
          onChange={(e) => setRootMode(e.target.checked)}
        />
      </Box>
    </Box>
  )
}

const rotateScale = (pivot: number, scale: number[]) => [
  ...scale.slice(-pivot),
  ...scale.slice(0, -pivot),
]
