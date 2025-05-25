import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BusinessNavigation from "./components/BusinessNavigation";

const CreateJobPage = () => {
  const { currentUser, userData } = useAuth();
  const [step, setStep] = useState(1);
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
        createdAt: serverTimestamp(),
      });
      navigate("/business/activity");
    } catch (err) {
      console.error("Failed to post job:", err);
    }
  };

  const tabClasses = (tabStep) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-all duration-150 ${
      step === tabStep
        ? "border-[#f2be5c] text-[#254159]"
        : "border-transparent text-gray-400 hover:text-[#254159]"
    }`;

  return (
    <div className="min-h-screen bg-[#f2ece4]">
      <BusinessNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-300">
          <h2 className="text-2xl font-bold text-[#254159] mb-1">📝 Post a New Job</h2>
          <p className="text-sm text-gray-600 mb-6">
            Provide detailed information to help jobseekers understand the role.
          </p>

          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b mb-6">
            <button className={tabClasses(1)} onClick={() => setStep(1)}>Job Basics</button>
            <button className={tabClasses(2)} onClick={() => setStep(2)}>Qualifications & Terms</button>
            <button className={tabClasses(3)} onClick={() => setStep(3)}>FIFO Details</button>
            <button className={tabClasses(4)} onClick={() => setStep(4)}>Pay & Benefits</button>
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                <input name="title" placeholder="Job Title" value={newJob.title} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" required />
                <textarea name="positionOverview" placeholder="Position Overview" value={newJob.positionOverview} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full md:col-span-2" required />
                <textarea name="responsibilities" placeholder="Key Responsibilities" value={newJob.responsibilities} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full md:col-span-2" required />
              </div>
            )}

            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-4">
                <input name="qualifications" placeholder="Qualifications" value={newJob.qualifications} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="employmentType" placeholder="Employment Type" value={newJob.employmentType} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input type="date" name="startDate" value={newJob.startDate} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="contractDuration" placeholder="Contract Duration" value={newJob.contractDuration} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input type="date" name="applicationClosingDate" value={newJob.applicationClosingDate} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
              </div>
            )}

            {step === 3 && (
              <div className="grid md:grid-cols-2 gap-4">
                <input name="rosterCycle" placeholder="Roster Cycle" value={newJob.rosterCycle} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="flyInLocations" placeholder="Fly-In Locations" value={newJob.flyInLocations} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="destinationLocation" placeholder="Destination Location" value={newJob.destinationLocation} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="transportInclusions" placeholder="Transport Inclusions" value={newJob.transportInclusions} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="accommodationType" placeholder="Accommodation Type" value={newJob.accommodationType} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="accommodationCosts" placeholder="Accommodation Costs" value={newJob.accommodationCosts} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="mealsProvided" placeholder="Meals Provided" value={newJob.mealsProvided} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
              </div>
            )}

            {step === 4 && (
              <div className="grid md:grid-cols-2 gap-4">
                <input name="hourlyRate" placeholder="Hourly Rate" value={newJob.hourlyRate} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="allowances" placeholder="Allowances" value={newJob.allowances} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="bonus" placeholder="Bonuses" value={newJob.bonus} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
                <input name="developmentOpportunities" placeholder="Development Opportunities" value={newJob.developmentOpportunities} onChange={handleChange} className="border border-gray-300 px-3 py-2 rounded w-full" />
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                disabled={step === 1}
              >
                Previous
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white px-6 py-2 rounded-md transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white px-6 py-2 rounded-md transition"
                >
                  Post Job
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;
