import { useStore } from '../store'

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

export const Grid = () => {
  const { ids } = useStore((state) => state.keyboardConfig)
  return (
    <div className="grid">
      {ids.map((_, i) => (
        <Row key={i} row={i} />
      ))}
    </div>
  )
}
