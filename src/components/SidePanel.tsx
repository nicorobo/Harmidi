import { ReactNode } from 'react'
import { Box, Sheet } from '@mui/joy'

type SidePanelProps = {
  children: ReactNode
}

export const SidePanel = ({ children }: SidePanelProps) => (
  <Sheet sx={{ width: '350px', overflowY: 'auto' }}>{children}</Sheet>
)
export const SidePanelHeader = ({ title }: { title: string }) => (
  <Box
    sx={{
      p: '0.5rem 1rem',
      background: '#eee',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <Box sx={{ fontWeight: 'bold' }}>{title}</Box>
  </Box>
)
