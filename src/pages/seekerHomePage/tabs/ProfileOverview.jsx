import { Link } from "react-router-dom";

const ProfileOverview = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Profile Overview</h2>
      <p>Name: Enyce</p>
      <p>Email: enyce@example.com</p>
      <Link to="/seeker/profile" className="text-blue-600 underline">
        View Full Profile
      </Link>
    </div>
  );
};

export default ProfileOverview;
