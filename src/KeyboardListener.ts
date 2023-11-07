import { useEffect, useState } from 'react'
import { useStore } from './store'
import { useActionsByKey } from './use-actions-by-key'

// Certainly theres a better way to do this. Consider building these arrays in the functions itself, or doing this in a single pass.
const compareArrays = (a1: string[], a2: string[]) => ({
  added: a2.filter((key) => !a1.includes(key)),
  // neutral: a2.filter((key) => a1.includes(key)),
  removed: a1.filter((key) => !a2.includes(key)),
})

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
      const s = settings[rowByKey[e.key]]
      const currentTop = stack.length ? stack[stack.length - 1] : null
      console.log('currentTop: ', JSON.stringify(currentTop))
      // I should be able to use .toSpliced but have to find a way to use the polyfill
      let nextStack = [...stack]
      keydown(e.key)
      if (currentTop) {
        // check if keys in top will mute e.key
        const row = rowByKey[e.key]
        const { muteOnPlayRows } = settings[row]
        const muted = currentTop
          .filter((key) => !muteOnPlayRows.includes(rowByKey[key]))
          .some((key) => settings[rowByKey[key]].muteOnPlayRows.includes(row))
        if (muted) {
          console.log('is muted...')
          nextStack.splice(-2, 0, [e.key])
        } else {
          // We are creating two arrays, one with the currently playing elements that have been muted, and one for the currently playing elements
          const nextTop = currentTop
            .reduce(
              (prev, cur) => {
                const i = muteOnPlayRows.includes(rowByKey[cur]) ? 0 : 1
                prev[i].push(cur)
                return prev
              },
              [[], [e.key]]
            )
            .filter((arr) => arr.length)

          //
          nextStack.splice(-1, 1, ...nextTop)
        }
      } else {
        nextStack = [[e.key]]
      }
      // for (let row of s.muteOnPlayRows) {
      //   for (let key of keyGrid[row]) {
      //     if (offActionsByKey[key]) {
      //       offActionsByKey[key]()
      //     }
      //   }
      // }

      // Compare previous top to the current top to decide what to on and what to off.
      const nextTop = nextStack[nextStack.length - 1]
      const { added, removed } = currentTop
        ? compareArrays(currentTop, nextTop)
        : { added: nextTop, removed: [] }

      for (let key of removed) {
        if (offActionsByKey[key]) {
          offActionsByKey[key]()
        }
      }
      for (let key of added) {
        actionsByKey[key]?.on()
        setOffActionsByKey((a) => ({ ...a, [key]: actionsByKey[key]?.off }))
      }
      console.log('setting stack: ', JSON.stringify(nextStack))
      setStack(nextStack)
      // find whats new: trigger on
      // find whats old: trigger off
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (keyList.includes(e.key)) {
      const s = settings[rowByKey[e.key]]
      const currentTop = stack.length ? stack[stack.length - 1] : null
      const currentSecondTop = stack.length > 1 ? stack[stack.length - 2] : null
      console.log('currentTop: ', JSON.stringify(currentTop))
      // I should be able to use .toSpliced but have to find a way to use the polyfill
      let nextStack = [...stack]

      if (currentTop) {
        const index = currentTop.indexOf(e.key)
        // Removing a key that is currently playing
        if (index > -1) {
          const nextTop = [...currentTop].filter((_, i) => i !== index)
          if (currentSecondTop) {
            const mutedRows = nextTop.reduce((prev, cur) => {
              prev.push(...settings[rowByKey[cur]].muteOnPlayRows)
              return prev
            }, [] as number[])
            const nextTops = currentSecondTop
              .reduce(
                (prev, cur) => {
                  const i = mutedRows.includes(rowByKey[cur]) ? 0 : 1
                  prev[i].push(cur)
                  return prev
                },
                [[], nextTop] as string[][]
              )
              .filter((arr) => arr.length)

            nextStack.splice(-2, 2, ...nextTops)
          } else {
            nextStack = [nextTop]
          }
        } else {
          // Removing key not currently playing
          for (let i = stack.length - 1; i >= 0; i--) {
            const index = stack[i].indexOf(e.key)
            if (index > -1) {
              const nextLayer = [...stack[i]].filter((_, i) => i !== index)
              if (i - 1 >= 0) {
                const mutedRows = nextLayer.reduce((prev, cur) => {
                  prev.push(...settings[rowByKey[cur]].muteOnPlayRows)
                  return prev
                }, [] as number[])
                const nextLayers = stack[i - 1]
                  .reduce(
                    (prev, cur) => {
                      const i = mutedRows.includes(rowByKey[cur]) ? 0 : 1
                      prev[i].push(cur)
                      return prev
                    },
                    [[], nextLayer] as string[][]
                  )
                  .filter((arr) => arr.length)

                nextStack.splice(i - 1, 2, ...nextLayers)
              } else {
                nextStack.splice(i, 1, nextLayer)
              }
              break
            }
          }
          // find which level the key is in
          // remove it, and replace the previous and current rows
        }
      }

      keyup(e.key)

      const nextTop = nextStack.length ? nextStack[nextStack.length - 1] : null
      if (currentTop) {
        const { added, removed } = nextTop
          ? compareArrays(currentTop, nextTop)
          : { added: [], removed: currentTop }
        console.log({ added, removed })
        for (let key of removed) {
          if (offActionsByKey[key]) {
            offActionsByKey[key]()
          }
        }
        for (let key of added) {
          actionsByKey[key]?.on()
          setOffActionsByKey((a) => ({ ...a, [key]: actionsByKey[key]?.off }))
        }
      }
      console.log('setting stack: ', JSON.stringify(nextStack))
      setStack(nextStack)
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
