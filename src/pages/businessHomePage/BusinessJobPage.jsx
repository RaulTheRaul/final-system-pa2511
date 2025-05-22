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
    location: "",
    jobType: "",
    startDate: "",
    schedule: "",
    description: "",
    requirements: "",
    payRate: "",
    contactInstructions: ""
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
        location: "",
        jobType: "",
        startDate: "",
        schedule: "",
        description: "",
        requirements: "",
        payRate: "",
        contactInstructions: ""
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
          <p className="text-sm text-gray-500 mb-4">
            Provide detailed information to help jobseekers understand the role.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Job Title</label>
              <input type="text" name="title" placeholder="e.g., Babysitter, Nanny" value={newJob.title} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <input type="text" name="location" placeholder="e.g., Epping, NSW" value={newJob.location} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Job Type</label>
              <select name="jobType" value={newJob.jobType} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm bg-white focus:ring-[#f2be5c] focus:border-[#f2be5c]" required>
                <option value="">Select type</option>
                <option value="Casual">Casual</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
                <option value="Live-in">Live-in</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
              <input type="date" name="startDate" value={newJob.startDate} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Weekly Schedule</label>
            <textarea name="schedule" placeholder="e.g., Mon–Fri, 3:00 PM – 6:00 PM" value={newJob.schedule} onChange={handleChange} rows="2" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Job Description</label>
            <textarea name="description" placeholder="Describe your family, the children, and what you're looking for in a carer." value={newJob.description} onChange={handleChange} rows="4" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Requirements</label>
            <textarea name="requirements" placeholder="e.g., Working With Children Check, First Aid, non-smoker, driver's license" value={newJob.requirements} onChange={handleChange} rows="3" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Pay Rate</label>
              <input type="text" name="payRate" placeholder="e.g., $30/hour" value={newJob.payRate} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Instructions</label>
              <textarea name="contactInstructions" placeholder="e.g., We’ll reach out via email or app chat." value={newJob.contactInstructions} onChange={handleChange} rows="2" className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-[#f2be5c] focus:border-[#f2be5c]" />
            </div>
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
