/**
 * File: src/services/auth.ts
 *
 * Description: Firebase authentication service with methods for user authentication,
 * registration, and profile management
 *
 */

import { auth, db } from '@/config/firebase';
import { UserSchema, UserType } from '@/types/user';
import {
    User as FirebaseUser,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

/**
 * Creates a new user account with email and password
 */
export const registerWithEmailAndPassword = async (
    email: string,
    password: string,
    displayName: string
): Promise<UserType> => {
    try {
        // Create the authentication account in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Update profile with display name
        await updateProfile(user, {
            displayName,
        });

        // Create the user document in Firestore
        const userData: Omit<UserType, 'id'> = {
            displayName,
            email,
            photoURL: user.photoURL || '',
            createdAt: new Date(),
            favoritePrompts: [],
        };

        await setDoc(doc(db, 'users', user.uid), {
            ...userData,
            createdAt: serverTimestamp(),
        });

        // Return a properly formatted user object that matches our UserType
        return {
            id: user.uid,
            ...userData,
        };
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

/**
 * Signs in a user with email and password
 */
export const loginWithEmailAndPassword = async (
    email: string,
    password: string
) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in user:', error);
        throw error;
    }
};

/**
 * Signs in a user with Google
 */
export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Check if user exists in Firestore, if not create a new record
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            const userData: Omit<UserType, 'id'> = {
                displayName: user.displayName || 'User',
                email: user.email || '',
                photoURL: user.photoURL || '',
                createdAt: new Date(),
                favoritePrompts: [],
            };

            await setDoc(doc(db, 'users', user.uid), {
                ...userData,
                createdAt: serverTimestamp(),
            });
        }

        return user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

/**
 * Signs out the current user
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

/**
 * Sends a password reset email
 */
export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

/**
 * Fetches user data from Firestore
 */
export const fetchUserData = async (
    userId: string
): Promise<UserType | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Fetched user data:', userData);
            const parsedUser = UserSchema.parse({
                id: userId,
                ...userData,
                createdAt: userData.createdAt
                    ? userData.createdAt.toDate()
                    : new Date(),
            });
            return parsedUser;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

/**
 * Converts a FirebaseUser to our UserType
 */
export const firebaseUserToUser = async (
    firebaseUser: FirebaseUser | null
): Promise<UserType | null> => {
    if (!firebaseUser) return null;

    try {
        return await fetchUserData(firebaseUser.uid);
    } catch (error) {
        console.error('Error converting Firebase user:', error);
        return null;
    }
};
