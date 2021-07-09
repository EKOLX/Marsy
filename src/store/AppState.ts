import { combineReducers } from "redux";
import { photosReducer } from "./reducers/photosReducer";

export const rootReducer = combineReducers({
    photosList: photosReducer
});

export type AppState = ReturnType<typeof rootReducer>;