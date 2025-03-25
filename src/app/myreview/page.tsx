"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Input,
    Button,
    Stack,
    CircularProgress,
    Textarea,
    Alert
} from "@mui/joy";

interface Appointment {
    _id: string;
    apptDate: string;
    restaurant: {
        _id: string;
        name: string;
    };
}

interface Review {
    _id: string;
    rating: number;
    comment: string;
    restaurant: { _id: string; name?: string };
}

export default function MyBookingsPage() {
    const { data: session, status } = useSession();
    const token = session?.user.token;
    const [profile, setProfile] = useState<any>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [userReviews, setUserReviews] = useState<Record<string, Review>>({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (session?.user.token) {
            getUserProfile(session.user.token)
                .then((data) => setProfile(data))
                .catch((err) => console.error(err));
        }
    }, [session]);


    useEffect(() => {
        if (profile?.data.role === "user") {
            fetchBookings();
        }
    }, [profile]);

    const fetchBookings = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/appointments/", {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            });
            const data = await res.json();
            if (data.success) {
                setAppointments(data.data);
            } else {
                console.error("Failed to fetch appointments:", data.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
        setLoading(false);
    };

    const fetchUserReviews = async () => {
        if (!token) return;
        setIsRefreshing(true);
        try {
            // แก้ไข endpoint จาก user/reviews เป็น users/reviews ตามที่ API ใช้จริง
            const res = await fetch("https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/users/reviews", {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
                method: 'GET'
            });
            const data = await res.json();
            console.log("User reviews response:", data);

            if (data.success) {
                const reviewsMap: Record<string, Review> = {};
                data.data.forEach((review: Review) => {
                    reviewsMap[review.restaurant._id] = review;
                });
                setUserReviews(reviewsMap);
                console.log("Updated reviews map:", reviewsMap);
            } else {
                console.error("Failed to fetch user reviews:", data.message);
            }
        } catch (error) {
            console.error("Error fetching user reviews:", error);
        }
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (token) {
            fetchBookings();
            fetchUserReviews();
        }
    }, [token]);

    const handleReviewSubmit = async (restaurantId: string) => {
        if (!rating || rating < 1 || rating > 5) return alert("กรุณาให้คะแนนระหว่าง 1-5 ดาว");
        if (!comment) return alert("กรุณาใส่ความคิดเห็น");
        if (!token) return alert("กรุณาเข้าสู่ระบบก่อน");

        try {
            // ตรวจสอบว่าเป็นการสร้างหรือแก้ไขรีวิว
            const isEdit = userReviews[restaurantId] !== undefined;
            const url = isEdit
                ? `https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/reviews/${userReviews[restaurantId]._id}`
                : `https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/restaurants/${restaurantId}/reviews`;

            console.log("Submitting review to:", url);
            console.log("Review data:", { rating, comment });

            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, comment }),
                cache: 'no-store'
            });

            const data = await res.json();
            console.log("Review submission response:", data);

            if (data.success) {
                alert(isEdit ? "แก้ไขรีวิวสำเร็จ" : "เพิ่มรีวิวสำเร็จ");
                setReviewingId(null);
                setRating(null);
                setComment("");

                // รับข้อมูลรีวิวล่าสุดทันทีหลังจากเพิ่ม/แก้ไข
                setTimeout(() => fetchUserReviews(), 500); // เพิ่ม delay เล็กน้อยเพื่อให้แน่ใจว่า API ได้บันทึกข้อมูลเรียบร้อยแล้ว
            } else {
                alert(`ไม่สามารถ${isEdit ? "แก้ไข" : "เพิ่ม"}รีวิวได้: ${data.message}`);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("เกิดข้อผิดพลาดในการส่งรีวิว");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!token) return alert("กรุณาเข้าสู่ระบบก่อน");
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?")) return;

        try {
            const res = await fetch(`https://be-project-2024-2-songkhonkordee.vercel.app/api/v1/reviews/${reviewId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            });
            const data = await res.json();
            console.log("Delete review response:", data);

            if (data.success) {
                alert("ลบรีวิวสำเร็จ");

                // ค้นหา restaurant ID ของรีวิวที่ถูกลบ
                let deletedRestaurantId = null;
                for (const [restaurantId, review] of Object.entries(userReviews)) {
                    if (review._id === reviewId) {
                        deletedRestaurantId = restaurantId;
                        break;
                    }
                }

                // อัปเดต state โดยตรง
                if (deletedRestaurantId) {
                    const newReviews = { ...userReviews };
                    delete newReviews[deletedRestaurantId];
                    setUserReviews(newReviews);
                }

                // ดึงข้อมูลล่าสุดจาก API เพื่อให้แน่ใจว่ามีข้อมูลที่ถูกต้อง
                setTimeout(() => fetchUserReviews(), 500); // เพิ่ม delay เล็กน้อยเพื่อให้แน่ใจว่า API ได้ลบข้อมูลเรียบร้อยแล้ว
            } else {
                alert(`ไม่สามารถลบรีวิวได้: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("เกิดข้อผิดพลาดในการลบรีวิว");
        }
    };

    const handleEditReview = (restaurantId: string) => {
        if (userReviews[restaurantId]) {
            setReviewingId(restaurantId);
            setRating(userReviews[restaurantId].rating);
            setComment(userReviews[restaurantId].comment);
        }
    };

    // เพิ่มฟังก์ชันสำหรับการรีเฟรชทั้งหมด
    const refreshAllData = async () => {
        setIsRefreshing(true);
        try {
            await fetchUserReviews();
            await fetchBookings();
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
        setIsRefreshing(false);
    };

    if (status === "loading" || !profile) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (profile.data.role !== "user") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <Alert color="danger">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography level="h3" sx={{ mb: 3 }}>
                การจองของฉัน
            </Typography>
            {isRefreshing && (
                <Box sx={{ textAlign: "center", my: 2 }}>
                    <CircularProgress size="sm" /> <Typography level="body-sm" sx={{ ml: 1, display: "inline" }}>กำลังอัปเดตข้อมูล...</Typography>
                </Box>
            )}
            <Button
                onClick={refreshAllData}
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                disabled={isRefreshing}
            >
                รีเฟรชข้อมูลทั้งหมด
            </Button>

            {appointments.length === 0 ? (
                <Typography sx={{ textAlign: "center", mt: 4 }}>
                    คุณยังไม่มีการจองร้านอาหาร
                </Typography>
            ) : (
                <Stack spacing={3}>
                    {appointments.map((appt) => {
                        // ตรวจสอบว่ามีรีวิวของร้านอาหารนี้หรือไม่
                        const hasReview = Boolean(userReviews[appt.restaurant._id]);
                        return (
                            <Card key={appt._id} sx={{ p: 2 }}>
                                <CardContent>
                                    <Typography level="title-md">
                                        ร้าน: {appt.restaurant?.name}
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        วันที่จอง: {new Date(appt.apptDate).toLocaleString()}
                                    </Typography>
                                    {hasReview ? (
                                        <>
                                            <Box sx={{ mt: 2, p: 2, bgcolor: "background.level1", borderRadius: 'sm' }}>
                                                <Typography level="title-sm">รีวิวของคุณ</Typography>
                                                <Typography sx={{ mt: 1 }}>
                                                    คะแนน: {userReviews[appt.restaurant._id].rating} ดาว
                                                </Typography>
                                                <Typography sx={{ mt: 1 }}>
                                                    ความคิดเห็น: {userReviews[appt.restaurant._id].comment}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                                <Button
                                                    onClick={() => handleEditReview(appt.restaurant._id)}
                                                    variant="outlined"
                                                >
                                                    แก้ไขรีวิว
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    onClick={() => handleDeleteReview(userReviews[appt.restaurant._id]._id)}
                                                    variant="outlined"
                                                >
                                                    ลบรีวิว
                                                </Button>
                                            </Stack>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => setReviewingId(appt.restaurant._id)}
                                            sx={{ mt: 2 }}
                                        >
                                            เพิ่มรีวิว
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            {/* ฟอร์มสำหรับเพิ่มหรือแก้ไขรีวิว */}
            {reviewingId && (
                <Card sx={{ mt: 3, p: 3 }}>
                    <Typography level="h4" sx={{ mb: 2 }}>
                        {userReviews[reviewingId] ? "แก้ไขรีวิว" : "เพิ่มรีวิว"}
                    </Typography>
                    <Input
                        type="number"
                        value={rating ?? ""}
                        onChange={(e) => setRating(Number(e.target.value))}
                        placeholder="คะแนน (1-5)"
                        slotProps={{
                            input: {
                                min: 1,
                                max: 5
                            }
                        }}
                        sx={{ mb: 2, width: "100%" }}
                    />
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="ความคิดเห็น"
                        minRows={3}
                        sx={{ mb: 2, width: "100%" }}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={() => handleReviewSubmit(reviewingId)}
                            color="primary"
                        >
                            {userReviews[reviewingId] ? "บันทึกการแก้ไข" : "เพิ่มรีวิว"}
                        </Button>
                        <Button
                            onClick={() => {
                                setReviewingId(null);
                                setRating(null);
                                setComment("");
                            }}
                            color="neutral"
                            variant="outlined"
                        >
                            ยกเลิก
                        </Button>
                    </Stack>
                </Card>
            )}

            {/* แสดงข้อมูล Debug สำหรับการตรวจสอบ */}
            {process.env.NODE_ENV === 'development' && (
                <Card sx={{ mt: 3, p: 3 }}>
                    <Typography level="h4">Debug Info</Typography>
                    <Typography level="body-sm" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify({ userReviews }, null, 2)}
                    </Typography>
                </Card>
            )}
        </Box>
    );
}