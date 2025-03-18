/**
 * File: src/pages/RegisterPage.tsx
 *
 * Description: Registration page component that contains the registration form
 *
 */

import { RegisterForm } from '@/components/user/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import GoogleIcon from '@mui/icons-material/Google';
import {
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Link,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    const handleSuccessfulRegistration = () => {
        navigate('/');
    };

    const handleGoogleRegistration = async () => {
        setIsGoogleLoading(true);
        setGoogleError(null);

        try {
            await loginWithGoogle();
            handleSuccessfulRegistration();
        } catch (err) {
            console.error('Google registration error:', err);
            setGoogleError(
                err instanceof Error
                    ? err.message
                    : 'Failed to register with Google. Please try again.'
            );
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                    >
                        Create Account
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        Register to start creating and saving prompts
                    </Typography>

                    {googleError && (
                        <Typography
                            color="error"
                            variant="body2"
                            align="center"
                            sx={{ mb: 2 }}
                        >
                            {googleError}
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleRegistration}
                        loading={isGoogleLoading}
                        sx={{ mb: 3 }}
                    >
                        Sign up with Google
                    </Button>

                    <Divider sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            OR
                        </Typography>
                    </Divider>

                    <RegisterForm onSuccess={handleSuccessfulRegistration} />

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link
                            component={Button}
                            onClick={() => navigate('/login')}
                            sx={{ textTransform: 'none' }}
                        >
                            Sign in here
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
