import { 
    ADD_PRODUCT_TO_CART,
    EMPTY_TO_CART,
    EDIT_PRODUCT,
    DELETE_PRODUCT,
 } from './cartTypes'

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

export const editProduct = (product) => {
    return {
        type: EDIT_PRODUCT,
        payload: product
    }
}

export const deleteProduct = (product) => {
    return {
        type: DELETE_PRODUCT,
        payload: product
    }
}
