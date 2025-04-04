import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

/* //to access tabs
import ActivityMessages from "./tabs/ActivityMessages";
import CandidateFeed from "./pages/businessHomePage/tabs/CandidateFeed";
import TokenDashboard from "./pages/tabs/TokenDashboard";
*/

const BusinessProfile = () => {
    //const [activeTab, setActiveTab] = useState("");
    const { userData } = useAuth();

    // Check if we have business information
    const BusinessInfo = userData?.businessInformation || {};

    return (

    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Business Overview</h2>
        
          {/* Tab Content or Nav bar 
          <div className="mt-4">
            {activeTab === "Activity" && <ActivityMessages />}
            {activeTab === "Candidate Feed" && <CandidateFeed />}
            {activeTab === "Token Dashboard" && <TokenDashboard />}
        </div>
*/}
        {/*This will display the business logo*/}
        <a href ="">
          <img alt="Business logo"
               src=""
               className="object-non" rounded-full/>
        </a>


        {/*This will display all the business details*/}
        <div className="space-y-3">
        <div>
          <p className="text-gray-600 font-medium">Business Name:</p>
          <p className="text-gray-900">{BusinessInfo?.centreName}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Rating:</p>
          <p className="text-gray-900">{BusinessInfo.acecqaRating}</p>
        </div>

        {userData?.userType === "business" && userData?.businessInformation && (
          <>
            <div>
              <p className="text-gray-600 font-medium">Centre Address:</p>
              <p className="text-gray-900">{userData.businessInformation.centreAddress || "Not provided"}</p>
            </div>

             <div>
                <p className="text-gray-600 font-medium">Centre Type:</p>
                <p className="text-gray-900 capitalize">{userData.businessInformation.centreType || "Not specified"}</p>
              </div>
          </>
        )}

        <div>
            <p className="text-gray-600 font-medium">Teaching Approach:</p>
            <p className="text-gray-900">{BusinessInfo.teachingApproach  || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Desription:</p>
          <p className="text-gray-900">{BusinessInfo.centreDescription || "Not provided"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Career Opportunities:</p>
          <p className="text-gray-900">{BusinessInfo.careerOpportunities || "Not provided"}</p>
        </div>
        
        <div>
          <p className="text-gray-600 font-medium">Contact Details:</p>
          <p className="text-gray-900">Email:{userData.email || "Not provided"}</p>
          <p className="text-gray-900">Phone:{BusinessInfo?.centrePhone || "Not provided"}</p>
        </div>

        <div className="mt-6">
        <Link to="/business/profile" className="text-blue-600 hover:text-blue-800 font-medium">
          View/Edit Full Profile
        </Link>
        </div>
        </div> {/* end of business info*/}
    </div>

    //This section will display the business vacencies

    //This section will display the customers review ratings


    );
};


export default BusinessProfile;
