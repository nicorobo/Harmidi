import { useCallback, useEffect } from 'react'
import { useStore } from './store'
import './App.css'

const Cell = ({ id }: { id: number }) => {
  return <div className="cell">{id}</div>
}

const Row = ({ row }: { row: number }) => {
  const { ids } = useStore((state) => state.keyboardConfig)

  return (
    <div className="row">
      {ids[row].map((i) => (
        <Cell id={i} />
      ))}
    </div>
  )
}

const Grid = () => {
  const { ids } = useStore((state) => state.keyboardConfig)
  return (
    <div className="grid">
      {ids.map((_, i) => (
        <Row row={i} />
      ))}
    </div>
  )
}

const useKeyboardListener = () => {
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)

  const onKeyDown = useCallback(
    () => (e: KeyboardEvent) => {
      if (!e.repeat) {
        keydown(e.key)
      }
    },
    [keydown]
  )

  const onKeyUp = useCallback(
    () => (e: KeyboardEvent) => {
      keyup(e.key)
    },
    [keyup]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])
}

const KeyboardListener = () => {
  useKeyboardListener()
  return null
}

function App() {
  return (
    <>
      <KeyboardListener />
      <Grid />
    </>
  )
}

export default App
