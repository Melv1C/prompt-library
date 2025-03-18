/**
 * File: src/components/layout/navigation/navLinks.tsx
 *
 * Description: Shared navigation links configuration
 *
 */

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import HomeIcon from '@mui/icons-material/Home';
// import InfoIcon from '@mui/icons-material/Info';

/**
 * Navigation links configuration with paths and icons
 */
export const navLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Prompts', path: '/prompts', icon: <AutoStoriesIcon /> },
    {
        name: 'My Library',
        path: '/my-library',
        icon: <CollectionsBookmarkIcon />,
    },
    // { name: 'About', path: '/about', icon: <InfoIcon /> },
];
