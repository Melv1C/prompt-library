/**
 * File: src/store/authAtom.ts
 *
 * Description: Authentication state management using Jotai atoms
 *
 */

import { auth } from '@/config/firebase';
import { firebaseUserToUser } from '@/services/auth';
import { UserType } from '@/types/user';
import { Unsubscribe } from 'firebase/auth';
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

// Stores the current authentication loading state
export const authLoadingAtom = atom(true);

// Atom for the current user
export const userAtom = atom<UserType | null>(null);

// Loadable version of userAtom for handling async state
export const loadableUserAtom = loadable(userAtom);

// Initialize auth state listener
export const authInitAtom = atom(
    null,
    async (_get, set): Promise<Unsubscribe> => {
        set(authLoadingAtom, true);

        return auth.onAuthStateChanged(async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // User is signed in
                    const user = await firebaseUserToUser(firebaseUser);
                    set(userAtom, user);
                } else {
                    // User is signed out
                    set(userAtom, null);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                set(userAtom, null);
            } finally {
                set(authLoadingAtom, false);
            }
        });
    }
);

// Derived atom to check if user is authenticated
export const isAuthenticatedAtom = atom((get) => {
    return get(userAtom) !== null;
});
