/**
 * File: src/components/layout/navigation/MobileNavigation.tsx
 *
 * Description: Mobile navigation component with drawer
 *
 */

import { UserType } from '@/types';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge, Drawer, IconButton } from '@mui/material';
import { MobileDrawerContent } from './MobileDrawerContent';

/**
 * Props for MobileNavigation component
 */
interface MobileNavigationProps {
    user: UserType | null;
    isAuthenticated: boolean;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    handleLogout: () => void;
}

/**
 * Mobile navigation component - handles the drawer and toggle button
 */
export const MobileNavigation = ({
    user,
    isAuthenticated,
    mobileOpen,
    handleDrawerToggle,
    handleLogout,
}: MobileNavigationProps) => (
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
            <MobileDrawerContent
                user={user}
                isAuthenticated={isAuthenticated}
                handleDrawerToggle={handleDrawerToggle}
                handleLogout={handleLogout}
            />
        </Drawer>
    </>
);
