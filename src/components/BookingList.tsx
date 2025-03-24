"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppSelector } from "@/redux/store";
import { getBookings, removeBooking } from "@/redux/features/bookSlice";

const BookingList: React.FC = () => {
    const dispatch = useDispatch();
    const bookings = useSelector((rootState: RootState) => getBookings(rootState).bookItems);

    return (
        <div>
            <h2 className="text-xl font-semibold text-black">My Bookings</h2> { }
            {bookings.length === 0 ? (
                <p className="text-black">No Venue Booking</p>
            ) : (
                <ul>
                    {bookings.map((booking, index) => (
                        <li key={index} className="text-black">
                            {booking.nameLastname} - {booking.venue} - {booking.bookDate}
                            <button
                                onClick={() =>
                                    dispatch(removeBooking(booking))
                                }
                                className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                            >
                                Cancel
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingList;
