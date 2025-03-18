/**
 * File: src/pages/MyLibraryPage.tsx
 *
 * Description: Page that displays the current user's prompt library
 * with filtering and organization capabilities
 */

import { PromptCard } from '@/components/prompt/PromptCard';
import { useUserPrompts } from '@/hooks/usePrompts';
import { userAtom } from '@/store/authAtom';
import AddIcon from '@mui/icons-material/Add';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';

export function MyLibraryPage() {
    const user = useAtomValue(userAtom);
    const { prompts, loading, error } = useUserPrompts(user?.id);
    const navigate = useNavigate();

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
                    My Prompt Library
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/prompts/new')}
                >
                    New Prompt
                </Button>
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
                    You haven't created any prompts yet. Create your first
                    prompt to see it here.
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
