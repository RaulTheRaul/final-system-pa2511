import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import JobCardEditable from "./components/JobCardEditable";
import BusinessNavigation from "./components/BusinessNavigation";

const BusinessJobPage = () => {
  const { currentUser, userData } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchJobs = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const q = query(
        collection(db, "jobs"),
        where("businessId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const jobList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
      setError("");
    } catch (err) {
      console.log("Error fetching jobs:", err);
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentUser]);

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
        createdAt: new Date()
      });

      setNewJob({
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

      await fetchJobs();
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Job Title</label>
              <input type="text" name="title" placeholder="e.g., FIFO Educator" value={newJob.title} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Position Overview</label>
              <input type="text" name="positionOverview" placeholder="Short summary of the role" value={newJob.positionOverview} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Key Responsibilities</label>
            <textarea name="responsibilities" placeholder="e.g., Supervise children, plan activities..." value={newJob.responsibilities} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" rows="3" required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Qualifications</label>
              <input type="text" name="qualifications" placeholder="e.g., Cert III, Diploma" value={newJob.qualifications} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Employment Type</label>
              <input type="text" name="employmentType" placeholder="Full-time / Part-time" value={newJob.employmentType} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
              <input type="date" name="startDate" value={newJob.startDate} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Contract Duration</label>
              <input type="text" name="contractDuration" placeholder="e.g., 3 months, ongoing" value={newJob.contractDuration} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Application Closing Date</label>
            <input type="date" name="applicationClosingDate" value={newJob.applicationClosingDate} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
          </div>

          <hr className="my-4" />
          <h3 className="text-lg font-semibold text-[#254159]">FIFO Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="rosterCycle" placeholder="Roster Cycle" value={newJob.rosterCycle} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="flyInLocations" placeholder="Fly-In Locations" value={newJob.flyInLocations} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="destinationLocation" placeholder="Destination Location" value={newJob.destinationLocation} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="transportInclusions" placeholder="Transport Inclusions" value={newJob.transportInclusions} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="accommodationType" placeholder="Accommodation Type" value={newJob.accommodationType} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="accommodationCosts" placeholder="Accommodation Costs" value={newJob.accommodationCosts} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="mealsProvided" placeholder="Meals Provided" value={newJob.mealsProvided} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
          </div>

          <hr className="my-4" />
          <h3 className="text-lg font-semibold text-[#254159]">Pay & Benefits</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="hourlyRate" placeholder="Hourly Rate" value={newJob.hourlyRate} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="allowances" placeholder="Allowances" value={newJob.allowances} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="bonus" placeholder="Retention/Completion Bonus" value={newJob.bonus} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            <input type="text" name="developmentOpportunities" placeholder="Professional Development Opportunities" value={newJob.developmentOpportunities} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
          </div>

          <div className="pt-4">
            <button type="submit" className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white font-semibold py-2 px-6 rounded-md transition">
              Post Job
            </button>
          </div>
        </form>

        {/* Posted Jobs */}
        <div className="bg-[#F1EEEB] rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-xl font-semibold text-[#254159] mb-4">Posted Jobs</h3>
          {loading ? (
            <p className="text-gray-600">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">You haven’t posted any jobs yet.</p>
          ) : (
            <ul className="space-y-3">
              {jobs.map((job) => (
                <JobCardEditable key={job.id} job={job} refreshJobs={fetchJobs} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessJobPage;
