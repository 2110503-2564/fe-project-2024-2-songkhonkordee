"use client";

import { useState } from "react";
import { Button, Input, Box, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";  // ใช้ useRouter จาก next/navigation
import { useSession } from "next-auth/react"

export default function BookingPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const [apptDate, setApptDate] = useState<string>(new Date().toISOString().slice(0, 16));
    const [error, setError] = useState("");
    const router = useRouter();  // useRouter ควรอยู่ใน Client Component

    const userId = session?.user._id;
    const token = session?.user.token;  // แทนที่ด้วย Token ที่ได้รับจากการ Login
    // ฟังก์ชั่นในการส่งคำขอการจอง
    const handleBooking = async () => {

        if (!apptDate || !userId) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const requestData = {
            apptDate: apptDate,
            user: userId,
        };

        try {
            const res = await fetch(`https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/restaurants/${params.id}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            const data = await res.json();
            if (data.success) {
                alert("การจองสำเร็จ!");
                router.push(`/restaurant/${params.id}`); // ไปที่หน้าร้านอาหารหลังการจอง
            } else {
                setError("การจองล้มเหลว ไม่สามารถจองได้มากกว่า 3 ร้าน");
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการจอง");
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography level="h3" sx={{ marginBottom: 3 }}>
                จองโต๊ะที่ร้าน
            </Typography>

            <Box sx={{ marginBottom: 2 }}>
                <Typography sx={{ marginBottom: 1 }}>
                    User ID
                </Typography>
                <Input
                    fullWidth
                    value={userId}
                    disabled
                />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
                <Typography sx={{ marginBottom: 1 }}>
                    เลือกวันที่และเวลา
                </Typography>
                <Input
                    type="datetime-local"
                    fullWidth
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                />
            </Box>

            {error && (
                <Typography color="danger" sx={{ marginBottom: 2 }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ textAlign: "center" }}>
                <Button color="primary" onClick={handleBooking}>
                    ยืนยันการจอง
                </Button>
            </Box>
        </Box>
    );
}
