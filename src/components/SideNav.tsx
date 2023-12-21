import { useStore } from '../store'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
} from '@mui/joy'
import { ZoneSettingsPanel } from './zone-settings/ZoneSettings'
import { getDefaultNoteZone } from '../zone-settings'
import { KeyMappingSwitch } from './KeyMappingSwitch'
import { Add } from '@mui/icons-material'

export const SideNav = () => {
  const selectedZone = useStore.use.selectedZone()
  const setSelectedZone = useStore.use.setSelectedZone()
  const createZone = useStore.use.createZone()
  const zoneIds = useStore.use.zoneIds()
  const zoneById = useStore.use.zoneById()
  const zones = zoneIds.map((id) => zoneById[id])

  const zoneSelected = (id: string) => {
    setSelectedZone(selectedZone === id ? null : id)
  }
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <List size="sm">
        <ListSubheader>
          Zones{' '}
          <IconButton onClick={() => createZone(getDefaultNoteZone())}>
            <Add />
          </IconButton>
        </ListSubheader>
        {zones.map(({ id, name }, i) => (
          <ListItem key={id}>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {name}
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <KeyMappingSwitch />
        </ListItem>
      </List>
      {selectedZone !== null && (
        <ZoneSettingsPanel zone={zoneById[selectedZone]} />
      )}
    </Box>
  )
}
