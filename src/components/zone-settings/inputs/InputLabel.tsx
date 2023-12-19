import { Typography } from '@mui/joy'

type Props = { title: string }

export const InputLabel: React.FC<Props> = ({ title }) => (
  <Typography
    sx={{
      textTransform: 'uppercase',
      color: '#333',
      fontWeight: 600,
      fontSize: '0.75rem',
    }}
  >
    {title}
  </Typography>
)
