import * as Index from '../pages/Index/redux'
// __PUSH_IMPORT

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


type ModuleName<T, D> = T extends '' ? D : T

type IndexModule = {
	[k in ModuleName<typeof Index['MODULE_NAME'], 'Index'>]: {
		[k in Exclude<keyof typeof Index, 'MODULE_NAME'>]: InitState<Entries>
	}
}
// __PUSH_DATA
type TState = IndexModule 
	// __PUSH_DATA_&