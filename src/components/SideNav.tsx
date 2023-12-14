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
import {
  isNoteZone,
  isControlZone,
  getDefaultNoteZone,
  getDefaultControlZone,
} from '../zone-settings'
import { KeyMappingSwitch } from './KeyMappingSwitch'
import { Add } from '@mui/icons-material'
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const SideNav = () => {
  const selectedZone = useStore.use.selectedZone()
  const setSelectedZone = useStore.use.setSelectedZone()
  const createZone = useStore.use.createZone()
  const zones = useStore.use.zones()

  const zoneSelected = (id: string) => {
    setSelectedZone(selectedZone === id ? null : id)
  }

  const noteZones = Object.values(zones).filter(isNoteZone)
  const controlZones = Object.values(zones).filter(isControlZone)
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <List size="sm">
        <ListSubheader sticky>
          Notes{' '}
          <IconButton onClick={() => createZone(getDefaultNoteZone())}>
            <Add />
          </IconButton>
        </ListSubheader>
        {noteZones.map(({ id }, i) => (
          <ListItem key={id}>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {alphabet[i]}
            </ListItemButton>
          </ListItem>
        ))}

        <ListSubheader sticky>
          Control
          <IconButton onClick={() => createZone(getDefaultControlZone())}>
            <Add />
          </IconButton>
        </ListSubheader>
        {controlZones.map(({ id }, i) => (
          <ListItem key={id}>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {alphabet[i]}
            </ListItemButton>
          </ListItem>
        ))}

        {/* <ListSubheader sticky>
          Mutate
          <IconButton onClick={() => createZone(getDefaultMutateZone())}>
            <Add />
          </IconButton>
        </ListSubheader>
        {mutateZones.map(({ id }, i) => (
          <ListItem key={id}>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {alphabet[i]}
            </ListItemButton>
          </ListItem>
        ))} */}
        <ListItem>
          <KeyMappingSwitch />
        </ListItem>
      </List>
      {selectedZone !== null && (
        <ZoneSettingsPanel zone={zones[selectedZone]} />
      )}
    </Box>
  )
}
