/**
 * File: src/components/common/ThemeSelector.tsx
 *
 * Description: A theme selector component that allows users to switch between
 * light, dark, and system themes via a dropdown menu.
 */

import { setThemeAtom, themeAtom, ThemeMode } from '@/store/themeAtom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import {
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';

export function ThemeSelector() {
    const [theme] = useAtom(themeAtom);
    const setTheme = useSetAtom(setThemeAtom);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeChange = (newTheme: ThemeMode) => {
        setTheme(newTheme);
        handleClose();
    };

    // Get the appropriate icon based on current theme
    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <LightModeIcon />;
            case 'dark':
                return <DarkModeIcon />;
            case 'system':
                return <SettingsBrightnessIcon />;
            default:
                return <SettingsBrightnessIcon />;
        }
    };

    return (
        <>
            <Tooltip title="Theme settings">
                <IconButton
                    onClick={handleClick}
                    size="medium"
                    aria-controls={open ? 'theme-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    color="inherit"
                    sx={{
                        // Improve contrast in dark mode
                        color: 'text.primary',
                        borderRadius: '50%',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    {getThemeIcon()}
                </IconButton>
            </Tooltip>
            <Menu
                id="theme-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'theme-button',
                    dense: true,
                }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: '170px',
                        mt: 1,
                        // Ensure proper background color in dark mode
                        backgroundColor: 'background.paper',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 1 }}>
                    <MenuItem
                        onClick={() => handleThemeChange('light')}
                        selected={theme === 'light'}
                    >
                        <ListItemIcon>
                            <LightModeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Light</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleThemeChange('dark')}
                        selected={theme === 'dark'}
                    >
                        <ListItemIcon>
                            <DarkModeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Dark</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleThemeChange('system')}
                        selected={theme === 'system'}
                    >
                        <ListItemIcon>
                            <SettingsBrightnessIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>System</ListItemText>
                    </MenuItem>
                </Box>
            </Menu>
        </>
    );
}
