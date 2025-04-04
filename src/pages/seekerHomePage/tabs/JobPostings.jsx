import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { db } from "../../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        // Fetch job postings
        const jobSnapshot = await getDocs(collection(db, "jobs"));
        const jobsData = jobSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsData);

        // Fetch applications made by the current user
        if (currentUser) {
          const q = query(
            collection(db, "applications"),
            where("userId", "==", currentUser.uid)
          );
          const appSnapshot = await getDocs(q);
          const appliedIds = appSnapshot.docs.map(doc => doc.data().jobId);
          setAppliedJobIds(appliedIds);
        }
      } catch (error) {
        console.error("Error fetching jobs or applications:", error);
      }
    };

    fetchJobsAndApplications();
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available yet.</p>
      ) : (
        jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            alreadyApplied={appliedJobIds.includes(job.id)}
          />
        ))
      )}
    </div>
  );
};

export default JobPostings;
