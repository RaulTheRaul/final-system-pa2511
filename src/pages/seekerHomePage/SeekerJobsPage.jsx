import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";
import JobCard from "./components/JobCard";

const SeekerJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  // Fetch jobs and user data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      setLoading(true);

      try {
        // 1. Fetch all jobs
        const jobsSnapshot = await getDocs(collection(db, "jobs"));
        const jobsData = jobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);

        // 2. Fetch applications
        const appsQuery = query(
          collection(db, "applications"),
          where("userId", "==", currentUser.uid)
        );
        const appsSnapshot = await getDocs(appsQuery);
        const appliedIds = appsSnapshot.docs.map((doc) => doc.data().jobId);
        setAppliedJobs(appliedIds);

        // ✅ 3. Fetch saved jobs
        const savedJobsQuery = query(
          collection(db, "savedJobs"),
          where("userId", "==", currentUser.uid)
        );
        const savedSnapshot = await getDocs(savedJobsQuery);
        const savedIds = savedSnapshot.docs.map((doc) => doc.data().jobId);
        setSavedJobs(savedIds);

        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Apply to job
  const handleApply = async (jobId, jobTitle, postedBy) => {
    if (!currentUser) return;

    try {
      await setDoc(doc(db, "applications", `${currentUser.uid}_${jobId}`), {
        userId: currentUser.uid,
        jobId,
        jobTitle,
        appliedAt: new Date(),
        postedBy: postedBy || "Unknown",
      });

      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (error) {
      console.error("Error applying to job:", error);
    }
  };

  // Save a job
  const saveJob = async (jobId) => {
    try {
      await setDoc(doc(db, "savedJobs", `${currentUser.uid}_${jobId}`), {
        userId: currentUser.uid,
        jobId,
        savedAt: new Date(),
      });
      setSavedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  // Unsave a job
  const unsaveJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, "savedJobs", `${currentUser.uid}_${jobId}`));
      setSavedJobs((prev) => prev.filter((id) => id !== jobId));
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2ece4]">
      <SeekerNavigation />

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#254159] mb-6">
            Available Job Postings
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading job listings...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 bg-[#F1EEEB] rounded-lg">
              <p className="text-gray-600">
                No job listings available at this time.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Check back later for new opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  applied={appliedJobs.includes(job.id)}
                  saved={savedJobs.includes(job.id)}
                  handleApply={() =>
                    handleApply(job.id, job.title, job.postedBy)
                  }
                  handleSave={() => saveJob(job.id)}
                  handleUnsave={() => unsaveJob(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerJobsPage;
