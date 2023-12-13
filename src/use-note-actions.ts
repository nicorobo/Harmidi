import { useMIDIOutput } from '@react-midi/hooks'
import { KeyActions, ZoneOperators } from './use-actions-by-key'
import { getNotes } from './note-getters'
import { ControlZone, Zone, isControlZone, isNoteZone } from './zone-settings'
import { useRef } from 'react'
import { gsap } from 'gsap'

type CCMap = {
  [id: string]: {
    midiCC: number
    channel: number
    atTarget: boolean
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
    let allAtTarget = true
    for (const ccKey in ccMap.current) {
      const { midiCC, channel, currentValue, previousValue, atTarget } =
        ccMap.current[ccKey]
      if (!atTarget) {
        allAtTarget = false
      }
      const val = Math.round(currentValue)
      if (val !== previousValue) {
        cc(val, midiCC, channel)
        ccMap.current[ccKey].previousValue = val
      }
    }
    if (!allAtTarget && Object.keys(ccMap.current).length) {
      window.requestAnimationFrame(updateCC)
    }
  }
  const getCCActions = (zone: ControlZone) => {
    if (!cc) {
      return
    }
    const ccId = `${zone.channel}-${zone.midiCC}`
    return {
      on: () => {
        gsap.killTweensOf(ccMap.current[ccId])
        if (zone.attack === 0) {
          cc(zone.targetValue, zone.midiCC, zone.channel)
          delete ccMap.current[ccId]
          return
        }

        ccMap.current[ccId] ??= {
          channel: zone.channel,
          midiCC: zone.midiCC,
          atTarget: false,
          currentValue: zone.initialValue,
          previousValue: zone.initialValue,
        }

        const completness =
          1 -
          (ccMap.current[ccId].previousValue - zone.initialValue) /
            (zone.targetValue - zone.initialValue)

        gsap.to(ccMap.current[ccId], {
          currentValue: zone.targetValue,
          duration: (zone.attack * completness) / 1000,
          onComplete: () => {
            ccMap.current[ccId].atTarget = true
          },
        })
        // I maybe don't want to call this when updateCC is already running
        window.requestAnimationFrame(updateCC)
      },

      off: () => {
        if (!ccMap.current[ccId]) {
          return
        }
        gsap.killTweensOf(ccMap.current[ccId])
        if (zone.release === 0) {
          cc(zone.initialValue, zone.midiCC, zone.channel)
          delete ccMap.current[ccId]
          return
        }
        ccMap.current[ccId].atTarget = false
        const completness =
          1 -
          (ccMap.current[ccId].previousValue - zone.targetValue) /
            (zone.targetValue - zone.initialValue)

        gsap.to(ccMap.current[ccId], {
          currentValue: zone.initialValue,
          duration: (zone.release * completness) / 1000,
          onComplete: () => {
            delete ccMap.current[ccId]
          },
        })

        // I maybe don't want to call this when updateCC is already running
        window.requestAnimationFrame(updateCC)
      },
      notes: [],
    }
  }
  const actions: KeyActions = {}
  const factory = (
    keys: string[],
    zone: Zone,
    zoneOperators: ZoneOperators
  ) => {
    if (isNoteZone(zone)) {
      if (!noteOn || !noteOff) {
        return actions
      }
      const controlActions = zoneOperators.controlZones.map(getCCActions)
      const noteFactory = getNotes(zone)
      const noteSettings = {
        velocity: zone.velocity,
        channel: zone.channel,
      }
      for (let i = 0; i < keys.length; i++) {
        const notes = noteFactory(i)
        actions[keys[i]] = {
          on: (triggerOperators?: boolean) => {
            // console.log(performance.measure('on', 'keydown'))
            if (triggerOperators) {
              console.log('[on] triggering operators')
              for (const controlAction of controlActions ?? []) {
                controlAction?.on()
              }
            }
            noteOn(notes, noteSettings)
          },
          off: (triggerOperators?: boolean) => {
            // console.log(performance.measure('off', 'keyup'))
            if (triggerOperators) {
              console.log('[off] triggering operators')
              for (const controlAction of controlActions ?? []) {
                controlAction?.off()
              }
            }
            noteOff(notes, noteSettings)
          },
          notes,
          // TODO consider putting the stringified notes here, or chord names etc.. other metadata
        }
      }
    } else if (isControlZone(zone) && !zone.triggerOnNote) {
      const ccActions = getCCActions(zone)
      if (!ccActions) {
        return actions
      }
      for (let i = 0; i < keys.length; i++) {
        actions[keys[i]] = ccActions
      }
    }

    return actions
  }
  return factory
}
