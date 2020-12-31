import { BUY_PRODUCT, SET_STORE } from './productTypes'

export const buyProduct = (number =  1) => {
    return {
        type: BUY_PRODUCT,
        payload: number
    }
}

export const settingStore = (store =  []) => {
    return {
        type: SET_STORE,
        payload: store
    }
}