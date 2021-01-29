import { 
    UPDATE_CARD_PRODUCTS,
 } from './cardTypes'

export const updateCardProducts = (products) => {
    return {
        type: UPDATE_CARD_PRODUCTS,
        payload: products
    }
}
