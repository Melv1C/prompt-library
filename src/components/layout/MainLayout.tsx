/**
 * File: src/components/layout/MainLayout.tsx
 *
 * Description: Main layout component that includes header, content area, and footer
 *
 */

import { Box, Container } from '@mui/material';
import { Footer } from './Footer';
import { Header } from './Header';

type MainLayoutProps = {
    children: React.ReactNode;
};

export function MainLayout(props: MainLayoutProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            <Container
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {props.children}
            </Container>
            <Footer />
        </Box>
    );
}
