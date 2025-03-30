import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";

function App() {
  const { currentUser, userData, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading effect to prevent flashing of login screen
    // if we already have a logged in user
    if (currentUser !== undefined) {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // If user is not logged in, show AuthPage for login/signup
  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">User Profile</h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 font-medium">Name:</p>
            <p className="text-gray-900">
              {userData?.fullName || userData?.businessName || "Not provided"}
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
}

export default App;