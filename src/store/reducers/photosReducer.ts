import Photo from "../../models/Photo";
import { PhotosAction } from "../actions/photosAction";

interface PhotosState {
    photos: Array<Photo>;
}
const initialState = {
    photos: []
}

export const photosReducer = (state: PhotosState = initialState, action: PhotosAction): PhotosState => {
    switch (action.type) {
        case 'SET_PHOTOS':
            return { photos: action.photos! };
        case 'FAILED':
            return initialState;
        default: return state;
    }
};