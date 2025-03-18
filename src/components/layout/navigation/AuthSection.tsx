/**
 * File: src/components/layout/navigation/AuthSection.tsx
 *
 * Description: Authentication section component showing either login button or user menu
 *
 */

import { UserType } from '@/types';
import { SignInButton } from './SignInButton';
import { UserMenu } from './UserMenu';

/**
 * Props for AuthSection component
 */
interface AuthSectionProps {
    user: UserType | null;
    isAuthenticated: boolean;
    anchorEl: HTMLElement | null;
    handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    handleLogout: () => void;
}

/**
 * Authentication section component - shows either login button or user menu
 * based on authentication status
 */
export const AuthSection = ({
    user,
    isAuthenticated,
    anchorEl,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
}: AuthSectionProps) => {
    // Ensure we're showing the user menu when user is authenticated AND we have user data
    return isAuthenticated && user ? (
        <UserMenu
            user={user}
            anchorEl={anchorEl}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
            handleLogout={handleLogout}
        />
    ) : (
        <SignInButton />
    );
};
