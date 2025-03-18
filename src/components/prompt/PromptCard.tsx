/**
 * File: src/components/prompt/PromptCard.tsx
 *
 * Description: Component for displaying a prompt card with basic information
 * and actions such as copying to clipboard
 */

import { PromptType } from '@/types/prompt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type PromptCardProps = {
    prompt: PromptType;
};

export function PromptCard(props: PromptCardProps) {
    const { prompt } = props;
    const [copied, setCopied] = useState(false);

    // Truncate description to first 30 characters
    const truncatedDescription = prompt.description
        ? prompt.description.length > 30
            ? `${prompt.description.substring(0, 30)}...`
            : prompt.description
        : '';

    // Only show up to 3 tags
    const displayTags = prompt.tags.slice(0, 3);

    const handleCopyClick = async (e: React.MouseEvent) => {
        // Prevent navigation when clicking the copy button
        e.stopPropagation();
        e.preventDefault();

        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy content:', err);
        }
    };

    return (
        <Link
            to={`/prompts/${prompt.id}`}
            style={{
                textDecoration: 'none',
                display: 'block',
                color: 'inherit',
                width: '100%',
                height: '100%',
            }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                    },
                }}
            >
                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            {prompt.title}
                        </Typography>

                        <IconButton
                            size="small"
                            onClick={handleCopyClick}
                            color={copied ? 'success' : 'default'}
                            title="Copy prompt to clipboard"
                            aria-label="Copy to clipboard"
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Chip
                        label={prompt.category}
                        size="small"
                        sx={{ alignSelf: 'flex-start', mb: 1 }}
                        color="primary"
                        variant="outlined"
                    />

                    {truncatedDescription && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, flexGrow: 1 }}
                        >
                            {truncatedDescription}
                        </Typography>
                    )}

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 'auto', flexWrap: 'wrap', gap: 1 }}
                    >
                        {displayTags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                        {prompt.tags.length > 3 && (
                            <Typography
                                variant="caption"
                                sx={{ alignSelf: 'center' }}
                            >
                                +{prompt.tags.length - 3} more
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Link>
    );
}
