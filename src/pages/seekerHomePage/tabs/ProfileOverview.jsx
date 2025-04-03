import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProfileOverview = () => {
  const { userData, currentUser } = useAuth();

  //Grabs jobseeker's info
  const jobseekerInfo = userData?.jobseekerInformation || {};


  const formatCertificationStatus = (isValid, expiryDate) => {
    if (!isValid) return "Not certified";
    if (!expiryDate || expiryDate === "") return "Valid (No expiry date)";

    return `Valid until ${expiryDate}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
      <div className="space-y-3">
        {/* Personal Information */}
        <div className="pb-2 mb-2 border-b border-gray-200">
          <h3 className="font-medium text-blue-600 mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <p className="text-gray-600 font-medium">Willing to Relocate:</p>
              <p className="text-gray-900">{jobseekerInfo.willingToRelocate ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        {/* Availability & Preferences */}
        <div className="pb-2 mb-2 border-b border-gray-200">
          <h3 className="font-medium text-blue-600 mb-2">Availability & Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-600 font-medium">Availability:</p>
              <p className="text-gray-900 capitalize">{jobseekerInfo.availability || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Preferred Role:</p>
              <p className="text-gray-900 capitalize">{jobseekerInfo.preferredRole || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Immediate Start:</p>
              <p className="text-gray-900">{jobseekerInfo.immediateStart ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Work Trial Available:</p>
              <p className="text-gray-900">{jobseekerInfo.workTrialAvailability ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="pb-2 mb-2 border-b border-gray-200">
          <h3 className="font-medium text-blue-600 mb-2">Qualifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-600 font-medium">Education Level:</p>
              <p className="text-gray-900">{jobseekerInfo.educationLevel || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Years of Experience:</p>
              <p className="text-gray-900">
                {jobseekerInfo.yearsOfExperience ? `${jobseekerInfo.yearsOfExperience} years` : "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="pb-2 mb-2 border-b border-gray-200">
          <h3 className="font-medium text-blue-600 mb-2">Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-600 font-medium">First Aid:</p>
              <p className="text-gray-900">
                {formatCertificationStatus(
                  jobseekerInfo.certifications?.firstAid,
                  jobseekerInfo.certifications?.firstAidExpiry
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Child Protection:</p>
              <p className="text-gray-900">
                {formatCertificationStatus(
                  jobseekerInfo.certifications?.childProtection,
                  jobseekerInfo.certifications?.childProtectionExpiry
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Anaphylaxis:</p>
              <p className="text-gray-900">
                {formatCertificationStatus(
                  jobseekerInfo.certifications?.anaphylaxis,
                  jobseekerInfo.certifications?.anaphylaxisExpiry
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Asthma:</p>
              <p className="text-gray-900">
                {formatCertificationStatus(
                  jobseekerInfo.certifications?.asthma,
                  jobseekerInfo.certifications?.asthmaExpiry
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Courses/Skills */}
        {(jobseekerInfo.additionalCourses?.length > 0 || jobseekerInfo.specialSkills?.length > 0) && (
          <div className="pb-2 mb-2 border-b border-gray-200">
            <h3 className="font-medium text-blue-600 mb-2">Additional Qualifications & Skills</h3>

            {jobseekerInfo.additionalCourses?.length > 0 && (
              <div className="mb-3">
                <p className="text-gray-600 font-medium">Additional Courses:</p>
                <p className="text-gray-900">
                  {jobseekerInfo.additionalCourses.join(", ")}
                </p>
              </div>
            )}

            {jobseekerInfo.specialSkills?.length > 0 && (
              <div>
                <p className="text-gray-600 font-medium">Special Skills:</p>
                <p className="text-gray-900">
                  {jobseekerInfo.specialSkills.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bio Section */}
        {jobseekerInfo.bio && (
          <div className="pb-2 mb-2 border-b border-gray-200">
            <h3 className="font-medium text-blue-600 mb-2">About Me</h3>
            <p className="text-gray-900">{jobseekerInfo.bio}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/seeker/profile"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <span>View/Edit Full Profile</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ProfileOverview;