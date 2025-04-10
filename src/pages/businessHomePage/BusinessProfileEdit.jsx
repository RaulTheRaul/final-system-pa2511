import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import BusinessNavigation from "./components/BusinessNavigation";

//Import business sections
import BusinessInfoSection from "../businessHomePage/components/businessProfile/BusinessInfoSection";
import CentreSection from "../businessHomePage/components/businessProfile/CentreSection";
import BusinessAdditionalInfoSection from "../businessHomePage/components/businessProfile/BusinessAdditionalInfoSection";



const BusinessProfileEdit = () => {
    const { currentUser, userData, getUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    //Get business information from userData
    const businessInfo = userData?.businessInformation || {};

    //Form a state with default values

    const [formData, setFormData] = useState({
        //Business Information
        businessName: "",
        aceqcaRating: "",

        //Centre Information
        centreName: "",
        centreAddress: "",
        centrePhone: "",
        operatingHours: "",
        centreType: "",
        teachingApproach: "",
        roomCount: "",
        centreCapacity: "",
        staffToChildRatio: "",
        centreDescription: "",

        //Staff Benefits
        staffBenefits: "",
        careerOpportunities: ""
    });

    //Update form data when userData changes or on component mount
    useEffect(() => {
        if (userData && businessInfo){
            setFormData({
                //Business Information
                businessName: userData.businessName || "",
                aceqcaRating: businessInfo.aceqcaRating || "",

                //Centre Information
                centreName: businessInfo.centreName || "",
                centreAddress: businessInfo.centreAddress || "",
                centrePhone: businessInfo.centrePhone || "",
                operatingHours: businessInfo.operatingHours || "",
                centreType: businessInfo.centreType || "",
                teachingApproach: businessInfo.teachingApproach || "",
                roomCount: businessInfo.roomCount || "",
                centreCapacity: businessInfo.centreCapacity || "",
                staffToChildRatio: businessInfo.staffToChildRatio || "",
                centreDescription: businessInfo.centreDescription || "",

                //Staff Benefits
                staffBenefits: Array.isArray(businessInfo.staffBenefits)
                    ? businessInfo.staffBenefits.join(", ")
                    : businessInfo.staffBenefits || "",

                careerOpportunities: businessInfo.careerOpportunities || ""
            });
        }

    },[userData, businessInfo]);

    //captures user input and changes inputted data when user submits the form
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
        navigate("/business/profile");
    };

    //This function will talk to the database when the user submits their changes.
    //It will update any values on the database and validate required fields.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        //Basic Validation
        if (!formData.businessName || !formData.centreName || !formData.centreAddress){
            setError("Please fill out all required fields");
        }

        try {
            //Form data for Firestore
            const staffBenefitsArray = formData.staffBenefits
                ? formData.staffBenefits.split(',').map(benefits => benefits.trim())
                : [];

            //Create updated businessInformation object
            const updatedInfo = {
                //Business Information
                businessName: formData.businessName,
                aceqcaRating: formData.aceqcaRating,

                //Centre Information
                centreName: formData.businessName,
                centreAddress: formData.centreAddress,
                centrePhone: formData.centrePhone,
                operatingHours: formData.operatingHours,
                centreType: formData.centreType,
                teachingApproach: formData.teachingApproach,
                roomCount: formData.roomCount ? Number(formData.roomCount) : null,
                centreCapacity: formData.centreCapacity ? Number(formData.centreCapacity) : null,
                staffToChildRatio: formData.staffToChildRatio,
                centreDescription: formData.centreDescription,


                //Staff Benefits
                centreDescription: formData.centreDescription,
                staffBenefits: staffBenefitsArray,

                //Update timestamp
                updatedAt: new Date()
            };

            //if this is a new busiess profile, add createdAt
            if (!currentUser.createdAt){
                updatedInfo.createdAt = new Date();
            } else {
                updatedInfo.createdAt = businessInfo.createdAt;
            }

            //Update Firestore document
            await setDoc(
                doc(db, "users", currentUser.uid),
                {
                    businessName: formData.businessName,
                    businessInformation: updatedInfo,
                    setupCompleted: true
                },
                    {merge: true}
            );

            //Refresh user data
            await getUserData(currentUser.uid);
            setSuccess(true);

            //After delay, redirect back to profile page
            setTimeout(() =>{
                navigate("/business/profile");
            }, 1500);

        } catch (err) {
            console.error("Error updating business profile:", err);
            setError("Failed to update business profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2ece4]">
        <BusinessNavigation />

        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-[#EEEEEE] rounded-lg shadow-sm p-6">
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
                    {/* Business Information Section */}
                    <BusinessInfoSection
                        formData={formData}
                        handleChange={handleChange}
                        handleCheckboxChange={handleCheckboxChange}
                    />

                    {/*Centre Information Section*/}
                    <CentreSection
                        formData={formData}
                        handleChange={handleChange}
                        handleCheckboxChange={handleCheckboxChange}
                    />

                    {/* Business Additional Info Section */}
                    <BusinessAdditionalInfoSection
                        formData={formData}
                        handleChange={handleChange}
                        handleCheckboxChange={handleCheckboxChange}
                    />

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
                            disabled={loading}
                            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#26425A] hover:bg-[#f2be5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2be5c] ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default BusinessProfileEdit;