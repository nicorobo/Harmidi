import {
  Box,
  Dropdown,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
} from '@mui/joy'
import { Zone } from '../../zone-settings'
import { Check, Delete, MoreVert } from '@mui/icons-material'
import { useStore } from '../../store'
import { ColorPicker } from './ColorPicker'
import React, { useEffect } from 'react'

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
  const onNameChange = (name: string) => {
    updateZone(zone.id, { ...zone, name })
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
      <Stack direction={'row'} gap={'1rem'} alignItems={'center'}>
        <ColorPicker color={zone.color} onChange={onColorChange} />
        <EditableText text={zone.name} onChange={onNameChange} />
      </Stack>
      <ContextMenu id={zone.id} />
    </Box>
  )
}

const EditableText: React.FC<{
  text: string
  onChange: (text: string) => void
}> = ({ text, onChange }) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [value, setValue] = React.useState(text)
  const onComplete = () => {
    setIsEditing(false)
    onChange(value.trim())
  }
  // Resets the component's state if we change zones while editing.
  // Caveat: this only works if the zones have different names.
  useEffect(() => {
    setIsEditing(false)
    setValue(text)
  }, [text])

  return isEditing ? (
    <Input
      size="sm"
      value={value}
      autoFocus
      onBlur={onComplete}
      onKeyDown={(e) => {
        e.key === 'Enter' && onComplete()
      }}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      endDecorator={
        <IconButton onClick={onComplete}>
          <Check />
        </IconButton>
      }
    />
  ) : (
    <Box
      sx={{ fontWeight: 'bold', cursor: 'pointer' }}
      onClick={() => setIsEditing(true)}
    >
      {text}{' '}
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
      <MenuButton size="sm" variant="plain" sx={{ paddingInline: '0.5rem' }}>
        <MoreVert />
      </MenuButton>
      <Menu placement="right-end">
        <MenuItem onClick={() => deleteZone(id)}>
          <Delete color="error" /> Delete
        </MenuItem>
      </Menu>
    </Dropdown>
  )
}
