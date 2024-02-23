import { useStore } from '../store'
import {
  Box,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListSubheader,
  Stack,
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
      variant="outlined"
      sx={{
        '--IconButton-size': '1rem',
        scale: 0.5,
        color: '#555',
      }}
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
      sx={{
        display: 'flex',
        height: '100vh',
        borderRight: selectedZone ? '1px solid #ddd' : '',
      }}
    >
      <Stack sx={{ borderRight: '1px solid #ddd' }}>
        {/* <Logo /> */}
        <List size="sm">
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
          <Divider />
          <ListItem>
            <ListItemButton
              selected={appSettingsIsOpen}
              onClick={settingsSelected}
            >
              Settings
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton selected={appDocsIsOpen} onClick={docsSelected}>
              Manual
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <KeyMappingSwitch />
          </ListItem>
        </List>
      </Stack>
      {selectedZone !== null && (
        <ZoneSettingsPanel zone={zoneById[selectedZone]} />
      )}
      {appSettingsIsOpen && <AppSettingsPanel />}
      {appDocsIsOpen && <AppDocsPanel />}
    </Box>
  )
}

// TODO create logo
// const Logo = () => (
//   <Box
//     sx={{
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//       borderBottom: '1px solid #ddd',
//     }}
//   >
//     Joy
//   </Box>
// )

const Divider = () => <ListDivider sx={{ margin: 0 }} />
