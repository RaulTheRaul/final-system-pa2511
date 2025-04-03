import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import JobPostings from "./tabs/JobPostings";
import Activity from "./tabs/Activity";
import ProfileOverview from "./tabs/ProfileOverview";

const SeekerHome = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const { userData, logout } = useAuth();

  const handleLogout = async () => {
    try {
      //This calls logout from authContext
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {userData?.fullName || "Seeker"}</h1>
    <div className=" max-w-4xl mx-auto">
      <div className="text-xl flex gap-4 mb-6 font-semibold bg-gray-300 rounded-md">
        <div className="p-1">PlatformNameHere</div>
        <a className="hover:bg-blue-300 rounded-md p-1" href="#dashboard">Dashboard</a>
        <a className="hover:bg-blue-300 rounded-md p-1" href="#searchEngine">Vacancies</a>
        <a className="hover:bg-blue-300 rounded-md p-1" href="#searchEngine">Job Seekers</a>
        <a className="hover:bg-blue-300 rounded-md p-1" href="#searchEngine">Businesses</a>
      </div>

      <h1 className="text-2xl font-bold mb-4">Welcome, Seeker </h1>

        {/* Setup Reminder */}
        {!userData?.setupCompleted && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6 border border-yellow-300">
            Your profile setup is incomplete.{" "}
            <Link to="/setup" className="underline text-blue-600 font-medium">
              Click here to complete it
            </Link>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex space-x-4 mb-6 border-b">
          {["jobs", "activity", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium border-b-2 transition duration-150 ${activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500"
                }`}
            >
              {tab === "jobs" ? "Job Postings" : tab === "activity" ? "Activity" : "Profile"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "jobs" && <JobPostings />}
          {activeTab === "activity" && <Activity />}
          {activeTab === "profile" && <ProfileOverview />}
        </div>
        <div className="pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeekerHome;