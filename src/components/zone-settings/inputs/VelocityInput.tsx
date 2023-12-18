import { Knob } from '../../Knob'

export const VelocityInput = ({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) => {
  return (
    <Knob
      value={value}
      onChange={onChange}
      title="Velocity"
      min={0}
      max={127}
      fullAngle={270}
    />
  )
}
