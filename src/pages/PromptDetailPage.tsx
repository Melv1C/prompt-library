/**
 * File: src/pages/PromptDetailPage.tsx
 *
 * Description: Page component for viewing detailed information about a specific prompt
 * with edit, delete, and favorite options for users.
 *
 */

import { usePrompt } from '@/hooks';
import { useFavoriteStatus } from '@/hooks/useFavorites';
import { useDeletePrompt } from '@/hooks/usePromptActions';
import { userAtom } from '@/store/authAtom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

export function PromptDetailPage() {
    const { promptId } = useParams<{ promptId: string }>();
    const { prompt, loading, error } = usePrompt(promptId);
    const currentUser = useAtomValue(userAtom);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Delete functionality
    const { deletePromptAction, state: deleteState } = useDeletePrompt();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Favorite functionality
    const {
        isFavorite,
        favoriteCount,
        loading: favoriteLoading,
        toggleFavorite,
    } = useFavoriteStatus(promptId);

    // Copy to clipboard functionality
    const [copied, setCopied] = useState(false);

    // Check if current user is the author
    const isAuthor = useMemo(() => {
        if (!currentUser || !prompt) return false;
        return currentUser.id === prompt.authorId;
    }, [currentUser, prompt]);

    // Handle copy to clipboard
    const handleCopy = () => {
        if (!prompt) return;

        navigator.clipboard
            .writeText(prompt.content)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error('Failed to copy:', err));
    };

    // Handle delete
    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!promptId) return;

        const success = await deletePromptAction(promptId);
        if (success) {
            setDeleteDialogOpen(false);
            navigate('/my-library');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    // Handle favorite toggle
    const handleFavoriteToggle = async () => {
        if (!currentUser) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { from: `/prompts/${promptId}` } });
            return;
        }

        await toggleFavorite();
    };

    // Render loading state
    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // Render error state
    if (error || !prompt) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    {error ? error.message : 'Prompt not found'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* Prompt Details Card */}
            <Card elevation={3}>
                <CardContent>
                    {/* Header with title, category and action buttons */}
                    <Box
                        sx={{
                            mb: 3,
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'flex-start',
                            gap: isMobile ? 2 : 0,
                        }}
                    >
                        {/* Title and chips on the left */}
                        <Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                gutterBottom
                            >
                                {prompt.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {/* Favorite count chip - always visible */}
                                <Chip
                                    icon={<FavoriteIcon fontSize="small" />}
                                    label={favoriteCount}
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    sx={{
                                        padding: '0.25rem 0.5rem',
                                    }}
                                />
                                
                                <Chip
                                    label={prompt.category}
                                    color="primary"
                                    size="small"
                                />
                                
                                {isAuthor && (
                                    <Chip
                                        label={
                                            prompt.isPublic ? 'Public' : 'Private'
                                        }
                                        color={
                                            prompt.isPublic ? 'success' : 'default'
                                        }
                                        size="small"
                                    />
                                )}

                            </Box>
                        </Box>
                        {/* Action buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                flexDirection: isMobile ? 'row' : 'row',
                                width: isMobile ? '100%' : 'auto',
                            }}
                        >
                            {/* Favorite button - visible to logged-in users */}
                            {currentUser && (
                                <Tooltip
                                    title={
                                        isFavorite
                                            ? 'Remove from favorites'
                                            : 'Add to favorites'
                                    }
                                >
                                    <IconButton
                                        color="error"
                                        onClick={handleFavoriteToggle}
                                        disabled={favoriteLoading}
                                        size="medium"
                                    >
                                        {favoriteLoading ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : isFavorite ? (
                                            <FavoriteIcon />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            )}

                            {/* Edit/Delete buttons - only visible to author */}
                            {isAuthor && (
                                <>
                                    {isMobile ? (
                                        <>
                                            <Button
                                                startIcon={<EditIcon />}
                                                component={RouterLink}
                                                to={`/prompts/${prompt.id}/edit`}
                                                color="primary"
                                                variant="contained"
                                                size="small"
                                                fullWidth
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                color="error"
                                                variant="contained"
                                                size="small"
                                                onClick={handleDeleteClick}
                                                disabled={deleteState.loading}
                                                fullWidth
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                startIcon={<EditIcon />}
                                                component={RouterLink}
                                                to={`/prompts/${prompt.id}/edit`}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                color="error"
                                                variant="outlined"
                                                size="small"
                                                onClick={handleDeleteClick}
                                                disabled={deleteState.loading}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>

                    {/* Description if available */}
                    {prompt.description && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                        >
                            {prompt.description}
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Prompt content with copy button - Updated to handle overflow */}
                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                position: 'relative',
                                // Updated styles for better overflow handling
                                maxWidth: '100%',
                                overflowX: 'auto',
                                '&::after': copied
                                    ? {
                                          content: '"Copied!"',
                                          position: 'absolute',
                                          top: 8,
                                          right: 8,
                                          bgcolor: 'success.main',
                                          color: 'white',
                                          px: 1,
                                          py: 0.5,
                                          borderRadius: 1,
                                          fontSize: '0.75rem',
                                          zIndex: 2,
                                      }
                                    : {},
                            }}
                        >
                            <Tooltip title="Copy to clipboard">
                                <IconButton
                                    size="small"
                                    onClick={handleCopy}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        zIndex: 1,
                                    }}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Typography
                                variant="body2"
                                component="pre"
                                sx={{
                                    pr: 4,
                                    // Updated text styles for better overflow handling
                                    whiteSpace:
                                        'pre-wrap' /* Preserves line breaks */,
                                    wordBreak:
                                        'break-word' /* Breaks long words */,
                                    overflowWrap:
                                        'break-word' /* Additional wrap property */,
                                    maxWidth:
                                        '100%' /* Ensure text doesn't overflow container */,
                                }}
                            >
                                {prompt.content}
                            </Typography>
                        </Paper>
                    </Box>

                    {/* Tags */}
                    {prompt.tags && prompt.tags.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Tags:
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                            >
                                {prompt.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Metadata */}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" display="block">
                                Created:{' '}
                                {new Date(
                                    prompt.createdAt
                                ).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="caption" display="block">
                                Last updated:{' '}
                                {new Date(
                                    prompt.updatedAt
                                ).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete Prompt
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this prompt? This action
                        cannot be undone.
                    </DialogContentText>
                    {deleteState.error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {deleteState.error.message}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={deleteState.loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        autoFocus
                        disabled={deleteState.loading}
                    >
                        {deleteState.loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
