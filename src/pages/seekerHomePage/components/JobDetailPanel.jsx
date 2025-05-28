import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

const JobDetailPanel = ({ job }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [hasApplied, setHasApplied] = useState(false);
  const { currentUser } = useAuth();

  const display = (label, value) => (
    <p><strong>{label}:</strong> {value || "Not provided"}</p>
  );

  // 🔍 Check if the current user already applied to this job
  useEffect(() => {
    const checkIfAlreadyApplied = async () => {
      if (!currentUser || !job?.id) return;

      const q = query(
        collection(db, "applications"),
        where("jobId", "==", job.id),
        where("seekerId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setHasApplied(true);
      }
    };

    checkIfAlreadyApplied();
  }, [currentUser, job?.id]);

  // ✅ Handle apply
  const handleApply = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to apply.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();

      await addDoc(collection(db, "applications"), {
        jobId: job.id,
        jobTitle: job.title,
        postedBy: job.company || "Unknown",
        seekerId: currentUser.uid,
        seekerName: userData?.fullName || "Unknown",
        seekerEmail: currentUser.email,
        appliedAt: serverTimestamp(),
      });

      toast.success("✅ Application submitted!");
      setHasApplied(true);
    } catch (error) {
      console.error("Failed to apply:", error);
      toast.error("❌ Failed to apply.");
    }
  };

  const tabStyle = (tab) =>
    `px-4 py-2 border-b-2 text-sm font-medium cursor-pointer ${
      activeTab === tab
        ? "border-[#f2be5c] text-[#254159]"
        : "border-transparent text-gray-500 hover:text-[#254159]"
    }`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h2 className="text-2xl font-bold text-[#254159] mb-2">{job.title}</h2>
      <p className="text-sm text-gray-600 mb-1">
        📍 {job.location} | 💼 {job.jobType} | 📅 Start: {job.startDate || "TBA"}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Posted by: {job.company || "Unknown"}
      </p>

      {/* Tabs */}
      <div className="flex border-b mb-4 space-x-4">
        <button
          className={tabStyle("overview")}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={tabStyle("responsibilities")}
          onClick={() => setActiveTab("responsibilities")}
        >
          Responsibilities
        </button>
        <button
          className={tabStyle("fifo")}
          onClick={() => setActiveTab("fifo")}
        >
          FIFO Details
        </button>
        <button className={tabStyle("pay")} onClick={() => setActiveTab("pay")}>
          Pay & Benefits
        </button>
      </div>

      {/* Tab Content */}
      <div className="text-sm text-gray-700 space-y-2">
        {activeTab === "overview" && (
          <>
            <p><strong>Position Overview:</strong><br />{job.positionOverview}</p>
            <p><strong>Qualifications:</strong><br />{job.qualifications}</p>
            <p><strong>Start Date:</strong> {job.startDate}</p>
            <p><strong>Contract Duration:</strong> {job.contractDuration || "Ongoing"}</p>
            <p><strong>Application Deadline:</strong> {job.closingDate || "Open until filled"}</p>
          </>
        )}

        {activeTab === "responsibilities" && (
          <p><strong>Key Responsibilities:</strong><br />{job.responsibilities || "Not specified"}</p>
        )}

        {activeTab === "fifo" && (
          <>
            <p><strong>Roster Cycle:</strong> {job.rosterCycle}</p>
            <p><strong>Fly-In Locations:</strong> {job.flyInLocations}</p>
            <p><strong>Destination:</strong> {job.destinationLocation}</p>
            <p><strong>Transport:</strong> {job.transportInclusions}</p>
            <p><strong>Accommodation:</strong> {job.accommodationType} ({job.accommodationCosts})</p>
            <p><strong>Meals Provided:</strong> {job.mealsProvided}</p>
          </>
        )}

        {activeTab === "pay" && (
          <>
            {display("Hourly Rate / Salary", job.hourlyRate)}
            {display("Allowances", job.allowances)}
            {display("Bonuses", job.bonus)}
            {display("Professional Development", job.developmentOpportunities)}
          </>
        )}
      </div>

      {/* Apply Button */}
      <div className="mt-6">
        {hasApplied ? (
          <button
            className="bg-gray-400 cursor-not-allowed text-white font-medium px-6 py-2 rounded-md"
            disabled
          >
             Applied
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="bg-[#26425A] hover:bg-[#f2be5c] text-white font-medium px-6 py-2 rounded-md transition"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetailPanel;
