import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import BusinessNavigation from "./components/BusinessNavigation";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";

const CreateJobPage = () => {
  const { currentUser, userData } = useAuth();
  const [newJob, setNewJob] = useState({
    title: "",
    positionOverview: "",
    responsibilities: "",
    qualifications: "",
    employmentType: "",
    startDate: "",
    contractDuration: "",
    applicationClosingDate: "",
    rosterCycle: "",
    flyInLocations: "",
    destinationLocation: "",
    transportInclusions: "",
    accommodationType: "",
    accommodationCosts: "",
    mealsProvided: "",
    hourlyRate: "",
    allowances: "",
    bonus: "",
    developmentOpportunities: ""
  });
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "jobs"), {
        ...newJob,
        businessId: currentUser.uid,
        company: userData?.businessName || "Unknown",
        createdAt: serverTimestamp()
      });
      navigate("/business/activity");
    } catch (err) {
      console.error("Failed to post job:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2ece4]">
      <BusinessNavigation />
      <div className="max-w-6xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-[#254159] mb-2">📝 Post a New Job</h2>
          <p className="text-sm text-gray-500 mb-4">
            Provide detailed information to help jobseekers understand the role.
          </p>

          {/* Job Basics */}
          <details className="border rounded-md p-4 mb-4">
            <summary className="text-lg font-semibold text-[#254159] cursor-pointer">Job Basics</summary>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Job Title</label>
                <input type="text" name="title" value={newJob.title} onChange={handleChange} placeholder="e.g., FIFO Educator" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Position Overview</label>
                <textarea name="positionOverview" value={newJob.positionOverview} onChange={handleChange} placeholder="Brief summary of the role" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" rows="3" required></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Key Responsibilities</label>
                <textarea name="responsibilities" value={newJob.responsibilities} onChange={handleChange} rows="4" placeholder="List of key tasks and responsibilities, e.g., • Supervise children\n• Plan activities\n• Communicate with parents" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required></textarea>
              </div>
            </div>
          </details>

          {/* Qualifications and Terms */}
          <details className="border rounded-md p-4 mb-4">
            <summary className="text-lg font-semibold text-[#254159] cursor-pointer">Qualifications & Terms</summary>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input name="qualifications" value={newJob.qualifications} onChange={handleChange} placeholder="Qualifications Required" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="employmentType" value={newJob.employmentType} onChange={handleChange} placeholder="Employment Type (e.g., Full-time)" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="startDate" type="date" value={newJob.startDate} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="contractDuration" value={newJob.contractDuration} onChange={handleChange} placeholder="Contract Duration" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="applicationClosingDate" type="date" value={newJob.applicationClosingDate} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            </div>
          </details>

          {/* FIFO */}
          <details className="border rounded-md p-4 mb-4">
            <summary className="text-lg font-semibold text-[#254159] cursor-pointer">FIFO Details</summary>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input name="rosterCycle" value={newJob.rosterCycle} onChange={handleChange} placeholder="Roster Cycle" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="flyInLocations" value={newJob.flyInLocations} onChange={handleChange} placeholder="Fly-In Locations" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="destinationLocation" value={newJob.destinationLocation} onChange={handleChange} placeholder="Destination Location" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="transportInclusions" value={newJob.transportInclusions} onChange={handleChange} placeholder="Transport Inclusions" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="accommodationType" value={newJob.accommodationType} onChange={handleChange} placeholder="Accommodation Type" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="accommodationCosts" value={newJob.accommodationCosts} onChange={handleChange} placeholder="Accommodation Costs" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="mealsProvided" value={newJob.mealsProvided} onChange={handleChange} placeholder="Meals Provided" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            </div>
          </details>

          {/* Pay */}
          <details className="border rounded-md p-4 mb-4">
            <summary className="text-lg font-semibold text-[#254159] cursor-pointer">Pay & Benefits</summary>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input name="hourlyRate" value={newJob.hourlyRate} onChange={handleChange} placeholder="Hourly Rate" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="allowances" value={newJob.allowances} onChange={handleChange} placeholder="Allowances" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="bonus" value={newJob.bonus} onChange={handleChange} placeholder="Retention/Completion Bonus" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              <input name="developmentOpportunities" value={newJob.developmentOpportunities} onChange={handleChange} placeholder="Professional Development Opportunities" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            </div>
          </details>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`border text-sm font-semibold py-2 px-6 rounded-md transition ${showPreview ? 'bg-[#254159] text-white border-[#254159]' : 'border-[#254159] text-[#254159] hover:bg-[#f2be5c] hover:text-white hover:border-[#f2be5c]'}`}
            >
              {showPreview ? "Hide Preview" : "Preview Job"}
            </button>

            <button
              type="submit"
              className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Post Job
            </button>
          </div>
        </form>

        {showPreview && (
          <div className="bg-white mt-6 p-6 rounded-lg shadow border border-gray-300">
            <h2 className="text-xl font-bold text-[#254159] mb-2">Job Preview</h2>
            <p className="text-sm text-gray-700"><strong>Title:</strong> {newJob.title}</p>
            <p className="text-sm text-gray-700"><strong>Overview:</strong> {newJob.positionOverview}</p>
            <p className="text-sm text-gray-700"><strong>Responsibilities:</strong> {newJob.responsibilities}</p>
            <p className="text-sm text-gray-700"><strong>Qualifications:</strong> {newJob.qualifications}</p>
            <p className="text-sm text-gray-700"><strong>Employment Type:</strong> {newJob.employmentType}</p>
            <p className="text-sm text-gray-700"><strong>Start Date:</strong> {newJob.startDate}</p>
            <p className="text-sm text-gray-700"><strong>Contract Duration:</strong> {newJob.contractDuration}</p>
            <p className="text-sm text-gray-700"><strong>Application Closing:</strong> {newJob.applicationClosingDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJobPage;
