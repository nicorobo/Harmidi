/* 
A React component ScaleInput that allows a user to either select a scale from a dropdown or enter a custom scale.
The component displays a musical keyboard showing a single octave of the scale, with the root note highlighted.
Below the keyboard is
    * a dropdown menu of scale type, that can auto-detect the scale type from the selected notes or allow the user to select a scale type from a list of options.
    * two radio buttons for choosing the behavior of the keyboard input: either selecting root note, or selecting scale notes.
*/

import { Box, Dropdown, Menu, MenuButton, MenuItem, Switch } from '@mui/joy'
import { ScaleType } from '../../types/scale'
import { availableScales } from '../../constants'
import { Scale } from 'tonal'
import { useState } from 'react'

/*
getChroma takes the root and scale, and returns the scale's chroma representation.
This is used to determine the notes of the scale.
For example, the chroma of a C major scale is 101011010101
Because we store our scale in a normalized state, we use the root to rotate the scale before getting the chroma.
A normalized scale of 101010000000 with a root of 3 would become 000101010000
*/

const rotateScale = (pivot: number, scale: number[]) => [
  ...scale.slice(-pivot),
  ...scale.slice(0, -pivot),
]

interface ScaleInputProps {
  root: number
  scale: number[]
  onChange: (root: number, notes: number[]) => void
}

export const ScaleInput: React.FC<ScaleInputProps> = ({
  root,
  scale,
  onChange,
}) => {
  console.log(root, scale)
  const [rootMode, setRootMode] = useState(false)
  const onNoteClicked = (note: number) => {
    if (rootMode) {
      return onChange(note, rotateScale(note - root, scale))
    }
    if (note !== root) {
      onChange(root, scale.with(note, scale[note] === 0 ? 1 : 0))
    }
  }
  const onScaleSelected = (scaleType: ScaleType) => {
    const scale = Scale.get(scaleType)
      .chroma.split('')
      .map((n) => +n)
    onChange(root, rotateScale(root, scale))
  }
  return (
    <Box>
      <PianoInput root={root} notes={scale} onClick={onNoteClicked} />
      <Box>
        <ScaleQuickSelect onSelect={onScaleSelected} />
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

export const ScaleQuickSelect = ({
  onSelect,
}: {
  onSelect: (type: ScaleType) => void
}) => {
  return (
    <Dropdown>
      <MenuButton size="sm">Scale</MenuButton>
      <Menu size="sm" sx={{ maxHeight: 200, overflow: 'auto' }}>
        {availableScales.map((scale) => (
          <MenuItem key={scale} onClick={() => onSelect(scale as ScaleType)}>
            {scale}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  )
}

interface PianoInputProps {
  root?: number
  notes?: number[]
  onClick?: (note: number) => void
}

const whiteKeys = [0, 2, 4, 5, 7, 9, 11]
const blackKeys = [1, 3, 6, 8, 10]

const whiteKeyWidth = 30
const blackKeyWidth = whiteKeyWidth * 0.75

const defaultNotes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
export const PianoInput: React.FC<PianoInputProps> = ({
  root,
  notes = defaultNotes,
  onClick,
}) => {
  const getColor = (key: number) => {
    if (key === root) return '#f00'
    if (notes[key] > 0) return '#ddd'
    return '#fff'
  }
  return (
    <Box position={'relative'}>
      <Box display="flex">
        {whiteKeys.map((key) => (
          <Box
            key={key}
            onClick={() => onClick && onClick(key)}
            sx={{
              height: 50,
              width: whiteKeyWidth,
              cursor: onClick ? 'pointer' : 'default',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              bgcolor: getColor(key),
              ':hover': {
                bgcolor: onClick ? '#eee' : 'default',
              },
            }}
          />
        ))}
      </Box>
      <Box display="flex" position={'absolute'} top={0}>
        {blackKeys.map((key, i) => (
          <Box
            key={key}
            onClick={() => onClick && onClick(key)}
            sx={{
              height: 30,
              width: blackKeyWidth,
              cursor: onClick ? 'pointer' : 'default',
              position: 'absolute',
              left: `${
                (i > 1 ? i + 1 : i) * whiteKeyWidth +
                whiteKeyWidth -
                blackKeyWidth / 2
              }px`,
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              bgcolor: getColor(key),
              ':hover': {
                bgcolor: onClick ? '#eee' : 'default',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
