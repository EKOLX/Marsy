import { Dispatch } from "react"

export const setPhotos = (page: number) =>
    async (dispatch: Dispatch<any>) => {
        try {
            const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${page}&api_key=DEMO_KEY`);

            const payload = await response.json();
            console.log(payload);
        } catch (err) {
            console.error(err);
        }
    };