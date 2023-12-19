import { useState, useRef } from 'react'
import { Box, Tooltip } from '@mui/joy'
import { noop } from 'lodash'

// TODO This whole file needs some TLC
// TODO make this all more general/reusable later
// TODO show value (should be a callback)
type Props = {
  points: number[]
  min: number
  max: number
  canAddPoint: boolean
  onPointAdded: (value: number) => void
  onPointRemoved: (id: number) => void
  onPointUpdated: (id: number, newValue: number) => void
  labels?: { value: number; label: string }[]
  trackColor: string
  // getValue
  // getColor
  // getDefaultPoint
}

export const MultiPointSliderInput: React.FC<Props> = ({
  points,
  min,
  max,
  canAddPoint,
  onPointAdded,
  onPointRemoved,
  onPointUpdated,
  labels,
  trackColor,
}) => {
  const [initialX, setInitialX] = useState(0)
  const [dragValue, setDragValue] = useState(0)
  const [dragging, setDragging] = useState<number | null>(null)
  const [ghostPoint, setGhostPoint] = useState<number | null>(null)

  const trackRef = useRef<HTMLSpanElement>(null)
  const range = max - min // Do I need to add one to this because I can choose 0?
  const oneSeg = (trackRef.current?.clientWidth ?? 0) / range
  const valueToPercentage = (value: number) => (value - min) / range

  const occupiedValues = points.map((v, i) => (i === dragging ? min - 1 : v))
  const onPointMouseMove = (e: React.PointerEvent, i: number) => {
    const distance = e.clientX - initialX
    const segCount = distance / oneSeg
    const newValueRaw = points[i] + segCount
    const newValue = Math.round(Math.max(min, Math.min(max, newValueRaw)))
    if (newValue !== dragValue && !occupiedValues.includes(newValue)) {
      setDragValue(newValue)
    }
  }
  const onPointMouseDown = (e: React.PointerEvent, i: number) => {
    setDragging(i)
    setInitialX(e.clientX)
    setDragValue(points[i])
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointMouseUp = (e: React.PointerEvent, i: number) => {
    if (dragValue !== points[i]) {
      onPointUpdated(i, dragValue)
    }
    setDragging(null)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const onMouseMoveTrack = (e: React.PointerEvent) => {
    if (!canAddPoint) return
    // This is to prevent rendering a ghost point when mousing over an existing point.
    if (e.target !== trackRef.current) {
      setGhostPoint(null)
      return
    }
    // Create a new ghost point when mousing over the track.
    const newGhostPoint = Math.round(e.nativeEvent.offsetX / oneSeg) + min
    if (ghostPoint !== newGhostPoint) {
      setGhostPoint(newGhostPoint)
    }
  }

  const onMouseOutTrack = () => {
    if (ghostPoint !== null && canAddPoint) {
      setGhostPoint(null)
    }
  }

  // TODO debug the mischief that happens when you create a new point and drag before releasing.
  const onMouseDown = () => {
    if (ghostPoint !== null && canAddPoint) {
      onPointAdded(ghostPoint)
      setGhostPoint(null)
    }
  }
  return (
    <Box pt={1} height={50}>
      <Box sx={sliderStyle}>
        <Box
          ref={trackRef}
          sx={trackStyle(trackColor)}
          style={{ cursor: canAddPoint ? 'pointer' : 'inherit' }}
          onPointerMove={onMouseMoveTrack}
          onPointerLeave={onMouseOutTrack}
          onPointerDown={onMouseDown}
        >
          {ghostPoint !== null && (
            <Box
              sx={ghostPointStyle(trackColor)}
              left={`${valueToPercentage(ghostPoint) * 100}%`}
            />
          )}
          {points.map((point, i) => {
            const isDragging = dragging === i
            const per = valueToPercentage(isDragging ? dragValue : point)
            return (
              <Tooltip
                key={`voice-${i}`}
                title={dragging === i ? dragValue : point}
                placement="top"
                arrow
              >
                <Box
                  sx={pointStyle(trackColor)}
                  key={'point' + i}
                  onPointerDown={(e) => onPointMouseDown(e, i)}
                  onPointerUp={isDragging ? (e) => onPointMouseUp(e, i) : noop}
                  onPointerMove={
                    isDragging ? (e) => onPointMouseMove(e, i) : noop
                  }
                  onDoubleClick={() => onPointRemoved(i)}
                  style={{ left: `${per * 100}%` }}
                />
              </Tooltip>
            )
          })}
        </Box>
        {labels?.map(({ value, label }) => {
          const leftPercentage = valueToPercentage(value) * 100
          const translateX =
            value === min ? '0' : value === max ? '-100%' : '-50%'
          return (
            <>
              <Box sx={markStyle} left={`${leftPercentage}%`} />
              <Box
                sx={labelStyle}
                left={`${leftPercentage}%`}
                style={{ transform: `translate(${translateX}, 0.5rem)` }}
              >
                {label}
              </Box>
            </>
          )
        })}
      </Box>
    </Box>
  )
}

const sliderStyle = {
  width: '100%',
  position: 'relative',
  display: 'flex',
}
const TRACK_HEIGHT = 6
const POINT_SIZE = 15
const POINT_COLOR = '#fff'

const trackStyle = (trackColor: string) => ({
  height: TRACK_HEIGHT,
  width: '100%',
  background: trackColor,
  borderRadius: '65px',
  display: 'inline-block',
  ':before': {
    content: '""',
    position: 'absolute',
    background: trackColor,
    height: TRACK_HEIGHT,
    width: TRACK_HEIGHT,
    borderRadius: '50% 0 0 50%',
    left: -TRACK_HEIGHT / 2,
  },
  ':after': {
    content: '""',
    position: 'absolute',
    background: trackColor,
    height: TRACK_HEIGHT,
    width: TRACK_HEIGHT,
    borderRadius: '0 50% 50% 0',
    right: -TRACK_HEIGHT / 2,
  },
})

const pointStyle = (trackColor: string) => ({
  height: POINT_SIZE,
  width: POINT_SIZE,
  top: '50%',
  position: 'absolute',
  backgroundColor: POINT_COLOR,

  borderRadius: '50%',
  border: `2px solid ${trackColor}`,
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  zIndex: '10',
})

const ghostPointStyle = (trackColor: string) => ({
  ...pointStyle(trackColor),
  opacity: '0.5',
  pointerEvents: 'none',
})

const markStyle = {
  height: '2px',
  width: '2px',
  position: 'absolute',
  top: '50%',
  backgroundColor: 'rgb(255, 255, 255)',
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
}

const labelStyle = {
  position: 'absolute',
  color: '#666',
  fontSize: '0.7rem',
}
