import { createStore, applyMiddleware } from "redux";
import ReduxThunk from 'redux-thunk';

import { rootReducer } from "./AppState";

const configureStore = () => createStore(rootReducer, applyMiddleware(ReduxThunk));

export default configureStore;