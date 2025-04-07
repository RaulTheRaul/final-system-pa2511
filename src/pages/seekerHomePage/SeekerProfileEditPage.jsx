import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";
//Importing the different form sections components
import PersonalInfoSection from "./components/profile/PersonalInfoSection"
import QualificationSection from "./components/profile/QualificationSection"
import PreferencesSection from "./components/profile/PreferencesSection"
import AdditionalInfoSection from "./components/profile/AdditionalInfoSection"




const SeekerProfileEditPage = () => {
    const { currentUser, userData, getUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    //Get jobseeker information from userData
    const jobseekerInfo = userData?.jobseekerInformation || {};

    //Form state with default values
    const [formData, setFormData] = useState({
        // Personal & Contact Information
        fullName: "",
        preferredName: "",
        location: "",
        willingToRelocate: false,
        availability: "full-time",

        //Qualification & Certification
        educationLevel: "",
        educationInstitution: "",
        graduationYear: "",

        //Certifications
        firstAid: false,
        firstAidExpiry: "",
        childProtection: false,
        childProtectionExpiry: "",
        anaphylaxis: false,
        anaphylaxisExpiry: "",
        asthma: false,
        asthmaExpiry: "",

        //Additional qualifications
        additionalCourses: "",

        //Resume - would typically handle with file upload
        resumeUrl: "",

        //Preferences & Work Conditions
        preferredRole: "educator",
        desiredPayRate: "",
        shiftPreference: "any",
        workplaceValues: "",
        maxTravelDistance: "",
        transportMethod: "",
        immediateStart: false,
        workTrialAvailability: false,

        //Additional Information
        bio: "",
        yearsOfExperience: "",
        specialSkills: ""
    });

    //Update form data when userData changes or on component mount
    useEffect(() => {
        if (userData && jobseekerInfo) {
            setFormData({
                //Personal & Contact Information
                fullName: userData.fullName || "",
                preferredName: jobseekerInfo.preferredName || "",
                location: jobseekerInfo.location || "",
                willingToRelocate: jobseekerInfo.willingToRelocate || false,
                availability: jobseekerInfo.availability || "full-time",

                //Qualification & Certification
                educationLevel: jobseekerInfo.educationLevel || "",
                educationInstitution: jobseekerInfo.educationInstitution || "",
                graduationYear: jobseekerInfo.graduationYear || "",

                //Certifications
                firstAid: jobseekerInfo.certifications?.firstAid || false,
                firstAidExpiry: jobseekerInfo.certifications?.firstAidExpiry || "",
                childProtection: jobseekerInfo.certifications?.childProtection || false,
                childProtectionExpiry: jobseekerInfo.certifications?.childProtectionExpiry || "",
                anaphylaxis: jobseekerInfo.certifications?.anaphylaxis || false,
                anaphylaxisExpiry: jobseekerInfo.certifications?.anaphylaxisExpiry || "",
                asthma: jobseekerInfo.certifications?.asthma || false,
                asthmaExpiry: jobseekerInfo.certifications?.asthmaExpiry || "",

                //Additional qualifications
                additionalCourses: Array.isArray(jobseekerInfo.additionalCourses)
                    ? jobseekerInfo.additionalCourses.join(", ")
                    : jobseekerInfo.additionalCourses || "",

                //Resume
                resumeUrl: jobseekerInfo.resumeUrl || "",

                //Preferences & Work Conditions
                preferredRole: jobseekerInfo.preferredRole || "educator",
                desiredPayRate: jobseekerInfo.desiredPayRate || "",
                shiftPreference: jobseekerInfo.shiftPreference || "any",
                workplaceValues: jobseekerInfo.workplaceValues || "",
                maxTravelDistance: jobseekerInfo.maxTravelDistance || "",
                transportMethod: jobseekerInfo.transportMethod || "",
                immediateStart: jobseekerInfo.immediateStart || false,
                workTrialAvailability: jobseekerInfo.workTrialAvailability || false,

                //Additional Information
                bio: jobseekerInfo.bio || "",
                yearsOfExperience: jobseekerInfo.yearsOfExperience || "",
                specialSkills: Array.isArray(jobseekerInfo.specialSkills)
                    ? jobseekerInfo.specialSkills.join(", ")
                    : jobseekerInfo.specialSkills || ""
            });
        }
    }, [userData, jobseekerInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked
        });
    };

    const handleCancel = () => {
        navigate("/seeker/profile");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        //Basic validation
        if (!formData.fullName || !formData.location) {
            setError("Please fill out all required fields");
            setLoading(false);
            return;
        }

        try {
            //Format data for Firestore
            const specialSkillsArray = formData.specialSkills
                ? formData.specialSkills.split(',').map(skill => skill.trim())
                : [];

            const additionalCoursesArray = formData.additionalCourses
                ? formData.additionalCourses.split(',').map(course => course.trim())
                : [];

            // Create updated jobseekerInformation object
            const updatedInfo = {
                // Personal & Contact Information
                fullName: formData.fullName,
                preferredName: formData.preferredName,
                location: formData.location,
                willingToRelocate: formData.willingToRelocate,
                availability: formData.availability,

                // Qualification & Certification
                educationLevel: formData.educationLevel,
                educationInstitution: formData.educationInstitution,
                graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,

                // Certifications
                certifications: {
                    firstAid: formData.firstAid,
                    firstAidExpiry: formData.firstAidExpiry,
                    childProtection: formData.childProtection,
                    childProtectionExpiry: formData.childProtectionExpiry,
                    anaphylaxis: formData.anaphylaxis,
                    anaphylaxisExpiry: formData.anaphylaxisExpiry,
                    asthma: formData.asthma,
                    asthmaExpiry: formData.asthmaExpiry,
                },

                // Additional qualifications
                additionalCourses: additionalCoursesArray,

                // Resume
                resumeUrl: formData.resumeUrl,

                // Preferences & Work Conditions
                preferredRole: formData.preferredRole,
                desiredPayRate: formData.desiredPayRate,
                shiftPreference: formData.shiftPreference,
                workplaceValues: formData.workplaceValues,
                maxTravelDistance: formData.maxTravelDistance ? Number(formData.maxTravelDistance) : null,
                transportMethod: formData.transportMethod,
                immediateStart: formData.immediateStart,
                workTrialAvailability: formData.workTrialAvailability,

                // Additional Information
                bio: formData.bio,
                yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : null,
                specialSkills: specialSkillsArray,

                // Update timestamp
                updatedAt: new Date()
            };

            // If this is a new profile, add createdAt
            if (!jobseekerInfo.createdAt) {
                updatedInfo.createdAt = new Date();
            } else {
                updatedInfo.createdAt = jobseekerInfo.createdAt;
            }

            // Update Firestore document
            await setDoc(
                doc(db, "users", currentUser.uid),
                {
                    fullName: formData.fullName,
                    jobseekerInformation: updatedInfo,
                    setupCompleted: true
                },
                { merge: true }
            );

            //Refresh user data
            await getUserData(currentUser.uid);
            setSuccess(true);

            //After a short delay, redirect back to profile page
            setTimeout(() => {
                navigate("/seeker/profile");
            }, 1500);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2ece4]">
            <SeekerNavigation />

            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Edit Your Profile</h2>
                        <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                            Profile successfully updated! Redirecting to profile page...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        Personal & Contact Information Section
                        <PersonalInfoSection
                            formData={formData}
                            handleChange={handleChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />

                        {/* Qualification & Certification Section */}
                        <QualificationSection
                            formData={formData}
                            handleChange={handleChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />

                        {/* Preferences & Work Conditions Section */}
                        <PreferencesSection
                            formData={formData}
                            handleChange={handleChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />

                        {/* Additional Information Section */}
                        <AdditionalInfoSection
                            formData={formData}
                            handleChange={handleChange}
                        />

                        {/* Form Actions */}
                        <div className="pt-6 flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default SeekerProfileEditPage;