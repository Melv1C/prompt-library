/**
 * File: src/pages/PublicPromptsPage.tsx
 *
 * Description: Page that displays publicly available prompts from all users
 * with filtering and sorting capabilities
 */

import ActiveFilters from '@/components/common/ActiveFilters';
import MobileFilterDrawer from '@/components/common/MobileFilterDrawer';
import SearchBar from '@/components/common/SearchBar';
import FilterSidebar from '@/components/layout/FilterSidebar';
import { PromptCard } from '@/components/prompt/PromptCard';
import { PromptCategory, PromptTag } from '@/constants';
import { usePublicPrompts } from '@/hooks/usePrompts';
import { filterStateAtom } from '@/store/filterStore';
import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useAtomValue } from 'jotai';

export function PublicPromptsPage() {
    const filterState = useAtomValue(filterStateAtom);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        orderByField: filterState.sortField === 'category' 
            ? 'title' // Fallback to title if category is selected
            : filterState.sortField as 'title' | 'createdAt' | 'updatedAt' | 'favoriteCount' | undefined,
        orderDirection: filterState.sortDirection,
        searchQuery: filterState.searchQuery,
    };

    // Use the usePublicPrompts hook to fetch all public prompts
    const { prompts, loading, error } = usePublicPrompts(queryOptions);

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
                    Public Prompts
                </Typography>
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
                                ? 'No public prompts match your filters. Try adjusting your search criteria.'
                                : 'No public prompts available at the moment.'}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {prompts.map((prompt) => (
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
