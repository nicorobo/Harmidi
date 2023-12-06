import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListSubheader,
  Sheet,
} from '@mui/joy'
import { useStore } from '../store'

export const KeyMappingPanel = ({
  selectedZone,
  setSelectedZone,
}: {
  selectedZone: string | null
  setSelectedZone: (zone: string | null) => void
}) => {
  const zones = useStore((state) => state.zones)

  return (
    <Sheet sx={{ width: '350px', p: '1rem' }}>
      <List size="sm">
        <ListSubheader sticky>Note Zones</ListSubheader>
        {Object.keys(zones).map((id, i) => (
          <ListItem>
            <ListItemButton
              selected={selectedZone === id}
              onClick={() => setSelectedZone(id)}
            >
              <ListItemContent>Zone {['ABCDEFG'[i]]}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Sheet>
  )
}
