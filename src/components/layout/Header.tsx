/**
 * File: src/components/layout/Header.tsx
 *
 * Description: Main application header component that includes navigation
 * and the theme selector.
 */

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {
    AppBar,
    Box,
    Slide,
    Toolbar,
    Typography,
    useScrollTrigger,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';

/**
 * HideOnScroll component to hide the AppBar when scrolling down
 * and reveal it when scrolling up
 */
function HideOnScroll(props: { children: React.ReactNode }) {
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <Box>{props.children}</Box>
        </Slide>
    );
}

export function Header(props: { title?: string }) {
    return (
        <HideOnScroll>
            <AppBar position="sticky" elevation={0}>
                <Toolbar
                    sx={{
                        py: 1,
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Logo and Title */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <AutoStoriesIcon
                            color="primary"
                            sx={{
                                mr: 1.5,
                                fontSize: 28,
                            }}
                        />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                background: (theme) =>
                                    `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: { xs: 'none', sm: 'block' },
                            }}
                        >
                            {props.title || 'Prompt Library'}
                        </Typography>
                    </Box>

                    {/* Navigation */}
                    <Navigation />
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
}
