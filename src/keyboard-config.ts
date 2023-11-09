export type ZoneByKey = { [key: string]: number }
export type KeyboardConfig = {
  keyGrid: string[][]
  keyList: string[]
  zoneByKey: ZoneByKey
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

const getKeyList = (keyGrid: string[][]): string[] =>
  keyGrid.reduce((list, row) => {
    list.push(...row)
    return list
  }, [])

// Zones are not associated to rows, but by default the zones are rows.
const getRowByKey = (keyGrid: string[][]): ZoneByKey => {
  const dict: ZoneByKey = {}
  for (let i = 0; i < keyGrid.length; i++) {
    for (let j = 0; j < keyGrid[i].length; j++) {
      dict[keyGrid[i][j]] = i
    }
  }
  return dict
}

export const keyboardConfigs: { [key: string]: KeyboardConfig } = {
  USEnglish: {
    keyGrid: USEnglishKeysFull,
    keyList: getKeyList(USEnglishKeysFull),
    zoneByKey: getRowByKey(USEnglishKeysFull),
  },
}
