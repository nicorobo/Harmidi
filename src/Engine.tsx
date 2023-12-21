import React, { useRef, useState } from 'react'
import { useActionsByKey } from './use-actions-by-key'
import { useStore, ZoneIdByKey, ZoneById } from './store'
import { transform, noop, mapValues, countBy } from 'lodash'
import { isNoteZone } from './zone-settings'
import { notEmpty } from './util'

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

const getPlayingKeys = ({
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
  const [offActionsByKey, setOffActionsByKey] = useState<{
    [key: string]: (triggerOperators?: boolean) => void
  }>({})
  const zones = useStore.use.zoneById()
  const zoneIdByKey = useStore.use.zoneIdByKey()
  const [activeKeys, setActiveKeysState] = useState<string[]>([])
  const activeZonesIds = activeKeys
    .map((key) => zoneIdByKey[key])
    .filter(notEmpty)
  const actionsByKey = useActionsByKey(activeZonesIds)
  const previousCountByZone = countBy(
    previous.current.map((key) => zoneIdByKey[key])
  )

  const setActiveKeys = (keys: string[]) => {
    const playing = getPlayingKeys({ activeKeys: keys, zones, zoneIdByKey })
    const playingZoneCount = countBy(playing.map((key) => zoneIdByKey[key]))
    const { added, removed } = compareArrays(previous.current, playing)
    removed.forEach((k) =>
      offActionsByKey[k]?.(!playingZoneCount[zoneIdByKey[k] ?? ''])
    )
    added.forEach((k) => {
      const triggerOperators = !previousCountByZone[zoneIdByKey[k] ?? '']
      actionsByKey[k]?.on(triggerOperators)
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
