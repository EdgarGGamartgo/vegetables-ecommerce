import { ADD_PRODUCT_TO_CART } from './cartTypes'

export const addProductCart = (product) => {
    return {
        type: ADD_PRODUCT_TO_CART,
        payload: product
    }
}
