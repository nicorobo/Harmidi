import { Box, Tooltip } from '@mui/joy'
import { noop } from 'lodash'
import { useState, useRef } from 'react'

// TODO This whole file needs some TLC
// TODO make this all more general/reusable later
// TODO show value (should be a callback)
export type Voice = { offset: number; velocity: number; on: boolean }
type VoicesInputProps = {
  voices: Voice[]
  maxVoices: number
  min: number // min semitone offset
  max: number // max semitone offset
  onChange: (voices: Voice[]) => void
  labels: { value: number; label: string }[]
  // getValue
  // getColor
  // getDefaultPoint
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
    <Box sx={sliderStyle}>
      <Box
        ref={trackRef}
        sx={trackStyle}
        style={{ cursor: canAddPoint ? 'pointer' : 'inherit' }}
        onPointerMove={canAddPoint ? onMouseMoveTrack : noop}
        onPointerLeave={canAddPoint ? onMouseOutTrack : noop}
        onPointerDown={canAddPoint ? onMouseDown : noop}
      >
        {ghostPoint !== null && (
          <Box
            sx={ghostPointStyle}
            left={`${valueToPercentage(ghostPoint) * 100}%`}
          />
        )}
        {voices.map((voice, i) => {
          const isDragging = dragging === i
          const per = valueToPercentage(isDragging ? dragValue : voice.offset)
          return (
            <Tooltip
              title={dragging === i ? dragValue : voice.offset}
              placement="top"
              arrow
            >
              <Box
                sx={pointStyle}
                key={'point' + i}
                onPointerDown={(e) => onPointMouseDown(e, i)}
                onPointerUp={isDragging ? (e) => onPointMouseUp(e, i) : noop}
                onPointerMove={
                  isDragging ? (e) => onPointMouseMove(e, i) : noop
                }
                onDoubleClick={
                  voices.length > 1
                    ? () => onChange(voices.filter((_, j) => i !== j))
                    : noop
                }
                style={{ left: `${per * 100}%` }}
              />
            </Tooltip>
          )
        })}
      </Box>
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
        const leftPercentage = valueToPercentage(value) * 100
        return (
          <>
            <Box sx={markStyle} left={`${leftPercentage}%`} />
            <Box sx={labelStyle} left={`${leftPercentage}%`}>
              {label}
            </Box>
          </>
        )
      })}
    </Box>
  )
}

const sliderStyle = {
  width: '100%',
  position: 'relative',
  display: 'flex',
}
const trackStyle = {
  height: '6px',
  width: '100%',
  background: 'rgb(207, 207, 207)',
  borderRadius: '65px',
  display: 'inline-block',
  before: {
    position: 'absolute',
    background: 'rgb(207, 207, 207)',
    height: '6px',
    width: '6px',
    borderRadius: '50% 0 0 50%',
    left: '-3px',
  },
  after: {
    position: 'absolute',
    background: 'rgb(207, 207, 207)',
    height: '6px',
    width: '6px',
    borderRadius: '0 50% 50% 0',
    right: '-3px',
  },
}

const pointStyle = {
  height: '13px',
  width: '13px',
  top: '50%',
  position: 'absolute',
  backgroundColor: '#ae67ff',
  display: 'flex',
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  zIndex: '10',
}

const ghostPointStyle = {
  ...pointStyle,
  opacity: '0.5',
  pointerEvents: 'none',
}
const markStyle = {
  height: '2px',
  width: '2px',
  top: '50%',
  position: 'absolute',
  backgroundColor: 'rgb(255, 255, 255)',
  display: 'flex',
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
}
const labelStyle = {
  position: 'absolute',
  color: '#ae67ff',
  fontSize: '0.7rem',
  transform: 'translate(-50%, 0.5rem)',
}
