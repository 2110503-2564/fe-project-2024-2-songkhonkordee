export default async function getVenues(venueId?: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const url = `https://a08-venue-explorer-backend.vercel.app/api/v1/venues`;

    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch venue${venueId ? ` with ID: ${venueId}` : "s"}`);
    }

    return await response.json();
}
