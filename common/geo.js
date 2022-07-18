var requestOptions = {
    method: 'GET',
  };
  
  

const getCoordinates = async (placeName) => {
    const result = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURI(placeName)}&apiKey=${process.env.GEOAPIFY_API_KEY}`, requestOptions).then(response => response.json())
    //.then(result => console.log(result))
    //.catch(error => console.log('error', error));
    return result.features?.map(res => ({
        latitude: res.properties.lat,
        longitude: res.properties.lon,
        name: res.properties.formatted
    })) || []
}

export {
    getCoordinates
}