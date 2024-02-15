import { useMIDIOutput } from '@react-midi/hooks'
import { KeyActions } from './use-actions-by-key'
import { getNotes } from './note-getters'
import { Zone } from './zone-settings'

export const useActions = () => {
  const { noteOn, noteOff } = useMIDIOutput()

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
}
