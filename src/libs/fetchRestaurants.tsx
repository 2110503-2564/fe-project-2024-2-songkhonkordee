async function fetchRestaurants(page: number, limit: number, filters: any = {}) {
    // Build query string for filters
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
    });

    const response = await fetch(`http://213.136.76.41:5003/api/v1/restaurants?${queryParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
    }

    return await response.json();
}