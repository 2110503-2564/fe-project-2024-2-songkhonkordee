'use client'
import { useReducer, useState } from 'react'
import Card from "@/components/Card";
import Link from 'next/link';
import getVenues from '@/libs/getVenues';
import { useEffect } from 'react';

export default function CardPanel() {

    const [venueResponse, setVenueResponse] = useState(null)
    useEffect(()=>{
        const fetchData = async () => {
            const venues = await getVenues()
            setVenueResponse(venues)
        }
        fetchData()
    }, [])

    const CardReducer = (venueList: Map<string, number>, action: { type: string, venueName: string, rating?: number }) => {
        let defaultVenue = new Map<string, number>([
            ["The Bloom Pavilion", 0],
            ["Spark Space", 0],
            ["The Grand Table", 0]
        ]);
        switch (action.type) {
            case 'add': {
                const newVenueList = new Map(venueList);
                newVenueList.set(action.venueName, action.rating ?? 0);
                return newVenueList;
            }
            case 'remove': {
                const newVenueList = new Map(venueList);
                newVenueList.delete(action.venueName);
                return newVenueList;
            }
            default: return defaultVenue
        }
    }
    const [venueList, dispatchVenue] = useReducer(CardReducer, new Map<string, number>([
        ["The Bloom Pavilion", 0],
        ["Spark Space", 0],
        ["The Grand Table", 0]
    ]))

    /* Mock Data */
    
    const mockVenue = [
        {vid:'001', name: 'The Bloom Pavilion', image: '/img/bloom.jpg'},
        {vid:'002', name: 'Spark Space', image: '/img/sparkspace.jpg'},
        {vid:'003', name: 'The Grand Table', image: '/img/grandtable.jpg'}
    ] 

    if(!venueResponse) return (<p>Venue Panel is Loading ...</p>)

    return (
        <div>
            <div style={{ margin: "20px", display: "flex", flexDirection: "row", alignContent: "space-around", justifyContent: "space-around", flexWrap: "wrap" }}>
                {
                    mockVenue.map((venueItem)=>(
                        <Link href={`/venue/${venueItem.vid}`} className = 'w-1/5'>
                        <Card venueName={venueItem.name} imgSrc={venueItem.image} onCompare={(card: string, rating: number) => dispatchVenue({ type: 'add', venueName: card, rating: rating })} />
                        </Link>
                    ))
                }
            </div>
            <div className='w-full text-xl font-medium'>Venue List with Ratings : {venueList.size}</div>
            {Array.from(venueList).map(([venueName, rating]) => <div key={venueName} data-testid={venueName} onClick={() => dispatchVenue({ type: 'remove', venueName: venueName })}>{venueName} : {rating}</div>)}
        </div>
    )
}