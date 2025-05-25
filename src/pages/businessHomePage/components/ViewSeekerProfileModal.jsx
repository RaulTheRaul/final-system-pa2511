import { useState } from "react";

const ViewSeekerProfileModal = ({onClose, seekerData }) => {
    const [activeTab, setActiveTab] = useState("overview")

    //Dont display data if not open or there is no data
    if(!seekerData) {
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
            preferredRole="N/A",
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
            firstAidExpiry = 'N/A'
        } = nestedCertifications;

    //Handles the tab on click
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    //Makes boolean display Yes or No
    const formatBoolean = (value) => {
        return value ? "Yes" : "No";
    } 

    return(
    
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
                <div className="space-y-4">
                    <p><strong>Anaphylaxis:</strong>  {formatBoolean(anaphylaxis)} | (Expiry: {anaphylaxisExpiry})</p>
                    <p><strong>Asthma:</strong> {formatBoolean(asthma)} | (Expiry: {asthmaExpiry})</p>
                    <p><strong>Child Protection:</strong> {formatBoolean(childProtection)} | (Expiry: {childProtectionExpiry})</p>
                    <p><strong>First Aid:</strong> {formatBoolean(firstAid)} | (Expiry: {firstAidExpiry})</p>
                </div>
                )}

            </div>


             {/* Close Button*/}
            <div className="flex justify-end mt-6">
                <button
                    className="px-6 py-2 rounded-mbpx-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border
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