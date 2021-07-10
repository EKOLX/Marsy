import { Dispatch } from "react";

import Photo from "../../models/Photo";

export type PhotosActionType = 'SET_PHOTOS' | 'SET_FAVORITE_PHOTO' | 'FAILED';

export interface PhotosAction {
    type: PhotosActionType;
    photos?: Array<Photo>;
    favoritePhoto?: Photo;
}

export const setPhotos = (page: number) =>
    async (dispatch: Dispatch<PhotosAction>) => {
        try {
            const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${page}&api_key=DEMO_KEY`);

            const payload = await response.json();
            const photos: Array<Photo> = [] = payload.photos.map((photo: any) => ({ id: photo.id, src: photo.img_src }));

            dispatch({ type: 'SET_PHOTOS', photos });
        } catch (err) {
            console.error("setPhotos error:", err);
            dispatch({ type: 'FAILED' });
        }
    };

export const addFavoritePhoto = (photo: Photo) =>
    async (dispatch: Dispatch<PhotosAction>) => {
        try {
            // Save to server
            dispatch({ type: 'SET_FAVORITE_PHOTO', favoritePhoto: photo });
        }
        catch (err) {
            console.error("setFavoritePhoto error:", err);
            dispatch({ type: 'FAILED' });
        }
    }