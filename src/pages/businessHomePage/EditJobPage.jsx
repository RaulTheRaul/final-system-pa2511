import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import BusinessNavigation from "./components/BusinessNavigation";

const EditJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        setJobData(jobSnap.data());
      }
      setLoading(false);
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobRef = doc(db, "jobs", jobId);
    await updateDoc(jobRef, {
      title: jobData.title,
      positionOverview: jobData.positionOverview,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      employmentType: jobData.employmentType,
      startDate: jobData.startDate,
      applicationClosingDate: jobData.applicationClosingDate,
    });
    navigate("/business/activity");
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f2ece4]">
      <BusinessNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-[#254159] mb-6">✏️ Edit Job</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Job Title</label>
              <input type="text" name="title" value={jobData.title || ""} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Position Overview</label>
              <input type="text" name="positionOverview" value={jobData.positionOverview || ""} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Responsibilities</label>
            <textarea name="responsibilities" rows="4" value={jobData.responsibilities || ""} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" required></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Qualifications</label>
              <input type="text" name="qualifications" value={jobData.qualifications || ""} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Employment Type</label>
              <input type="text" name="employmentType" value={jobData.employmentType || ""} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
              <input type="date" name="startDate" value={jobData.startDate || ""} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Application Closing Date</label>
              <input type="date" name="applicationClosingDate" value={jobData.applicationClosingDate || ""} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;
