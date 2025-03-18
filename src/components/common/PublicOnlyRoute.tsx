/**
 * File: src/components/common/PublicOnlyRoute.tsx
 *
 * Description: Component that restricts authenticated users from accessing
 * public-only routes like login and register pages by redirecting them
 * to a specified path (typically profile or home page)
 *
 */

import { authLoadingAtom, isAuthenticatedAtom } from '@/store/authAtom';
import { Box, CircularProgress } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Navigate } from 'react-router-dom';

interface PublicOnlyRouteProps {
    children: React.ReactNode;
    redirectPath?: string;
}

/**
 * Component that prevents authenticated users from accessing certain routes
 * Redirects authenticated users to the specified path (default: '/profile')
 * Used for pages like login and register that shouldn't be accessible when logged in
 */
export const PublicOnlyRoute = ({
    children,
    redirectPath = '/profile',
}: PublicOnlyRouteProps) => {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const isLoading = useAtomValue(authLoadingAtom);

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

    // If authenticated, redirect to the specified path
    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // If not authenticated, render the public route content
    return <>{children}</>;
};
