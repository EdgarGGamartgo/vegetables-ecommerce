import { BUY_PRODUCT } from './productTypes'

const initialState = {
    productKg: 30
}

const productReducer = (state = initialState, action) => {
    switch(action.type) {
        case BUY_PRODUCT: return {
            ...state,
            productKg: state.productKg - action.payload
        }

        default: return state
    }
}

export default productReducer