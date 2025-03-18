/**
 * File: src/components/common/ActiveFilters.tsx
 *
 * Description: Component that displays active filters as chips with the ability to remove them
 */

import {
    selectedCategoriesAtom,
    selectedTagsAtom,
    toggleCategoryAtom,
    toggleTagAtom,
} from '@/store/filterStore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Chip } from '@mui/material';
import { useAtom } from 'jotai';

/**
 * Displays active filters as chips with the ability to remove them
 * Search is not shown in active filters since it's visible in the search bar
 * @returns React component
 */
export const ActiveFilters = () => {
    const [selectedCategories] = useAtom(selectedCategoriesAtom);
    const [selectedTags] = useAtom(selectedTagsAtom);
    const [, toggleCategory] = useAtom(toggleCategoryAtom);
    const [, toggleTag] = useAtom(toggleTagAtom);

    // If no active filters, don't render anything
    if (selectedCategories.length === 0 && selectedTags.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                my: 2,
                alignItems: 'center',
            }}
        >
            <FilterAltIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />

            {/* Display category filters */}
            {selectedCategories.map((category) => (
                <Chip
                    key={`filter-category-${category}`}
                    label={category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    onDelete={() => toggleCategory(category)}
                />
            ))}

            {/* Display tag filters */}
            {selectedTags.map((tag) => (
                <Chip
                    key={`filter-tag-${tag}`}
                    label={tag}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    onDelete={() => toggleTag(tag)}
                />
            ))}
        </Box>
    );
};

export default ActiveFilters;
