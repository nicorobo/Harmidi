import { Box } from '@mui/joy'
import { useStore } from '../store'

const activeColor = '#d9d8ff'
export const Cell = ({
  cell,
  isActive,
}: {
  cell: string
  isActive: boolean
}) => {
  const setKeyZone = useStore((state) => state.updateKeyZone)
  const selectedZone = useStore((state) => state.selectedZone)
  const zone = useStore((state) => state.zoneByKey[cell])
  const handleClick = () => {
    if (zone !== selectedZone && selectedZone !== null) {
      setKeyZone(cell, selectedZone)
    }
  }
  return (
    <Box
      height={'3rem'}
      width={'3rem'}
      mx={'0.25rem'}
      p={'0rem 0.15rem'}
      borderRadius={'15% 15% 15% 0'}
      border={`1px solid ${isActive ? activeColor : '#ddd'}`}
      boxSizing={'border-box'}
      sx={{ opacity: selectedZone !== null && selectedZone !== zone ? 0.5 : 1 }}
      bgcolor={isActive ? activeColor : 'none'}
      display={'flex'}
      flexDirection={'column-reverse'}
      overflow={'clip'}
      onClick={handleClick}
    >
      {'ABCDEFG'[zone]}
    </Box>
  )
}
