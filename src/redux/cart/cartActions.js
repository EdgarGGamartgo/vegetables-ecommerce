import { ADD_PRODUCT_TO_CART, EMPTY_TO_CART } from './cartTypes'

export const addProductCart = (product) => {
    return {
        type: ADD_PRODUCT_TO_CART,
        payload: product
    }
}

export const emptyCart = () => {
    return {
        type: EMPTY_TO_CART,
    }
}
