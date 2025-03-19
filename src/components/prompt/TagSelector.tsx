/**
 * File: src/components/prompt/TagSelector.tsx
 *
 * Description: Advanced tag selector component with dropdown and accordion features
 * Provides a clean interface for selecting tags from categorized groups
 */

import { TAG_GROUPS } from '@/constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Chip,
    ClickAwayListener,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    Popper,
    Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

/**
 * Props for the TagSelector component
 * Uses generics to ensure type safety with react-hook-form
 */
interface TagSelectorProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    error?: boolean;
    helperText?: string;
}

/**
 * A dropdown tag selector component with accordion grouping
 * Provides a clean interface for selecting tags from categorized groups
 */
export function TagSelector<T extends FieldValues>({
    name,
    control,
    label,
    error,
    helperText,
}: TagSelectorProps<T>) {
    // State for handling dropdown open/close
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    // Get field controller from react-hook-form
    const { field } = useController({
        name,
        control,
    });

    // Get selected tag count
    const selectedTagCount = field.value.length;

    return (
        <>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>

            {/* Custom Select-like component */}
            <Box ref={anchorRef}>
                <OutlinedInput
                    id={name}
                    label={label}
                    onClick={() => setOpen((prev) => !prev)}
                    value={selectedTagCount > 0 ? ' ' : ''} // Hack to always show the label
                    readOnly
                    error={error}
                    fullWidth
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen((prev) => !prev);
                                }}
                            >
                                <KeyboardArrowDownIcon
                                    sx={{
                                        transform: open
                                            ? 'rotate(180deg)'
                                            : 'rotate(0)',
                                        transition: 'transform 150ms ease',
                                    }}
                                />
                            </IconButton>
                        </InputAdornment>
                    }
                    sx={{
                        cursor: 'pointer',
                        '& .MuiOutlinedInput-input': {
                            cursor: 'pointer',
                        },
                    }}
                />
                {/* Render selected tags */}
                {selectedTagCount > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: 14,
                            right: 40,
                            pointerEvents: 'none',
                        }}
                    >
                        {field.value.map((tag: string) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    const newTags = field.value.filter(
                                        (t: string) => t !== tag
                                    );
                                    field.onChange(newTags);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                sx={{ pointerEvents: 'auto' }}
                            />
                        ))}
                    </Box>
                )}

                {/* Display helper text if provided */}
                {helperText && (
                    <FormHelperText error={error}>{helperText}</FormHelperText>
                )}
            </Box>

            {/* Dropdown panel with accordions */}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                style={{
                    width: anchorRef.current?.clientWidth,
                    zIndex: 1300,
                }}
            >
                <ClickAwayListener onClickAway={(e) => {
                    if (anchorRef.current?.contains(e.target as Node)) {
                        return;
                    }
                    setOpen(false);
                }}>
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 1,
                            maxHeight: '350px',
                            overflowY: 'auto',
                        }}
                    >
                        {Object.entries(TAG_GROUPS).map(([groupKey, tags]) => (
                            <Accordion
                                key={groupKey}
                                disableGutters
                                sx={{
                                    '&:before': {
                                        display: 'none', // Remove default divider
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`${groupKey}-content`}
                                    id={`${groupKey}-header`}
                                >
                                    <Typography>
                                        {groupKey.replace(/_/g, ' ')}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: 'text.secondary',
                                            ml: 1,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        (
                                        {
                                            tags.filter((tag) =>
                                                field.value.includes(tag)
                                            ).length
                                        }{' '}
                                        selected)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0 }}>
                                    <FormGroup>
                                        {tags.map((tag) => (
                                            <FormControlLabel
                                                key={tag}
                                                control={
                                                    <Checkbox
                                                        checked={field.value.includes(
                                                            tag
                                                        )}
                                                        onChange={(e) => {
                                                            const newTags = e
                                                                .target.checked
                                                                ? [
                                                                      ...field.value,
                                                                      tag,
                                                                  ]
                                                                : field.value.filter(
                                                                      (
                                                                          t: string
                                                                      ) =>
                                                                          t !==
                                                                          tag
                                                                  );
                                                            field.onChange(
                                                                newTags
                                                            );
                                                        }}
                                                        size="small"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    />
                                                }
                                                label={tag}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        ))}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                        {/* Action buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1.5,
                            }}
                        >
                            <Button
                                size="small"
                                onClick={() => {
                                    field.onChange([]);
                                }}
                                disabled={field.value.length === 0}
                            >
                                Clear All
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => setOpen(false)}
                            >
                                Done
                            </Button>
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    );
}
