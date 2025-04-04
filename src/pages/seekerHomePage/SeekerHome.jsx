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
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--nude)",
        color: "var(--night)",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        {/* Top Navigation Bar */}
        <div
          style={{
            backgroundColor: "var(--misto)",
            display: "flex",
            gap: "1rem",
            padding: "0.75rem",
            fontWeight: "600",
            borderRadius: "0.5rem",
          }}
        >
          <div>CentreConnect</div>
          {["Dashboard", "Vacancies", "Job Seekers", "Businesses"].map((label) => (
            <a
              key={label}
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--honey)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {label}
            </a>
          ))}
        </div>

        {/* Welcome Box */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            marginTop: "1rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Welcome, {userData?.fullName || "Seeker"} 👋
          </h1>
        </div>

        {/* Setup Reminder */}
        {!userData?.setupCompleted && (
          <div
            style={{
              backgroundColor: "var(--honey)",
              color: "#000",
              padding: "1rem",
              marginTop: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid #e2c044",
            }}
          >
            Your profile setup is incomplete.{" "}
            <Link to="/setup" style={{ textDecoration: "underline", color: "var(--ocean)" }}>
              Click here to complete it
            </Link>
          </div>
        )}

        {/* Tab Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            borderBottom: "2px solid var(--misto)",
            marginBottom: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          {["jobs", "activity", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                borderBottom:
                  activeTab === tab ? "3px solid var(--ocean)" : "3px solid transparent",
                color: activeTab === tab ? "var(--ocean)" : "var(--misto)",
                background: "transparent",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {tab === "jobs"
                ? "Job Postings"
                : tab === "activity"
                ? "Activity"
                : "Profile"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "jobs" && <JobPostings />}
          {activeTab === "activity" && <Activity />}
          {activeTab === "profile" && <ProfileOverview />}
        </div>

        {/* Logout Button */}
        <div style={{ marginTop: "2rem", paddingTop: "1rem" }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "var(--ocean)",
              color: "white",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeekerHome;
