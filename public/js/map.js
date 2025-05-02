async function geocodeLocation(location, country) {
    const query = encodeURIComponent(location + ', ' + country);
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    console.log("Nominatim URL:", nominatimUrl);

    try {
        const response = await fetch(nominatimUrl); // Native fetch is available
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        } else {
            console.error(`Geocoding failed for: ${location}, ${country}`);
            return null;
        }
    } catch (error) {
        console.error('Error during geocoding:', error);
        return null;
    }
}

module.exports = { geocodeLocation };