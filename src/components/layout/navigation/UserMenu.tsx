/**
 * File: src/components/layout/navigation/UserMenu.tsx
 *
 * Description: User menu component for authenticated users
 *
 */

import { useAuth } from '@/hooks/useAuth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Avatar,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

/**
 * Props for UserMenu component
 */
interface UserMenuProps {
    user: ReturnType<typeof useAuth>['user'];
    anchorEl: HTMLElement | null;
    handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    handleLogout: () => void;
}

/**
 * User menu component for authenticated users
 */
export const UserMenu = ({
    user,
    anchorEl,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
}: UserMenuProps) => (
    <>
        <Tooltip title="Account">
            <IconButton
                onClick={handleMenuOpen}
                sx={{
                    ml: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                    },
                }}
            >
                <Avatar
                    src={user?.photoURL || undefined}
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: 'small',
                    }}
                >
                    {user?.displayName?.[0] || (
                        <AccountCircleIcon fontSize="small" />
                    )}
                </Avatar>
            </IconButton>
        </Tooltip>

        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
            }}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
            }}
        >
            <MenuItem
                component={NavLink}
                to="/profile"
                onClick={handleMenuClose}
            >
                <ListItemIcon>
                    <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
            </MenuItem>
            <MenuItem
                component={NavLink}
                to="/settings"
                onClick={handleMenuClose}
            >
                <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    </>
);
