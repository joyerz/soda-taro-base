
interface Payload<P = {}, C = {}> {
  params: P
  callback: C
}

interface CommonActions<P1 = {}, P2 = {}, P3 = {}> {
  start: (params?: P1) => any
  success: (params?: P2) => any
  error: (params?: P3) => any
}

interface ActionsType {
  [x: string]: CommonActions
}
