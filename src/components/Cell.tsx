import { Box } from '@mui/material'

export const Cell = ({ isActive }: { isActive: boolean }) => {
  return (
    <Box
      height={'3rem'}
      width={'3rem'}
      mx={'0.25rem'}
      borderRadius={'15%'}
      border={'1px solid #ddd'}
      boxSizing={'border-box'}
      bgcolor={isActive ? '#ddd' : 'none'}
    />
  )
}
