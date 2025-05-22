import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

import BusinessNavigation from "./components/BusinessNavigation";

const BusinessJobPage = () => {
    const { currentUser, userData } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        location: ""
    });

    // Fetch jobs posted by current business
    useEffect(() => {
        const fetchJobs = async () => {
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
                company: userData?.businessName || "Unknown", // ✅ Automatically added
                createdAt: new Date()
            });

            setNewJob({ title: "", description: "", location: "" });

            // Refresh job list
            const snapshot = await getDocs(
                query(collection(db, "jobs"), where("businessId", "==", currentUser.uid))
            );
            setJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error("Failed to post job:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <BusinessNavigation />

            <div className="max-w-6xl mx-auto p-6">
                {/* Job Posting Form */}
                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-[#254159] mb-4">Post a Job</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            value={newJob.title}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={newJob.location}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Job Description"
                            value={newJob.description}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-[#f2be5c] text-white py-2 px-6 rounded hover:bg-[#e3aa3c]"
                        >
                            Post
                        </button>
                    </form>
                </div>

                {/* Posted Jobs */}
                <div className="bg-[#F1EEEB] rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-[#254159] mb-4">Posted Jobs</h3>
                    {loading ? (
                        <p className="text-gray-600">Loading jobs...</p>
                    ) : jobs.length === 0 ? (
                        <p className="text-gray-600">You haven’t posted any jobs yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {jobs.map((job) => (
                                <li key={job.id} className="bg-white p-4 rounded shadow-sm">
                                    <h4 className="text-lg font-bold">{job.title}</h4>
                                    <p className="text-sm text-gray-700">
                                        {job.company} • {job.location}
                                    </p>
                                    <p className="text-gray-600 mt-2">{job.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessJobPage;
