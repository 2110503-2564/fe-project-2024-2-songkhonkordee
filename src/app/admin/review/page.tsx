"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    CircularProgress,
    Textarea,
    Select,
    Option,
    Alert
} from "@mui/joy";

interface Review {
    _id: string;
    rating: number;
    comment: string;
    user: { name: string; email: string };
    restaurant: { name: string };
}

export default function AdminManageReviews() {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedComment, setEditedComment] = useState("");
    const [editedRating, setEditedRating] = useState<number>(0);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (session?.user.token) {
            getUserProfile(session.user.token)
                .then((data) => setProfile(data))
                .catch((err) => console.error(err));
        }
    }, [session]);


    useEffect(() => {
        if (profile?.data.role === "admin") {
            fetchReviews();
        }
    }, [profile]);

    const fetchReviews = async () => {
        if (!session?.user.token) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5003/api/v1/reviews", {
                headers: { Authorization: `Bearer ${session.user.token}` },
            });
            const data = await res.json();
            setReviews(data.data);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (session?.user.token) fetchReviews();
    }, [session]);

    const handleDelete = async (id: string) => {
        if (!confirm("คุณต้องการลบรีวิวนี้ใช่หรือไม่?")) return;
        try {
            await fetch(`http://localhost:5003/api/v1/reviews/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session?.user.token}` },
            });
            alert("ลบรีวิวสำเร็จ");
            fetchReviews();
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการลบ");
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editedComment || editedRating === 0) {
            return alert("กรุณาใส่ความคิดเห็นและเลือกคะแนน");
        }

        try {
            console.log("Updating review with ID:", id);
            console.log("Sending data:", { comment: editedComment, rating: editedRating });

            const res = await fetch(`http://localhost:5003/api/v1/reviews/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({ comment: editedComment, rating: editedRating }),
            });

            const data = await res.json();
            console.log("Response data:", data);

            if (res.ok) {
                alert("อัปเดตรีวิวสำเร็จ");
                setEditingId(null);
                fetchReviews(); // โหลดข้อมูลใหม่
            } else {
                alert(`เกิดข้อผิดพลาด: ${data.message || "ไม่สามารถอัปเดตได้"}`);
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการอัปเดต");
            console.error("Update error:", err);
        }
    };

    if (status === "loading" || !profile) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (profile.data.role !== "admin") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <Alert color="danger">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography level="h3" sx={{ mb: 3 }}>
                จัดการรีวิวทั้งหมด (Admin)
            </Typography>
            {loading ? (
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Stack spacing={3}>
                    {reviews.map((review) => (
                        <Card key={review._id} sx={{ p: 2 }}>
                            <CardContent>
                                <Typography level="title-md">
                                    ร้าน: {review.restaurant.name}
                                </Typography>
                                <Typography>
                                    ผู้ใช้: {review.user.name} ({review.user.email})
                                </Typography>
                                {editingId === review._id ? (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography>คะแนน:</Typography>
                                        <Select
                                            defaultValue={review.rating}
                                            onChange={(event, value) => setEditedRating(value as number)}
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <Option key={num} value={num}>
                                                    {num} ดาว
                                                </Option>
                                            ))}
                                        </Select>

                                        <Typography sx={{ mt: 2 }}>ความคิดเห็น:</Typography>
                                        <Textarea
                                            fullWidth
                                            defaultValue={review.comment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                        />

                                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                            <Button onClick={() => handleUpdate(review._id)}>
                                                บันทึก
                                            </Button>
                                            <Button
                                                color="danger"
                                                variant="soft"
                                                onClick={() => setEditingId(null)}
                                            >
                                                ยกเลิก
                                            </Button>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <>
                                        <Typography sx={{ mt: 1 }}>คะแนน: {review.rating} ดาว</Typography>
                                        <Typography sx={{ mt: 1 }}>ความคิดเห็น: {review.comment}</Typography>
                                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                            <Button
                                                onClick={() => {
                                                    setEditingId(review._id);
                                                    setEditedComment(review.comment);
                                                    setEditedRating(review.rating);
                                                }}
                                            >
                                                แก้ไข
                                            </Button>
                                            <Button color="danger" variant="soft" onClick={() => handleDelete(review._id)}>
                                                ลบ
                                            </Button>
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
