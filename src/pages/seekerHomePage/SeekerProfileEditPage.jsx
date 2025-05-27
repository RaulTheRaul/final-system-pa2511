import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import SeekerNavigation from "./components/SeekerNavigation";
//Importing the different form sections components
import PersonalInfoSection from "./components/profile/PersonalInfoSection";
import QualificationSection from "./components/profile/QualificationSection";
import PreferencesSection from "./components/profile/PreferencesSection";
import AdditionalInfoSection from "./components/profile/AdditionalInfoSection";

const SeekerProfileEditPage = () => {
    const { currentUser, userData, getUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    // max file size for resumes (2 MB)
    const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

    // New state for resume file and upload progress
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

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

        // Preferences & Work Conditions
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

                // Preferences & Work Conditions
                preferredRole: jobseekerInfo.preferredRole || "educator",
                desiredPayRate: jobseekerInfo.desiredPayRate || "",
                shiftPreference: jobseekerInfo.shiftPreference || "any",
                workplaceValues: jobseekerInfo.workplaceValues || "",
                maxTravelDistance: jobseekerInfo.maxTravelDistance ? Number(jobseekerInfo.maxTravelDistance) : null,
                transportMethod: jobseekerInfo.transportMethod || "",
                immediateStart: jobseekerInfo.immediateStart || false,
                workTrialAvailability: jobseekerInfo.workTrialAvailability || false,

                //Additional Information
                bio: jobseekerInfo.bio || "",
                yearsOfExperience: jobseekerInfo.yearsOfExperience ? Number(jobseekerInfo.yearsOfExperience) : null,
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

    const handleResumeChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Client-side file size validation
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setError(`File size exceeds the limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`);
                setResumeFile(null); // Clear the selected file
                e.target.value = ''; // Clear the input field to allow re-selection
                return;
            }

            // Client-side file type validation
            const allowedTypes = [
                'application/pdf',
                'application/msword', // .doc
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
            ];
            if (!allowedTypes.includes(file.type)) {
                setError('Only PDF and Word documents (.doc, .docx) are allowed.');
                setResumeFile(null);
                e.target.value = '';
                return;
            }

            // Clear any previous errors if file is valid
            setError('');
            setResumeFile(file);
        } else {
            setResumeFile(null); // No file selected
            setError(''); // Clear error if user deselects file
        }
    };

    const handleCancel = () => {
        navigate("/seeker/profile");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear previous errors initially
        setSuccess(false);

        // Basic validation for form fields
        if (!formData.fullName || !formData.location) {
            setError("Please fill out all required fields");
            setLoading(false);
            return;
        }

        // IMPORTANT: Check for client-side errors from file selection before proceeding
        if (error) { // If 'error' state is currently set (e.g., due to invalid file selection)
            setLoading(false);
            return;
        }

        let uploadedResumeUrl = formData.resumeUrl; // Default to existing URL

        // **NEW: Resume Upload Logic**
        if (resumeFile) {
            const storageRef = ref(storage, `resumes/${currentUser.uid}/${resumeFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, resumeFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Error uploading resume:", error);
                    setError("Failed to upload resume. Please try again.");
                    setLoading(false);
                    return; // Stop further processing
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        uploadedResumeUrl = downloadURL;  // Update URL after successful upload
                        //   Proceed with updating Firestore *after* successful upload
                        updateFirestore(uploadedResumeUrl);
                    }).catch((err) => {
                        console.error("Error getting download URL:", err);
                        setError("Failed to get resume download URL. Please try again.");
                        setLoading(false);
                    });
                }
            );
        } else {
            // If no new resume, proceed directly to update Firestore
            updateFirestore(uploadedResumeUrl);
        }
    };

    const updateFirestore = async (resumeUrl) => {
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
                resumeUrl: resumeUrl,

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
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#254159]">Edit Your Profile</h2>
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
                        {/* Personal & Contact Information Section */}
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

                        {/* Resume Upload UI */}
                        <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                                Upload Resume
                            </label>
                            <input
                                type="file"
                                id="resume"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeChange}
                                className="mt-1 block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100"
                            />
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <progress value={uploadProgress} max="100" className="w-full mt-2" />
                            )}
                            {uploadProgress === 100 && !error && (
                                <p className="mt-2 text-sm text-green-600">Upload complete!</p>
                            )}
                            {formData.resumeUrl && !resumeFile && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Current Resume: <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a>
                                </p>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="pt-6 flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-[#EEEEEE] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading || !!error}
                                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#26425A] hover:bg-[#f2be5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2be5c] ${loading || !!error ? "opacity-70 cursor-not-allowed" : ""
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