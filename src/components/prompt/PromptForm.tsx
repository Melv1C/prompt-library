/**
 * File: src/components/prompt/PromptForm.tsx
 *
 * Description: Reusable form component for creating and editing prompts
 *
 */

import { PromptCategory } from '@/constants';
import { useCreatePrompt, useUpdatePrompt } from '@/hooks/usePromptActions';
import { userAtom } from '@/store/authAtom';
import {
    CreatePromptSchema,
    CreatePromptType,
    PromptType,
    UpdatePromptType,
} from '@/types/prompt';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TagSelector } from './TagSelector';

interface PromptFormProps {
    prompt?: PromptType;
    isEditing?: boolean;
    onSuccess?: (prompt: PromptType) => void;
}

export function PromptForm({
    prompt,
    isEditing = false,
    onSuccess,
}: PromptFormProps) {
    const navigate = useNavigate();
    const user = useAtomValue(userAtom); // Get the current user from the atom

    const { createPromptAction, state: createState } = useCreatePrompt();
    const { updatePromptAction, state: updateState } = useUpdatePrompt();

    // Use the appropriate state based on whether we're editing or creating
    const { loading, error, success, data } = isEditing
        ? updateState
        : createState;

    // Set up react-hook-form with modified zod resolver
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: zodResolver(CreatePromptSchema),
        mode: 'onChange',
        defaultValues: {
            title: prompt?.title || '',
            description: prompt?.description || '',
            content: prompt?.content || '',
            tags: prompt?.tags || [],
            category: prompt?.category || PromptCategory.OTHER,
            isPublic: prompt?.isPublic || false,
            authorId: prompt?.authorId || '',
        },
    });

    // Set authorId when user is available
    useEffect(() => {
        if (user?.id) {
            setValue('authorId', user.id);
        }
    }, [user, setValue]);

    // Reset form when prompt changes (useful when navigating between different prompts in edit mode)
    useEffect(() => {
        if (prompt) {
            reset({
                title: prompt.title,
                description: prompt.description,
                content: prompt.content,
                tags: prompt.tags,
                category: prompt.category,
                isPublic: prompt.isPublic,
                authorId: prompt.authorId,
            });
        }
    }, [prompt, reset]);

    // Navigate after successful submission
    useEffect(() => {
        if (success && data) {
            if (onSuccess) {
                onSuccess(data);
            } else {
                // Navigate to the prompt view page
                navigate(`/prompts/${data.id}`);
            }
        }
    }, [success, data, navigate, onSuccess]);

    const onSubmit = async (formData: CreatePromptType) => {
        if (isEditing && prompt) {
            // Prepare update data
            const updateData: UpdatePromptType = {
                ...formData,
                id: prompt.id,
                updatedAt: new Date(),
            };

            // Call update action
            await updatePromptAction(prompt.id, updateData);
        } else {
            // Call create action with modified data
            await createPromptAction(formData);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 2 }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
            )}

            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Prompt Title"
                        autoFocus
                        error={!!errors.title}
                        helperText={errors.title?.message?.toString()}
                    />
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        fullWidth
                        id="description"
                        label="Description (optional)"
                        multiline
                        rows={2}
                        error={!!errors.description}
                        helperText={errors.description?.message?.toString()}
                    />
                )}
            />

            <Controller
                name="content"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        required
                        fullWidth
                        id="content"
                        label="Prompt Content"
                        multiline
                        rows={8}
                        error={!!errors.content}
                        helperText={errors.content?.message?.toString()}
                    />
                )}
            />

            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.category}
                    >
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            {...field}
                            labelId="category-label"
                            id="category"
                            label="Category"
                        >
                            {Object.entries(PromptCategory).map(
                                ([key, value]) => (
                                    <MenuItem key={key} value={value}>
                                        {value}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                        {errors.category && (
                            <FormHelperText>
                                {errors.category.message?.toString()}
                            </FormHelperText>
                        )}
                    </FormControl>
                )}
            />

            {/* Use the extracted TagSelector component */}
            <FormControl fullWidth margin="normal" error={!!errors.tags}>
                <TagSelector
                    name="tags"
                    control={control}
                    label="Tags"
                    error={!!errors.tags}
                    helperText={errors.tags?.message?.toString()}
                />
            </FormControl>

            <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={field.value}
                                onChange={(e) =>
                                    field.onChange(e.target.checked)
                                }
                            />
                        }
                        label="Make this prompt public"
                    />
                )}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isDirty || !isValid || loading} // Fixed loading prop
            >
                {isEditing ? 'Update Prompt' : 'Create Prompt'}
            </Button>
        </Box>
    );
}
