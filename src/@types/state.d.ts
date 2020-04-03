interface InitState<T = {}> {
  loading: boolean
  error: boolean
  success: boolean
  params: any
  data: T
}

interface Entries<T> {
  page: number
  per_page: number
  total_count: number
  total_page: number
  entries: T[]
}

interface TState {
  Index: {
    list: InitState<Entries>
  }
}

const state: InitState = {
  loading: true,

}

console.log(state)