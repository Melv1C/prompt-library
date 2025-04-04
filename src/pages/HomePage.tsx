/**
 * File: src/pages/HomePage.tsx
 *
 * Description: Home page with project description and key features
 *
 */

import { useAuth } from '@/hooks/useAuth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ShareIcon from '@mui/icons-material/Share';
import TagIcon from '@mui/icons-material/Tag';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
    // Get authentication status to show appropriate CTA buttons
    const { isAuthenticated } = useAuth();

    return (
        <Container>
            {/* Hero Section */}
            <Box
                sx={{
                    py: 8,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <AutoStoriesIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h2" component="h1" gutterBottom>
                    Prompt Library
                </Typography>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    paragraph
                    sx={{ maxWidth: 600 }}
                >
                    Store, organize, and share your AI prompts in one place. A
                    powerful tool for managing all your prompting needs.
                </Typography>
                <Box 
                    sx={{
                        mt: 4,
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        width: '100%',
                        gap: { xs: 2, sm: 1 }
                    }}
                >
                    {/* Button to browse prompts */}
                    <Button
                        variant="contained"
                        size="large"
                        component={RouterLink}
                        to="/prompts"
                        fullWidth={false}
                        sx={{ 
                            mx: { sm: 1 },
                            minWidth: { xs: '200px', sm: 'auto' }
                        }}
                    >
                        Browse Prompts
                    </Button>

                    {/* Conditional button based on authentication status */}
                    {isAuthenticated ? (
                        <Button
                            variant="outlined"
                            size="large"
                            component={RouterLink}
                            to="/my-library"
                            fullWidth={false}
                            sx={{ 
                                mx: { sm: 1 },
                                minWidth: { xs: '200px', sm: 'auto' }
                            }}
                        >
                            My Library
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            size="large"
                            component={RouterLink}
                            to="/register"
                            fullWidth={false}
                            sx={{ 
                                mx: { sm: 1 },
                                minWidth: { xs: '200px', sm: 'auto' }
                            }}
                        >
                            Get Started
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 8 }}>
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    align="center"
                    sx={{ mb: 6 }}
                >
                    Key Features
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <CollectionsBookmarkIcon
                                sx={{ fontSize: 50, mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Prompt Management
                            </Typography>
                            <Typography color="text.secondary">
                                Create, edit, and organize your AI prompts with
                                ease. Copy prompts with one click.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <TagIcon sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Organization System
                            </Typography>
                            <Typography color="text.secondary">
                                Tag and categorize your prompts. Use advanced
                                filtering and search capabilities.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <ShareIcon sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Sharing Capabilities
                            </Typography>
                            <Typography color="text.secondary">
                                Share your prompts publicly or keep them
                                private. Generate shareable links.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
