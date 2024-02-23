import { Box } from '@mui/joy'
import { Zone } from '../../zone-settings'
import { ZoneSettingsHeader } from './ZoneSettingsHeader'
import { NoteSettings } from './NoteSettings'
import { SidePanel } from '../SidePanel'

type Props = { zone: Zone }

export const ZoneSettingsPanel: React.FC<Props> = ({ zone }) => {
  return (
    <SidePanel>
      <ZoneSettingsHeader zone={zone} />
      <Box sx={{ p: '1rem' }}>
        <NoteSettings zone={zone} />
      </Box>
    </SidePanel>
  )
}
