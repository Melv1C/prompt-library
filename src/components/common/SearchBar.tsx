/**
 * File: src/components/common/SearchBar.tsx
 *
 * Description: Search bar component for filtering prompts by text with real-time filtering
 */

import { searchQueryAtom } from '@/store/filterStore';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

interface SearchBarProps {
    placeholder?: string;
    fullWidth?: boolean;
    debounceMs?: number;
}

export const SearchBar = ({
    placeholder = 'Search prompts...',
    fullWidth = true,
    debounceMs = 300, // Default debounce delay in milliseconds
}: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
    const [inputValue, setInputValue] = useState(searchQuery);

    // Debounced search implementation using useEffect
    useEffect(() => {
        // Don't debounce if the input is cleared (for immediate feedback)
        if (inputValue === '') {
            setSearchQuery('');
            return;
        }

        // Set a timer to update the search query after the specified delay
        const timer = setTimeout(() => {
            setSearchQuery(inputValue.trim());
        }, debounceMs);

        // Clean up timer if input changes before the delay expires
        return () => clearTimeout(timer);
    }, [inputValue, debounceMs, setSearchQuery]);

    // Handle search input change - just update local state which triggers the debounce effect
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    // Clear the search
    const handleClear = useCallback(() => {
        setInputValue('');
        setSearchQuery('');
    }, [setSearchQuery]);

    // Prevent form submission since we're filtering in real-time
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ width: fullWidth ? '100%' : 'auto' }}
        >
            <TextField
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                fullWidth={fullWidth}
                size="small"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: inputValue ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="clear search"
                                onClick={handleClear}
                                edge="end"
                                size="small"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
                sx={{ bgcolor: 'background.paper' }}
            />
        </form>
    );
};

export default SearchBar;
