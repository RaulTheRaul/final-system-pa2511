import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProfileOverview = () => {
  const { userData, currentUser } = useAuth();

  // Check if we have jobseeker information
  const jobseekerInfo = userData?.jobseekerInformation || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>

      <div className="space-y-3">
        <div>
          <p className="text-gray-600 font-medium">Name:</p>
          <p className="text-gray-900">{userData?.fullName || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Email:</p>
          <p className="text-gray-900">{currentUser?.email || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Location:</p>
          <p className="text-gray-900">{jobseekerInfo.location || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Availability:</p>
          <p className="text-gray-900 capitalize">{jobseekerInfo.availability || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Education Level:</p>
          <p className="text-gray-900">{jobseekerInfo.educationLevel || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Preferred Role:</p>
          <p className="text-gray-900 capitalize">{jobseekerInfo.preferredRole || "Not provided"}</p>
        </div>

        {jobseekerInfo.bio && (
          <div>
            <p className="text-gray-600 font-medium">Bio:</p>
            <p className="text-gray-900">{jobseekerInfo.bio}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link to="/seeker/profile" className="text-blue-600 hover:text-blue-800 font-medium">
          View/Edit Full Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileOverview;