import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import BusinessNavigation from "../components/BusinessNavigation";

const BusinessProfile = () => {
  const { userData, currentUser } = useAuth();
  const BusinessInfo = userData?.businessInformation || {};
  const logoUrl = BusinessInfo.logoUrl || '';
  const centreImageUrls = BusinessInfo.centreImageUrls || [];


  return (
    <div className="min-h-screen bg-[#f2ece4]">
      <BusinessNavigation />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-[#F8F8F8] rounded-xl shadow-xl p-6 md:p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#254159]">Your Business Profile</h2>
            <Link
              to="/business/profile/edit"
              className="bg-[#254159] hover:bg-[#f2be5c] text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              Edit Business Profile
            </Link>
          </div>

        {/* Buisness Logo Display*/}
        {logoUrl && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 flex items-center justify-center">
              <img src={logoUrl} alt="Business Logo" className="max-h-32 object-contain" />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 font-medium">Business Name:</p>
                <p className="text-gray-900">{BusinessInfo?.centreName || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Email:</p>
                <p className="text-gray-900">{currentUser?.email || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-gray-600 font-medium">ACECQA Rating:</p>
                <p className="text-gray-900">{BusinessInfo.acecqaRating || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Approved Provider License:</p>
                <p className="text-gray-900">{BusinessInfo.licenseNumber || "—"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Centre Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 font-medium">Centre Name:</p>
                <p className="text-gray-900">{BusinessInfo.centreName || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Phone:</p>
                <p className="text-gray-900">{BusinessInfo.centrePhone || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Centre Type:</p>
                <p className="text-gray-900">{BusinessInfo.centreType || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Operating Hours:</p>
                <p className="text-gray-900">{BusinessInfo.operatingHours || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Room Count:</p>
                <p className="text-gray-900">{BusinessInfo.roomCount || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Centre Capacity:</p>
                <p className="text-gray-900">{BusinessInfo.centreCapacity || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Staff to Child Ratio:</p>
                <p className="text-gray-900">{BusinessInfo.staffToChildRatio || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Teaching Approach:</p>
                <p className="text-gray-900">{BusinessInfo.teachingApproach || "—"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 font-medium">Centre Address:</p>
                <p className="text-gray-900">{BusinessInfo.centreAddress || "—"}</p>
              </div>
            </div>
          </div>

        {/* Centre Images Display */}
        {centreImageUrls.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Centre Photos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {centreImageUrls.map((url, index) => (
                  <div key={index} className="w-full aspect-video rounded-md overflow-hidden shadow-sm border border-gray-200">
                    <img src={url} alt={`Centre photo ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Additional Information</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 font-medium">Description:</p>
                <div className="bg-gray-50 rounded-lg p-4 mt-2 text-gray-800 whitespace-pre-line">
                  {BusinessInfo.centreDescription || "No description provided."}
                </div>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Staff Benefits:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(BusinessInfo.staffBenefits) && BusinessInfo.staffBenefits.length > 0 ? (
                    BusinessInfo.staffBenefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-[#F8F8F8] border border-gray-200 text-[#254159] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {benefit}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No staff benefits provided.</p>
                  )}
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