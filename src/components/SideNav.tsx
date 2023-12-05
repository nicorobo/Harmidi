import { useStore } from '../store'
import { Box, List, ListItem, ListItemButton, ListSubheader } from '@mui/joy'
import { ZoneSettingsPanel } from './zone-settings/ZoneSettings'
import { KeyMappingPanel } from './KeyMappingPanel'
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const SideNav = () => {
  const selectedZone = useStore((state) => state.selectedZone)
  const setSelectedZone = useStore((state) => state.setSelectedZone)
  const zones = useStore((state) => state.settings)
  const isKeyMapping = useStore((state) => state.isKeyMapping)
  const setIsKeyMapping = useStore.use.setIsKeyMapping()

  const zoneSelected = (i: number) => {
    setIsKeyMapping(false)
    setSelectedZone(selectedZone === i ? null : i)
  }
  return (
    <Box display="flex">
      <List size="sm">
        <ListSubheader sticky>Notes</ListSubheader>
        {zones.map((_, i) => (
          <ListItem>
            <ListItemButton
              selected={selectedZone === i}
              onClick={() => zoneSelected(i)}
            >
              {alphabet[i]}
            </ListItemButton>
          </ListItem>
        ))}

        <ListSubheader sticky>Operators</ListSubheader>
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
        <ZoneSettingsPanel
          zoneIndex={selectedZone}
          settings={zones[selectedZone]}
        />
      )}
    </Box>
  )
}
