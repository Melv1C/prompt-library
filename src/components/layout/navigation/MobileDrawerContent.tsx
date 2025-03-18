/**
 * File: src/components/layout/navigation/MobileDrawerContent.tsx
 *
 * Description: Component that renders the content of the mobile drawer
 *
 */

import { ThemeSelector } from '@/components/common/ThemeSelector';
import { UserType } from '@/types';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { navLinks } from './navLinks';

/**
 * Props for MobileDrawerContent component
 */
interface MobileDrawerContentProps {
    user: UserType | null;
    isAuthenticated: boolean;
    handleDrawerToggle: () => void;
    handleLogout: () => void;
}

/**
 * Mobile drawer content component - contains navigation links, theme selector, and auth controls
 */
export const MobileDrawerContent = ({
    user,
    isAuthenticated,
    handleDrawerToggle,
    handleLogout,
}: MobileDrawerContentProps) => (
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
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Theme selector */}
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

            {/* User section - enhanced to match desktop navigation */}
            <Box onClick={(e) => e.stopPropagation()}>
                {!isAuthenticated || !user ? (
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<LoginIcon />}
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
                ) : (
                    <Box sx={{ width: '100%' }}>
                        {/* User profile header */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                                px: 1,
                            }}
                        >
                            <Avatar
                                src={user?.photoURL || undefined}
                                sx={{ width: 32, height: 32, mr: 1.5 }}
                            >
                                {user?.displayName?.[0] || 'U'}
                            </Avatar>
                            <Typography variant="subtitle1" noWrap>
                                {user?.displayName || user?.email || 'User'}
                            </Typography>
                        </Box>

                        {/* User menu options - similar to desktop */}
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/profile"
                                    sx={{ borderRadius: 1 }}
                                >
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/settings"
                                    sx={{ borderRadius: 1 }}
                                >
                                    <ListItemIcon>
                                        <SettingsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItemButton>
                            </ListItem>

                            <Divider sx={{ my: 1 }} />

                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={handleLogout}
                                    sx={{ borderRadius: 1 }}
                                >
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                )}
            </Box>
        </Box>
    </Box>
);
