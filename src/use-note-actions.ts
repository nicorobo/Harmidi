import { useMIDIOutput } from '@react-midi/hooks'
import { KeyActions } from './use-actions-by-key'
import { getNotes } from './note-getters'
import { Zone, isControlZone, isNoteZone } from './zone-settings'
import { useRef } from 'react'
import { gsap } from 'gsap'

type CCMap = {
  [id: string]: {
    midiCC: number
    channel: number
    currentValue: number
    previousValue: number
  }
}
export const useActions = () => {
  const ccMap = useRef<CCMap>({})
  const { noteOn, noteOff, cc } = useMIDIOutput()
  const updateCC = () => {
    if (!cc) {
      return
    }
    for (const ccKey in ccMap.current) {
      const { midiCC, channel, currentValue, previousValue } =
        ccMap.current[ccKey]
      const val = Math.round(currentValue)
      if (val !== previousValue) {
        cc(val, midiCC, channel)
        ccMap.current[ccKey].previousValue = val
      }
    }
    if (Object.keys(ccMap.current).length) {
      window.requestAnimationFrame(updateCC)
    }
  }
  const actions: KeyActions = {}
  const factory = (keys: string[], zone: Zone) => {
    if (isNoteZone(zone)) {
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
            // console.log(performance.measure('on', 'keydown'))
            noteOn(notes, noteSettings)
          },
          off: () => {
            // console.log(performance.measure('off', 'keyup'))
            noteOff(notes, noteSettings)
          },
          notes,
          // TODO consider putting the stringified notes here, or chord names etc.. other metadata
        }
      }
    } else if (isControlZone(zone)) {
      if (!cc) {
        return actions
      }
      for (let i = 0; i < keys.length; i++) {
        const ccId = `${zone.channel}-${zone.midiCC}`
        actions[keys[i]] = {
          on: () => {
            gsap.killTweensOf(ccMap.current[ccId])
            if (zone.upTime === 0) {
              cc(zone.endValue, zone.midiCC, zone.channel)
              delete ccMap.current[ccId]
              return
            }
            ccMap.current[ccId] = ccMap.current[ccId] ?? {
              channel: zone.channel,
              midiCC: zone.midiCC,
              currentValue: zone.startValue,
              previousValue: zone.startValue,
            }
            const completness =
              1 -
              (ccMap.current[ccId].previousValue - zone.startValue) /
                (zone.endValue - zone.startValue)
            console.log('completness: ', completness)
            gsap.to(ccMap.current[ccId], {
              currentValue: zone.endValue,
              duration: (zone.upTime * completness) / 1000,
              onComplete: () => {
                console.log('[on] delete')
                delete ccMap.current[ccId]
              },
            })
            // I maybe don't want to call this when updateCC is already running
            window.requestAnimationFrame(updateCC)
          },
          off: () => {
            gsap.killTweensOf(ccMap.current[ccId])
            if (zone.downTime === 0) {
              cc(zone.startValue, zone.midiCC, zone.channel)
              delete ccMap.current[ccId]
              return
            }
            ccMap.current[ccId] = ccMap.current[ccId] ?? {
              channel: zone.channel,
              midiCC: zone.midiCC,
              currentValue: zone.endValue,
              previousValue: zone.endValue,
            }

            const completness =
              1 -
              (ccMap.current[ccId].previousValue - zone.endValue) /
                (zone.endValue - zone.startValue)
            console.log((zone.downTime * completness) / 1000)
            gsap.to(ccMap.current[ccId], {
              currentValue: zone.startValue,
              duration: (zone.downTime * completness) / 1000,
              onComplete: () => {
                console.log('[off] delete')
                delete ccMap.current[ccId]
              },
            })

            // I maybe don't want to call this when updateCC is already running
            window.requestAnimationFrame(updateCC)
          },
          notes: [],
        }
      }
    }

    return actions
  }
  return factory
}
