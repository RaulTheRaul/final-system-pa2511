// NOTE!!!!!!!
// This is a temporary dashboard to view user data.
//This file will be deleted once JobseekerDashboard and BusinessDashboard are created.



import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { currentUser, userData, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h1 className="text-2xl font-bold text-blue-600 mb-6">User Profile</h1>

                <div className="space-y-4">
                    <div>
                        <p className="text-gray-600 font-medium">Name:</p>
                        <p className="text-gray-900">
                            {userData?.businessInformation?.centreName ||
                                userData?.fullName ||
                                userData?.businessName ||
                                "Not provided"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-600 font-medium">Email:</p>
                        <p className="text-gray-900">{currentUser.email}</p>
                    </div>

                    <div>
                        <p className="text-gray-600 font-medium">Account Type:</p>
                        <p className="text-gray-900 capitalize">{userData?.userType || "Not specified"}</p>
                    </div>

                    {userData?.userType === "business" && userData?.businessInformation && (
                        <>
                            <div>
                                <p className="text-gray-600 font-medium">Centre Address:</p>
                                <p className="text-gray-900">{userData.businessInformation.centreAddress || "Not provided"}</p>
                            </div>

                            <div>
                                <p className="text-gray-600 font-medium">Centre Type:</p>
                                <p className="text-gray-900 capitalize">{userData.businessInformation.centreType || "Not specified"}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;