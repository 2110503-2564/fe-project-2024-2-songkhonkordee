// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { BookingItem } from "../../../interface";

// type BookState = {
//   bookItems: BookingItem[];
// };

// const initialState: BookState = { bookItems: [] };

// export const bookSlice = createSlice({
//   name: "book",
//   initialState,
//   reducers: {
//     addBooking: (state, action: PayloadAction<BookingItem>) => {
//       state.bookItems.push(action.payload);
//     },
//     removeBooking: (state, action: PayloadAction<BookingItem>) => {
//       const remainItems = state.bookItems.filter((obj) => {
//         return (
//           obj.bookModel !== action.payload.bookModel ||
//           obj.pickupDate !== action.payload.pickupDate ||
//           obj.returnDate !== action.payload.returnDate
//         );
//       });
//       state.bookItems = remainItems;
//     },
//   },
// });

// export const { addBooking, removeBooking } = bookSlice.actions;

// export default bookSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface BookingItem {
  nameLastname: string;
  tel: string;
  venue: string;
  bookDate: string;
}

interface BookState {
  bookItems: BookingItem[];
}

const initialState: BookState = {
  bookItems: [],
};

export const bookSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      const index = state.bookItems.findIndex(
        (item) =>
          item.venue === action.payload.venue &&
          item.bookDate === action.payload.bookDate
      );

      if (index !== -1) {
        state.bookItems[index] = action.payload;
      } else {
        state.bookItems.push(action.payload);
      }
    },
    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      state.bookItems = state.bookItems.filter(
        (item) =>
          item.venue !== action.payload.venue ||
          item.bookDate !== action.payload.bookDate
      );
    },
  },
});

export const { addBooking, removeBooking } = bookSlice.actions;
export const getBookings = (state: RootState) => state.bookSlice;
export default bookSlice.reducer;
