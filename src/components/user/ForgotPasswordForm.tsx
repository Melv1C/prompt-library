/**
 * File: src/components/user/ForgotPasswordForm.tsx
 *
 * Description: Forgot password form component with validation
 *
 */

import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema for password reset email
const forgotPasswordSchema = z.object({
    email: z.string().email('Valid email address is required'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordFormProps = {
    onSuccess?: () => void;
};

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
    const { onSuccess } = props;
    const { resetPassword } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await resetPassword(data.email);
            setSuccessMessage(
                `Password reset email sent to ${data.email}. Please check your inbox.`
            );
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Password reset error:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to send password reset email. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <TextField
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                margin="normal"
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                loading={isSubmitting}
                sx={{ mt: 2, mb: 2 }}
            >
                Reset Password
            </Button>
        </Box>
    );
}
