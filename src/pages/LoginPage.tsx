/**
 * File: src/pages/LoginPage.tsx
 *
 * Description: Login page component that contains the login form
 *
 */

import { LoginForm } from '@/components/user/LoginForm';
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

export function LoginPage() {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    const handleSuccessfulLogin = () => {
        navigate('/');
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setGoogleError(null);

        try {
            await loginWithGoogle();
            handleSuccessfulLogin();
        } catch (err) {
            console.error('Google login error:', err);
            setGoogleError(
                err instanceof Error
                    ? err.message
                    : 'Failed to sign in with Google. Please try again.'
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
                        Sign In
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        Enter your credentials to access your account
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
                        onClick={handleGoogleLogin}
                        loading={isGoogleLoading}
                        sx={{ mb: 3 }}
                    >
                        Sign in with Google
                    </Button>

                    <Divider sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            OR
                        </Typography>
                    </Divider>

                    <LoginForm onSuccess={handleSuccessfulLogin} />

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account?{' '}
                        <Link
                            component={Button}
                            onClick={() => navigate('/register')}
                            sx={{ textTransform: 'none' }}
                        >
                            Register here
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
