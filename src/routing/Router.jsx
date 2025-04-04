import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPage from "../pages/AuthPage";
import BusinessSetup from "../pages/BusinessSetup";
import SeekerHome from "../pages/seekerHomePage/SeekerHome";

import BusinessHome from "../pages/businessHomePage/BusinessHome";



import JobseekerSetup from "../pages/JobseekerSetup";
//Change this below to whatever page you want to test.
//import Dashboard from "../pages/Dashboard";
import BusinessProfile from "../pages/businessHomePage/tabs/BusinessProfile";


const Router = () => {
    const { currentUser, userData, loading } = useAuth();
    //Used this to fix seeing dashboard before setup
    const isUserDataLoading = currentUser && !userData;

    // Show loading state while authentication is being determined
    if (loading || isUserDataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-blue-600 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

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
                        currentUser && userData && !userData.setupCompleted ?
                            (userData.userType === "business" ?
                                <BusinessSetup /> :
                                (userData.userType === "jobseeker" ?
                                    <JobseekerSetup />
                                    : <Navigate to="/" replace />)) :
                            <Navigate to="/" replace />
                    }
                />

                {/* Dashboard as home route */}
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
                                ) : userData.userType === "seeker" || userData.userType === "jobseeker" ? (
                                    <SeekerHome />
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

}
export default Router;