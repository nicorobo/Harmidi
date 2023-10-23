import { useStore } from '../store'

const Cell = ({ keyboardKey }: { keyboardKey: string }) => {
  const active = useStore((state) => state.active)
  console.log(active)

  return (
    <div className={'cell' + (active.includes(keyboardKey) ? ' active' : '')} />
  )
}

const Row = ({ row }: { row: number }) => {
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  return (
    <div className={`row row-${row}`}>
      {keyGrid[row].map((i) => (
        <Cell keyboardKey={i} />
      ))}
    </div>
  )
}

export const Grid = () => {
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  return (
    <div className="grid">
      {keyGrid.map((_, i) => (
        <Row key={i} row={i} />
      ))}
    </div>
  )
}
