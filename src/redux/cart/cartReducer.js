import { ADD_PRODUCT_TO_CART } from './cartTypes'

const initialState = {
    products: []
}

const cartReducer = (state = initialState, action) => {
    console.log('My REDUC: ', action)
    switch(action.type) {
        case ADD_PRODUCT_TO_CART: 
        
        return {
            ...state,
            products: [...state.products, ...action.payload]
        }

        default: return state
    }
}

export default cartReducer