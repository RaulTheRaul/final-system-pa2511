import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPage from "../pages/AuthPage";
import BusinessSetup from "../pages/BusinessSetup";
import Dashboard from "../pages/Dashboard";
import JobseekerSetup from "../pages/JobseekerSetup";

// Import the business pages
import BusinessProfile from "../pages/businessHomePage/tabs/BusinessProfile";
import BusinessRecruitSeeker from "../pages/businessHomePage/BusinessRecruitSeeker";
import BusinessProfileEdit from "../pages/businessHomePage/BusinessProfileEdit";
import TokenManagement from "../pages/businessHomePage/tabs/TokenManagement";
import BusinessJobPage from "../pages/businessHomePage/BusinessJobPage";
import BusinessActivity from "../pages/businessHomePage/tabs/BusinessActivity";

// Updated: Import the new split-pane job board
import SeekerJobBoard from "../pages/seekerHomePage/SeekerJobBoard";
import SeekerActivityPage from "../pages/seekerHomePage/SeekerActivityPage";
import SeekerProfilePage from "../pages/seekerHomePage/SeekerProfilePage";
import SeekerProfileEditPage from "../pages/seekerHomePage/SeekerProfileEditPage";

// Business list pages
import BusinessListPage from "../pages/seekerHomePage/BusinessListPage";
import BusinessDetailPage from "../pages/seekerHomePage/BusinessDetailPage";

const Router = () => {
    const { currentUser, userData, loading } = useAuth();
    const isUserDataLoading = currentUser && !userData;

    if (loading || isUserDataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-blue-600 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    const isSeeker = () => userData?.userType === "seeker" || userData?.userType === "jobseeker";
    const isBussiness = () => userData?.userType === "business";
    const needsSetup = () => currentUser && userData && !userData.setupCompleted;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!currentUser ? <AuthPage /> : <Navigate to="/" replace />} />

                <Route path="/setup" element={needsSetup() ? (
                    userData.userType === "business" ? <BusinessSetup /> : <JobseekerSetup />
                ) : <Navigate to="/" replace />} />

                {/* Seeker routes */}
                <Route
                    path="/seeker/jobs"
                    element={
                        currentUser && userData && isSeeker() ? (
                            <SeekerJobsPage />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/seeker/activity"
                    element={
                        currentUser && userData && isSeeker() ? (
                            <SeekerActivityPage />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/seeker/profile"
                    element={
                        currentUser && userData && isSeeker() ? (
                            <SeekerProfilePage />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/seeker/profile/edit"
                    element={
                        currentUser && userData && isSeeker() ? (
                            <SeekerProfileEditPage />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                {/* Business listing routes */}
                <Route
                    path="/businesses"
                    element={
                        currentUser && userData && isSeeker() ? (
                            <BusinessListPage />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/businesses/:businessId"
                    element={
                        currentUser && userData && isSeeker() ? (
                            <BusinessDetailPage />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                {/* Business routes */}
                <Route
                    path="/business/recruit"
                    element={
                        currentUser && userData && isBussiness() ? (
                            <BusinessRecruitSeeker />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/business/profile"
                    element={
                        currentUser && userData && isBussiness() ? (
                            <BusinessProfile />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/business/profile/edit"
                    element={
                        currentUser && userData && isBussiness() ? (
                            <BusinessProfileEdit />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/business/tokens"
                    element={
                        currentUser && userData && isBussiness() ? (
                            <TokenManagement />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                {/* ✅ New: Business Jobs route */}
                <Route
                    path="/business/jobs"
                    element={
                        currentUser && userData && isBussiness() ? (
                            <BusinessJobPage />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                <Route
                    path="/business/activity"
                    element={
                        currentUser && userData && isBussiness() ?
                            <BusinessActivity /> :
                            <Navigate to="/" replace />
                    }
                />

                <Route path="/" element={currentUser ? (
                    userData ? (
                        userData.userType === "business" ? (
                            !userData.setupCompleted ? <Navigate to="/setup" replace /> : <BusinessRecruitSeeker />
                        ) : isSeeker() ? <Navigate to="/seeker/jobs" replace /> : <div>User type not recognized</div>
                    ) : <div>Loading user data...</div>
                ) : <Navigate to="/login" replace />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
