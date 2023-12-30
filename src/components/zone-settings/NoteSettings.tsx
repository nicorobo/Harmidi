import { Stack } from '@mui/joy'
import { NoteZone } from '../../zone-settings'
import { useStore } from '../../store'
import {
  HoldToggleInput,
  MidiChannelInput,
  MuteZoneInput,
  OctaveInput,
  OrderInput,
  ScaleInput,
  TranslateInput,
  VelocityInput,
  VoicesInput,
} from './inputs'

type Props = { zone: NoteZone }

export const NoteSettings: React.FC<Props> = ({ zone }) => {
  const updateZoneSettings = useStore((state) => state.updateZone)
  const onUpdate = (update: Partial<NoteZone>) => {
    updateZoneSettings(zone.id, { ...zone, ...update })
  }
  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={4}>
          <MidiChannelInput
            channel={zone.channel}
            onChange={(channel) => onUpdate({ channel })}
          />
          <OrderInput
            order={zone.order}
            onChange={(orientation) => onUpdate({ order: orientation })}
          />
          <HoldToggleInput
            hold={zone.hold}
            onChange={(hold) => onUpdate({ hold })}
          />
        </Stack>
        <Stack direction="row" spacing={4}>
          <VelocityInput
            velocity={zone.velocity}
            onChange={(velocity) => onUpdate({ velocity })}
          />
          <OctaveInput
            octave={zone.octave}
            onChange={(octave) => onUpdate({ octave })}
          />
          <TranslateInput
            translate={zone.translate}
            onChange={(translate) => onUpdate({ translate })}
          />
        </Stack>
        <MuteZoneInput
          muteZones={zone.muteZones}
          selfId={zone.id}
          onChange={(muteZones) => onUpdate({ muteZones })}
        />
      </Stack>
      <VoicesInput
        voices={zone.voices}
        onChange={(voices) => onUpdate({ voices })}
        trackColor={'#0a6bcb'}
      />
      <Stack direction="row" spacing={2} justifyContent={'space-between'}>
        <ScaleInput
          root={zone.root}
          scale={zone.scale}
          color={'#0a6bcb'}
          onChange={(root, scale) => onUpdate({ root, scale })}
        />
      </Stack>
    </Stack>
  )
}
