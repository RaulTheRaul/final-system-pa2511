import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import JobCard from "./components/JobCard";
import JobDetailPanel from "./components/JobDetailPanel";
import SeekerNavigation from "./components/SeekerNavigation";

const SeekerJobBoard = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"));
        const jobData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(jobData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const savedSnapshot = await getDocs(
          query(collection(db, "savedJobs"), where("userId", "==", currentUser.uid))
        );
        const savedIds = savedSnapshot.docs.map((doc) => doc.data().jobId);
        setSavedJobs(savedIds);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    if (currentUser) {
      fetchJobs();
      fetchSavedJobs();
    }
  }, [currentUser]);

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
      <div className="flex max-h-[calc(100vh-64px)]">
        {/* Left - Job list */}
        <div className="w-1/2 border-r overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-[#254159] mb-4">Available Jobs</h2>
          {loading ? (
            <p className="text-gray-600">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">No job listings found.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedJobs.includes(job.id)}
                  handleSave={() => saveJob(job.id)}
                  handleUnsave={() => unsaveJob(job.id)}
                  onView={() => setSelectedJob(job)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right - Job detail panel */}
        <div className="w-1/2 overflow-y-auto p-6">
          {selectedJob ? (
            <JobDetailPanel job={selectedJob} />
          ) : (
            <div className="text-gray-500 text-center mt-20">
              <p>Select a job to view the full description.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerJobBoard;
