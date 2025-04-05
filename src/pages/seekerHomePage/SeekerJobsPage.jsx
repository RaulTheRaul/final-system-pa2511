import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import SeekerNavigation from "./components/SeekerNavigation";
import JobCard from "./components/JobCard";

const SeekerJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "jobs"));
                const jobsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setJobs(jobsData);
                setError("");
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setError("Failed to load job listings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-[#254159] mb-6">Available Job Postings</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading job listings...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md">
                            {error}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-8 bg-[#F1EEEB] rounded-lg">
                            <p className="text-gray-600">No job listings available at this time.</p>
                            <p className="text-gray-500 text-sm mt-2">Check back later for new opportunities.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeekerJobsPage;