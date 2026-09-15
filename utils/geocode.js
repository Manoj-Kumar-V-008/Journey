const geocode = async (location, country) => {
    const query = `${location}, ${country}`;

    const params = new URLSearchParams({
        text: query,
        format: "json",
        limit: "1",
        apiKey: process.env.GEOAPIFY_API_KEY
    });

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?${params}`
    );

    if (!response.ok) {
        throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`Could not find location: ${query}`);
    }

    const result = data.results[0];

    return {
        lat: result.lat,
        lng: result.lon
    };
};

module.exports = geocode;