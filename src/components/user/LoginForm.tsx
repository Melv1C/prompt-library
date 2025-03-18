/**
 * File: src/components/user/LoginForm.tsx
 *
 * Description: Login form component with validation and error handling
 *
 */

import { useAuth } from '@/hooks/useAuth';
import { AuthUserSchema } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define the login form schema using AuthUserSchema
const loginFormSchema = AuthUserSchema;
type LoginFormData = z.infer<typeof loginFormSchema>;

type LoginFormProps = {
    onSuccess?: () => void;
};

export function LoginForm(props: LoginFormProps) {
    const { onSuccess } = props;
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await login(data.email, data.password);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to sign in. Please check your credentials and try again.'
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

            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleTogglePassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                loading={isSubmitting}
                sx={{ mt: 2, mb: 2 }}
            >
                Sign In
            </Button>
        </Box>
    );
}
