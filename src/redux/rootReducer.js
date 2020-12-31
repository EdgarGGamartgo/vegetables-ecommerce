import { combineReducers } from 'redux'
import productReducer from './product/productReducer'

const rootReducer = combineReducers({
    store: productReducer,
})

export default rootReducer