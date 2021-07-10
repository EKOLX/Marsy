import { Dispatch } from "react";

import Photo from "../../models/Photo";

export type PhotosActionType = 'SET_PHOTOS' | 'ADD_FAVORITE_PHOTO' | 'REMOVE_FAVORITE_PHOTO' | 'FAILED';

export interface PhotosAction {
    type: PhotosActionType;
    photos?: Array<Photo>;
    favoritePhoto?: Photo;
    removePhotoId?: number;
}

export const setPhotos = (page: number) =>
    async (dispatch: Dispatch<PhotosAction>) => {
        try {
            const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${page}&api_key=DEMO_KEY`);

            const payload = await response.json();

            if (response.ok) {
                const photos: Array<Photo> = [] = payload.photos.map((photo: any) => ({ id: photo.id, src: photo.img_src }));

                dispatch({ type: 'SET_PHOTOS', photos });
            }
            else {
                console.log(payload);
                dispatch({ type: 'FAILED' });
            }
        } catch (err) {
            console.error("setPhotos error:", err);
            dispatch({ type: 'FAILED' });
        }
    };

export const addFavoritePhoto = (photo: Photo) =>
    async (dispatch: Dispatch<PhotosAction>) => {
        try {
            // Save to server
            dispatch({ type: 'ADD_FAVORITE_PHOTO', favoritePhoto: photo });
        }
        catch (err) {
            console.error("setFavoritePhoto error:", err);
            dispatch({ type: 'FAILED' });
        }
    };

export const removeFavoritePhoto = (photoId: number) =>
    async (dispatch: Dispatch<PhotosAction>) => {
        try {
            // Remove from server
            dispatch({ type: 'REMOVE_FAVORITE_PHOTO', removePhotoId: photoId });
        } catch (err) {
            console.error("removeFavoritePhoto error:", err);
            dispatch({ type: 'FAILED' });
        }
    };