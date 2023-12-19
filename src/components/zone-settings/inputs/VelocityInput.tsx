import { Knob } from '../../Knob'

type Props = {
  velocity: number
  onChange: (value: number) => void
}

export const VelocityInput: React.FC<Props> = ({ velocity, onChange }) => {
  return (
    <Knob
      min={0}
      max={127}
      fullAngle={270}
      title="Velocity"
      value={velocity}
      onChange={onChange}
    />
  )
}
