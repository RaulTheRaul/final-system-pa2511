import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import BusinessNavigation from "../components/BusinessNavigation";

const BusinessProfile = () => {
    const { userData, currentUser } = useAuth();

    // Check if we have business information
    const BusinessInfo = userData?.businessInformation || {};

    return (
      <div className="min-h-screen bg-[#f2ece4]"> 
        <BusinessNavigation />
      
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#254159]">Your Profile</h2>
                        
            {/*This is for the edit profile function.   */}
              <Link
                  to="/business/profile/edit"
                  className="bg-[#26425A] hover:bg-[#f2be5c] text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                Edit Business Profile
              </Link>
          </div>
                
      <div className="space-y-6">
        <p className= "text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Business Information</p> {/*Section*/ }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
              <div> {/* Name */}
                <p className="text-gray-600 font-medium">Business Name:</p>
                <p className="text-gray-900">{BusinessInfo?.centreName}</p>
              </div>

              <div> {/* Email */}
                <p className="text-gray-600 font-medium">Email:</p>
                <p className="text-gray-900">{currentUser?.email}</p>
              </div>

            </div>
          
            <div className="space-y-4">
              <div> {/* Rating */}
                <p className="text-gray-600 font-medium"> ACECQA Rating: </p>
                <p className="text-gray-900">{BusinessInfo.acecqaRating}</p>
              </div>

              <div> {/* License */}
                <p className="text-gray-600 font-medium">License Number: </p>
                <p className="text-gray-900">{BusinessInfo.licenseNumber}</p>
              </div>

      </div>
    
      
      <div className="space-y-6">
            <p className= "text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Centre Information</p> {/*Section*/ }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-4">
            <div> {/* Centre Name */}
                <p className="text-gray-600 font-medium">Centre Name: </p>
                <p className="text-gray-900">{BusinessInfo.centreName}</p>
            </div>

            <div> {/* Centre Address */}
                <p className="text-gray-600 font-medium">Centre Address: </p>
                <p className="text-gray-900">{BusinessInfo.centreAddress}</p>
            </div>

            <div> {/* Centre Phone */}
                <p className="text-gray-600 font-medium"> Phone: </p>
                <p className="text-gray-900">{BusinessInfo.centrePhone}</p>
            </div>

            <div> {/* Centre Operating Hours */}
                <p className="text-gray-600 font-medium">Operating Hours: </p>
                <p className="text-gray-900">{BusinessInfo.operatingHours}</p>
            </div>

            <div> {/* Centre Type */}
                <p className="text-gray-600 font-medium">Centre Type: </p>
                <p className="text-gray-900">{BusinessInfo.centreType}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div> {/* Teaching Approach */}
                <p className="text-gray-600 font-medium">Teaching Approach: </p>
                <p className="text-gray-900">{BusinessInfo.teachingApproach}</p>
            </div>

            <div> {/* Centre Room Count */}
                <p className="text-gray-600 font-medium">Room Count: </p>
                <p className="text-gray-900">{BusinessInfo.roomCount}</p>
            </div>
            <div> {/* Centre Capacity */}
                <p className="text-gray-600 font-medium">Centre Capacity: </p>
                <p className="text-gray-900">{BusinessInfo.centreCapacity}</p>
            </div>
            <div> {/* Centre Ratio */}
                <p className="text-gray-600 font-medium">Staff to Child Ratio: </p>
                <p className="text-gray-900">{BusinessInfo.staffToChildRatio}</p>
            </div>
          </div>

          </div>
      </div>

      <div className="space-y-6">
      <p className= "text-lg font-semibold text-[#254159] mb-4 pb-2 border-b">Additonal Information</p> {/*Section*/ }  
        
        <div className="space-y-4">

              <div> {/* Centre Description */}
                <p className="text-gray-600 font-medium">Description:</p>
                <p className="text-gray-900 mt-2 whitespace-pre-line">{BusinessInfo.centreDescription}</p>
              </div>

              <div> {/* Staff Benefits */}
                <p className="text-gray-600 font-medium">Staff Benefits:</p>
                <p className="text-gray-900 mt-2 whitespace-pre-line">{BusinessInfo.staffBenefits}</p>
              </div>
              
         </div>  
      </div> 
        
        </div>
        </div>
            </div>
          </div>
    );
};


export default BusinessProfile;
