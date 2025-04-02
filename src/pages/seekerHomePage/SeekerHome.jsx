import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import JobPostings from "./tabs/JobPostings";
import Activity from "./tabs/Activity";
import ProfileOverview from "./tabs/ProfileOverview";

const SeekerHome = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const { userData } = useAuth();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, Seeker </h1>

      {/*  Setup reminder if profile isn't completed */}
      {!userData?.setupCompleted && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">
          Your profile setup is incomplete.{" "}
          <Link to="/setup" className="underline text-blue-600">
            Click here to complete it
          </Link>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("jobs")} className={activeTab === "jobs" ? "font-semibold" : ""}>
          Job Postings
        </button>
        <button onClick={() => setActiveTab("activity")} className={activeTab === "activity" ? "font-semibold" : ""}>
          Activity
        </button>
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "font-semibold" : ""}>
          Profile
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "jobs" && <JobPostings />}
        {activeTab === "activity" && <Activity />}
        {activeTab === "profile" && <ProfileOverview />}
      </div>
    </div>
  );
};

export default SeekerHome;
