import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/reducers';

const middlewares = [ReduxThunk];

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,// default state of the application
    compose(applyMiddleware(...middlewares)),
  );
}
