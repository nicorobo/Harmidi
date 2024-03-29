import React, { useEffect, useRef, useState } from 'react'
import { useActionsByKey } from './use-actions-by-key'
import { useStore, ZoneIdByKey, ZoneById } from './store'
import { transform, noop, mapValues } from 'lodash'
import { isNoteZone } from './zone-settings'
import { compareArrays, notEmpty } from './util'
import { useActiveKeys } from './use-active-keys'
import { NoteInfo } from './note-getters'

type GetPlayingKeysArgs = {
  activeKeys: string[]
  zones: ZoneById
  zoneIdByKey: ZoneIdByKey
}

// Returns a map between a zone and the zones that mute it.
// If this is slow, we can compute it from state when settings change and cache.
const getMutedBy = (zones: ZoneById) =>
  transform(
    zones,
    (mutedBy, zone) => {
      if (isNoteZone(zone)) {
        for (let mutedZoneId of zone.muteZones) {
          mutedBy[mutedZoneId].push(zone.id)
        }
      }
      return mutedBy
    },
    mapValues<ZoneById, string[]>(zones, () => [])
  )

const getTriggeredKeys = ({
  activeKeys,
  zones,
  zoneIdByKey,
}: GetPlayingKeysArgs) => {
  const zoneIds = activeKeys.map((key) => zoneIdByKey[key]).filter(notEmpty)
  const mutedBy = getMutedBy(zones)
  const playing: string[] = []
  for (let i = 0; i < activeKeys.length; i++) {
    // Is there a key already playing causing a non-mutual mute?
    const alreadyMuted = playing.some((k) => {
      const zoneId = zoneIdByKey[k]
      return zoneId ? (mutedBy[zoneIds[i]] || []).includes(zoneId) : false
    })
    // Is there a key that will be played that will cause a mute?
    const willBeMuted = zoneIds
      .slice(i + 1)
      .some((z) => mutedBy[zoneIds[i]].includes(z))

    if (!alreadyMuted && !willBeMuted) {
      playing.push(activeKeys[i])
    }
  }
  return playing
}

const EngineContext = React.createContext<{
  activeKeys: string[]
  setActiveKeys: (keys: string[]) => void
  getNoteInfoByKey: (key: string) => NoteInfo
  keyDown: (key: string) => void
  keyUp: (key: string) => void
}>({
  activeKeys: [],
  setActiveKeys: noop,
  getNoteInfoByKey: () => ({ rootNote: 0, midiNotes: [] }),
  keyDown: noop,
  keyUp: noop,
})

type Props = {
  children?: React.ReactNode
}

export const EngineProvider = ({ children }: Props) => {
  const zones = useStore.use.zoneById()
  const zoneIdByKey = useStore.use.zoneIdByKey()

  const triggeredKeys = useRef<string[]>([])
  const [offActionsByKey, setOffActionsByKey] = useState<{
    [key: string]: () => void
  }>({})

  const actionsByKey = useActionsByKey()

  const { keyDown, keyUp, activeKeys, setActiveKeys } = useActiveKeys()

  const triggerKeysUsingActiveKeys = (keys: string[]) => {
    const newTriggeredKeys = getTriggeredKeys({
      activeKeys: keys,
      zones,
      zoneIdByKey,
    })
    const { added, removed } = compareArrays(
      triggeredKeys.current,
      newTriggeredKeys
    )
    removed.forEach((k) => offActionsByKey[k]?.())
    added.forEach((k) => {
      actionsByKey[k]?.on()
      setOffActionsByKey((a) => ({ ...a, [k]: actionsByKey[k]?.off }))
    })
    triggeredKeys.current = newTriggeredKeys
  }

  useEffect(() => {
    triggerKeysUsingActiveKeys(activeKeys)
  }, [activeKeys])

  const getNoteInfoByKey = (key: string) => {
    if (actionsByKey[key]) {
      return actionsByKey[key]?.noteInfo
    }
    return { rootNote: 0, midiNotes: [] }
  }

  return (
    <EngineContext.Provider
      value={{
        activeKeys,
        setActiveKeys,
        getNoteInfoByKey,
        keyDown,
        keyUp,
      }}
    >
      {children}
    </EngineContext.Provider>
  )
}

export const useEngine = () => React.useContext(EngineContext)
