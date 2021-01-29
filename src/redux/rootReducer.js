import { combineReducers } from 'redux'
import productReducer from './product/productReducer'
import cartReducer from './cart/cartReducer'
import cardReducer from './card/cardReducer'

const rootReducer = combineReducers({
    store: productReducer,
    cart: cartReducer,
    card: cardReducer
})

export default rootReducer