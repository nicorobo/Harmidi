import { useMIDIOutput } from '@react-midi/hooks'
import { KeyActions } from './use-actions-by-key'
import { getChords, getFamilyChords, getNotes } from './note-getters'
import { ZoneSettings } from './zone-settings'

export const getNoteFactory = (zoneSettings: ZoneSettings) => {
  if (zoneSettings.type === 'chord') {
    return getChords(zoneSettings)
  } else if (zoneSettings.type === 'chord-family') {
    return getFamilyChords(zoneSettings)
  } else {
    return getNotes(zoneSettings)
  }
}

export const useNoteActions = () => {
  const { noteOn, noteOff } = useMIDIOutput()

  const factory = (letters: string[], zoneSettings: ZoneSettings) => {
    const actions: KeyActions = {}
    if (!noteOn || !noteOff) {
      return actions
    }
    const noteFactory = getNoteFactory(zoneSettings)
    const noteSettings = {
      velocity: zoneSettings.velocity,
      channel: zoneSettings.channel,
    }
    for (let i = 0; i < letters.length; i++) {
      const notes = noteFactory(i)
      actions[letters[i]] = {
        on: () => {
          console.log(performance.measure('on', 'keydown'))
          noteOn(notes, noteSettings)
        },
        off: () => {
          // console.log(performance.measure('off', 'keyup'))
          noteOff(notes, noteSettings)
        },
      }
    }
    return actions
  }

  return factory
}
