import { 
    UPDATE_CARD_PRODUCTS,
    DOWNLOAD_CARD_PRODUCTS,
    FILTER_CARD_PRODUCTS,
 } from './cardTypes'

export const updateCardProducts = (products) => {
    return {
        type: UPDATE_CARD_PRODUCTS,
        payload: products
    }
}

export const downloadCardProducts = (downloads) => {
    return {
        type: DOWNLOAD_CARD_PRODUCTS,
        payload: downloads
    }
}

export const filterCards = (folio) => {
    return {
        type: FILTER_CARD_PRODUCTS,
        payload: folio
    }
}
