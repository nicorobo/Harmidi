import { useState, useRef } from 'react'

// TODO make this all more general/reusable later
// Depending on range and rail's width we can change how many markers we make.
// TODO show value (should be a callback)
type Voice = { offset: number; velocity: number; on: boolean }
type VoicesInputProps = {
  voices: Voice[]
  maxVoices: number
  min: number // min semitone offset
  max: number // max semitone offset
  step: number
  onChange: (voices: Voice[]) => void
  labels: { value: number; label: string }[]
}

export const VoicesInput = ({
  voices,
  max,
  min,
  maxVoices,
  labels,
  onChange,
}: VoicesInputProps) => {
  const trackRef = useRef<HTMLSpanElement>(null)
  const range = max - min // Do I need to add one to this because I can choose 0?
  const oneSeg = (trackRef.current?.clientWidth ?? 0) / range
  const canAddPoint = voices.length < maxVoices
  const [initialX, setInitialX] = useState(0)
  const [dragValue, setDragValue] = useState(0)
  const [dragging, setDragging] = useState<number | null>(null)
  const [ghostPoint, setGhostPoint] = useState<number | null>(null)
  const valueToPercentage = (value: number) => (value - min) / range
  const occupiedOffsets = voices.map((v, i) =>
    i === dragging ? min - 1 : v.offset
  )
  const onPointMouseMove = (e: React.PointerEvent, i: number) => {
    const distance = e.clientX - initialX
    const segCount = distance / oneSeg
    const newOffsetRaw = voices[i].offset + segCount
    // TODO instead of Math.round(), use step prop
    const newOffset = Math.round(Math.max(min, Math.min(max, newOffsetRaw)))
    if (newOffset !== dragValue && !occupiedOffsets.includes(newOffset)) {
      setDragValue(newOffset)
    }
  }
  const onPointMouseDown = (e: React.PointerEvent, i: number) => {
    setDragging(i)
    setInitialX(e.clientX)
    setDragValue(voices[i].offset)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointMouseUp = (e: React.PointerEvent, i: number) => {
    if (dragValue !== voices[i].offset) {
      onChange(voices.with(i, { ...voices[i], offset: dragValue }))
    }
    setDragging(null)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }
  const onMouseMoveTrack = (e: React.PointerEvent) => {
    if (e.target !== trackRef.current) {
      setGhostPoint(null)
      return
    }
    const newGhostPoint = Math.round(e.nativeEvent.offsetX / oneSeg) + min
    if (ghostPoint !== newGhostPoint) {
      setGhostPoint(newGhostPoint)
    }
  }
  const onMouseOutTrack = () => {
    if (ghostPoint !== null) {
      setGhostPoint(null)
    }
  }
  // TODO debug the mischief that happens when you create a new point and drag before releasing.
  const onMouseDown = () => {
    if (ghostPoint !== null) {
      onChange([...voices, { offset: ghostPoint, velocity: 100, on: true }])
      setGhostPoint(null)
    }
  }
  return (
    <span className="slider">
      <span
        ref={trackRef}
        className="track"
        style={{ cursor: canAddPoint ? 'pointer' : 'inherit' }}
        onPointerMove={canAddPoint ? onMouseMoveTrack : () => {}}
        onPointerLeave={canAddPoint ? onMouseOutTrack : () => {}}
        onPointerDown={canAddPoint ? onMouseDown : () => {}}
      >
        {ghostPoint !== null && (
          <span
            className="point ghost-point"
            style={{ left: `${valueToPercentage(ghostPoint) * 100}%` }}
          />
        )}
        {voices.map((voice, i) => {
          const per = valueToPercentage(
            dragging === i ? dragValue : voice.offset
          )
          return (
            <span
              className="point"
              key={'point' + i}
              onPointerDown={(e) => onPointMouseDown(e, i)}
              onPointerUp={
                dragging === i ? (e) => onPointMouseUp(e, i) : () => {}
              }
              onPointerMove={
                dragging === i ? (e) => onPointMouseMove(e, i) : () => {}
              }
              onDoubleClick={() =>
                onChange(voices.filter((_, ind) => i !== ind))
              }
              style={{ left: `${per * 100}%` }}
            />
          )
        })}
      </span>
      {/* {Array(range - 1)
        .fill(0)
        .map((_, i) => {
          return (
            <span
              className="mark"
              key={"mark" + i}
              style={{ left: `${valueToPercentage(i + min + 1) * 100}%` }}
            />
          );
        })} */}
      {labels.map(({ value, label }) => {
        const per = valueToPercentage(value) * 100
        return (
          <>
            <span className="mark" style={{ left: `${per}%` }} />
            <span className="label" style={{ left: `${per}%` }}>
              {label}
            </span>
          </>
        )
      })}
    </span>
  )
}
