import { Box } from '@mui/joy'

type Props = {
  root?: number
  notes?: number[]
  onClick?: (note: number) => void
}

const whiteKeys = [0, 2, 4, 5, 7, 9, 11]
const blackKeys = [1, 3, 6, 8, 10]

const WHITE_KEY_WIDTH = 30
const BLACK_KEY_WIDTH = WHITE_KEY_WIDTH * 0.75

const defaultNotes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
export const PianoInput: React.FC<Props> = ({
  root,
  notes = defaultNotes,
  onClick,
}) => {
  const getColor = (key: number) => {
    if (key === root) return '#f00'
    if (notes[key] > 0) return '#ddd'
    return '#fff'
  }

  return (
    <Box position={'relative'}>
      <Box display="flex">
        {whiteKeys.map((key) => (
          <Box
            key={key}
            onClick={() => onClick && onClick(key)}
            sx={{
              height: 50,
              width: WHITE_KEY_WIDTH,
              cursor: onClick ? 'pointer' : 'default',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              bgcolor: getColor(key),
              ':hover': {
                bgcolor: onClick ? '#eee' : 'default',
              },
            }}
          />
        ))}
      </Box>
      <Box display="flex" position={'absolute'} top={0}>
        {blackKeys.map((key, i) => (
          <Box
            key={key}
            onClick={() => onClick && onClick(key)}
            sx={{
              height: 30,
              width: BLACK_KEY_WIDTH,
              cursor: onClick ? 'pointer' : 'default',
              position: 'absolute',
              left: `${
                (i > 1 ? i + 1 : i) * WHITE_KEY_WIDTH +
                WHITE_KEY_WIDTH -
                BLACK_KEY_WIDTH / 2
              }px`,
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              bgcolor: getColor(key),
              ':hover': {
                bgcolor: onClick ? '#eee' : 'default',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
