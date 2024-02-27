import React, { useEffect } from 'react'
import { Box, IconButton, Input, Stack, Tooltip } from '@mui/joy'
import { Zone } from '../../zone-settings'
import { Check, Delete } from '@mui/icons-material'
import { useStore } from '../../store'
import { ColorPicker } from './ColorPicker'

type Props = { zone: Zone }

export const ZoneSettingsHeader: React.FC<Props> = ({ zone }) => {
  const deleteZone = useStore.use.deleteZone()
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
      <Tooltip title="Delete zone">
        <IconButton size="sm" onClick={() => deleteZone(zone.id)}>
          <Delete />
        </IconButton>
      </Tooltip>
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
