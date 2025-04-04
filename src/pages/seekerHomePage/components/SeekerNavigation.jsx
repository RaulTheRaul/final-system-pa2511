import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const SeekerNavigation = () => {
    const location = useLocation();
    const { userData, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    //Check if current path matches the link path
    const isActive = (path) => {
        return location.pathname === path;
    };


    //This is all the styling for the nav bar, adjust it to match colour when possible
    //Need to implement Business section to view all businesses.
    return (
        <div className="w-full bg-white shadow-sm">
            <div className="max-w-6xl mx-auto">
                {/* Top navigation */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">Childcare Connect</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Welcome, {userData?.fullName || "Seeker"}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main navigation */}
                <div className="flex space-x-6 p-4">
                    <Link
                        to="/seeker/jobs"
                        className={`py-2 px-4 font-medium transition-colors ${isActive("/seeker/jobs")
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                            }`}
                    >
                        Job Postings
                    </Link>
                    <Link
                        to="/seeker/activity"
                        className={`py-2 px-4 font-medium transition-colors ${isActive("/seeker/activity")
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                            }`}
                    >
                        Activity
                    </Link>
                    <Link
                        to="/seeker/profile"
                        className={`py-2 px-4 font-medium transition-colors ${isActive("/seeker/profile")
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                            }`}
                    >
                        Profile
                    </Link>
                </div>
            </div>

            {/* Setup Reminder Banner */}
            {!userData?.setupCompleted && (
                <div className="bg-yellow-100 text-yellow-800 p-4 border-t border-b border-yellow-300">
                    <div className="max-w-6xl mx-auto">
                        Your profile setup is incomplete.{" "}
                        <Link to="/setup" className="underline text-blue-600 font-medium">
                            Click here to complete it
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeekerNavigation;