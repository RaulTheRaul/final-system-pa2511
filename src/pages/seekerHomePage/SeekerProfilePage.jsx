import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";

const SeekerProfilePage = () => {
    const { userData, currentUser } = useAuth();

    // Check if we have jobseeker information
    const jobseekerInfo = userData?.jobseekerInformation || {};

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#254159]">Your Profile</h2>
                        <Link
                            to="/seeker/profile/edit"
                            className="bg-[#26425A] hover:bg-[#f2be5c] text-white px-4 py-2 rounded-md flex items-center transition-colors"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-600 font-medium">Name:</p>
                                    <p className="text-gray-900 text-lg">{userData?.fullName || "Not provided"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 font-medium">Email:</p>
                                    <p className="text-gray-900 text-lg">{currentUser?.email || "Not provided"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 font-medium">Location:</p>
                                    <p className="text-gray-900 text-lg">{jobseekerInfo.location || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-600 font-medium">Availability:</p>
                                    <p className="text-gray-900 text-lg capitalize">{jobseekerInfo.availability || "Not provided"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 font-medium">Education Level:</p>
                                    <p className="text-gray-900 text-lg">{jobseekerInfo.educationLevel || "Not provided"}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 font-medium">Preferred Role:</p>
                                    <p className="text-gray-900 text-lg capitalize">{jobseekerInfo.preferredRole || "Not provided"}</p>
                                </div>
                            </div>
                        </div>

                        {jobseekerInfo.bio && (
                            <div className="pt-4 border-t">
                                <p className="text-gray-600 font-medium">Bio:</p>
                                <p className="text-gray-900 mt-2 whitespace-pre-line">{jobseekerInfo.bio}</p>
                            </div>
                        )}

                        {!jobseekerInfo.bio && (
                            <div className="pt-4 border-t text-center">
                                <p className="text-gray-500 italic">Add a bio to tell potential employers about yourself and your experience</p>
                                <Link
                                    to="/seeker/profile/edit"
                                    className="text-[#f2be5c] hover:text-[#26425A] font-medium inline-block mt-2"
                                >
                                    Add Bio
                                </Link>
                            </div>
                        )}

                        <div className="pt-6 border-t">
                            <h3 className="text-xl font-semibold text-[#254159] mb-4">Additional Information</h3>

                            <div className="bg-[#EEEEEE] p-4 rounded-md">
                                <p className="text-[#0D1826]">
                                    Complete your profile with additional information to increase your chances of finding the perfect job:
                                </p>
                                <ul className="mt-2 space-y-1 text-gray-700 list-disc list-inside">
                                    <li>Upload your resume</li>
                                    <li>Add your certifications</li>
                                    <li>List your special skills</li>
                                    <li>Describe your work experience</li>
                                </ul>
                                <Link
                                    to="/seeker/profile/edit"
                                    className="text-[#f2be5c] hover:text-[#26425A] font-medium inline-block mt-4"
                                >
                                    Complete Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerProfilePage;