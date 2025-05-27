import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import BusinessNavigation from "./components/BusinessNavigation";

const ViewJobPage = () => {
  const { jobId } = useParams();
  const { currentUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "jobs", jobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setJob(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteDoc(doc(db, "jobs", jobId));
        navigate("/business/activity");
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!job) {
    return <div className="p-6">Job not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f2ece4]">
      <BusinessNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold text-[#254159] mb-2">{job.title}</h2>
          <p className="text-gray-600 mb-4 italic">Posted by: {job.company || "Unknown"}</p>

          <div className="space-y-3 text-sm text-gray-800">
            <p><strong>Position Overview:</strong><br /> {job.positionOverview}</p>
            <p><strong>Key Responsibilities:</strong><br /> {job.responsibilities}</p>
            <p><strong>Qualifications:</strong> {job.qualifications}</p>
            <p><strong>Employment Type:</strong> {job.employmentType}</p>
            <p><strong>Start Date:</strong> {job.startDate}</p>
            <p><strong>Contract Duration:</strong> {job.contractDuration}</p>
            <p><strong>Application Closing Date:</strong> {job.applicationClosingDate}</p>
          </div>

          <hr className="my-6" />

          <div className="space-y-2 text-sm">
            <h3 className="text-lg font-semibold text-[#254159]">FIFO Details</h3>
            <p><strong>Roster Cycle:</strong> {job.rosterCycle}</p>
            <p><strong>Fly-In Locations:</strong> {job.flyInLocations}</p>
            <p><strong>Destination Location:</strong> {job.destinationLocation}</p>
            <p><strong>Transport Inclusions:</strong> {job.transportInclusions}</p>
            <p><strong>Accommodation Type:</strong> {job.accommodationType}</p>
            <p><strong>Accommodation Costs:</strong> {job.accommodationCosts}</p>
            <p><strong>Meals Provided:</strong> {job.mealsProvided}</p>
          </div>

          <hr className="my-6" />

          <div className="space-y-2 text-sm">
            <h3 className="text-lg font-semibold text-[#254159]">Pay & Benefits</h3>
            <p><strong>Hourly Rate:</strong> {job.hourlyRate}</p>
            <p><strong>Allowances:</strong> {job.allowances}</p>
            <p><strong>Bonus:</strong> {job.bonus}</p>
            <p><strong>Development Opportunities:</strong> {job.developmentOpportunities}</p>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate("/business/activity")}
              className="bg-gray-100 hover:bg-gray-200 text-[#254159] font-medium py-2 px-4 rounded border border-gray-300"
            >
              Go Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/business/jobs/edit/${jobId}`)}
                className="bg-[#f2be5c] hover:bg-[#e3aa3c] text-white font-semibold px-4 py-2 rounded-md transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#e57373] hover:bg-[#d64b4b] text-white font-semibold px-4 py-1.5 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJobPage;
