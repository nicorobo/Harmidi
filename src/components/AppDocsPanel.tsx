import { Box, IconButton, List, ListItem, Table, Typography } from '@mui/joy'
import { SidePanel, SidePanelHeader } from './SidePanel'
import { GitHub } from '@mui/icons-material'

export const AppDocsPanel = () => {
  return (
    <SidePanel>
      <SidePanelHeader title="Manual" />
      <Box sx={{ p: '1rem', fontSize: '0.8rem' }}>
        <Typography
          fontSize={'0.8rem'}
          textTransform={'uppercase'}
          textAlign={'center'}
          fontWeight={800}
          sx={{ color: '#666' }}
        >
          Welcome to
        </Typography>
        <Box
          sx={{
            lineHeight: 1.2,
            fontSize: '2.5rem',
            fontWeight: 800,
            textAlign: 'center',
            background:
              '-webkit-linear-gradient(45deg, #FC466B 0%, #3F5EFB 100%)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
          }}
        >
          Harmidi
        </Box>
        <Box mt={'1rem'}>
          Harmidi is an in-browser MIDI controller that turns your computer
          keyboard into a multi-instrument workstation. Built for traveling
          musicians and harmony magicians, it offers a flexible and intuitive
          way to explore musical ideas while on the go or in the studio.
        </Box>
        <Box>
          <Typography mt="1rem" level="h4">
            Zones
          </Typography>
          A Zone is a group of keys that share settings. <b>Create</b> a new
          zone by pressing on the "+" icon in the sidebar. <b>Delete</b> a zone
          by clicking the trash icon in the zone panel. <b>Rename</b> a zone by
          clicking on the name in the zone panel. <br />
          Add keys to a zone by enabling <i>key mapping mode</i> with the switch
          on the bottom of the sidebar. After pressing the keys you would like
          to add, disable <i>key mapping mode.</i>
          <Typography mt="1rem" level="h4">
            Zone Settings
          </Typography>
          <Table
            sx={{
              fontSize: '0.8rem',
              '& thead th:nth-child(1)': { width: '100px' },
            }}
          >
            <thead>
              <tr>
                <th>Setting</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Instrument</td>
                <td>Select a built-in sound for testing</td>
              </tr>
              <tr>
                <td>Channel</td>
                <td>Select the zone's MIDI channel</td>
              </tr>
              <tr>
                <td>Order</td>
                <td>
                  Choose the order of the zone's progression. Default is
                  left-to-right, top-to-bottom.
                </td>
              </tr>
              <tr>
                <td>Hold</td>
                <td>
                  When enabled, keys in this zone will act as switches,
                  remaining held until pressed again.
                </td>
              </tr>
              <tr>
                <td>Velocity</td>
                <td>Choose the zone's note velocity</td>
              </tr>
              <tr>
                <td>Octave</td>
                <td>Increase or decrease the zone's octave</td>
              </tr>
              <tr>
                <td>Transpose</td>
                <td>Transpose the zone's notes up or down</td>
              </tr>
              <tr>
                <td>Mute Zones</td>
                <td>
                  Select zones to mute when a key is pressed. It is suggested a
                  zone mutes itself when playing &gt; 1 voice.
                </td>
              </tr>
              <tr>
                <td>Voices</td>
                <td>
                  Select from a list of chords, or build your own by adding up
                  to 8 voices.
                </td>
              </tr>
              <tr>
                <td>Quantize</td>
                <td>
                  Select from a list of scales, or create your own. Voices will
                  be quantized to the nearest note in the scale.
                </td>
              </tr>
            </tbody>
          </Table>
          <Typography mt="1rem" level="h4">
            Notes
          </Typography>
          <List
            sx={{ lineHeight: 'inherit', fontSize: '0.8rem' }}
            marker="disc"
          >
            <ListItem>
              Harmidi was developed as a MIDI controller; built-in sounds are
              meant for demo purposes and may appear sluggish or behave in
              unexpected ways.
            </ListItem>
            <ListItem>
              Many keyboards have a limit to the amount of simultaneous key
              presses they can detect.
              <br />
              <a
                target="_blank"
                href="https://en.wikipedia.org/wiki/Key_rollover"
                rel="noopener noreferrer"
              >
                Find out more here.
              </a>
            </ListItem>
            <ListItem>
              If you would like to control virtual MIDI devices or DAWs (such as
              Ableton Live, Logic Pro, etc.), you will need to setup a virtual
              MIDI driver. <br />
              <a
                target="_blank"
                href="https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus"
                rel="noopener noreferrer"
              >
                This article explains how.
              </a>
            </ListItem>
          </List>
          <Typography
            fontSize={'0.8rem'}
            textTransform={'uppercase'}
            textAlign={'center'}
            fontWeight={800}
            sx={{ color: '#666' }}
            my={'1rem'}
          >
            Have fun!
          </Typography>
          <GithubButton />
        </Box>
      </Box>
    </SidePanel>
  )
}

const GithubButton = () => (
  <Box display={'flex'} justifyContent={'center'}>
    <a
      href="https://github.com/nicorobo/Harmidi"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconButton aria-label="github">
        <GitHub />
      </IconButton>
    </a>
  </Box>
)
