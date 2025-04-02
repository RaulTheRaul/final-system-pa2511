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
                // Personal & Contact Information
                fullName: formData.fullName,
                preferredName: "",
                location: formData.location,
                willingToRelocate: false,
                availability: formData.availability,

                //qualification & Certification
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

                // Additional qualifications
                additionalCourses: [],

                // Resume
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

                // Additional Information
                bio: formData.bio || "",
                yearsOfExperience: null,
                specialSkills: [],

                // Timestamp
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

            // Refresh user data in context
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
        <div></div>

    );

};

export default JobseekerSetup