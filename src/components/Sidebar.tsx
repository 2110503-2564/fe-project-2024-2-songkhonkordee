"use client";

import React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HandymanIcon from '@mui/icons-material/Handyman';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Link from 'next/link';

import { closeSidebar } from './utils';

interface TogglerProps {
    defaultExpanded?: boolean;
    renderToggle: (params: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => React.ReactNode;
    children: React.ReactNode;
}

function Toggler({ defaultExpanded = false, renderToggle, children }: TogglerProps) {
    const [open, setOpen] = React.useState(defaultExpanded);
    return (
        <>
            {renderToggle({ open, setOpen })}
            <Box
                sx={[
                    {
                        display: 'grid',
                        transition: '0.2s ease',
                        '& > *': { overflow: 'hidden' },
                    },
                    open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
                ]}
            >
                {children}
            </Box>
        </>
    );
}

export default function SidebarContent({ session }: { session: any }) {
    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                p: 2,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <GlobalStyles styles={(theme) => ({
                ':root': {
                    '--Sidebar-width': '220px',
                    [theme.breakpoints.up('lg')]: { '--Sidebar-width': '240px' },
                },
            })} />
            <Box className="Sidebar-overlay" sx={{
                position: 'fixed',
                zIndex: 9998,
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                opacity: 'var(--SideNavigation-slideIn)',
                backgroundColor: 'var(--joy-palette-background-backdrop)',
                transition: 'opacity 0.4s',
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                    lg: 'translateX(-100%)',
                },
            }} onClick={() => closeSidebar()} />

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton variant="soft" color="primary" size="sm">
                    <BrightnessAutoRoundedIcon />
                </IconButton>
                <Typography level="title-lg">SongKhonKordee</Typography>
            </Box>

            <Box sx={{
                minHeight: 0,
                overflow: 'hidden auto',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                [`& .${listItemButtonClasses.root}`]: { gap: 1.5 },
            }}>
                <List size="sm" sx={{
                    gap: 1,
                    '--List-nestedInsetStart': '30px',
                    '--ListItem-radius': (theme) => theme.vars.radius.sm,
                }}>
                    <ListItem>
                        <ListItemButton component={Link} href="/">
                            <HomeRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Home</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} href="/restaurant">
                            <ApartmentIcon />
                            <ListItemContent>
                                <Typography level="title-sm">View Restaurant</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem nested>
                        <Toggler defaultExpanded renderToggle={({ open, setOpen }) => (
                            <ListItemButton onClick={() => setOpen(!open)}>
                                <AssignmentRoundedIcon />
                                <ListItemContent>
                                    <Typography level="title-sm">Booking</Typography>
                                </ListItemContent>
                                <KeyboardArrowDownIcon sx={[
                                    open ? { transform: 'rotate(180deg)' } : {},
                                ]} />
                            </ListItemButton>
                        )}>
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <ListItemButton component={Link} href="/mybooking">Own Booking</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component={Link} href="/myreview">Reviews</ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                    <ListItem nested>
                        <Toggler defaultExpanded renderToggle={({ open, setOpen }) => (
                            <ListItemButton onClick={() => setOpen(!open)}>
                                <HandymanIcon />
                                <ListItemContent>
                                    <Typography level="title-sm">Admin Tools</Typography>
                                </ListItemContent>
                                <KeyboardArrowDownIcon sx={[
                                    open ? { transform: 'rotate(180deg)' } : {},
                                ]} />
                            </ListItemButton>
                        )}>
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <ListItemButton component={Link} href="/admin/booking">View All Booking</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton component={Link} href="/admin/review">View All Reviews</ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                </List>
            </Box>
            <Divider />
            {session ? (
                <div>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Avatar variant="outlined" size="sm" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286" />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography level="title-sm">{session.user?.name ?? 'Anonymous'}</Typography>
                            <Typography level="body-xs">{session.user?.email ?? 'unknown@example.com'}</Typography>
                        </Box>
                    </Box>
                    <ListItemButton component="a" href="/api/auth/signout">
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <span>Log Out</span>
                            <LogoutRoundedIcon style={{ marginLeft: "auto" }} />
                        </Box>
                    </ListItemButton>
                </div>
            ) : (
                <div>
                    <ListItemButton component="a" href="/api/auth/signin">
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <span>Sign In</span>
                            <LoginIcon style={{ marginLeft: "auto" }} />
                        </Box>
                    </ListItemButton>

                    <ListItemButton component="a" href="/register">
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <span>Sign Up</span>
                            <PersonAddIcon style={{ marginLeft: "auto" }} />
                        </Box>
                    </ListItemButton>
                </div>
            )}
        </Sheet>
    );
}

