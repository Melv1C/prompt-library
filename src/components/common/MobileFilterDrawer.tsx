/**
 * File: src/components/common/MobileFilterDrawer.tsx
 *
 * Description: Mobile-friendly drawer for filters that can be toggled on smaller screens
 */

import { selectedCategoriesAtom, selectedTagsAtom } from '@/store/filterStore';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Badge, Drawer, Fab, useMediaQuery, useTheme } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import FilterPanel from './FilterPanel';

interface MobileFilterDrawerProps {
    showBadge?: boolean;
}

export const MobileFilterDrawer = ({
    showBadge = true,
}: MobileFilterDrawerProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Get filter state to determine if we need to show a badge
    const selectedCategories = useAtomValue(selectedCategoriesAtom);
    const selectedTags = useAtomValue(selectedTagsAtom);
    const activeFilterCount = selectedCategories.length + selectedTags.length;

    // Only show on mobile screens
    if (!isMobile) return null;

    return (
        <>
            {/* Floating action button to open filters */}
            <Fab
                color="primary"
                size="medium"
                aria-label="filter"
                onClick={() => setDrawerOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: theme.zIndex.speedDial,
                }}
            >
                {showBadge && activeFilterCount > 0 ? (
                    <Badge badgeContent={activeFilterCount} color="error">
                        <FilterListIcon />
                    </Badge>
                ) : (
                    <FilterListIcon />
                )}
            </Fab>

            {/* Drawer containing filters */}
            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        maxHeight: '85vh',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    },
                }}
            >
                <FilterPanel />
            </Drawer>
        </>
    );
};

export default MobileFilterDrawer;
