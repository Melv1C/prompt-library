/**
 * File: src/components/layout/Footer.tsx
 *
 * Description: Footer component with copyright information
 * Properly respects the current theme mode (light/dark)
 *
 */

import { Box, Container, Link, Typography } from '@mui/material';

export function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                // Use theme-dependent background color
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : theme.palette.grey[100],
                // Add subtle border for better visual separation
                borderTop: (theme) =>
                    `1px solid ${
                        theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)'
                    }`,
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="body2"
                    // Use theme-aware text color
                    color="text.secondary"
                    align="center"
                >
                    {'© '}
                    {new Date().getFullYear()}{' '}
                    <Link
                        color="inherit"
                        href="/"
                        sx={{
                            // Enhance link appearance for better accessibility
                            '&:hover': {
                                color: (theme) => theme.palette.primary.main,
                            },
                        }}
                    >
                        Prompt Library
                    </Link>
                    {' - All rights reserved.'}
                </Typography>
            </Container>
        </Box>
    );
}
