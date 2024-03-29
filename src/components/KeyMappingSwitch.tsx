import { Switch, Tooltip } from '@mui/joy'
import { useStore } from '../store'
import { Keyboard } from '@mui/icons-material'

// A switch to toggle between play mode and key mapping mode.
export const KeyMappingSwitch = () => {
  const selectedZone = useStore.use.selectedZone()
  const isKeyMapping = useStore.use.isKeyMapping()
  const setIsKeyMapping = useStore.use.setIsKeyMapping()
  return (
    <Tooltip title="Key Mapping">
      <Switch
        disabled={selectedZone === null}
        checked={isKeyMapping}
        onChange={() => setIsKeyMapping(!isKeyMapping)}
        startDecorator={<Keyboard />}
      />
    </Tooltip>
  )
}
