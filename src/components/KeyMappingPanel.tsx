import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListSubheader,
  Sheet,
} from '@mui/joy'
import { useStore } from '../store'
import { FormatColorFill } from '@mui/icons-material'

export const KeyMappingPanel = ({
  selectedZone,
  setSelectedZone,
}: {
  selectedZone: number | null
  setSelectedZone: (zone: number | null) => void
}) => {
  const zones = useStore((state) => state.settings)
  const fillKeyZone = useStore((state) => state.fillKeyZone)

  return (
    <Sheet sx={{ width: '350px', p: '1rem' }}>
      <List size="sm">
        <ListSubheader sticky>Note Zones</ListSubheader>
        {zones.map((_, i) => (
          <ListItem
            endAction={
              selectedZone === i && (
                <IconButton onClick={() => fillKeyZone(i)} size="sm">
                  <FormatColorFill />
                </IconButton>
              )
            }
          >
            <ListItemButton
              selected={selectedZone === i}
              onClick={() => setSelectedZone(i)}
            >
              <ListItemContent>Zone {['ABCDEFG'[i]]}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Sheet>
  )
}
