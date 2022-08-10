import {useEffect, useState} from "react";


export const useGeoData = () => {

    const [coord, setCoord] = useState(null)

    useEffect(() => {

        navigator.geolocation.getCurrentPosition(
        ( position ) => {
            setCoord({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
            },
        () => {
            console.log('Местоположение не определено или отключена геолокация в вашем устройстве');
            }
        )

    }, [])


    return {coord}
}
