import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist' // imports from redux-persist
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = { // configuration object for redux-persist
  key: 'root',
  storage, // define which storage to use
}

const persistedReducer = persistReducer(persistConfig, rootReducer) // create a persisted reducer

// const store = createStore(rootReducer, composeWithDevTools(
//     persistedReducer, // pass the persisted reducer instead of rootReducer to createStore
//     applyMiddleware(logger, thunk),
//     // other store enhancers if any
// ))

const store = createStore(
  persistedReducer, // pass the persisted reducer instead of rootReducer to createStore
  applyMiddleware(logger, thunk),
  // other store enhancers if any
)

export const persistor = persistStore(store); // used to create the persisted store, persistor will be used in the next step

export default store