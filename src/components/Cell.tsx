import { Box } from '@mui/joy'
import { useStore } from '../store'
import { useEngine } from '../use-engine'
import { Midi } from 'tonal'
import { getChordNameFromMidiNotes } from '../chord-names-from-midi-notes'

export const Cell = ({ cell }: { cell: string }) => {
  const zoneById = useStore.use.zoneById()
  const zoneId = useStore((state) => state.zoneIdByKey[cell])

  const { activeKeys, getNoteInfoByKey } = useEngine()
  const noteInfo = getNoteInfoByKey(cell)
  const root = Midi.midiToNoteName(noteInfo.rootNote)
  const chord = getChordNameFromMidiNotes(noteInfo.midiNotes)
  const title = root + (chord ? ` ${chord}` : '')

  const isActive = activeKeys.includes(cell)
  // const selectedZone = useStore.use.selectedZone()
  const { color } = zoneId ? zoneById[zoneId] : { color: '#fff' }
  return (
    <Box
      display="flex"
      height={'3rem'}
      width={'3rem'}
      mx={'0.25rem'}
      p={'0rem 0.15rem'}
      borderRadius={'15% 15% 15% 0'}
      border={color === '#fff' ? `1px solid #eee` : ''}
      boxSizing={'border-box'}
      // sx={{
      //   opacity: isActive ? 1 : 0.5,
      // }}
      bgcolor={color + (isActive ? 'ff' : 44)}
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        flexDirection={'column'}
        overflow={'clip'}
        color={'#333'}
        fontSize={'0.6rem'}
      >
        <Box color={'#999'}>{cell}</Box>
        <Box>{title}</Box>
      </Box>
    </Box>
  )
}
