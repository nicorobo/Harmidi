/* 
KeyMapInfo is a component that displays the current zone and color that is selected,
so it's clear that pressing a key will result in it being mapped instead of making a sound
*/

import { Box } from '@mui/joy'
import { useStore } from '../store'

export const KeyMapInfo = () => {
  const isKeyMapping = useStore.use.isKeyMapping()
  const zoneById = useStore.use.zoneById()
  const selectedZone = useStore.use.selectedZone()
  if (!isKeyMapping || !selectedZone) return null
  const { name, color } = zoneById[selectedZone]
  return (
    <Box
      fontSize={'0.8rem'}
      display={'flex'}
      alignItems="center"
      alignSelf={'flex-start'}
      position={'absolute'}
      top={-30}
    >
      <ColorDot color={color} />
      <span>
        Mapping <b>{name}</b>
      </span>
    </Box>
  )
}

const ColorDot = ({ color }: { color: string }) => {
  return (
    <Box
      sx={{
        width: '1rem',
        height: '1rem',
        borderRadius: '50%',
        backgroundColor: color,
        border: color.toLowerCase() === '#ffffff' ? '1px solid #ddd' : 'none',
        display: 'inline-block',
        marginRight: '0.5rem',
      }}
    />
  )
}
