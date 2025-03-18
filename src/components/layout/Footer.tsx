/**
 * File: src/components/layout/Footer.tsx
 *
 * Description: Footer component with copyright information
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
                backgroundColor: (theme) => theme.palette.grey[100],
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    {'© '}
                    {new Date().getFullYear()}{' '}
                    <Link color="inherit" href="/">
                        Prompt Library
                    </Link>
                    {' - All rights reserved.'}
                </Typography>
            </Container>
        </Box>
    );
}
