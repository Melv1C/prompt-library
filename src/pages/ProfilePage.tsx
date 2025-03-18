/**
 * File: src/pages/ProfilePage.tsx
 *
 * Description: User profile page accessible only to authenticated users
 *
 */

import { userAtom } from '@/store/authAtom';
import { Avatar, Box, Container, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';

export const ProfilePage = () => {
    const user = useAtomValue(userAtom);

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar
                    src={user?.photoURL || undefined}
                    alt={user?.displayName || 'Profile'}
                    sx={{ width: 100, height: 100, mb: 3 }}
                />
                <Typography variant="h4" component="h1" gutterBottom>
                    My Profile
                </Typography>
                <Typography variant="subtitle1">{user?.displayName}</Typography>
                <Typography variant="body1">{user?.email}</Typography>
            </Box>
        </Container>
    );
};
