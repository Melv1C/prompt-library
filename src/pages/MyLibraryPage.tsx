/**
 * File: src/pages/MyLibraryPage.tsx
 *
 * Description: Page that displays the current user's prompt library
 * with filtering and organization capabilities
 */

import ActiveFilters from '@/components/common/ActiveFilters';
import MobileFilterDrawer from '@/components/common/MobileFilterDrawer';
import SearchBar from '@/components/common/SearchBar';
import FilterSidebar from '@/components/layout/FilterSidebar';
import { PromptCard } from '@/components/prompt/PromptCard';
import { PromptCategory, PromptTag } from '@/constants';
import { useMultipleFavoriteStatuses } from '@/hooks/useMultipleFavoriteStatuses';
import { useUserPrompts } from '@/hooks/usePrompts';
import { userAtom } from '@/store/authAtom';
import { filterStateAtom } from '@/store/filterStore';
import { PromptType } from '@/types/prompt';
import AddIcon from '@mui/icons-material/Add';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function MyLibraryPage() {
    const user = useAtomValue(userAtom);
    const filterState = useAtomValue(filterStateAtom);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    // State for sorted prompts
    const [sortedPrompts, setSortedPrompts] = useState<PromptType[]>([]);

    // Convert filter state to query options for the hook
    const queryOptions = {
        category:
            filterState.selectedCategories.length === 1
                ? (filterState.selectedCategories[0] as PromptCategory)
                : undefined,
        categories:
            filterState.selectedCategories.length > 1
                ? (filterState.selectedCategories as PromptCategory[])
                : undefined,
        tags: filterState.selectedTags as PromptTag[],
        orderByField:
            filterState.sortField === 'category'
                ? 'title' // Use title as fallback when category is selected for sorting
                : (filterState.sortField as
                      | 'title'
                      | 'createdAt'
                      | 'updatedAt'
                      | 'favoriteCount'
                      | undefined),
        orderDirection: filterState.sortDirection,
        searchQuery: filterState.searchQuery,
        isPublic:
            filterState.isPublic === null ? undefined : filterState.isPublic,
    };

    const { prompts, loading, error } = useUserPrompts(user?.id, queryOptions);

    // Extract prompt IDs for favorites hook
    const promptIds = useMemo(
        () => prompts.map((prompt) => prompt.id),
        [prompts]
    );

    // Use the new hook to get all favorite statuses at once
    const { favoriteStatuses, loading: favoritesLoading } =
        useMultipleFavoriteStatuses(promptIds);

    // Sort prompts based on favorite status and favorite count
    useEffect(() => {
        if (!loading && !favoritesLoading && prompts.length > 0) {
            const sorted = [...prompts].sort((a, b) => {
                // First priority: user's favorites at the top
                const isAFavorite = favoriteStatuses[a.id] || false;
                const isBFavorite = favoriteStatuses[b.id] || false;

                if (isAFavorite && !isBFavorite) return -1;
                if (!isAFavorite && isBFavorite) return 1;

                // Second priority: sort by favorite count (higher count first)
                const aFavoriteCount = a.favoriteCount || 0;
                const bFavoriteCount = b.favoriteCount || 0;

                if (aFavoriteCount !== bFavoriteCount) {
                    return bFavoriteCount - aFavoriteCount;
                }

                // Third priority: apply the selected sort field from filter state
                // This serves as a tiebreaker for prompts with equal favorite status/count
                if (filterState.sortField === 'title') {
                    return (
                        a.title.localeCompare(b.title) *
                        (filterState.sortDirection === 'asc' ? 1 : -1)
                    );
                }

                if (
                    filterState.sortField === 'createdAt' ||
                    filterState.sortField === 'updatedAt'
                ) {
                    const aDate = a[filterState.sortField].getTime();
                    const bDate = b[filterState.sortField].getTime();
                    return (
                        (bDate - aDate) *
                        (filterState.sortDirection === 'asc' ? -1 : 1)
                    );
                }

                return 0;
            });

            setSortedPrompts(sorted);
        } else {
            setSortedPrompts([]);
        }
    }, [
        loading,
        favoritesLoading,
        prompts,
        favoriteStatuses,
        filterState.sortField,
        filterState.sortDirection,
    ]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
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

            {/* Mobile search bar */}
            {isMobile && (
                <Box sx={{ mb: 2 }}>
                    <SearchBar />
                </Box>
            )}

            {/* Active filters display */}
            <ActiveFilters />

            {/* Content grid with sidebar for desktop */}
            <Grid container spacing={3}>
                {/* Filter sidebar - only shown on desktop */}
                <Grid item xs={12} md={3}>
                    <FilterSidebar />
                </Grid>

                {/* Main content area */}
                <Grid item xs={12} md={9}>
                    {loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                p: 4,
                            }}
                        >
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
                            {filterState.searchQuery ||
                            filterState.selectedCategories.length > 0 ||
                            filterState.selectedTags.length > 0
                                ? 'No prompts match your filters. Try adjusting your search criteria.'
                                : "You haven't created any prompts yet. Create your first prompt to see it here."}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {sortedPrompts.map((prompt) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                lg={4}
                                key={prompt.id}
                            >
                                <PromptCard prompt={prompt} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer />
        </Container>
    );
}
