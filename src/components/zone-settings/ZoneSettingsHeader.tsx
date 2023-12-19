import { Box, Dropdown, Menu, MenuButton, MenuItem, Typography } from '@mui/joy'
import { Zone } from '../../zone-settings'
import { MoreVert } from '@mui/icons-material'
import { useStore } from '../../store'
import { ColorPicker } from './ColorPicker'
import React from 'react'

/* 
A header for the zone settings panel.
Display a color picker, the zone name, and a context menu button.
The context menu button will open a menu with options to:
  - Rename the zone
  - Duplicate the zone
  - Delete the zone 
*/

type Props = { zone: Zone }

export const ZoneSettingsHeader: React.FC<Props> = ({ zone }) => {
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
      <ColorPicker color={zone.color} onChange={onColorChange} />
      <Typography>Zone {zone.id.substring(0, 5)}</Typography>
      <ContextMenu id={zone.id} />
    </Box>
  )
}

/*
ContextMenu will display a MUI Icon Button with a MUI menu that will open when clicked.
The menu has options for renaming, duplicating, and deleting the zone.
*/

type ContextMenuProps = { id: string }

const ContextMenu: React.FC<ContextMenuProps> = ({ id }) => {
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
