import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";
import AccountSettingsModal from "./components/AccountSettingsModal";

const SeekerProfilePage = () => {
    const { userData, currentUser } = useAuth();
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // Check if we have jobseeker information
    const jobseekerInfo = userData?.jobseekerInformation || {};

    // Helper function to format arrays
    const formatArray = (arr) => {
        if (!arr || arr.length === 0) return "Not provided";
        return Array.isArray(arr) ? arr.join(", ") : arr;
    };

    // Helper function to format boolean values
    const formatBoolean = (value) => value ? "Yes" : "No";

    // Check if profile is complete
    const isProfileComplete = jobseekerInfo.bio && jobseekerInfo.resumeUrl &&
        jobseekerInfo.educationLevel && jobseekerInfo.yearsOfExperience;

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-[#F8F8F8] rounded-xl shadow-xl p-6 md:p-8 border border-gray-200">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#254159] mb-2">
                                {userData?.fullName || "Your Profile"}
                            </h2>
                            <div className="flex items-center space-x-4 text-gray-600">
                                <span>{currentUser?.email || "Not provided"}</span>
                                <span>•</span>
                                <span>{jobseekerInfo.location || "Location not set"}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsSettingsModalOpen(true)}
                                    className="px-4 py-2 bg-[#254159] text-white rounded-md shadow-sm hover:bg-[#f2be5c] hover:text-[#254159] transition-colors duration-200 flex items-center cursor-pointer"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Account Settings
                                </button>
                                <Link
                                    to="/seeker/profile/edit"
                                    className="px-4 py-2 bg-[#254159] text-white rounded-md shadow-sm hover:bg-[#f2be5c] hover:text-[#254159] transition-colors duration-200 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Call to Action for Incomplete Profiles */}
                    {!isProfileComplete && (
                        <div className="mt-8 bg-gradient-to-r from-[#254159] to-[#f2be5c] rounded-lg shadow-md p-6 text-white border border-gray-200">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
                                <p className="mb-4 opacity-90">
                                    Add more details to your profile to attract potential employers and increase your job opportunities.
                                </p>
                                <Link
                                    to="/seeker/profile/edit"
                                    className="bg-white text-[#254159] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 inline-block"
                                >
                                    Complete Profile
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Profile Overview Card */}
                    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-[#254159] mb-3">Profile Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600 font-medium">Role Preference</span>
                                        <p className="text-lg font-semibold text-[#254159] capitalize">
                                            {jobseekerInfo.preferredRole || "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 font-medium">Experience</span>
                                        <p className="text-lg font-semibold text-[#254159]">
                                            {jobseekerInfo.yearsOfExperience ? `${jobseekerInfo.yearsOfExperience} years` : "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 font-medium">Availability</span>
                                        <p className="text-lg font-semibold text-[#254159] capitalize">
                                            {jobseekerInfo.availability || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isProfileComplete ? (
                                    <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Profile Complete
                                    </div>
                                ) : (
                                    <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                        Incomplete
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* About Me Section */}
                    {jobseekerInfo.bio ? (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                            <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">About Me</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {jobseekerInfo.bio}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                            <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">About Me</h3>
                            <div className="text-center py-8 text-gray-500">
                                <p className="mb-3">No bio added yet</p>
                                <Link
                                    to="/seeker/profile/edit"
                                    className="text-[#254159] hover:text-[#f2be5c] font-medium transition-colors"
                                >
                                    Add your bio to stand out to employers
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Work Preferences */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Work Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Preferred Role</span>
                                            <p className="text-gray-900 font-semibold capitalize">{jobseekerInfo.preferredRole || "Not specified"}</p>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Availability</span>
                                            <p className="text-gray-900 font-semibold capitalize">{jobseekerInfo.availability || "Not specified"}</p>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Shift Preference</span>
                                            <p className="text-gray-900 font-semibold capitalize">{jobseekerInfo.shiftPreference || "Not specified"}</p>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Desired Pay Rate</span>
                                            <p className="text-gray-900 font-semibold">{jobseekerInfo.desiredPayRate || "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Willing to Relocate</span>
                                            <p className="text-gray-900 font-semibold">{formatBoolean(jobseekerInfo.willingToRelocate)}</p>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Immediate Start Available</span>
                                            <p className="text-gray-900 font-semibold">{formatBoolean(jobseekerInfo.immediateStart)}</p>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Work Trial Available</span>
                                            <p className="text-gray-900 font-semibold">{formatBoolean(jobseekerInfo.workTrialAvailability)}</p>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-gray-600 font-medium text-sm">Max Travel Distance</span>
                                            <p className="text-gray-900 font-semibold">{jobseekerInfo.maxTravelDistance ? `${jobseekerInfo.maxTravelDistance} km` : "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                                {jobseekerInfo.workplaceValues && (
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <span className="text-gray-600 font-medium text-sm">Workplace Values</span>
                                        <p className="text-gray-900 mt-2">{jobseekerInfo.workplaceValues}</p>
                                    </div>
                                )}
                            </div>

                            {/* Skills & Experience */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Skills & Experience</h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-gray-600 font-medium text-sm">Years of Experience</span>
                                        <p className="text-gray-900 font-semibold">{jobseekerInfo.yearsOfExperience ? `${jobseekerInfo.yearsOfExperience} years` : "Not specified"}</p>
                                    </div>
                                    {jobseekerInfo.specialSkills && (
                                        <div>
                                            <span className="text-gray-600 font-medium text-sm">Special Skills</span>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {formatArray(jobseekerInfo.specialSkills).split(', ').map((skill, index) => (
                                                    <span key={index} className="bg-[#f2be5c] text-[#254159] px-3 py-1 rounded-full text-sm font-medium border border-[#f2be5c] border-opacity-30">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Secondary Info */}
                        <div className="space-y-6">
                            {/* Personal Details */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Personal Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-gray-600 font-medium text-sm">Preferred Name</span>
                                        <p className="text-gray-900">{jobseekerInfo.preferredName || "Not set"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium text-sm">Transport Method</span>
                                        <p className="text-gray-900 capitalize">{jobseekerInfo.transportMethod || "Not specified"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Education */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Education</h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-gray-600 font-medium text-sm">Education Level</span>
                                        <p className="text-gray-900">{jobseekerInfo.educationLevel || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium text-sm">Institution</span>
                                        <p className="text-gray-900">{jobseekerInfo.educationInstitution || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium text-sm">Graduation Year</span>
                                        <p className="text-gray-900">{jobseekerInfo.graduationYear || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resume */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Resume</h3>
                                {jobseekerInfo.resumeUrl ? (
                                    <div className="text-center">
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4 inline-block">
                                            <svg className="w-8 h-8 text-[#254159] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <a
                                                href={jobseekerInfo.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#254159] hover:bg-[#f2be5c] hover:text-[#254159] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                View Resume
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <p className="mb-3">No resume uploaded</p>
                                        <Link
                                            to="/seeker/profile/edit"
                                            className="text-[#254159] hover:text-[#f2be5c] font-medium transition-colors"
                                        >
                                            Upload Resume
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Certifications */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Certifications</h3>
                                <div className="space-y-3">
                                    {jobseekerInfo.certifications ? (
                                        <>
                                            {jobseekerInfo.certifications.wwcc && (
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-green-800 font-medium">Working With Children Check</span>
                                                    </div>
                                                    {jobseekerInfo.certifications.wwccExpiry && (
                                                        <span className="text-xs text-green-600">Expires: {jobseekerInfo.certifications.wwccExpiry}</span>
                                                    )}
                                                </div>
                                            )}
                                            {jobseekerInfo.certifications.firstAid && (
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-green-800 font-medium">First Aid</span>
                                                    </div>
                                                    {jobseekerInfo.certifications.firstAidExpiry && (
                                                        <span className="text-xs text-green-600">Expires: {jobseekerInfo.certifications.firstAidExpiry}</span>
                                                    )}
                                                </div>
                                            )}
                                            {jobseekerInfo.certifications.childProtection && (
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-green-800 font-medium">Child Protection</span>
                                                    </div>
                                                    {jobseekerInfo.certifications.childProtectionExpiry && (
                                                        <span className="text-xs text-green-600">Expires: {jobseekerInfo.certifications.childProtectionExpiry}</span>
                                                    )}
                                                </div>
                                            )}
                                            {jobseekerInfo.certifications.anaphylaxis && (
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-green-800 font-medium">Anaphylaxis</span>
                                                    </div>
                                                    {jobseekerInfo.certifications.anaphylaxisExpiry && (
                                                        <span className="text-xs text-green-600">Expires: {jobseekerInfo.certifications.anaphylaxisExpiry}</span>
                                                    )}
                                                </div>
                                            )}
                                            {jobseekerInfo.certifications.asthma && (
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-green-800 font-medium">Asthma</span>
                                                    </div>
                                                    {jobseekerInfo.certifications.asthmaExpiry && (
                                                        <span className="text-xs text-green-600">Expires: {jobseekerInfo.certifications.asthmaExpiry}</span>
                                                    )}
                                                </div>
                                            )}
                                            {!Object.values(jobseekerInfo.certifications).some(cert => cert === true) && (
                                                <p className="text-gray-500 text-center py-2">No certifications added</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-center py-2">No certifications added</p>
                                    )}
                                </div>
                            </div>

                            {/* Additional Courses */}
                            {jobseekerInfo.additionalCourses && (
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                    <h3 className="text-2xl font-semibold text-[#254159] mb-4 border-b border-gray-300 pb-3">Additional Courses</h3>
                                    <div className="space-y-2">
                                        {formatArray(jobseekerInfo.additionalCourses).split(', ').map((course, index) => (
                                            <div key={index} className="p-3 bg-[#f2ece4] rounded-lg text-[#254159] font-medium border border-gray-100">
                                                {course.trim()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Account Settings Modal */}
            <AccountSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
        </div>
    );
};

export default SeekerProfilePage;