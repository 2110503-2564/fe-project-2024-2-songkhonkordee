"use client";

import * as React from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import { Dayjs } from "dayjs";

interface DateReserveProps {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
}

const DateReserve: React.FC<DateReserveProps> = ({ value, onChange }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Select Date"
                value={value}
                onChange={onChange}
                slotProps={{ textField: { fullWidth: true } }}
            />
        </LocalizationProvider>
    );
};

export default DateReserve;
