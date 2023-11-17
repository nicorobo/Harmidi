import { Typography } from '@mui/joy'

const labelStyle = {
  textTransform: 'uppercase',
  color: '#ae67ff',
  fontWeight: 600,
  fontSize: '0.75rem',
}

export const InputLabel = ({ title }: { title: string }) => (
  <Typography sx={labelStyle}>{title}</Typography>
)
