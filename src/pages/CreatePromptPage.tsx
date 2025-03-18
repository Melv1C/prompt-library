/**
 * File: src/pages/CreatePromptPage.tsx
 *
 * Description: Page component for creating new prompts
 *
 */

import { PromptForm } from '@/components/prompt/PromptForm';
import { Box, Container, Paper, Typography } from '@mui/material';

export function CreatePromptPage() {
    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create New Prompt
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Create a new prompt to save in your library. Fill out the
                    form below with your prompt details.
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <PromptForm />
                </Box>
            </Paper>
        </Container>
    );
}
