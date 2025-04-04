import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPage from "../pages/AuthPage";
import BusinessSetup from "../pages/BusinessSetup";
<<<<<<< HEAD
import SeekerHome from "../pages/seekerHomePage/SeekerHome";

import BusinessHome from "../pages/businessHomePage/BusinessHome";



import JobseekerSetup from "../pages/JobseekerSetup";
//Change this below to whatever page you want to test.
//import Dashboard from "../pages/Dashboard";
import BusinessProfile from "../pages/businessHomePage/tabs/BusinessProfile";
=======
import Dashboard from "../pages/Dashboard";
import JobseekerSetup from "../pages/JobseekerSetup";
>>>>>>> origin/main

// Import the seeker pages
import SeekerJobsPage from "../pages/seekerHomePage/SeekerJobsPage";
import SeekerActivityPage from "../pages/seekerHomePage/SeekerActivityPage";
import SeekerProfilePage from "../pages/seekerHomePage/SeekerProfilePage";
import SeekerProfileEditPage from "../pages/seekerHomePage/SeekerProfileEditPage";

const Router = () => {
    const { currentUser, userData, loading } = useAuth();
    const isUserDataLoading = currentUser && !userData;

    // Show loading state while authentication is being determined
    if (loading || isUserDataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-blue-600 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    // Helper function to check if user is a seeker
    const isSeeker = () => {
        return userData?.userType === "seeker" || userData?.userType === "jobseeker";
    };

    // Helper function to check if setup is completed
    const needsSetup = () => {
        return currentUser && userData && !userData.setupCompleted;
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Public route */}
                <Route
                    path="/login"
                    element={
                        !currentUser ? <AuthPage /> : <Navigate to="/" replace />
                    }
                />

                {/* Protected routes */}
                <Route
                    path="/setup"
                    element={
                        needsSetup() ?
                            (userData.userType === "business" ?
                                <BusinessSetup /> :
                                (userData.userType === "jobseeker" ?
                                    <JobseekerSetup />
                                    : <Navigate to="/" replace />)) :
                            <Navigate to="/" replace />
                    }
                />

                {/* Seeker routes - separate routes for each section */}
                <Route
                    path="/seeker/jobs"
                    element={
                        currentUser && userData && isSeeker() ?
                            <SeekerJobsPage /> :
                            <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/seeker/activity"
                    element={
                        currentUser && userData && isSeeker() ?
                            <SeekerActivityPage /> :
                            <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/seeker/profile"
                    element={
                        currentUser && userData && isSeeker() ?
                            <SeekerProfilePage /> :
                            <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/seeker/profile/edit"
                    element={
                        currentUser && userData && isSeeker() ?
                            <SeekerProfileEditPage /> :
                            <Navigate to="/" replace />
                    }
                />

                {/* Dashboard as home route - redirect to appropriate dashboard */}
                <Route
                    path="/"
                    element={
                        currentUser ? (
                            userData ? (
                                userData.userType === "business" ? (
                                    !userData.setupCompleted ? (
                                        <Navigate to="/setup" replace />
                                    ) : (
                                        <BusinessProfile />
                                    )
                                ) : isSeeker() ? (
                                    <Navigate to="/seeker/jobs" replace />
                                ) : (
                                    <div>User type not recognized</div>
                                )
                            ) : (
                                <div>Loading user data...</div>
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Catch all other routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;