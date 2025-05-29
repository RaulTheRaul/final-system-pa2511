import { useState } from "react";

const ViewSeekerProfileModal = ({ isOpen, onClose, seekerData }) => {
    const [activeTab, setActiveTab] = useState("overview")

    //Dont display data if not open or there is no data
    if (!isOpen || !seekerData) {
        return null;
    }

    //deconstruct and store jobseeker information
    const {
        fullName = "N/A",
        email = "N/A",
        jobseekerInformation,
    } = seekerData;

    //deconstruct jobseekerInformation field
    const {
        educationLevel = "N/A",
        availability = "N/A",
        shiftPreference = "N/A",
        desiredPayRate = "N/A",
        location = "N/A",
        bio = "N/A",
        preferredRole = "N/A",
        willingToRelocate = false,
        educationInstitution = 'N/A',
        graduationYear = 'N/A',
        resumeUrl = null,
        certifications: nestedCertifications = {}

    } = jobseekerInformation || {};

    //deconstruct certification field
    const {
        anaphylaxis = false,
        anaphylaxisExpiry = 'N/A',
        asthma = false,
        asthmaExpiry = 'N/A',
        childProtection = false,
        childProtectionExpiry = 'N/A',
        firstAid = false,
        firstAidExpiry = 'N/A',
        wwcc = false,
        wwccExpiry = 'N/A'
    } = nestedCertifications;

    //Handles the tab on click
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    //Makes boolean display Yes or No
    const formatBoolean = (value) => {
        return value ? "Yes" : "No";
    }

    // Function to render certification with nice styling
    const renderCertification = (name, hasIt, expiry) => {
        return (
            <div className={`p-3 rounded-lg border ${hasIt ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${hasIt ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className={`font-medium ${hasIt ? 'text-green-800' : 'text-gray-600'}`}>
                            {name}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${hasIt ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {hasIt ? 'Certified' : 'Not Certified'}
                        </span>
                    </div>
                    {hasIt && expiry && expiry !== 'N/A' && (
                        <span className="text-xs text-green-600">
                            Expires: {expiry}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (

        <div className="p-6 bg-white rounded-lg shadow-sm border-2 border-gray-200 relative">

            <h3 className="text-xl font-bold mb-4 text-[#26425A]">
                {fullName}'s Profile
            </h3>

            <p className="text-gray-600 text-sm mb-6">
                Email: {email}
            </p>

            <p className="text-gray-600 text-sm mb-6">
                Location: {location}
            </p>

            <p className="text-gray-600 text-sm mb-6">
                Desired Rate: {desiredPayRate}
            </p>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-300 mb-6">
                {/* Overview Tab */}
                <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-[#26425A] text-[#26425A]' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => handleTabClick('overview')}
                >
                    Overview
                </button>

                {/* Qualification Tab */}
                <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'qualifications' ? 'border-b-2 border-[#26425A] text-[#26425A]' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => handleTabClick('qualifications')}
                >
                    Qualifications
                </button>

                {/* Certification Tab */}
                <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'certifications' ? 'border-b-2 border-[#26425A] text-[#26425A]' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => handleTabClick('certifications')}
                >
                    Certifications
                </button>
            </div>


            {/* Tab Content */}
            <div className="tab-content">
                {/* Overview content*/}
                {activeTab === "overview" && (
                    <div className="space-y-4">
                        <p><strong>Availablity: </strong>{availability}</p>
                        <p><strong>Preferred Role: </strong>{preferredRole}</p>
                        <p><strong>Shift Preference: </strong>{shiftPreference}</p>
                        <p><strong>Willing to Relocate: </strong>{formatBoolean(willingToRelocate)}</p>
                        <div>
                            <strong>Bio:</strong>
                            <p className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm leading-relaxed shadow-sm">
                                {bio}
                            </p>
                        </div>
                        {/* Resume code here*/}
                        <div>
                            <button
                                onClick={() => {
                                    if (resumeUrl) {
                                        window.open(resumeUrl, '_blank');
                                    } else {
                                        console.log("Resume not avaliable")
                                    }
                                }}
                                className={`px-6 py-2 rounded-md text-base font-medium transition-colors duration-200 shadow-sm border
                                bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent
                                ${!resumeUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!resumeUrl} //disable the download button if there is no resume
                            >
                                Download Resume
                            </button>
                            {!resumeUrl && (
                                <p className="text-sm text-gray-500">Resume Not Available</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Qualifications content */}
                {activeTab === 'qualifications' && (
                    <div className="space-y-4">
                        <p><strong>Education Level:</strong> {educationLevel}</p>
                        <p><strong>Institution:</strong> {educationInstitution}</p>
                        <p><strong>Graduation Year:</strong> {graduationYear}</p>
                    </div>
                )}

                {/* Certifications content */}
                {activeTab === 'certifications' && (
                    <div className="space-y-3">
                        {renderCertification("First Aid", firstAid, firstAidExpiry)}
                        {renderCertification("Child Protection", childProtection, childProtectionExpiry)}
                        {renderCertification("Working with Children Check", wwcc, wwccExpiry)}
                        {renderCertification("Anaphylaxis Management", anaphylaxis, anaphylaxisExpiry)}
                        {renderCertification("Asthma Management", asthma, asthmaExpiry)}
                    </div>
                )}

            </div>


            {/* Close Button*/}
            <div className="flex justify-end mt-6">
                <button
                    className="px-6 rounded-mbpx-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
                       bg-[#26425A] text-white hover:bg-[#f2be5c] border-transparent"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>

    );
}


export default ViewSeekerProfileModal;