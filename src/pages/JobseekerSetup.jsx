import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const JobseekerSetup = () => {
    const { currentUser, userData, getUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    //Form state,
    const [formData, setFormData] = useState({
        //Jobseeker's information

        //This is a chaining check to see if the data already exists if the user might've left mid setup.
        //if any part of the chain (userData -> businessInformation -> jobseekerGeneralLocation) doesn't exist it creates an empty value.        
        fullName: userData?.fullName || "",
        location: userData?.jobseekerInformation?.location || "",
        availability: userData?.jobseekerInformation?.availability || "full-time",

        //essential qualification
        educationLevel: userData?.jobseekerInformation?.educationLevel || "",

        //essential preference
        preferredRole: userData?.jobseekerInformation?.preferredRole || "educator",

        //brief bio
        bio: userData?.jobseekerInformation?.bio || "",

    });

    //Checks if there was data already filled within another tab or another device.
    useEffect(() => {
        if (userData) {
            setFormData(prevData => ({
                ...prevData,
                fullName: userData.fullName || prevData.fullName,
                location: userData.jobseekerInformation?.location || prevData.location,
                availability: userData?.jobseekerInformation?.availability || prevData.availability,
                educationLevel: userData?.jobseekerInformation?.educationLevel || prevData.educationLevel,
                preferredRole: userData?.jobseekerInformation?.preferredRole || prevData.preferredRole,
                bio: userData?.jobseekerInformation?.bio || prevData.bio
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: checked
        }));
    };


    //Thi is what will happen when the user attempts to submit the form.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        //This will check if the required fields have been completed.
        if (!formData.fullName || !formData.location || !formData.educationLevel) {
            setError("Please fill out all required fields");
            setLoading(false);
            return;
        }

        try {
            //Create the full jobseekerInformation structure with all fields
            //Only a few fields will have actual values; the rest will be empty
            //This way when the user completes the setup, all the required data strucutre will be in place,
            //and can be read from firebase without having to add or recreate it.
            const jobseekerInformation = {
                //Personal & Contact Information
                fullName: formData.fullName,
                preferredName: "",
                location: formData.location,
                willingToRelocate: false,
                availability: formData.availability,

                //Qualification & Certification
                educationLevel: formData.educationLevel,
                educationInstitution: "",
                graduationYear: null,

                //Certifications
                certifications: {
                    firstAid: false,
                    firstAidExpiry: "",
                    childProtection: false,
                    childProtectionExpiry: "",
                    anaphylaxis: false,
                    anaphylaxisExpiry: "",
                    asthma: false,
                    asthmaExpiry: "",
                },

                //Additional qualifications
                additionalCourses: [],

                //Resume
                resumeUrl: "",

                // Preferences & Work Conditions
                preferredRole: formData.preferredRole,
                desiredPayRate: "",
                shiftPreference: "any",
                workplaceValues: "",
                maxTravelDistance: null,
                transportMethod: "",
                immediateStart: false,
                workTrialAvailability: false,

                //Additional Information
                bio: formData.bio || "",
                yearsOfExperience: null,
                specialSkills: [],

                //Timestamp
                createdAt: new Date(),
                updatedAt: new Date()
            };

            //Update user document in Firestore
            await setDoc(
                doc(db, "users", currentUser.uid),
                {
                    jobseekerInformation,
                    setupCompleted: true
                },
                { merge: true }
            );

            //Refresh user data in context
            await getUserData(currentUser.uid);

            setSuccess(true);
            setError("");
        } catch (err) {
            console.error("Error updating jobseeker profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="min-h-screen bg-[#f2ece4] p-4 md:p-8">
            <div className="max-w-2xl mx-auto bg-[#f2ece4] rounded-lg shadow-md p-6 md:p-8">
                <h1 className="text-2xl font-bold text-[#254159] mb-6">Complete Your Profile</h1>
                <p className="text-gray-600 mb-6">
                    Please fill in these basic details, you can change them later in the user profile.
                </p>
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                        profile successfully updated!
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Basic profile information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="fullName" className="block">
                                        Full Name *
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        rows="4"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="location" className="block">
                                        Location *
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        rows="4"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter Location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="availability" className="block">
                                        Availability *
                                    </label>
                                    <select
                                        id="availability"
                                        name="availability"
                                        required
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="casual">Casual</option>
                                        <option value="flexible">Flexible</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                        Education Level *
                                    </label>
                                    <select
                                        id="educationLevel"
                                        name="educationLevel"
                                        required
                                        value={formData.educationLevel}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                    >
                                        <option value="">Select Education Level</option>
                                        <option value="Certificate III">Certificate III in Early Childhood Education</option>
                                        <option value="Diploma">Diploma of Early Childhood Education</option>
                                        <option value="Bachelor">Bachelor of Early Childhood Education</option>
                                        <option value="Masters">Masters or Higher</option>
                                        <option value="Other">Other Qualification</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="preferredRole" className="block text-sm font-medium text-gray-700 mb-1">
                                        Preferred Role *
                                    </label>
                                    <select
                                        id="preferredRole"
                                        name="preferredRole"
                                        required
                                        value={formData.preferredRole}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                    >
                                        <option value="educator">Educator</option>
                                        <option value="room-leader">Room Leader</option>
                                        <option value="assistant">Educational Assistant</option>
                                        <option value="director">Director</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                        Brief Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows="3"
                                        maxLength={500}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us a bit about yourself and your experience..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#f2be5c] focus:border-[#f2be5c]"
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.bio.length}/500 characters
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#254159] hover:bg-[#f2be5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2be5c] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                    >
                                        {loading ? "Saving..." : "Complete Setup"}
                                    </button>
                                </div>


                            </div>

                        </div>
                    </div>
                </form>



            </div>
        </div>
    );

};

export default JobseekerSetup