async function fetchRestaurants(page: number, limit: number, filters: any = {}) {
    // Build query string for filters
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
    });

    const response = await fetch(`https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/restaurants?${queryParams}`, {
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