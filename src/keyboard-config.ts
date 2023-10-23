// type KeyToIdMap = { [key: string]: number }

export type KeyboardConfig = {
  keyGrid: string[][]
  keyList: string[]
}

const USEnglishKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

// const createMapFromKeys = (keys: string[][]) => {
//   let count = 0
//   const map: KeyToIdMap = {}
//   for (let row of keys) {
//     for (let key of row) {
//       map[key] = count++
//     }
//   }
//   return map
// }

// const keysToIds = (keys: string[][]) => {
//   let count = 0
//   return keys.map((row) => row.map(() => count++))
// }

const getKeyList = (keyGrid: string[][]): string[] =>
  keyGrid.reduce((list, row) => {
    list.push(...row)
    return list
  }, [])

export const keyboardConfigs: { [key: string]: KeyboardConfig } = {
  USEnglish: {
    keyGrid: USEnglishKeys,
    keyList: getKeyList(USEnglishKeys),
  },
}
