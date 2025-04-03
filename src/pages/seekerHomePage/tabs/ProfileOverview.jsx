import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { auth } from "../../../firebase/config";

const ProfileOverview = () => {
  /*const signOut = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      // You might want to redirect or update state here
    } catch (error) {
      console.error('Error signing out: ', error.message);
    }
  };*/
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Profile Overview</h2>
      <p>Name: Enyce</p>
      <p>Email: enyce@example.com</p>
      <Link to="/seeker/profile" className="text-blue-600 underline">
        View Full Profile
      </Link>
        {/*<div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button> 
      </div> */}
    </div>
  );
};

export default ProfileOverview;
