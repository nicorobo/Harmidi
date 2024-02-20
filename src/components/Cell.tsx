import { Box } from '@mui/joy'
import { useStore } from '../store'
import { useEngine } from '../use-engine'
import { Midi } from 'tonal'
import { getChordNameFromMidiNotes } from '../chord-names-from-midi-notes'

// The Cell component is a single key on the grid.
// It displays the note name and chord name for the zone that the key belongs to.
// If the key is active, it will be highlighted.

/* 
The ideal solution for handling color in the cells would be using a 
color library like chroma.js to calculate the color of the text based 
on the background color. This would ensure that the text is always readable.
*/
export const Cell = ({ cell }: { cell: string }) => {
  const zoneById = useStore.use.zoneById()
  const zoneId = useStore((state) => state.zoneIdByKey[cell])

  const { activeKeys, getNoteInfoByKey } = useEngine()
  const noteInfo = getNoteInfoByKey(cell)
  const root = Midi.midiToNoteName(noteInfo.rootNote)
  const chord = getChordNameFromMidiNotes(noteInfo.midiNotes)

  const isActive = activeKeys.includes(cell)
  // const selectedZone = useStore.use.selectedZone()
  const { color } = zoneId ? zoneById[zoneId] : { color: '#ffffff' }
  const isWhite = color.toLowerCase() === '#ffffff'
  return (
    <Box
      display="flex"
      height={'3rem'}
      width={'3.5rem'}
      mx={'0.25rem'}
      borderRadius={'15% 15% 15% 0'}
      border={isWhite ? `1px solid #eee` : ''}
      boxSizing={'border-box'}
      // sx={{
      //   opacity: isActive ? 1 : 0.5,
      // }}
      bgcolor={color + (isActive ? 88 : 44)}
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        flexDirection={'column'}
        overflow={'clip'}
        color={'#333'}
        fontSize={'0.6rem'}
        width={'100%'}
      >
        <Box color={isWhite ? `#999` : color} m="0.1rem 0.3rem">
          {cell}
        </Box>
        {zoneId && (
          <Box
            m="0.1rem 0.3rem 0.1rem 0.2rem"
            display={'flex'}
            justifyContent={'space-between'}
          >
            <b>{root}</b>
            <span style={{ color }}>{chord && ` ${chord}`}</span>
          </Box>
        )}
      </Box>
    </Box>
  )
}
