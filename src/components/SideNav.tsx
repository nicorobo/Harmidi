import { useStore } from '../store'
import {
  Box,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListSubheader,
} from '@mui/joy'
import { ZoneSettingsPanel } from './zone-settings/ZoneSettings'
import { getDefaultNoteZone } from '../zone-settings'
import { KeyMappingSwitch } from './KeyMappingSwitch'
import { Add } from '@mui/icons-material'
import { AppSettingsPanel } from './AppSettingsPanel'
import { AppDocsPanel } from './AppDocsPanel'

const AddZoneButton = () => {
  const createZone = useStore.use.createZone()
  const zoneIds = useStore.use.zoneIds()
  return (
    <IconButton
      size="sm"
      variant="plain"
      sx={{ paddingInline: 'inherit' }}
      onClick={() =>
        createZone(getDefaultNoteZone({ name: `Zone ${zoneIds.length + 1}` }))
      }
    >
      <Add />
    </IconButton>
  )
}

export const SideNav = () => {
  const selectedZone = useStore.use.selectedZone()
  const setSelectedZone = useStore.use.setSelectedZone()
  const appSettingsIsOpen = useStore.use.appSettingsIsOpen()
  const appDocsIsOpen = useStore.use.appDocsIsOpen()
  const setAppSettingsIsOpen = useStore.use.setAppSettingsIsOpen()
  const setAppDocsIsOpen = useStore.use.setAppDocsIsOpen()
  const zoneIds = useStore.use.zoneIds()
  const zoneById = useStore.use.zoneById()
  const zones = zoneIds.map((id) => zoneById[id])

  const zoneSelected = (id: string | null) => {
    setSelectedZone(selectedZone === id ? null : id)
  }
  const settingsSelected = () => {
    setAppSettingsIsOpen(true)
  }
  const docsSelected = () => {
    setAppDocsIsOpen(true)
  }
  return (
    <Box
      sx={{ display: 'flex', height: '100vh', borderRight: '1px solid #ddd' }}
    >
      <List size="sm" sx={{ borderRight: '1px solid #ddd' }}>
        <ListSubheader sx={{ gap: 1 }}>
          Zones <AddZoneButton />
        </ListSubheader>
        {zones.map(({ id, name, color }) => (
          <ListItem
            key={id}
            sx={{
              boxSizing: 'border-box',
              borderLeft: '12px solid',
              borderColor: color,
            }}
          >
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => zoneSelected(id)}
            >
              {name}
            </ListItemButton>
          </ListItem>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <ListDivider />
        <ListItem>
          <ListItemButton onClick={settingsSelected}>Settings</ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem>
          <ListItemButton onClick={docsSelected}>Docs</ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem>
          <KeyMappingSwitch />
        </ListItem>
      </List>
      {selectedZone !== null && (
        <ZoneSettingsPanel zone={zoneById[selectedZone]} />
      )}
      {appSettingsIsOpen && <AppSettingsPanel />}
      {appDocsIsOpen && <AppDocsPanel />}
    </Box>
  )
}
