/**
 * File: src/components/common/AuthProvider.tsx
 *
 * Description: Provider component that initializes Firebase auth state listener once
 * and makes the authentication state available throughout the app
 *
 */

import { auth } from '@/config/firebase';
import { firebaseUserToUser } from '@/services/authService';
import { authLoadingAtom, userAtom } from '@/store/authAtom';
import { useAtom } from 'jotai';
import { ReactNode, useEffect } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [, setUser] = useAtom(userAtom);
    const [, setIsLoading] = useAtom(authLoadingAtom);

    // Initialize auth state listener once
    useEffect(() => {
        console.log('Setting up auth state listener...');
        setIsLoading(true);

        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // User is signed in
                    console.log('Auth state changed: user signed in');
                    const user = await firebaseUserToUser(firebaseUser);
                    setUser(user);
                } else {
                    // User is signed out
                    console.log('Auth state changed: user signed out');
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        });

        // Clean up listener on unmount
        return () => {
            console.log('Cleaning up auth state listener');
            unsubscribe();
        };
    }, [setIsLoading, setUser]);

    return <>{children}</>;
}
