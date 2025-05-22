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
        <div className="w-full bg-[#f2ece4] shadow-sm">
            <div className="max-w-6xl mx-auto">
                {/* Top navigation */}
                <div className="flex justify-between items-center p-1 border-b">
                    <div>
                        <a href="/seeker/jobs">
                        <img src="/images/Untitled-5.png" className="flex items-left bg-no-repeat max-w-xs max-h-auto" />
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Welcome, {userData?.fullName || "Seeker"}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 bg-[#657173] text-white rounded hover:bg-red-700 transition-colors"
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
                            ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                            : "text-gray-600 hover:text-[#F2BE5C]"
                            }`}
                    >
                        Available FIFO Jobs
                    </Link>
                    <Link
                        to="/seeker/activity"
                        className={`py-2 px-4 font-medium transition-colors ${isActive("/seeker/activity")
                            ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                            : "text-gray-600 hover:text-[#F2BE5C]"
                            }`}
                    >
                        Activity
                    </Link>
                    <Link
                        to="/seeker/profile"
                        className={`py-2 px-4 font-medium transition-colors ${isActive("/seeker/profile")
                            ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                            : "text-gray-600 hover:text-[#F2BE5C]"
                            }`}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/businesses"
                        className={`py-2 px-4 font-medium transition-colors ${isActive("/businesses")
                            ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                            : "text-gray-600 hover:text-[#F2BE5C]"
                            }`}
                    >
                        Businesses
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