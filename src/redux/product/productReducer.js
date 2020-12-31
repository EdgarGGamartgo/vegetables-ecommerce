import { BUY_PRODUCT, SET_STORE } from './productTypes'

const productReducer = (state = [], action) => {
    switch(action.type) {
        // case BUY_PRODUCT: return {
        //     ...state,
        //     productKg: state.productKg - action.payload
        // }

        case SET_STORE: return {
            ...state,
            products: action.payload.products
        }

        default: return state
    }
}

export default productReducer