import Photo from "../../models/Photo";
import { PhotosAction } from "../actions/photosAction";

interface PhotosState {
    photos: Array<Photo>;
    favoritesPhotos: Array<Photo>;
}
const initialState: PhotosState = {
    photos: [], favoritesPhotos: []
}

export const photosReducer = (state: PhotosState = initialState, action: PhotosAction): PhotosState => {
    switch (action.type) {
        case 'SET_PHOTOS':
            return { ...state, photos: action.photos! };
        case 'SET_FAVORITE_PHOTO':
            const updatedFavorites: Array<Photo> = [...state.favoritesPhotos, action.favoritePhoto!];
            return { ...state, favoritesPhotos: updatedFavorites };
        case 'FAILED':
            return initialState;
        default: return state;
    }
};