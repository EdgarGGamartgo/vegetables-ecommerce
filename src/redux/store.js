import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(logger, thunk),
    // other store enhancers if any
  ))

export default store