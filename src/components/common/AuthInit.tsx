/**
 * File: src/components/common/AuthInit.tsx
 *
 * Description: Component that initializes authentication state
 *
 */

import { authInitAtom } from '@/store/authAtom';
import { Unsubscribe } from 'firebase/auth';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

/**
 * Component that initializes the authentication state when the app mounts.
 * Should be included near the root of the component tree.
 */
export function AuthInit() {
    const [, initAuth] = useAtom(authInitAtom);

    useEffect(() => {
        // Initialize auth listener when component mounts
        let unsubscribe: Unsubscribe | undefined;

        // Using Promise to handle async initialization
        const initializeAuth = async () => {
            unsubscribe = await initAuth();
        };

        initializeAuth();

        // Clean up listener when component unmounts
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [initAuth]);

    // This component doesn't render anything
    return null;
}
