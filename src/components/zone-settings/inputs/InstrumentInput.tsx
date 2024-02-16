import { Option, Select, Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { ZoneInstrument, availableInstruments } from '../../../zone-instruments'
import React from 'react'

type Props = {
  instrument: ZoneInstrument
  onChange: (instrument: ZoneInstrument) => void
}

export const InstrumentInput: React.FC<Props> = ({ instrument, onChange }) => {
  const handleChange = (value: string | null) => {
    const instrumentSelected = availableInstruments.find(
      (inst) => inst.id === value
    )
    if (instrumentSelected && instrumentSelected.id !== instrument.id) {
      onChange({
        id: instrumentSelected.id,
        instrument: instrumentSelected.factory(),
      })
    }
  }
  return (
    <Stack>
      <InputLabel title="Instrument" />
      <Select
        size="sm"
        value={instrument.id}
        onChange={(_, value) => handleChange(value)}
      >
        {availableInstruments.map((inst) => (
          <Option key={inst.id} value={inst.id}>
            {inst.name}
          </Option>
        ))}
      </Select>
    </Stack>
  )
}
