/**
 * File: src/components/layout/Navigation.tsx
 *
 * Description: Modern responsive navigation component with improved styling and animations
 *
 */

import { ThemeSelector } from '@/components/common/ThemeSelector';
import { useAuth } from '@/hooks/useAuth';
import { Box, Divider, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { AuthSection } from './navigation/AuthSection';
import { DesktopNavLinks } from './navigation/DesktopNavLinks';
import { MobileNavigation } from './navigation/MobileNavigation';

/**
 * Main navigation component - manages auth state and renders either desktop or mobile navigation
 * Components have been split into separate files for better maintainability
 */
export function Navigation() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
    };

    return (
        <>
            {/* Desktop navigation */}
            {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {/* Navigation Links */}
                    <DesktopNavLinks />

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    {/* Theme Selector */}
                    <ThemeSelector />

                    {/* User Account Section - shows either login button or user menu */}
                    <AuthSection
                        user={user}
                        isAuthenticated={isAuthenticated}
                        anchorEl={anchorEl}
                        handleMenuOpen={handleMenuOpen}
                        handleMenuClose={handleMenuClose}
                        handleLogout={handleLogout}
                    />
                </Box>
            )}

            {/* Mobile navigation */}
            {isMobile && (
                <MobileNavigation
                    user={user}
                    isAuthenticated={isAuthenticated}
                    mobileOpen={mobileOpen}
                    handleDrawerToggle={handleDrawerToggle}
                    handleLogout={handleLogout}
                />
            )}
        </>
    );
}
