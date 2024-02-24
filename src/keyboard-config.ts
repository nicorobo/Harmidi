import { mapValues } from 'lodash'

export type KeyCoordinates = { [key: string]: { x: number; y: number } }

export type KeyboardConfig = {
  keyGrid: string[][]
  keyList: string[]
  keyCoordinates: KeyCoordinates
}

const getKeyCoordinates = (grid: string[][]) => {
  const coordinates: KeyCoordinates = {}
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      coordinates[grid[i][j]] = { x: j, y: i }
    }
  }
  return coordinates
}

const USEnglishKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

const USEnglishKeysFull = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

const KeyboardLayouts = {
  USEnglish: USEnglishKeys,
  USEnglishFull: USEnglishKeysFull,
}

export const keyboardConfigs = mapValues(KeyboardLayouts, (keyGrid) => ({
  keyGrid,
  keyList: keyGrid.flat(),
  keyCoordinates: getKeyCoordinates(keyGrid),
}))
