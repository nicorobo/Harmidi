import React from 'react'
import { useKnobBehavior } from './use-knob-behavior'
import { Box } from '@mui/joy'

const noselect = {
  touchAction: 'none',
  userSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
}

interface ContainerProps {
  children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...noselect,
      }}
    >
      {children}
    </Box>
  )
}

interface KnobBodyProps {
  children: React.ReactNode
  gradient: string
  innerRef: (el: any) => any
}

const KnobBody: React.FC<KnobBodyProps> = ({
  innerRef,
  children,
  gradient,
}) => {
  return (
    <Box
      ref={innerRef}
      sx={{
        height: '40px',
        width: '40px',
        background: gradient,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  )
}

const KnobInner: React.FC = () => {
  return (
    <Box
      sx={{
        height: '30px',
        width: '30px',
        borderRadius: '50%',
        background: '#fff',
      }}
    />
  )
}

// I'm not sure what this stuff was for
// transform: rotate(${(props) => props.rotate}deg);
// <KnobBody ref={knobRef} gradient={gradient} rotate={currentDeg}>

interface ValueProps {
  children: React.ReactNode
}

const Value: React.FC<ValueProps> = ({ children }) => {
  return (
    <Box
      sx={{
        marginTop: '-0.5rem',
        fontSize: '0.75rem',
        color: '#333',
      }}
    >
      {children}
    </Box>
  )
}

interface TitleProps {
  children: React.ReactNode
}

const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <Box
      sx={{
        fontSize: '0.75rem',
        color: '#333',
      }}
    >
      {children}
    </Box>
  )
}

type Props = {
  value?: number
  title?: string
  min?: number
  max?: number
  fullAngle?: number
  onChange: (value: number) => void
}

// TODO: look into the styles getting infinitely added to head element (something about emotion and the styles changing)
export const Knob: React.FC<Props> = ({
  value: controlledValue,
  onChange,
  title,
  min = 0,
  max = 100,
  fullAngle = 270,
}) => {
  const { knobRef, value } = useKnobBehavior({
    onChange,
    value: controlledValue,
    min,
    max,
  })
  const currentDeg = calculateAngle({ value, fullAngle, min, max })
  const gradient = calculateGradient({ fullAngle, currentDeg })
  return (
    <Container>
      {title && <Title>{title}</Title>}
      <KnobBody innerRef={knobRef} gradient={gradient}>
        <KnobInner />
      </KnobBody>
      <Value>{value}</Value>
    </Container>
  )
}

type calculateAngleArgs = {
  value: number
  fullAngle: number
  min: number
  max: number
}

const calculateAngle = ({ value, fullAngle, min, max }: calculateAngleArgs) => {
  const startAngle = (360 - fullAngle) / 2
  const endAngle = startAngle + fullAngle
  return Math.floor(convertRange({ min, max, startAngle, endAngle, value }))
}

type calculateGradientArgs = {
  fullAngle: number
  currentDeg: number
  activeColor?: string
  inactiveColor?: string
  backgroundColor?: string
}

const calculateGradient = ({
  fullAngle,
  currentDeg,
  activeColor = '#0a6bcb',
  inactiveColor = '#eee',
  backgroundColor = '#fff',
}: calculateGradientArgs) => {
  const startAngle = (360 - fullAngle) / 2
  return `conic-gradient(from ${startAngle - 180}deg, ${activeColor} ${
    currentDeg - startAngle
  }deg, ${inactiveColor} ${
    currentDeg - startAngle
  }deg ${fullAngle}deg, ${backgroundColor} ${fullAngle}deg)`
}

type convertRangeArgs = {
  min: number
  max: number
  startAngle: number
  endAngle: number
  value: number
}

const convertRange = ({
  min,
  max,
  startAngle,
  endAngle,
  value,
}: convertRangeArgs) => {
  return ((value - min) * (endAngle - startAngle)) / (max - min) + startAngle
}
