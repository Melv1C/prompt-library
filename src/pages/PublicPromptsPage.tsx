/**
 * File: src/pages/PublicPromptsPage.tsx
 *
 * Description: Page that displays publicly available prompts from all users
 * with filtering and sorting capabilities
 */

import { PromptCard } from '@/components/prompt/PromptCard';
import { usePublicPrompts } from '@/hooks/usePrompts';
import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from '@mui/material';

export function PublicPromptsPage() {
    // Use the usePublicPrompts hook to fetch all public prompts
    const { prompts, loading, error } = usePublicPrompts();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography variant="h4" component="h1">
                    Public Prompts
                </Typography>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading prompts: {error.message}
                </Alert>
            )}

            {!loading && !error && prompts.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No public prompts available at the moment.
                </Alert>
            )}

            <Grid container spacing={3}>
                {prompts.map((prompt) => (
                    <Grid item xs={12} sm={6} md={4} key={prompt.id}>
                        <PromptCard prompt={prompt} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
