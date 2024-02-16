import {
  Box,
  DialogContent,
  DialogTitle,
  FormControl,
  Sheet,
  Switch,
} from '@mui/joy'
import { InputLabel } from './zone-settings/inputs/InputLabel'

export const AppDocsPanel = () => {
  return (
    <Sheet sx={{ width: '350px', overflowY: 'auto' }}>
      <Box
        sx={{
          p: '0.5rem 1rem',
          background: '#eee',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ fontWeight: 'bold' }}>Docs</Box>
      </Box>
      <Box sx={{ p: '1rem' }}></Box>
    </Sheet>
  )
}
