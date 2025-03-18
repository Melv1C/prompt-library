/**
 * File: src/pages/EditPromptPage.tsx
 *
 * Description: Page component for editing existing prompts
 *
 */

import { PromptForm } from '@/components/prompt/PromptForm';
import { usePrompt } from '@/hooks/usePrompt';
import {
    Alert,
    AlertTitle,
    Box,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

export function EditPromptPage() {
    const { promptId } = useParams<{ promptId: string }>();
    const { prompt, loading, error } = usePrompt(promptId);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading prompt...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Failed to load prompt: {error.message}
                </Alert>
            </Container>
        );
    }

    if (!prompt) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">
                    <AlertTitle>Not Found</AlertTitle>
                    The prompt you're looking for doesn't exist.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Prompt
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Update your prompt details using the form below.
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <PromptForm prompt={prompt} isEditing />
                </Box>
            </Paper>
        </Container>
    );
}
