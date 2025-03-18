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
import { useUserPrompts } from '@/hooks/usePrompts';
import { userAtom } from '@/store/authAtom';
import { filterStateAtom } from '@/store/filterStore';
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
import { useNavigate } from 'react-router-dom';

export function MyLibraryPage() {
    const user = useAtomValue(userAtom);
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
            ? 'title'  // Use title as fallback when category is selected for sorting
            : filterState.sortField as 'title' | 'createdAt' | 'updatedAt' | 'favoriteCount' | undefined,
        orderDirection: filterState.sortDirection,
        searchQuery: filterState.searchQuery,
        isPublic: filterState.isPublic === null ? undefined : filterState.isPublic,
    };

    const { prompts, loading, error } = useUserPrompts(user?.id, queryOptions);
    const navigate = useNavigate();

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
