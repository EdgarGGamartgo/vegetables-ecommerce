import React from 'react'

const CartContext = React.createContext()

const CartProvider = CartContext.Provider
const CartConsumer = CartContext.Consumer

export { CartProvider, CartContext }