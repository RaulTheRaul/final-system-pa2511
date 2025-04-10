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
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Activity Section, Left Column */}
          <div className="md:w-1/2 bg-[#EEEEEE] rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-[#254159] mb-6">Your Activity</h2>
            {loading ? (
              <p className="text-gray-600">Loading your activity...</p>
            ) : applications.length === 0 ? (
              <div className="bg-[#F1EEEB] p-8 rounded-lg text-center">
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
                    className="bg-[#F1EEEB] p-4 rounded shadow flex flex-col justify-between border border-gray-200"
                  >
                    <div>
                      <p className="text-[#254159] font-bold text-lg">{app.jobTitle}</p>
                      <p className="text-sm text-gray-600">
                        Applied on {new Date(app.appliedAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted by: {app.postedBy || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {/* Message Section, Right Column */}
          <div className="md:w-1/2 bg-[#EEEEEE] rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-[#254159] mb-6">Messages</h2>
            
            {/* Placeholder content for messages */}
            <div className="bg-[#F1EEEB] p-6 rounded-lg text-center h-64 flex flex-col items-center justify-center">
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
            
            {/* Message feature coming soon section */}
            <div className="mt-6 border-t pt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Coming Soon</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Direct messaging with employers
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Interview scheduling
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Application status updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SeekerActivityPage;