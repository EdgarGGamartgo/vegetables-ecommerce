import { BUY_PRODUCT } from './productTypes'

export const buyProduct = (number =  1) => {
    return {
        type: BUY_PRODUCT,
        payload: number
    }
}