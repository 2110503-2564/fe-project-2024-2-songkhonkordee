"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, Typography, Card } from "@mui/joy";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        telephone: "",
        email: "",
        password: "",
        role: "user",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        if (!formData.name.trim()) {
            return "กรุณากรอกชื่อ";
        }

        const telephoneRegex = /^(\+?[0-9]{1,4})?[0-9-]{6,14}$/;
        if (!telephoneRegex.test(formData.telephone)) {
            return "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อนุญาตให้มี + ข้างหน้า และตัวเลข 6-14 หลัก)";
        }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(formData.email)) {
            return "กรุณากรอกอีเมลที่ถูกต้อง";
        }

        if (formData.password.length < 6) {
            return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        }

        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await fetch("http://localhost:5003/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessages = Object.values(errorData.errors || {}).join(", ");
                throw new Error(errorMessages || "Registration failed!");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/api/auth/signin");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Card variant="outlined" sx={{ width: 400, padding: 3 }}>
                <Typography level="h4">Register</Typography>
                {error && <Typography color="danger">{error}</Typography>}
                {success && <Typography color="success">Registration Successful! Redirecting...</Typography>}

                <form onSubmit={handleSubmit}>
                    <Input name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} required sx={{ mb: 2 }} />
                    <Input name="telephone" placeholder="Telephone" onChange={handleChange} value={formData.telephone} required sx={{ mb: 2 }} />
                    <Input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required sx={{ mb: 2 }} />
                    <Input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} required sx={{ mb: 2 }} />
                    <Button type="submit" fullWidth>Register</Button>
                </form>
            </Card>
        </Box>
    );
}
