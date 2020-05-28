interface InitState<T = {}> {
  loading: boolean
  error: boolean
  success: boolean
  params: any
  data: T
}

interface Entries<T = any> {
  page: number
  per_page: number
  total_count: number
  total_page: number
  entries: T[]
}

interface User {
  nickname: string
  age: number
}

interface TState {
  Index: {
    list: InitState<Entries<User>>
  }
	// __PUSH_DATA
}