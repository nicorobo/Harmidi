import { useStore } from '../store'
import { Box, List, ListItem, ListItemButton, ListSubheader } from '@mui/joy'
import { ZoneSettingsPanel } from './zone-settings/ZoneSettings'
import { KeyMappingPanel } from './KeyMappingPanel'
import { isNoteZone, isControlZone, isMutateZone } from '../zone-settings'
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const SideNav = () => {
  const selectedZone = useStore.use.selectedZone()
  const setSelectedZone = useStore.use.setSelectedZone()
  const zones = useStore.use.zones()
  const isKeyMapping = useStore.use.isKeyMapping()
  const setIsKeyMapping = useStore.use.setIsKeyMapping()

  const zoneSelected = (id: string) => {
    setIsKeyMapping(false)
    setSelectedZone(selectedZone === id ? null : id)
  }
  const noteZones = Object.values(zones).filter(isNoteZone)
  const controlZones = Object.values(zones).filter(isControlZone)
  const mutateZones = Object.values(zones).filter(isMutateZone)
  return (
    <Box display="flex">
      <List size="sm">
        <ListSubheader sticky>Notes</ListSubheader>
        {noteZones.map(({ id }, i) => (
          <ListItem>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {alphabet[i]}
            </ListItemButton>
          </ListItem>
        ))}

        <ListSubheader sticky>Control</ListSubheader>
        {controlZones.map(({ id }, i) => (
          <ListItem>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {alphabet[i]}
            </ListItemButton>
          </ListItem>
        ))}

        <ListSubheader sticky>Mutate</ListSubheader>
        {mutateZones.map(({ id }, i) => (
          <ListItem>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {alphabet[i]}
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <ListItemButton onClick={() => setIsKeyMapping(true)}>
            KM
          </ListItemButton>
        </ListItem>
      </List>
      {isKeyMapping && (
        <KeyMappingPanel
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
        />
      )}
      {selectedZone !== null && !isKeyMapping && (
        <ZoneSettingsPanel zone={zones[selectedZone]} />
      )}
    </Box>
  )
}
