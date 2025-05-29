import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";
import Footer from "../../components/footer";

const SeekerActivityPage = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Unsave a saved job
  const unsaveJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, "savedJobs", `${currentUser.uid}_${jobId}`));
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  // ✅ Fetch saved jobs with details
  const fetchSavedJobs = async (user) => {
    const q = query(
      collection(db, "savedJobs"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);

    const jobPromises = snapshot.docs.map(async (docSnap) => {
      const jobId = docSnap.data().jobId;
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);

      return jobSnap.exists()
        ? {
          id: jobSnap.id,
          ...jobSnap.data(),
          savedAt: docSnap.data().savedAt,
        }
        : null;
    });

    const jobsWithDetails = await Promise.all(jobPromises);
    return jobsWithDetails.filter(Boolean);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      if (!currentUser) return;

      try {
        const appsQuery = query(
          collection(db, "applications"),
          where("seekerId", "==", currentUser.uid)
        );
        const appsSnapshot = await getDocs(appsQuery);
        const appsData = appsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(appsData);

        const saved = await fetchSavedJobs(currentUser);
        setSavedJobs(saved);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#f2ece4] font-sans">
      <SeekerNavigation />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Applications + Saved Jobs */}
          <div className="md:w-1/2 bg-[#F8F8F8] rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-[#254159] mb-6">Your Activity</h2>

            {loading ? (
              <p className="text-gray-600">Loading your activity...</p>
            ) : (
              <>
                {/* Recent Applications */}
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Recent Applications
                  </h3>
                  {applications.length === 0 ? (
                    <p className="text-gray-500">You haven't applied for any jobs yet.</p>
                  ) : (
                    applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-[#F1EEEB] p-4 rounded shadow flex flex-col justify-between border border-gray-200"
                      >
                        <p className="text-[#254159] font-bold text-lg">{app.jobTitle}</p>
                        <p className="text-sm text-gray-600">
                          Applied on {new Date(app.appliedAt?.seconds * 1000).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Posted by: {app.postedBy || "Unknown"}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Saved Jobs */}
                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                    Saved Jobs
                  </h3>
                  {savedJobs.length === 0 ? (
                    <p className="text-gray-500">No saved jobs yet.</p>
                  ) : (
                    savedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-[#F1EEEB] p-4 rounded shadow flex flex-col justify-between border border-gray-200 relative"
                      >
                        <button
                          onClick={() => unsaveJob(job.id)}
                          className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
                          title="Remove from saved jobs"
                        >
                          ✖️
                        </button>

                        <p className="text-[#254159] font-bold text-lg">{job.title}</p>
                        <p className="text-sm text-gray-600">
                          Saved on {new Date(job.savedAt?.seconds * 1000).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Posted by: {job.postedBy || "Unknown"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Column - Messages */}
          <div className="md:w-1/2 bg-[#F8F8F8] rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-[#254159] mb-6">Messages</h2>
            <div className="bg-white p-6 rounded-lg text-center h-64 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-2">No messages yet</p>
              <p className="text-gray-500 text-sm max-w-xs">
                Messages from employers will appear here after you've applied to jobs and they've responded.
              </p>
            </div>

            <div className="mt-6 border-t pt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Coming Soon</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">✅ Direct messaging with employers</li>
                <li className="flex items-center">✅ Interview scheduling</li>
                <li className="flex items-center">✅ Application status updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeekerActivityPage;
