import { useMIDIOutput } from '@react-midi/hooks'
import { KeyActions } from './use-actions-by-key'
import { getNotes } from './note-getters'
import { Zone } from './zone-settings'
import { useStore } from './store'
import * as Tone from 'tone'
export const useActions = () => {
  const isUsingMidi = useStore.use.isUsingMidi()
  const { noteOn, noteOff } = useMIDIOutput()

  if (isUsingMidi) {
    return (keys: string[], zone: Zone) => {
      const actions: KeyActions = {}
      if (!noteOn || !noteOff) {
        return actions
      }
      const noteFactory = getNotes(zone)
      const noteSettings = {
        velocity: zone.velocity,
        channel: zone.channel,
      }
      for (let i = 0; i < keys.length; i++) {
        const noteInfo = noteFactory(i)
        actions[keys[i]] = {
          on: () => {
            noteOn(noteInfo.midiNotes, noteSettings)
          },
          off: () => {
            noteOff(noteInfo.midiNotes, noteSettings)
          },
          noteInfo,
        }
      }
      return actions
    }
  } else {
    return (keys: string[], zone: Zone) => {
      const actions: KeyActions = {}
      const noteFactory = getNotes(zone)
      for (let i = 0; i < keys.length; i++) {
        const noteInfo = noteFactory(i)
        const frequencies = noteInfo.midiNotes.map((midiNote) =>
          Tone.Midi(midiNote).toFrequency()
        )
        actions[keys[i]] = {
          on: () => {
            zone.instrument.instrument.triggerAttack(
              frequencies,
              Tone.context.currentTime,
              zone.velocity / 127
            )
          },
          off: () => {
            zone.instrument.instrument.triggerRelease(
              frequencies,
              Tone.context.currentTime
            )
          },
          noteInfo,
        }
      }
      return actions
    }
  }
}
