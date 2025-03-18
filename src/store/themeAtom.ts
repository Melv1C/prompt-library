/**
 * File: src/store/themeAtom.ts
 *
 * Description: Jotai atoms for theme state management with persistence
 * and system preference detection.
 */

import { atom } from 'jotai';

// Define available themes
export type ThemeMode = 'light' | 'dark' | 'system';

// Initialize theme from localStorage if available, otherwise use system preference
const getInitialTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'system';

    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme;
    }

    return 'system';
};

// The base theme atom stores the user's preference
export const themeAtom = atom<ThemeMode>(getInitialTheme());

// Derived atom to get the actual theme based on system preference when 'system' is selected
export const effectiveThemeAtom = atom<'light' | 'dark'>((get) => {
    const theme = get(themeAtom);

    if (theme === 'system') {
        // Use media query to detect system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    return theme;
});

// Atom to handle theme changes with persistence
export const setThemeAtom = atom(null, (_, set, newTheme: ThemeMode) => {
    set(themeAtom, newTheme);
    localStorage.setItem('theme', newTheme);
});
