import { useMIDIOutput } from '@react-midi/hooks'
import { KeyActions } from './use-actions-by-key'
import { getNotes } from './note-getters'
import { Zone } from './zone-settings'

export const useActions = () => {
  const { noteOn, noteOff } = useMIDIOutput()

  const actions: KeyActions = {}
  const factory = (keys: string[], zone: Zone) => {
    if (!noteOn || !noteOff) {
      return actions
    }
    const noteFactory = getNotes(zone)
    const noteSettings = {
      velocity: zone.velocity,
      channel: zone.channel,
    }
    for (let i = 0; i < keys.length; i++) {
      const notes = noteFactory(i)
      actions[keys[i]] = {
        on: () => {
          noteOn(notes, noteSettings)
        },
        off: () => {
          noteOff(notes, noteSettings)
        },
        notes,
      }
    }

    return actions
  }
  return factory
}
