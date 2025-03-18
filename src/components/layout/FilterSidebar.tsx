/**
 * File: src/components/layout/FilterSidebar.tsx
 *
 * Description: Sidebar component for filter panels on desktop screens
 */

import FilterPanel from '@/components/common/FilterPanel';
import SearchBar from '@/components/common/SearchBar';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface FilterSidebarProps {
    showSearch?: boolean;
}

export const FilterSidebar = ({ showSearch = true }: FilterSidebarProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    // Only render on desktop screens
    if (!isDesktop) return null;

    return (
        <Box sx={{ width: '100%', maxWidth: 280 }}>
            {showSearch && (
                <Box sx={{ mb: 2 }}>
                    <SearchBar />
                </Box>
            )}
            <FilterPanel />
        </Box>
    );
};

export default FilterSidebar;
