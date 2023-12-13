import { Box, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy'
import { Zone } from '../../zone-settings'
import { MoreVert } from '@mui/icons-material'
import { useStore } from '../../store'

/* 
A header for the zone settings panel.
Display the zone name, along with a context menu button.
The context menu button will open a menu with options to:
- Rename the zone
- Duplicate the zone
- Delete the zone 
*/

// ContextMenu will display a MUI Icon Button with a MUI menu that will open when clicked.
// The menu has options for renaming, duplicating, and deleting the zone.
const ContextMenu = ({ id }: { id: string }) => {
  const deleteZone = useStore.use.deleteZone()
  return (
    <Dropdown>
      <MenuButton size="sm">
        <MoreVert />
      </MenuButton>
      <Menu>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem onClick={() => deleteZone(id)}>Delete</MenuItem>
      </Menu>
    </Dropdown>
  )
}

export const ZoneSettingsHeader = ({ zone }: { zone: Zone }) => {
  return (
    <Box
      sx={{
        p: '0.5rem 1rem',
        background: '#d9d8ff',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      Zone {zone.id.substring(0, 5)}
      <ContextMenu id={zone.id} />
    </Box>
  )
}
