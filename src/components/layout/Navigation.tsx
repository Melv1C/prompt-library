/**
 * File: src/components/layout/Navigation.tsx
 *
 * Description: Modern responsive navigation component with improved styling and animations
 *
 */

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeSelector } from '../common/ThemeSelector';

// Navigation links with icons
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

// Navigation links
const navLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Prompts', path: '/prompts', icon: <AutoStoriesIcon /> },
    {
        name: 'My Library',
        path: '/my-library',
        icon: <CollectionsBookmarkIcon />,
    },
    { name: 'About', path: '/about', icon: <InfoIcon /> },
];

export function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Mobile navigation drawer
    const drawer = (
        <Box
            role="presentation"
            onClick={handleDrawerToggle}
            sx={{
                width: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Drawer header with close button */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    p: 1,
                }}
            >
                <IconButton onClick={handleDrawerToggle} edge="end">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            {/* Navigation items */}
            <List sx={{ flexGrow: 1, pt: 2 }}>
                {navLinks.map((link) => (
                    <ListItem key={link.name} disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={link.path}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                mx: 1,
                                '&.active': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: 'primary.main',
                                }}
                            >
                                {link.icon}
                            </ListItemIcon>
                            <ListItemText primary={link.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            {/* Theme selector and user section at bottom */}
            <Box
                sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                {/* Add theme selector to mobile drawer */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 1,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent drawer from closing when interacting with theme selector
                >
                    <ListItemText primary="Theme" />
                    <ThemeSelector />
                </Box>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AccountCircleIcon />}
                    component={NavLink}
                    to="/login"
                    sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1,
                    }}
                >
                    Sign In
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Desktop navigation */}
            {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {navLinks.map((link) => (
                        <Button
                            key={link.name}
                            component={NavLink}
                            to={link.path}
                            startIcon={link.icon}
                            sx={{
                                mx: 0.5,
                                px: 2,
                                py: 1,
                                borderRadius: '20px',
                                color: 'text.primary',
                                position: 'relative',
                                overflow: 'hidden',
                                textTransform: 'none',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    width: 0,
                                    height: '3px',
                                    backgroundColor: 'primary.main',
                                    transition: 'all 0.3s ease',
                                },
                                '&.active': {
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    '&::after': {
                                        width: '80%',
                                        left: '10%',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                    '&::after': {
                                        width: '80%',
                                        left: '10%',
                                    },
                                },
                            }}
                        >
                            {link.name}
                        </Button>
                    ))}

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    {/* Theme Selector */}
                    <ThemeSelector />

                    {/* User Account Button */}
                    <Tooltip title="Account">
                        <IconButton
                            sx={{
                                ml: 1,
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                                },
                            }}
                            component={NavLink}
                            to="/login"
                        >
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'primary.main',
                                    fontSize: 'small',
                                }}
                            >
                                <AccountCircleIcon fontSize="small" />
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Mobile navigation */}
            {isMobile && (
                <>
                    <IconButton
                        color="primary"
                        aria-label="open navigation menu"
                        edge="end"
                        onClick={handleDrawerToggle}
                    >
                        <Badge color="error" variant="dot" invisible={true}>
                            <MenuIcon />
                        </Badge>
                    </IconButton>
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        anchor="right"
                        sx={{
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                            },
                            '& .MuiBackdrop-root': {
                                backdropFilter: 'blur(3px)',
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </>
            )}
        </>
    );
}
