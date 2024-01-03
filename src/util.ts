import { difference } from 'lodash'

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const compareArrays = (a1: any[] = [], a2: any[] = []) => ({
  added: difference(a2, a1),
  removed: difference(a1, a2),
})

export { notEmpty, compareArrays }
