import { Stack } from '@mui/joy'
import { ControlZone } from '../../zone-settings'
import { useStore } from '../../store'

export const ControlSettings = ({ zone }: { zone: ControlZone }) => {
  const updateZoneSettings = useStore((state) => state.updateZone)
  const onUpdate = (update: Partial<ControlZone>) => {
    updateZoneSettings(zone.id, { ...zone, ...update })
  }
  return <Stack spacing={4}>Control Settings</Stack>
}
