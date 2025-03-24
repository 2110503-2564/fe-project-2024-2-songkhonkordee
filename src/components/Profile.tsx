"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getUserProfile from "@/libs/getUserProfile";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import Alert from "@mui/joy/Alert";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

export default function MyProfile() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user.token) {
            getUserProfile(session.user.token)
                .then((data) => setProfile(data))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [session]);

    if (status === "loading" || loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!session || !profile) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Alert severity="warning">You are not logged in.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 1, width: "100%" }}>
            <Stack
                spacing={4}
                sx={{
                    display: "flex",
                    maxWidth: "800px",
                    mx: "auto",
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Personal info</Typography>
                    </Box>
                    <Divider />
                    <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" }, my: 1 }}>
                        <Stack direction="column" spacing={1}>
                            <AspectRatio
                                ratio="1"
                                maxHeight={200}
                                sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
                            >
                                <img
                                    src={"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"}
                                    alt="User Avatar"
                                    loading="lazy"
                                />
                            </AspectRatio>
                        </Stack>
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            <Stack spacing={1}>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input size="sm" placeholder="Name" disabled defaultValue={profile.data.name} />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <FormControl>
                                    <FormLabel>Role</FormLabel>
                                    <Input size="sm" disabled value={profile.data.role} />
                                </FormControl>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        size="sm"
                                        type="email"
                                        startDecorator={<EmailRoundedIcon />}
                                        placeholder="email"
                                        defaultValue={profile.data.email}
                                        disabled
                                        sx={{ flexGrow: 1 }}
                                    />
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
        </Box>
    );
}
