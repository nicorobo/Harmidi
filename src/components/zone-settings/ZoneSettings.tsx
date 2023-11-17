import { useStore } from '../../store'
import {
  Slider,
  Select,
  MenuItem,
  ToggleButtonGroup,
  Stack,
  Typography,
  Box,
  IconButton,
  ButtonGroup,
  Button,
  Switch,
  Sheet,
} from '@mui/joy'
import { useRef } from 'react'

import { ChordType } from 'tonal'
import { availableScales } from '../../constants'
import { ScaleType } from '../../types/scale'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  ChordFamilyZoneSettings,
  ChordZoneSettings,
  NoteZoneSettings,
  ZoneSettings as ZoneSettingsType,
} from '../../zone-settings'
import { ZoneSettingsHeader } from './ZoneSettingsHeader'
import { ChordSettings } from './ChordSettings'
import { ChordFamilySettings } from './ChordFamilySettings'
import { NoteSettings } from './NoteSettings'

const channels = new Array(16).fill(0).map((_, i) => i)
const rootNotes = [
  'Ab',
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
]

const chordTypes = ChordType.all().map(({ name, aliases }) => ({
  name,
  value: aliases[0],
}))

const ZoneSettings = ({
  zoneIndex,
  settings,
}: {
  zoneIndex: number
  settings: ZoneSettingsType
}) => {
  const updateZoneSettings = useStore((state) => state.updateZoneSettings)
  // const updateRowType = useStore((state) => state.updateZoneType)
  const onUpdate = (update: Partial<ZoneSettingsType>) => {
    updateZoneSettings(zoneIndex, { ...settings, ...update })
  }
  const zoneType = settings.type
  if (zoneType === 'chord') {
    return <ChordSettings zoneIndex={zoneIndex} settings={settings} />
  } else if (zoneType === 'chord-family') {
    return <ChordFamilySettings zoneIndex={zoneIndex} settings={settings} />
  } else {
    return <NoteSettings zoneIndex={zoneIndex} settings={settings} />
  }
}

export const ZoneSettingsPanel = ({
  zoneIndex,
  settings,
}: {
  zoneIndex: number
  settings: ZoneSettingsType
}) => {
  return (
    <Sheet>
      <ZoneSettingsHeader zoneIndex={zoneIndex} />
      <Box sx={{ p: '1rem' }}>
        <ZoneSettings zoneIndex={zoneIndex} settings={settings} />
      </Box>
    </Sheet>
  )
}
