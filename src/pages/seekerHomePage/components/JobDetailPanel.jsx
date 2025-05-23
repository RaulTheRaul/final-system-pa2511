import { useState } from "react";

const JobDetailPanel = ({ job }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabStyle = (tab) =>
    `px-4 py-2 border-b-2 text-sm font-medium cursor-pointer ${
      activeTab === tab ? "border-[#f2be5c] text-[#254159]" : "border-transparent text-gray-500 hover:text-[#254159]"
    }`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h2 className="text-2xl font-bold text-[#254159] mb-2">{job.title}</h2>
      <p className="text-sm text-gray-600 mb-1">
        📍 {job.location} | 💼 {job.jobType} | 📅 Start: {job.startDate || "TBA"}
      </p>
      <p className="text-sm text-gray-500 mb-4">Posted by: {job.company || "Unknown"}</p>

      {/* Tabs */}
      <div className="flex border-b mb-4 space-x-4">
        <button className={tabStyle("overview")} onClick={() => setActiveTab("overview")}>Overview</button>
        <button className={tabStyle("responsibilities")} onClick={() => setActiveTab("responsibilities")}>Responsibilities</button>
        <button className={tabStyle("fifo")} onClick={() => setActiveTab("fifo")}>FIFO Details</button>
        <button className={tabStyle("pay")} onClick={() => setActiveTab("pay")}>Pay & Benefits</button>
      </div>

      {/* Tab Content */}
      <div className="text-sm text-gray-700 space-y-2">
        {activeTab === "overview" && (
          <>
            <p><strong>Position Overview:</strong><br />{job.positionOverview}</p>
            <p><strong>Schedule:</strong> {job.schedule}</p>
            <p><strong>Description:</strong><br />{job.description}</p>
            <p><strong>Qualifications:</strong><br />{job.requirements}</p>
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
            <p><strong>Hourly Rate / Salary:</strong> {job.payRate}</p>
            <p><strong>Allowances:</strong> {job.allowances}</p>
            <p><strong>Bonuses:</strong> {job.bonuses}</p>
            <p><strong>Professional Development:</strong> {job.professionalDevelopment}</p>
          </>
        )}
      </div>

      <div className="mt-6">
        <button className="bg-[#26425A] hover:bg-[#f2be5c] text-white font-medium px-6 py-2 rounded-md transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetailPanel;
