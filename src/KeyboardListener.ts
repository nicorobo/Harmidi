import { useEffect, useState } from 'react'
import { Settings, useStore } from './store'
import { useActionsByKey } from './use-actions-by-key'
import { RowByKey } from './keyboard-config'

// Certainly theres a better way to do this. Consider building these arrays in the functions itself, or doing this in a single pass.
const compareArrays = (a1: string[] = [], a2: string[] = []) => ({
  added: a2.filter((key) => !a1.includes(key)),
  // neutral: a2.filter((key) => a1.includes(key)),
  removed: a1.filter((key) => !a2.includes(key)),
})

// Given an array, an initial set of two arrays, and a set of muted rows
const organizeLevels = (
  baseArray: string[],
  init: string[][],
  mutedRows: number[],
  rowByKey: RowByKey
) =>
  baseArray
    .reduce((prev, cur) => {
      const i = mutedRows.includes(rowByKey[cur]) ? 0 : 1
      prev[i].push(cur)
      return prev
    }, init)
    .filter((arr) => arr.length)

const addKeyToStack = ({
  key,
  stack,
  settings,
  rowByKey,
}: {
  key: string
  stack: string[][]
  settings: Settings
  rowByKey: RowByKey
}) => {
  const keyRow = rowByKey[key]
  const { muteOnPlayRows } = settings[keyRow]
  const currentTop = stack.at(-1)

  if (!currentTop) {
    // There are no other keys playing
    return [[key]]
  }

  // check if keys in top will mute new key
  const muted = currentTop
    .filter((k) => !muteOnPlayRows.includes(rowByKey[k]))
    .some((k) => settings[rowByKey[k]].muteOnPlayRows.includes(keyRow))

  if (muted) {
    // This logic is very similar to what we do when removing a key from a row, we could maybe comine them.
    const layerBeneath = stack.at(-2)
    if (layerBeneath) {
      const nextLayers = organizeLevels(
        layerBeneath,
        [[], [key]],
        muteOnPlayRows,
        rowByKey
      )
      return stack.toSpliced(-2, 1, ...nextLayers)
    }
    return stack.toSpliced(-1, 0, [key])
  }

  // We are creating two arrays, one with the currently playing elements that have been muted, and one for the currently playing elements
  const nextLayers = organizeLevels(
    currentTop,
    [[], [key]],
    muteOnPlayRows,
    rowByKey
  )
  return stack.toSpliced(-1, 1, ...nextLayers)
}

const removeKeyFromStack = ({
  key,
  stack,
  settings,
  rowByKey,
}: {
  key: string
  stack: string[][]
  settings: Settings
  rowByKey: RowByKey
}) => {
  // Traverse stack in reverse until finding the key's level
  for (let i = stack.length - 1; i >= 0; i--) {
    const index = stack[i].indexOf(key)
    if (index < 0) {
      continue
    }
    const newLayer = [...stack[i]].filter((_, i) => i !== index)
    const layerBeneath = stack[i - 1]
    if (layerBeneath) {
      // There is a layer beneath and we need to decide how its affected by the key's removal
      const mutedRows = newLayer.reduce((prev, cur) => {
        prev.push(...settings[rowByKey[cur]].muteOnPlayRows)
        return prev
      }, [] as number[])
      const nextLayers = organizeLevels(
        layerBeneath,
        [[], [...newLayer]],
        mutedRows,
        rowByKey
      )

      return stack.toSpliced(i - 1, 2, ...nextLayers)
    } else {
      // The removed key was on the bottom layer,
      return stack.toSpliced(i, 1, newLayer)
    }
  }

  // Key was not found in the stack
  return stack
}

const useKeyboardListener = () => {
  const [offActionsByKey, setOffActionsByKey] = useState<{
    [key: string]: () => void
  }>({})
  const [stack, setStack] = useState<string[][]>([])
  const { keyList, rowByKey } = useStore((state) => state.keyboardConfig)
  const settings = useStore((state) => state.settings)
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)
  const actionsByKey = useActionsByKey()

  const onKeyDown = (e: KeyboardEvent) => {
    if (!e.repeat && keyList.includes(e.key)) {
      const newStack = addKeyToStack({ stack, settings, key: e.key, rowByKey })

      // Compare previous top to the current top to decide what to on and what to off.
      const currentTop = stack.at(-1)
      const newTop = newStack.at(-1)
      const { added, removed } = compareArrays(currentTop, newTop)

      // Take relevant action for added & removed keys
      removed.forEach((k) => offActionsByKey[k]?.())
      added.forEach((k) => {
        actionsByKey[k]?.on()
        setOffActionsByKey((a) => ({ ...a, [k]: actionsByKey[k]?.off }))
      })

      keydown(e.key)
      setStack(newStack)
      console.log('stack [on ]: ', JSON.stringify(newStack))
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (keyList.includes(e.key)) {
      const newStack = removeKeyFromStack({
        stack,
        settings,
        key: e.key,
        rowByKey,
      })

      const currentTop = stack.at(-1)
      const newTop = newStack.at(-1)
      const { added, removed } = compareArrays(currentTop, newTop)

      // Take relevant action for added & removed keys
      removed.forEach((k) => offActionsByKey[k]?.())
      added.forEach((k) => {
        actionsByKey[k]?.on()
        setOffActionsByKey((a) => ({ ...a, [k]: actionsByKey[k]?.off }))
      })

      keyup(e.key)
      setStack(newStack)
      console.log('stack [off]: ', JSON.stringify(newStack))
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])
}

export const KeyboardListener = () => {
  useKeyboardListener()
  return null
}
