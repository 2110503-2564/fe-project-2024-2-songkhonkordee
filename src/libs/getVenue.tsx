export default async function getVenue(id:string){
    await new Promise(resolve => setTimeout(resolve, 300)); // เพิ่ม delay 300ms
    
    const url = `https://a08-venue-explorer-backend.vercel.app/api/v1/venues/${id}`;

    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch venue`);
    }

    return await response.json();
}