/**
 * File: src/components/prompt/PromptCard.tsx
 *
 * Description: Card component for displaying prompt summaries in lists
 * with favorite, edit, and copy functionality
 *
 */

import { useFavoriteStatus } from '@/hooks/useFavorites';
import { userAtom } from '@/store/authAtom';
import { PromptType } from '@/types/prompt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface PromptCardProps {
    prompt: PromptType;
}

export function PromptCard({ prompt }: PromptCardProps) {
    const [copied, setCopied] = useState(false);
    const currentUser = useAtomValue(userAtom);
    const navigate = useNavigate();

    // Use the favorites hook
    const {
        isFavorite,
        favoriteCount,
        loading: favoriteLoading,
        toggleFavorite,
    } = useFavoriteStatus(prompt.id);

    // Only show up to 3 tags
    const displayTags = prompt.tags.slice(0, 3);

    const handleCopy = async (e: React.MouseEvent) => {
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

    // Handle favorite toggle
    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { from: `/prompts/${prompt.id}` } });
            return;
        }

        toggleFavorite();
    };

    // Truncate description to first 30 characters
    const truncatedDescription = prompt.description
        ? prompt.description.length > 30
            ? `${prompt.description.substring(0, 30)}...`
            : prompt.description
        : '';

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

                        {/* Copy button */}
                        <Tooltip title={copied ? 'Copied!' : 'Copy prompt'}>
                            <IconButton
                                aria-label="copy prompt"
                                onClick={handleCopy}
                                size="small"
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Favorite button */}
                        {currentUser && (
                            <Tooltip
                                title={
                                    isFavorite
                                        ? 'Remove from favorites'
                                        : 'Add to favorites'
                                }
                            >
                                <IconButton
                                    aria-label={
                                        isFavorite ? 'unfavorite' : 'favorite'
                                    }
                                    onClick={handleFavoriteToggle}
                                    disabled={favoriteLoading}
                                    color="error"
                                    size="small"
                                >
                                    {isFavorite ? (
                                        <FavoriteIcon fontSize="small" />
                                    ) : (
                                        <FavoriteBorderIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            mb: 2,
                        }}
                    >
                        <Chip
                            label={favoriteCount}
                            size="small"
                            color="error"
                            variant="outlined"
                            icon={<FavoriteIcon fontSize="small" />}
                            sx={{ padding: 0.5 }}
                        />

                        <Chip
                            label={prompt.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Box>

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
