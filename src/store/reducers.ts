import { combineReducers } from 'redux'

import * as Index from '../pages/Index/redux'


function ModuleSplit(Module: any, defaultModuleName: string): any {
	const reducer = {}
	Object.keys(Module).forEach(name => {
		if (!['default', 'MODULE_NAME'].includes(name)) {
			reducer[name] = Module[name].reducer
		}
	})
	return {
		[Module.MODULE_NAME || defaultModuleName]: combineReducers(reducer)
	}
}

export default combineReducers({
  ...ModuleSplit(Index, 'Index'),
	
})