
import { Link } from "@mui/material";

async function getRestaurant(id: string) {
    const res = await fetch(`http://localhost:5003/api/v1/restaurants/${id}`);
    const data = await res.json();
    return data;
}

export default async function RestaurantDetailPage({ params }: { params: { id: string } }) {
    const restaurantDetail = await getRestaurant(params.id);

    return (
        <main className='text-center p-5'>
            <h1 className='text-lg font-medium'>{restaurantDetail.data.name}</h1>
            <div className='flex flex-row my-5'>
                <div className='text-md mx-5 text-left'>
                    <div className='text-md mx-5'>Name: {restaurantDetail.data.name}</div>
                    <div className='text-md mx-5'>Address: {restaurantDetail.data.address}</div>
                    <div className='text-md mx-5'>District: {restaurantDetail.data.district}</div>
                    <div className='text-md mx-5'>Postal Code: {restaurantDetail.data.postalcode}</div>
                    <div className='text-md mx-5'>Tel: {restaurantDetail.data.telephone}</div>
                    <div className='text-md mx-5'>Open Time: {restaurantDetail.data.openTime}</div>
                    <div className='text-md mx-5'>Close Time: {restaurantDetail.data.closeTime}</div>
                    <div className='text-md mx-5'>Rating: {restaurantDetail.data.averageRating}</div>
                    <Link href={`/restaurant/${params.id}/appointments`}>
                        <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm">Make Reservation</button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
