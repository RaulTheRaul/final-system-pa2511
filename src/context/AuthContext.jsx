import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component to wrap around components that need auth
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sign up function
    const signup = async (email, password, userType, profileData) => {
        try {
            // Create the user authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create a user document in Firestore BEFORE signing out
            // This is important because your rules only allow document creation when authenticated
            await setDoc(doc(db, "users", user.uid), {
                email,
                userType,
                ...profileData,
                setupCompleted: false,
                createdAt: new Date(),
                emailVerified: false, // Track verification status in Firestore too
                tokenBalance: 0 // Initialize token balance to satisfy your rules
            });

            // Send email verification
            await sendEmailVerification(user);

            // Sign out the user after signup so they can't access the app until verified
            await signOut(auth);

            return user;
        } catch (error) {
            throw error;
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if email is verified
            if (!user.emailVerified) {
                // Force logout
                await signOut(auth);
                throw new Error("Please verify your email before logging in. Check your inbox for a verification link.");
            }

            return user;
        } catch (error) {
            throw error;
        }
    };

    // Function to resend verification email
    const resendVerificationEmail = async (email, password) => {
        try {
            // We need to temporarily log in the user to send the verification email
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Reload user to get the latest status
            await user.reload();

            if (!user.emailVerified) {
                await sendEmailVerification(user);
                // Sign out again
                await signOut(auth);
                return true;
            } else {
                // Already verified
                await signOut(auth);
                return false;
            }
        } catch (error) {
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    };

    // Get user data from Firestore
    const getUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                return data;
            } else {
                throw new Error("User data not found");
            }
        } catch (error) {
            throw error;
        }
    };

    // Update user's email verification status in Firestore when they verify
    const updateEmailVerificationStatus = async (user) => {
        if (user && user.emailVerified) {
            try {
                await setDoc(
                    doc(db, "users", user.uid),
                    { emailVerified: true },
                    { merge: true }
                );
            } catch (error) {
                console.error("Error updating verification status:", error);
            }
        }
    };

    // Set up auth state observer on mount and clean up on unmount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Force reload to get the latest verification status
                await user.reload();

                // Check if email is verified
                if (!user.emailVerified) {
                    // If not verified, sign them out immediately
                    console.log("User email not verified, signing out");
                    setCurrentUser(null);
                    await signOut(auth);
                    setLoading(false);
                    return;
                }

                // If we get here, user is verified
                setCurrentUser(user);

                // If the user's email is now verified, update it in Firestore too
                await updateEmailVerificationStatus(user);

                // Fetch user data
                try {
                    await getUserData(user.uid);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                // No user is signed in
                setCurrentUser(null);
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Context value
    const value = {
        currentUser,
        userData,
        signup,
        login,
        logout,
        getUserData,
        loading,
        resendVerificationEmail,
        isEmailVerified: currentUser?.emailVerified || false
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;