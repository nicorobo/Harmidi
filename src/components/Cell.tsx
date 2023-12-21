import { Box } from '@mui/joy'
import { useStore } from '../store'

export const Cell = ({
  cell,
  title,
  isActive,
}: {
  cell: string
  title: string
  isActive: boolean
}) => {
  const selectedZone = useStore.use.selectedZone()
  const zoneId = useStore((state) => state.zoneIdByKey[cell])
  const zoneById = useStore.use.zoneById()
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
