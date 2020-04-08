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

interface User {
  nickname: string
  age: number
}

interface TState {
  Index: {
    list: InitState<Entries<User>>
  }
	Coupon: {
		list: InitState<Entries>
	}
	// __PUSH_DATA
}