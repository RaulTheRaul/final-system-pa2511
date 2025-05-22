import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const BusinessNavigation = () => {
    const location = useLocation();
    const { userData, logout } = useAuth();

    //this function will handle any logout errors
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

    //Styling of nav bar
    return (
        <div>
            <div className="w-full bg-[#f2ece4] shadow-sm">
                <div className="max-w-6xl mx-auto">
                    {/* Top navigation */}
                    <div className="flex justify-between items-center p-1 border-b">
                        <div>
                            <a href="/business/recruit"> {/* Redirect to home when clicked  Note: Needs to be changed to activity*/}
                                <img src="/images/Untitled-5.png" className="flex items-left bg-no-repeat max-w-xs max-h-auto" />
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">
                                Welcome, {userData?.businessName || "Business"}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 bg-[#657173] text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main navigation - EDIT*/}
                    <div className="flex space-x-6 p-4">
                        <Link
                            to="/business/recruit"
                            className={`py-2 px-4 font-medium transition-colors ${isActive("/business/recruit")
                                ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                                : "text-gray-600 hover:text-[#F2BE5C]"
                                }`}
                        >
                            Recruit Workforce
                        </Link>

                        {/*
                     Note: Will change this when added more pages for business
                     <Link
                        to="/seeker/activity"
                        className={`py-2 px-4 font-medium transition-colors ${isActive("/seeker/activity")
                            ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                            : "text-gray-600 hover:text-[#F2BE5C]"
                            }`}
                    >
                        Activity
                    </Link> 
                    */}
                        <Link
                            to="/business/profile"
                            className={`py-2 px-4 font-medium transition-colors ${isActive("/business/profile")
                                ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                                : "text-gray-600 hover:text-[#F2BE5C]"
                                }`}
                        >
                            Business Profile
                        </Link>

                        {/* Token Management Link */}
                        <Link
                            to="/business/tokens"
                            className={`py-2 px-4 font-medium transition-colors ${isActive("/business/tokens")
                                ? "text-[#F2BE5C] border-b-2 border-[#F2BE5C]"
                                : "text-gray-600 hover:text-[#F2BE5C]"
                                }`}
                        >
                            Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BusinessNavigation;