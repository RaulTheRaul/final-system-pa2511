import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";

const SeekerActivityPage = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, "applications"),
          where("userId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#f2ece4] font-sans">
      <SeekerNavigation />

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[#254159] mb-6">Your Activity</h2>

          {loading ? (
            <p className="text-gray-600">Loading your activity...</p>
          ) : applications.length === 0 ? (
            <div className="bg-[#EEEEEE] p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-3">You don't have any recent activity.</p>
              <p className="text-gray-500 text-sm">
                When you apply for jobs or save job listings, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Recent Applications</h3>
              {applications.map(app => (
                <div
                  key={app.id}
                  className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center justify-between border border-gray-200"
                >
                  <div>
                    <p className="text-[#254159] font-bold text-lg">{app.jobTitle}</p>
                    <p className="text-sm text-gray-600">
                      Applied on {new Date(app.appliedAt?.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 md:mt-0 md:text-right">
                    Posted by: {app.postedBy || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerActivityPage;