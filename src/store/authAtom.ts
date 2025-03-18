/**
 * File: src/store/authAtom.ts
 *
 * Description: Authentication state management using Jotai atoms
 *
 */

import { UserType } from '@/types/user';
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

// Stores the current authentication loading state
export const authLoadingAtom = atom(true);

// Atom for the current user
export const userAtom = atom<UserType | null>(null);

// Loadable version of userAtom for handling async state
export const loadableUserAtom = loadable(userAtom);

// Derived atom to check if user is authenticated
export const isAuthenticatedAtom = atom((get) => {
    return get(userAtom) !== null;
});
