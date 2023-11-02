import { useMIDIOutput } from '@react-midi/hooks'
import { AllRowSettings } from './store'
import { KeyActions } from './use-actions-by-key'
import { getFamilyChords, getScaleChords, getScaleNotes } from './note-getters'

export const getNoteFactory = (rowSettings: AllRowSettings) => {
  if (rowSettings.type === 'family-chord') {
    return getFamilyChords(rowSettings)
  } else if (rowSettings.type === 'scale-chord') {
    return getScaleChords(rowSettings)
  } else {
    return getScaleNotes(rowSettings)
  }
}

export const useNoteActions = () => {
  const { noteOn, noteOff } = useMIDIOutput()

  const factory = (letters: string[], rowSettings: AllRowSettings) => {
    const actions: KeyActions = {}
    if (!noteOn || !noteOff) {
      return actions
    }
    const noteFactory = getNoteFactory(rowSettings)
    const noteSettings = {
      velocity: rowSettings.velocity,
      channel: rowSettings.channel,
    }
    for (let i = 0; i < letters.length; i++) {
      const notes = noteFactory(i)
      actions[letters[i]] = {
        on: () => {
          noteOn(notes, noteSettings)
        },
        off: () => {
          noteOff(notes, noteSettings)
        },
      }
    }
    return actions
  }

  return factory
}
