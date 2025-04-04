"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Box from "@mui/joy/Box";
import Link from "next/link";

interface Restaurant {
    _id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    telephone: string;
    openTime: string;
    closeTime: string;
    averageRating: number;
}

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const res = await fetch("https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/restaurants?page=1&limit=10000");
            const data = await res.json();
            if (data.success) {
                const sortedData = (data.data as Restaurant[]).sort(
                    (a, b) => b.averageRating - a.averageRating
                );
                setRestaurants(sortedData);
            }
        };
        fetchRestaurants();
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography level="h2" sx={{ mb: 3 }}>
                Restaurant List
            </Typography>
            <Grid container spacing={2}>
                {restaurants.map((restaurant) => (
                    <Grid xs={12} sm={6} md={4} lg={3} key={restaurant._id}>
                        <Card variant="outlined" sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography level="h4" sx={{ mb: 1 }}>
                                    {restaurant.name}
                                </Typography>
                                <Typography level="body-sm">
                                    Address: {restaurant.address}, {restaurant.district}, {restaurant.province}, {restaurant.postalcode}
                                </Typography>
                                <Typography level="body-sm">Tel: {restaurant.telephone}</Typography>
                                <Typography level="body-sm">
                                    Open: {restaurant.openTime} - {restaurant.closeTime}
                                </Typography>
                                <Typography level="body-sm">
                                    Rating: {restaurant.averageRating}
                                </Typography>
                                <Link href={`/restaurant/${restaurant._id}`} passHref>
                                    <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm mt-2">
                                        View Details
                                    </button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
