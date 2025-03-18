/**
 * File: src/hooks/useAuth.ts
 *
 * Description: Custom hook for managing authentication state and operations
 * without initializing auth listener (now handled by AuthProvider)
 *
 */

import {
    fetchUserData,
    firebaseUserToUser,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logoutUser,
    registerWithEmailAndPassword,
    resetPassword,
} from '@/services/authService';
import {
    authLoadingAtom,
    isAuthenticatedAtom,
    userAtom,
} from '@/store/authAtom';
import { UserType } from '@/types/user';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook that provides authentication state and methods
 * for authentication operations like login, logout, etc.
 */
export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const isLoading = useAtomValue(authLoadingAtom);
    const navigate = useNavigate();
    const location = useLocation();

    // Function to update user data after auth operations if needed
    const updateUserData = useCallback(
        async (userId: string) => {
            try {
                const userData = await fetchUserData(userId);
                if (userData) {
                    setUser(userData as UserType);
                }
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        },
        [setUser]
    );

    // Enhanced register function that updates state immediately
    const register = async (
        email: string,
        password: string,
        displayName: string
    ): Promise<UserType> => {
        const userData = await registerWithEmailAndPassword(
            email,
            password,
            displayName
        );

        // Handle redirect after registration if needed
        const from = (location.state as { from?: string })?.from || '/profile';
        navigate(from, { replace: true });

        return userData;
    };

    // Enhanced login functions with redirect support
    const login = async (
        email: string,
        password: string
    ): Promise<UserType> => {
        const userData = await loginWithEmailAndPassword(email, password);

        // Handle redirect after login
        const from = (location.state as { from?: string })?.from || '/profile';
        navigate(from, { replace: true });

        return await firebaseUserToUser(userData) as UserType;
    };

    const enhancedLoginWithGoogle = async (): Promise<UserType> => {
        const userData = await loginWithGoogle();

        // Handle redirect after login
        const from = (location.state as { from?: string })?.from || '/profile';
        navigate(from, { replace: true });

        return await firebaseUserToUser(userData) as UserType;
    };

    // Enhanced logout with redirect
    const logout = async (): Promise<void> => {
        await logoutUser();
        navigate('/');
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle: enhancedLoginWithGoogle,
        logout,
        register,
        resetPassword,
        updateUserData,
    };
};
