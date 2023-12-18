import { Stack, Switch } from '@mui/joy'
import { ControlZone } from '../../zone-settings'
import { useStore } from '../../store'
import {
  ActiveZoneInput,
  ChannelInput,
  HoldToggleInput,
  MidiCCInput,
} from './SharedSettings'
import { Knob } from '../Knob'

export const ControlSettings = ({ zone }: { zone: ControlZone }) => {
  const updateZoneSettings = useStore((state) => state.updateZone)
  const onUpdate = (update: Partial<ControlZone>) => {
    updateZoneSettings(zone.id, { ...zone, ...update })
  }
  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={4}>
        <ChannelInput
          channel={zone.channel}
          onChange={(channel) => onUpdate({ channel })}
        />
        <MidiCCInput
          value={zone.midiCC}
          onChange={(midiCC) => onUpdate({ midiCC })}
        />
        <HoldToggleInput
          value={zone.hold}
          onChange={(hold) => onUpdate({ hold })}
        />
      </Stack>
      <ActiveZoneInput
        zones={zone.noteZones}
        onChange={(noteZones) => onUpdate({ noteZones })}
      />
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
