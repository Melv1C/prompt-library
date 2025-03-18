/**
 * File: src/components/layout/navigation/SignInButton.tsx
 *
 * Description: Sign-in button component for unauthenticated users
 *
 */

import LoginIcon from '@mui/icons-material/Login';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

/**
 * Sign-in button component for unauthenticated users
 * More prominent than just an icon to make authentication status clear
 */
export const SignInButton = () => (
    <Button
        variant="contained"
        color="primary"
        startIcon={<LoginIcon />}
        component={NavLink}
        to="/login"
        sx={{
            borderRadius: '20px',
            textTransform: 'none',
            px: 2,
            boxShadow: 2,
            fontWeight: 'medium',
            '&:hover': {
                boxShadow: 4,
            },
        }}
    >
        Sign In
    </Button>
);
