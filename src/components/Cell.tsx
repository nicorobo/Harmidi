import { Box, Typography } from '@mui/material'

const activeColor = '#d9d8ff'
export const Cell = ({
  name,
  isActive,
}: {
  name: string
  isActive: boolean
}) => {
  return (
    <Box
      height={'3rem'}
      width={'3rem'}
      mx={'0.25rem'}
      p={'0rem 0.15rem'}
      borderRadius={'15% 15% 15% 0'}
      border={`1px solid ${isActive ? activeColor : '#ddd'}`}
      boxSizing={'border-box'}
      bgcolor={isActive ? activeColor : 'none'}
      display={'flex'}
      flexDirection={'column-reverse'}
      overflow={'clip'}
    >
      <Typography sx={{ fontSize: '0.6rem', color: '#777' }}>{name}</Typography>
    </Box>
  )
}
