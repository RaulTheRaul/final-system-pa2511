import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

const Activity = () => {
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Applications</h2>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map(app => (
            <li key={app.id} className="border rounded p-4 bg-white shadow">
              <h3 className="text-lg font-bold text-gray-800">{app.jobTitle}</h3>
              <p className="text-sm text-gray-500">
                Applied on {new Date(app.appliedAt.seconds * 1000).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Activity;
