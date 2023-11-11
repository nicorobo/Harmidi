import { useEffect, useRef, useState } from 'react'
import { Settings, useStore } from './store'
import { ZoneByKey } from './keyboard-config'
import { useActionsByKey } from './use-actions-by-key'

type GetPlayingKeysArgs = {
  activeKeys: string[]
  settings: Settings
  zoneByKey: ZoneByKey
}

// Returns a 2d array that acts as a map between a zone and the zones that mute it.
// If zones are ever identified as something other than an index, we can make this an actual map.
// If this is slow, we can compute it from state when settings change and cache.
const getMutedBy = (settings: Settings) =>
  settings.reduce((mutedBy, s, zone) => {
    for (let mutedZone of s.muteZones) {
      mutedBy[mutedZone].push(zone)
    }
    return mutedBy
  }, settings.map(() => []) as number[][])

const getPlayingKeys = ({
  activeKeys,
  settings,
  zoneByKey,
}: GetPlayingKeysArgs) => {
  const zones = activeKeys.map((key) => zoneByKey[key])
  const mutedBy = getMutedBy(settings)
  const playing: string[] = []
  for (let i = 0; i < activeKeys.length; i++) {
    // Is there a key already playing causing a non-mutual mute?
    const alreadyMuted = playing.some((k) =>
      mutedBy[zones[i]].includes(zoneByKey[k])
    )
    // Is there a key that will be played that will cause a mute?
    const willBeMuted = zones
      .slice(i + 1)
      .some((z) => mutedBy[zones[i]].includes(z))

    if (!alreadyMuted && !willBeMuted) {
      playing.push(activeKeys[i])
    }
  }
  return playing
}

const usePlayingKeys = () => {
  const activeKeys = useStore((store) => store.activeKeys)
  const settings = useStore((store) => store.settings)
  const { zoneByKey } = useStore((store) => store.keyboardConfig)
  return getPlayingKeys({ activeKeys, settings, zoneByKey })
}

const compareArrays = (a1: string[] = [], a2: string[] = []) => ({
  added: a2.filter((key) => !a1.includes(key)),
  // neutral: a2.filter((key) => a1.includes(key)),
  removed: a1.filter((key) => !a2.includes(key)),
})

export const useEngine = () => {
  const previous = useRef<string[]>([])
  const actionsByKey = useActionsByKey()
  const [offActionsByKey, setOffActionsByKey] = useState<{
    [key: string]: () => void
  }>({})
  const playing = usePlayingKeys()

  useEffect(() => {
    const { added, removed } = compareArrays(previous.current, playing)
    removed.forEach((k) => offActionsByKey[k]?.())
    added.forEach((k) => {
      actionsByKey[k]?.on()
      setOffActionsByKey((a) => ({ ...a, [k]: actionsByKey[k]?.off }))
    })
    previous.current = playing
  }, [previous.current, playing, actionsByKey, offActionsByKey])
}
