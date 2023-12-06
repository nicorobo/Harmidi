import { Stack } from '@mui/joy'
import { ControlZone } from '../../zone-settings'
import { useStore } from '../../store'
import {
  ChannelInput,
  HoldToggleInput,
  MidiValueInput,
  TimeInput,
} from './SharedSettings'

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
        <HoldToggleInput
          value={zone.hold}
          onChange={(hold) => onUpdate({ hold })}
        />
      </Stack>
      <TimeInput
        title="Attack"
        value={zone.upTime}
        onChange={(ms) => onUpdate({ upTime: ms })}
      />
      <TimeInput
        title="Decay"
        value={zone.downTime}
        onChange={(ms) => onUpdate({ downTime: ms })}
      />
      <MidiValueInput
        title="Start Value"
        value={zone.startValue} // initialValue and targetValue
        onChange={(value) => onUpdate({ startValue: value })}
      />
      <MidiValueInput
        title="End Value"
        value={zone.endValue}
        onChange={(value) => onUpdate({ endValue: value })}
      />
    </Stack>
  )
}
