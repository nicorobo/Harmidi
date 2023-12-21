import { Box } from '@mui/joy'

type Props = {
  root?: number
  notes?: number[]
  color: string
  onClick?: (note: number) => void
}

const whiteKeys = [0, 2, 4, 5, 7, 9, 11]
const blackKeys = [1, 3, 6, 8, 10]

const WHITE_KEY_WIDTH = 25
const BLACK_KEY_WIDTH = WHITE_KEY_WIDTH * 0.75

const defaultNotes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const BORDER_THICKNESS = 1
const BORDER_RADIUS = 5
export const PianoInput: React.FC<Props> = ({
  root,
  color,
  notes = defaultNotes,
  onClick,
}) => {
  return (
    <Box position={'relative'}>
      <Box display="flex">
        {whiteKeys.map((key) => (
          <Box
            key={key}
            onClick={() => onClick && onClick(key)}
            sx={{
              height: 60,
              width: WHITE_KEY_WIDTH,
              cursor: onClick ? 'pointer' : 'default',
              boxSizing: 'border-box',
              border: `${BORDER_THICKNESS}px solid ${color}`,
              borderLeftWidth: 0,
              bgcolor: '#fff',
              ':hover': {
                bgcolor: onClick ? '#eee' : 'default',
              },
              ':first-child': {
                borderLeftWidth: BORDER_THICKNESS,
                borderRadius: `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`,
              },
              ':last-child': {
                borderRadius: `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`,
              },
            }}
          >
            {notes[key] > 0 && (
              <Box
                sx={{
                  height: 8,
                  width: 8,
                  background: color,
                  position: 'relative',
                  borderRadius: '5px',
                  top: '70%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              ></Box>
            )}
          </Box>
        ))}
      </Box>
      <Box display="flex" position={'absolute'} top={0}>
        {blackKeys.map((key, i) => (
          <Box
            key={key}
            onClick={() => onClick && onClick(key)}
            sx={{
              height: 35,
              width: BLACK_KEY_WIDTH,
              cursor: onClick ? 'pointer' : 'default',
              position: 'absolute',
              left: `${
                (i > 1 ? i + 1 : i) * WHITE_KEY_WIDTH +
                WHITE_KEY_WIDTH -
                BLACK_KEY_WIDTH / 2
              }px`,
              borderRadius: `0 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px`,
              boxSizing: 'border-box',
              border: `${BORDER_THICKNESS}px solid ${color}`,
              bgcolor: color,
              ':hover': {
                bgcolor: onClick ? '#eee' : 'default',
              },
            }}
          >
            {notes[key] > 0 && (
              <Box
                sx={{
                  height: 8,
                  width: 8,
                  background: '#fff',
                  position: 'relative',
                  borderRadius: '5px',
                  top: '70%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              ></Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
