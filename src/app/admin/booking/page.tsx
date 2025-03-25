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
  Alert,
} from "@mui/joy";

interface Appointment {
  _id: string;
  apptDate: string;
  restaurant: {
    name: string;
  };
  user: {
    name: string;
    email: string;
  };
}

export default function AdminViewAllBookings() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    if (session?.user.token) {
      getUserProfile(session.user.token)
        .then((data) => setProfile(data))
        .catch((err) => console.error(err));
    }
  }, [session]);

  const fetchBookings = async () => {
    if (!session?.user.token) return;
    setLoading(true);
    try {
      const res = await fetch("http://213.136.76.41:5003/api/v1/appointments/", {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      const data = await res.json();
      setAppointments(data.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile?.data.role === "admin") {
      fetchBookings();
    }
  }, [profile]);

  const handleUpdate = async (id: string) => {
    if (!newDate) return alert("กรุณาเลือกวันและเวลาใหม่");
    try {
      const res = await fetch(
        `http://213.136.76.41:5003/api/v1/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ apptDate: newDate }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("อัปเดตสำเร็จ");
        setEditingId(null);
        fetchBookings();
      } else {
        alert("ไม่สามารถอัปเดตได้");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบการจองนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(
        `http://213.136.76.41:5003/api/v1/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("ลบสำเร็จ");
        fetchBookings();
      } else {
        alert("ลบไม่สำเร็จ");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบ");
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
        การจองทั้งหมด (Admin)
      </Typography>
      <Stack spacing={3}>
        {appointments.map((appt) => (
          <Card key={appt._id} sx={{ p: 2 }}>
            <CardContent>
              <Typography level="title-md">
                ร้าน: {appt.restaurant?.name}
              </Typography>
              <Typography>
                ผู้จอง: {appt.user.name} ({appt.user.email})
              </Typography>
              <Typography sx={{ mt: 1 }}>
                วันที่จอง: {new Date(appt.apptDate).toLocaleString()}
              </Typography>
              {editingId === appt._id ? (
                <Box sx={{ mt: 2 }}>
                  <Input
                    type="datetime-local"
                    fullWidth
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button onClick={() => handleUpdate(appt._id)}>
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
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button onClick={() => setEditingId(appt._id)}>
                    แก้ไข
                  </Button>
                  <Button
                    color="danger"
                    variant="soft"
                    onClick={() => handleDelete(appt._id)}
                  >
                    ลบ
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
