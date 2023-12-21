import { useStore } from '../store'
import {
  Box,
  Dropdown,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/joy'
import { ZoneSettingsPanel } from './zone-settings/ZoneSettings'
import { getDefaultControlZone, getDefaultNoteZone } from '../zone-settings'
import { KeyMappingSwitch } from './KeyMappingSwitch'
import { Add, MusicNote, Speed } from '@mui/icons-material'

export const ZoneIcon = ({ type }: { type: 'note' | 'control' | 'mutate' }) => {
  if (type === 'note') {
    return <MusicNote fontSize="inherit" />
  } else {
    return <Speed fontSize="inherit" />
  }
}

const AddZoneButton = () => {
  const createZone = useStore.use.createZone()
  return (
    <Dropdown>
      <MenuButton size="sm" variant="plain">
        <Add fontSize="small" />
      </MenuButton>
      <Menu size="sm" placement="right-end">
        <MenuItem onClick={() => createZone(getDefaultNoteZone())}>
          <ZoneIcon type="note" /> Note
        </MenuItem>
        <MenuItem onClick={() => createZone(getDefaultControlZone())}>
          <ZoneIcon type="control" />
          Control
        </MenuItem>
      </Menu>
    </Dropdown>
  )
}

export const SideNav = () => {
  const selectedZone = useStore.use.selectedZone()
  const setSelectedZone = useStore.use.setSelectedZone()
  const zoneIds = useStore.use.zoneIds()
  const zoneById = useStore.use.zoneById()
  const zones = zoneIds.map((id) => zoneById[id])

  const zoneSelected = (id: string) => {
    setSelectedZone(selectedZone === id ? null : id)
  }
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <List size="sm">
        <ListSubheader sx={{ gap: 1 }}>
          Zones <AddZoneButton />
        </ListSubheader>
        {zones.map(({ id, name, zoneType, color }) => (
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
              <Box fontSize={'1rem'}>
                <ZoneIcon type={zoneType} />
              </Box>
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
