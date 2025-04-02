import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { db } from "../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs available yet.</p>
      ) : (
        jobs.map(job => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
};

export default JobPostings;
