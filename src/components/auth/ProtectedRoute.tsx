/**
 * File: src/components/common/ProtectedRoute.tsx
 *
 * Description: Component that protects routes requiring authentication
 * by redirecting unauthenticated users to the login page
 *
 */

import { authLoadingAtom, isAuthenticatedAtom } from '@/store/authAtom';
import { Box, CircularProgress } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectPath?: string;
}

/**
 * Component that protects routes requiring authentication
 * Redirects unauthenticated users to the login page
 * Stores the attempted URL in location state for redirect after login
 */
export const ProtectedRoute = ({
    children,
    redirectPath = '/login',
}: ProtectedRouteProps) => {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const isLoading = useAtomValue(authLoadingAtom);
    const location = useLocation();

    // Show loading indicator while checking auth state
    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    // If not authenticated, redirect to login with the current path in state
    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectPath}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // If authenticated, render the protected route content
    return <>{children}</>;
};
