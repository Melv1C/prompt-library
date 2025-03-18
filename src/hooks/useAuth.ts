/**
 * File: src/hooks/useAuth.ts
 *
 * Description: Custom hook for managing authentication state and operations
 *
 */

import { auth } from '@/config/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import {
    firebaseUserToUser,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logoutUser,
    registerWithEmailAndPassword,
    resetPassword,
} from '@/services/auth';
import {
    authLoadingAtom,
    isAuthenticatedAtom,
    userAtom,
} from '@/store/authAtom';
import { UserType } from '@/types/user';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';

/**
 * Custom hook that provides authentication state and methods
 * for authentication operations like login, logout, etc.
 */
export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const [isLoading, setIsLoading] = useAtom(authLoadingAtom);

    const updateUserState = useCallback(
        async (firebaseUser: FirebaseUser | null) => {
            try {
                if (firebaseUser) {
                    const userData = await firebaseUserToUser(firebaseUser);
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error updating user state:', error);
                setUser(null);
            }
        },
        [setUser]
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

        return userData;
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        login: loginWithEmailAndPassword,
        loginWithGoogle,
        logout: logoutUser,
        register,
        resetPassword,
    };
};
