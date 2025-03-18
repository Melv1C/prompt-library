/**
 * File: src/components/common/FilterPanel.tsx
 *
 * Description: Collapsible filter panel for filtering prompts by categories and tags
 */

import { PROMPT_CATEGORIES } from '@/constants/categories';
import { TAG_GROUPS } from '@/constants/tags';
import {
    resetFilterAtom,
    selectedCategoriesAtom,
    selectedTagsAtom,
    toggleCategoryAtom,
    toggleTagAtom,
} from '@/store/filterStore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    FormGroup,
    Paper,
    Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react';

/**
 * FilterPanel component that allows users to filter prompts by categories and tags
 */
export const FilterPanel = () => {
    // Local state for panel expansion
    const [expandedPanel, setExpandedPanel] = useState<string | false>(
        'categories'
    );
    const [selectedCategories] = useAtom(selectedCategoriesAtom);
    const [selectedTags] = useAtom(selectedTagsAtom);
    const [, toggleCategory] = useAtom(toggleCategoryAtom);
    const [, toggleTag] = useAtom(toggleTagAtom);
    const [, resetFilter] = useAtom(resetFilterAtom);

    /**
     * Handle accordion expansion state change
     */
    const handleAccordionChange =
        (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedPanel(isExpanded ? panel : false);
        };

    /**
     * Renders a category checkbox
     */
    const renderCategoryCheckbox = (category: string) => (
        <FormControlLabel
            key={`category-${category}`}
            control={
                <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    size="small"
                />
            }
            label={<Typography variant="body2">{category}</Typography>}
        />
    );

    /**
     * Renders a tag chip
     */
    const renderTagChip = (tag: string) => (
        <Chip
            key={`tag-${tag}`}
            label={tag}
            size="small"
            clickable
            color={selectedTags.includes(tag) ? 'primary' : 'default'}
            onClick={() => toggleTag(tag)}
            sx={{ m: 0.5 }}
        />
    );

    return (
        <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden' }}>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterListIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                        Filters
                    </Typography>
                </Box>
                <Chip
                    label="Reset Filters"
                    size="small"
                    onClick={() => resetFilter()}
                    disabled={
                        !selectedCategories.length && !selectedTags.length
                    }
                />
            </Box>

            <Divider />

            {/* Categories Section */}
            <Accordion
                expanded={expandedPanel === 'categories'}
                onChange={handleAccordionChange('categories')}
                disableGutters
                elevation={0}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        Categories{' '}
                        {selectedCategories.length > 0 &&
                            `(${selectedCategories.length})`}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {PROMPT_CATEGORIES.map(renderCategoryCheckbox)}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Divider />

            {/* Tags Section */}
            <Accordion
                expanded={expandedPanel === 'tags'}
                onChange={handleAccordionChange('tags')}
                disableGutters
                elevation={0}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        Tags{' '}
                        {selectedTags.length > 0 && `(${selectedTags.length})`}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {Object.entries(TAG_GROUPS).map(([groupName, tags]) => (
                        <Box key={`tag-group-${groupName}`} sx={{ mb: 2 }}>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                {/* Convert the group name to a more readable format */}
                                {groupName
                                    .replace('_', ' ')
                                    .replace(/([A-Z])/g, ' $1')
                                    .trim()}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {tags.map(renderTagChip)}
                            </Box>
                        </Box>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};

export default FilterPanel;
