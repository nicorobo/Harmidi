import React, { useRef, useState } from 'react'
import { useActionsByKey } from './use-actions-by-key'
import { useStore, ZoneIdByKey, Zones } from './store'
import { transform, noop } from 'lodash'
import { isNoteZone } from './zone-settings'

type GetPlayingKeysArgs = {
  activeKeys: string[]
  zones: Zones
  zoneIdByKey: ZoneIdByKey
}

// Returns a map between a zone and the zones that mute it.
// If this is slow, we can compute it from state when settings change and cache.
const getMutedBy = (zones: Zones) =>
  transform(
    zones,
    (mutedBy, zone) => {
      if (isNoteZone(zone)) {
        for (let mutedZoneId of zone.muteZones) {
          if (mutedBy[mutedZoneId]) {
            mutedBy[mutedZoneId].push(zone.id)
          } else {
            mutedBy[mutedZoneId] = [zone.id]
          }
        }
      }
      return mutedBy
    },
    {} as { [id: string]: string[] }
  )

const getPlayingKeys = ({
  activeKeys,
  zones,
  zoneIdByKey,
}: GetPlayingKeysArgs) => {
  const zoneIds = activeKeys.map((key) => zoneIdByKey[key])
  const mutedBy = getMutedBy(zones)
  const playing: string[] = []
  for (let i = 0; i < activeKeys.length; i++) {
    // Is there a key already playing causing a non-mutual mute?
    const alreadyMuted = playing.some((k) =>
      (mutedBy[zoneIds[i]] || []).includes(zoneIdByKey[k])
    )
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

export const EngineContext = React.createContext<{
  activeKeys: string[]
  setActiveKeys: (keys: string[]) => void
  getNotesByKey: (key: string) => number[]
}>({ activeKeys: [], setActiveKeys: noop, getNotesByKey: () => [] })

const compareArrays = (a1: string[] = [], a2: string[] = []) => ({
  added: a2.filter((key) => !a1.includes(key)),
  // neutral: a2.filter((key) => a1.includes(key)),
  removed: a1.filter((key) => !a2.includes(key)),
})

type Props = {
  children?: React.ReactNode
}

export const EngineProvider = ({ children }: Props) => {
  const previous = useRef<string[]>([])
  const actionsByKey = useActionsByKey()
  const [offActionsByKey, setOffActionsByKey] = useState<{
    [key: string]: () => void
  }>({})
  const zones = useStore.use.zones()
  const zoneIdByKey = useStore.use.zoneIdByKey()
  const [activeKeys, setActiveKeysState] = useState<string[]>([])

  const setActiveKeys = (keys: string[]) => {
    const playing = getPlayingKeys({ activeKeys: keys, zones, zoneIdByKey })
    const { added, removed } = compareArrays(previous.current, playing)
    removed.forEach((k) => offActionsByKey[k]?.())
    added.forEach((k) => {
      actionsByKey[k]?.on()
      setOffActionsByKey((a) => ({ ...a, [k]: actionsByKey[k]?.off }))
    })
    previous.current = playing
    setActiveKeysState(keys)
  }

  const getNotesByKey = (key: string) => {
    if (actionsByKey[key]) {
      return actionsByKey[key]?.notes
    }
    return []
  }

  return (
    <EngineContext.Provider
      value={{ activeKeys, setActiveKeys, getNotesByKey }}
    >
      {children}
    </EngineContext.Provider>
  )
}
