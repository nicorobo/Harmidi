import { useMIDIOutput } from '@react-midi/hooks'
import { KeyActions } from './use-actions-by-key'
import { getNotes } from './note-getters'
import { Zone } from './zone-settings'
import { useStore } from './store'

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
        actions[keys[i]] = {
          on: () => {
            console.log('Note on', noteInfo.midiNotes)
          },
          off: () => {
            console.log('Note off', noteInfo.midiNotes)
          },
          noteInfo,
        }
      }
      return actions
    }
  }
}
