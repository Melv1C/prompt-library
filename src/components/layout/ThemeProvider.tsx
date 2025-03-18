/**
 * File: src/components/layout/ThemeProvider.tsx
 *
 * Description: Theme provider component that applies the selected theme
 * to the entire application using MUI's ThemeProvider.
 */

import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { effectiveThemeAtom } from '../../store/themeAtom';

type ThemeProviderProps = {
    children: React.ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps) {
    const [effectiveTheme] = useAtom(effectiveThemeAtom);

    // Create the MUI theme based on the current effective theme
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: effectiveTheme,
                    // Enhanced theme customization with better color contrast
                    primary: {
                        main: effectiveTheme === 'dark' ? '#90caf9' : '#1976d2',
                        // Improved contrast for dark mode
                        contrastText:
                            effectiveTheme === 'dark' ? '#000' : '#fff',
                    },
                    secondary: {
                        main: effectiveTheme === 'dark' ? '#f48fb1' : '#dc004e',
                        contrastText:
                            effectiveTheme === 'dark' ? '#000' : '#fff',
                    },
                    background: {
                        default:
                            effectiveTheme === 'dark' ? '#121212' : '#fafafa',
                        paper: effectiveTheme === 'dark' ? '#1e1e1e' : '#fff',
                    },
                    text: {
                        primary:
                            effectiveTheme === 'dark' ? '#e0e0e0' : '#333333',
                        secondary:
                            effectiveTheme === 'dark' ? '#b0b0b0' : '#666666',
                    },
                },
                components: {
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                background:
                                    effectiveTheme === 'dark'
                                        ? 'rgba(30, 30, 30, 0.8)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                borderBottom: '1px solid',
                                borderColor:
                                    effectiveTheme === 'dark'
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.1)',
                            },
                        },
                    },
                    MuiIconButton: {
                        styleOverrides: {
                            root: {
                                padding: '8px',
                            },
                        },
                    },
                    // Additional component customizations
                },
            }),
        [effectiveTheme]
    );

    // Apply theme class to body for potential CSS targeting
    useEffect(() => {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${effectiveTheme}-theme`);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector(
            'meta[name="theme-color"]'
        );
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                effectiveTheme === 'dark' ? '#121212' : '#ffffff'
            );
        }
    }, [effectiveTheme]);

    // Listen for system preference changes when in "system" mode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            // This will trigger a re-evaluation of effectiveThemeAtom if we're in system mode
            // We don't need to do anything explicitly here as Jotai will handle it
        };

        // Use the modern way of adding event listeners
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
        </MuiThemeProvider>
    );
}
