/**
 * File: src/components/layout/navigation/DesktopNavLinks.tsx
 *
 * Description: Component that renders navigation links for desktop view
 *
 */

import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { navLinks } from './navLinks';

/**
 * Desktop navigation links component - renders horizontal buttons with underline effects
 */
export const DesktopNavLinks = () => (
    <>
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
    </>
);
