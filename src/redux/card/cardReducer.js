import { 
    UPDATE_CARD_PRODUCTS,
    DOWNLOAD_CARD_PRODUCTS,
    FILTER_CARD_PRODUCTS,
 } from './cardTypes'

const initialState = {
    products: 0,
    downloads: 0,
    folio: ''
}

const cardReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_CARD_PRODUCTS: 
        
        return {
            ...state,
            products: Number(state.products) + Number(action.payload)
            //products: [...state.products, ...action.payload]
        }

        case DOWNLOAD_CARD_PRODUCTS: 
        
        return {
            ...state,
            downloads: Number(state.downloads) + Number(action.payload)
        }

        case FILTER_CARD_PRODUCTS: 
        
        return {
            ...state,
            folio: action.payload
        }

        default: return state
    }
}

export default cardReducer