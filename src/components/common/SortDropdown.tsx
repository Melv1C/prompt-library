/**
 * File: src/components/common/SortDropdown.tsx
 *
 * Description: Dropdown component for sorting prompts by different fields
 */

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SortIcon from '@mui/icons-material/Sort';
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tooltip,
} from '@mui/material';
import { useAtom } from 'jotai';
import {
    sortDirectionAtom,
    sortFieldAtom,
    toggleSortDirectionAtom,
} from '../../store/filterStore';
import { sortablePromptFields, SortField } from '../../types/filterTypes';

/**
 * Mapping of sort field values to display names
 */
const sortFieldDisplayNames: Record<SortField, string> = {
    createdAt: 'Date Created',
    updatedAt: 'Last Updated',
    title: 'Title',
    category: 'Category',
};

/**
 * SortDropdown component for choosing sort field and direction
 */
export const SortDropdown = () => {
    const [sortField, setSortField] = useAtom(sortFieldAtom);
    const [sortDirection] = useAtom(sortDirectionAtom);
    const [, toggleSortDirection] = useAtom(toggleSortDirectionAtom);

    /**
     * Handle sort field change from dropdown
     */
    const handleSortFieldChange = (event: SelectChangeEvent) => {
        setSortField(event.target.value as SortField);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SortIcon color="action" />

            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="sort-field-select-label">Sort By</InputLabel>
                <Select
                    labelId="sort-field-select-label"
                    id="sort-field-select"
                    value={sortField}
                    label="Sort By"
                    onChange={handleSortFieldChange}
                >
                    {sortablePromptFields.map((field) => (
                        <MenuItem key={field} value={field}>
                            {sortFieldDisplayNames[field]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Tooltip
                title={`Sort ${
                    sortDirection === 'asc' ? 'Ascending' : 'Descending'
                }`}
            >
                <IconButton
                    size="small"
                    onClick={() => toggleSortDirection()}
                    color="primary"
                >
                    {sortDirection === 'asc' ? (
                        <ArrowUpwardIcon />
                    ) : (
                        <ArrowDownwardIcon />
                    )}
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default SortDropdown;
