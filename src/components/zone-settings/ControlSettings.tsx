import { Stack, Switch } from '@mui/joy'
import { ControlZone } from '../../zone-settings'
import { useStore } from '../../store'
import { Knob } from '../Knob'
import { InputLabel } from './inputs/InputLabel'
import {
  HoldToggleInput,
  MidiCCInput,
  MidiChannelInput,
  NoteZoneGridInput,
} from './inputs'
import React from 'react'

type Props = { zone: ControlZone }

export const ControlSettings: React.FC<Props> = ({ zone }) => {
  const updateZoneSettings = useStore((state) => state.updateZone)
  const onUpdate = (update: Partial<ControlZone>) => {
    updateZoneSettings(zone.id, { ...zone, ...update })
  }
  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={4}>
        <MidiChannelInput
          channel={zone.channel}
          onChange={(channel) => onUpdate({ channel })}
        />
        <MidiCCInput
          midiCC={zone.midiCC}
          onChange={(midiCC) => onUpdate({ midiCC })}
        />
        <HoldToggleInput
          hold={zone.hold}
          onChange={(hold) => onUpdate({ hold })}
        />
      </Stack>
      <Stack>
        <InputLabel title="Note Zones" />
        <NoteZoneGridInput
          zoneIds={zone.noteZones}
          onChange={(noteZones) => onUpdate({ noteZones })}
        />
      </Stack>
      <Stack direction="row" spacing={4}>
        <Switch
          size="sm"
          startDecorator="Trigger on Note"
          checked={zone.triggerOnNote}
          onChange={(e) => onUpdate({ triggerOnNote: e.target.checked })}
        />
        <Switch
          size="sm"
          startDecorator="Legato"
          checked={zone.legato}
          onChange={(e) => onUpdate({ legato: e.target.checked })}
        />
      </Stack>
      <Stack direction="row" spacing={4}>
        <Knob
          title="Attack"
          value={zone.attack}
          min={0}
          max={3000}
          onChange={(attack) => onUpdate({ attack })}
        />

        <Knob
          title="Release"
          value={zone.release}
          min={0}
          max={3000}
          onChange={(release) => onUpdate({ release })}
        />
        <Knob
          title="Initial Value"
          value={zone.initialValue}
          min={0}
          max={127}
          onChange={(initialValue) => onUpdate({ initialValue })}
        />
        <Knob
          title="Target Value"
          value={zone.targetValue}
          min={0}
          max={127}
          onChange={(targetValue) => onUpdate({ targetValue })}
        />
      </Stack>
    </Stack>
  )
}