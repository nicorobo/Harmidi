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

export const keyboardConfigs: { [key: string]: KeyboardConfig } = {
  USEnglish: {
    keyGrid: USEnglishKeysFull,
    keyList: getKeyList(USEnglishKeysFull),
  },
}
