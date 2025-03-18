/**
 * File: src/pages/ForgotPasswordPage.tsx
 *
 * Description: Forgot password page component
 *
 */

import { ForgotPasswordForm } from '@/components/user/ForgotPasswordForm';
import {
    Button,
    Card,
    CardContent,
    Container,
    Link,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function ForgotPasswordPage() {
    const navigate = useNavigate();

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
                        Reset Password
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        Enter your email to receive a password reset link
                    </Typography>

                    <ForgotPasswordForm />

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Remember your password?{' '}
                        <Link
                            component={Button}
                            onClick={() => navigate('/login')}
                            sx={{ textTransform: 'none' }}
                        >
                            Back to Sign In
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
