import { Box, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy'
import { Zone } from '../../zone-settings'
import { MoreVert } from '@mui/icons-material'
import { useStore } from '../../store'
import Compact from '@uiw/react-color-compact'

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
      <MenuButton size="sm" variant="plain">
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
const ColorButton = ({
  color,
  onChange,
}: {
  color: string
  onChange: (color: string) => void
}) => {
  return (
    <Dropdown>
      <MenuButton size="sm" sx={{ bgcolor: color }} />
      <Menu>
        <Compact
          color={color}
          style={{
            boxShadow:
              'rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px',
          }}
          onChange={(color) => {
            onChange(color.hex)
          }}
        />
      </Menu>
    </Dropdown>
  )
}

export const ZoneSettingsHeader = ({ zone }: { zone: Zone }) => {
  const updateZone = useStore.use.updateZone()
  const onColorChange = (color: string) => {
    updateZone(zone.id, { ...zone, color })
  }
  return (
    <Box
      sx={{
        p: '0.5rem 1rem',
        background: '#eee',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <ColorButton color={zone.color} onChange={onColorChange} />
      Zone {zone.id.substring(0, 5)}
      <ContextMenu id={zone.id} />
    </Box>
  )
}
