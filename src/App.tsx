import { useEffect } from 'react'
import { useStore } from './store'

const Cell = ({ id }: { id: number }) => {
  return <div>{id}</div>
}

const Row = ({ row }: { row: number }) => {
  const { ids } = useStore((state) => state.keyboardConfig)

  return (
    <div>
      {ids[row].map((i) => (
        <Cell id={i} />
      ))}
    </div>
  )
}

const Grid = () => {
  const { ids } = useStore((state) => state.keyboardConfig)
  console.log('grid')
  return (
    <div>
      {ids.map((_, i) => (
        <Row row={i} />
      ))}
    </div>
  )
}

const useKeyboardListener = () => {
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (!e.repeat) {
        keydown(e.key)
      }
    }
    const keyUpListener = (e: KeyboardEvent) => {
      e.stopPropagation()
      e.stopImmediatePropagation()
      keyup(e.key)
    }
    window.addEventListener('keydown', keyDownListener)
    window.addEventListener('keyup', keyUpListener)
    return () => {
      window.removeEventListener('keydown', keyDownListener)
      window.removeEventListener('keyup', keyDownListener)
    }
  }, [keydown, keyup])
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
