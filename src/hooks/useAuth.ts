/**
 * File: src/hooks/useAuth.ts
 *
 * Description: Custom hook for managing authentication state and operations
 *
 */

import { auth } from '@/config/firebase';
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
import { User as FirebaseUser } from 'firebase/auth';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook that provides authentication state and methods
 * for authentication operations like login, logout, etc.
 */
export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
    const navigate = useNavigate();
    const location = useLocation();

    const updateUserState = useCallback(
        async (firebaseUser: FirebaseUser | null) => {
            try {
                if (firebaseUser) {
                    if (firebaseUser.uid !== user?.id) {
                        console.log(
                            'User ID has changed, fetching new user data...'
                        );
                        const userData = await firebaseUserToUser(firebaseUser);
                        setUser(userData);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error updating user state:', error);
                setUser(null);
            }
        },
        [setUser, user?.id]
    );

    // Initialize auth state listener
    useEffect(() => {
        setIsLoading(true);

        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            try {
                await updateUserState(firebaseUser);
            } finally {
                setIsLoading(false);
            }
        });

        // Clean up listener on unmount
        return () => unsubscribe();
    }, [setIsLoading, updateUserState]);

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

        // Explicitly update the user state after registration
        setUser(userData);

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

        return (await fetchUserData(userData.uid)) as UserType;
    };

    const enhancedLoginWithGoogle = async (): Promise<UserType> => {
        const userData = await loginWithGoogle();

        // Handle redirect after login
        const from = (location.state as { from?: string })?.from || '/profile';
        navigate(from, { replace: true });

        return (await fetchUserData(userData.uid)) as UserType;
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
    };
};
